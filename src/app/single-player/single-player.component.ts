import { Component, OnInit } from '@angular/core';
import { Ship, ShipPart } from '../shared-models/ships.model';
import { Column } from '../shared-models/column.model';
import { v4 as uuid } from 'uuid';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

// import { BoardsService } from '../sharedServices/boards.service';

@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrl: './single-player.component.css',
})
export class SinglePlayerComponent implements OnInit {
  playerBoard: any[][] = [];
  computerBoard: any[][] = [];

  // alt
  boardsMap: Map<string, Map<string, Column>> = new Map();
  boards: string[][] = [];
  // player || computer
  //

  width: number = 10;
  height: number = 10;

  initBoard(side: string) {
    for (let h = 0; h < this.height; h++) {
      for (let w = 0; w < this.width; w++) {
        const id = uuid();
        if (!this.boards[h]) {
          this.boards[h] = [];
        }

        this.boards[h].push(id);
      }
    }

    console.log('>>>>>>>', this.boards);
  }

  initData(side: string) {
    const map: Map<string, Column> = new Map();

    for (let row = 0; row < this.boards.length; row++) {
      for (let c = 0; c < this.boards[row].length; c++) {
        const id = uuid();
        // const id = this.boards[row][c];
        const column = new Column(id, null);

        map.set(id, column);
      }

      this.boardsMap.set(side, map);
    }
    console.log('2222', this.boardsMap);
  }

  addPart(columnId: string, side: string) {
    let board: any[][];
    if (side === 'player') {
      board = this.playerBoard;
    } else {
      board = this.computerBoard;
    }

    const row = parseInt(columnId.split('-')[0]);
    const col = parseInt(columnId.split('-')[1]);

    board[row][col] = { ...board[row][col], hasPart: true };

    if (side === 'player') {
      //  player turn
    } else {
      // computer turn
    }
  }

  ships: Ship[] = [
    new Ship('ship1', 2, 1),
    new Ship('ship2', 3, 2),
    new Ship('ship3', 4, 3),
    new Ship('ship4', 5, 4),
    new Ship('ship5', 5, 5),
  ];
  constructor() {
    this.initializeBoard(this.playerBoard);
    this.initializeBoard(this.computerBoard);
    this.placeShips(this.playerBoard);
    this.placeShips(this.computerBoard);

    this.initBoard('player');
    this.initData('player');

    this.initBoard('computer');
    this.initData('computer');
  }

  initializeBoard(board: any[][]) {
    for (let r = 0; r < 8; r++) {
      board[r] = [];
      for (let c = 0; c < 8; c++) {
        board[r][c] = { shipId: null };
      }
    }
    console.log('Board initialized:', board);
  }

  placeShips(board: any[][]) {
    console.log('>>>>');
    this.ships.forEach((ship) => {
      const length = ship.length;
      const row = Math.floor(Math.random() * 8);
      const col = Math.floor(Math.random() * (8 - length + 1));
      for (let i = 0; i < length; i++) {
        board[row][col + i].shipId = ship.id;
      }
    });
    console.log('Ships placed:', board);
  }

  isStartGame = true;

  ngOnInit() {}

  start() {
    this.isStartGame = !this.isStartGame;
  }

  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer !== event.container) {
      const droppedShip: Ship = event.item.data;
      const targetRowIndex = this.playerBoard.indexOf(event.container.data);
      const targetCellIndex = event.currentIndex;

      // Check if the ship fits horizontally within the target row
      if (
        targetCellIndex + droppedShip.length <=
        this.playerBoard[targetRowIndex].length
      ) {
        let canPlaceHorizontally = true;
        for (let i = 0; i < droppedShip.length; i++) {
          const currentCell =
            this.playerBoard[targetRowIndex][targetCellIndex + i];
          if (currentCell.shipId !== null) {
            canPlaceHorizontally = false;
            break;
          }
        }

        // Place the ship if it fits horizontally
        if (canPlaceHorizontally) {
          for (let i = 0; i < droppedShip.length; i++) {
            this.playerBoard[targetRowIndex][targetCellIndex + i].shipId =
              droppedShip.id;
          }
          this.ships = this.ships.filter((ship) => ship.id !== droppedShip.id);
          return;
        }
      } else {
        console.log('Ship does not fit horizontally');
      }

      // Check if the ship fits vertically within the column
      if (targetRowIndex + droppedShip.length <= this.playerBoard.length) {
        let canPlaceVertically = true;
        for (let i = 0; i < droppedShip.length; i++) {
          const currentRow = targetRowIndex + i;
          const currentCell = this.playerBoard[currentRow][targetCellIndex];
          if (currentCell.shipId !== null) {
            canPlaceVertically = false;
            break;
          }
        }

        // Place the ship if it fits vertically
        if (canPlaceVertically) {
          for (let i = 0; i < droppedShip.length; i++) {
            const currentRow = targetRowIndex + i;
            this.playerBoard[currentRow][targetCellIndex].shipId =
              droppedShip.id;
          }
          this.ships = this.ships.filter((ship) => ship.id !== droppedShip.id);
          return;
        }
      } else {
        console.log('Ship does not fit vertically');
      }
    }
    console.log(event);
    console.log('Updated playerBoard:', this.playerBoard);
  }

  flip() {}
}

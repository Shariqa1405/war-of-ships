import { Component, OnInit } from '@angular/core';
import { Ship } from '../shared-models/ships.model';
import { Column } from '../shared-models/column.model';
import { v4 as uuid } from 'uuid';
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
  }

  placeShips(board: any[][]) {
    this.ships.forEach((ship) => {
      const length = ship.length;
      const row = Math.floor(Math.random() * 8);
      const col = Math.floor(Math.random() * (8 - length + 1));
      for (let i = 0; i < length; i++) {
        board[row][col + i].shipId = ship.id;
      }
    });
  }

  isStartGame = true;

  ngOnInit() {}

  start() {
    this.isStartGame = !this.isStartGame;
  }

  flip() {}
}

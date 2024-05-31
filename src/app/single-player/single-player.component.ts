import { Component, OnInit } from '@angular/core';
import { Ship, ShipPart } from '../shared-models/ships.model';
import { Column } from '../shared-models/column.model';
import { v4 as uuid } from 'uuid';
import { BoardsService } from '../sharedServices/boards.service';

// import { BoardsService } from '../sharedServices/boards.service';

enum GameState {
    Pending,
    Preparing,
    Battle,
    Finished,
}

@Component({
    selector: 'app-single-player',
    templateUrl: './single-player.component.html',
    styleUrl: './single-player.component.css',
})
export class SinglePlayerComponent implements OnInit {
    constructor(private boardsService: BoardsService) {
        // this.initBoard('player');
        // this.initData('player');
        // this.initBoard('computer');
        // this.initData('computer');
    }

    private _columnsMap: Map<string, Column> = new Map();

    playerBoard: Column[][] = [];
    computerBoard: Column[][] = [];

    private _width: number = 8;
    private _height: number = 8;

    // TODO... set initial state to Pending
    private _gameState: GameState = GameState.Preparing;

    isStartGame = true;

    currentShipIndex: number = 0;

    selectedShip: Ship | null = null;
    shipPlacementCount: number = 0;

    angle: number = 0;

    // alt
    boardsMap: Map<string, Map<string, Column>> = new Map();
    boards: string[][] = [];
    // player || computer
    //

    initBoard(side: string) {
        for (let h = 0; h < this._height; h++) {
            for (let w = 0; w < this._width; w++) {
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
        let board: Column[][];
        if (side === 'player') {
            board = this.playerBoard;
        } else {
            board = this.computerBoard;
        }

        const row = parseInt(columnId.split('-')[0]);
        const col = parseInt(columnId.split('-')[1]);

        const part = new ShipPart(null, columnId, false);
        board[row][col].setPart(part);

        console.log('77777', board);
    }

    ships: Ship[] = [
        new Ship('ship1', 2, 1),
        new Ship('ship2', 3, 2),
        new Ship('ship3', 4, 3),
        new Ship('ship4', 5, 4),
        new Ship('ship5', 5, 5),
    ];

    ngOnInit() {
        this.initializeBoard(this.playerBoard);
        this.initializeBoard(this.computerBoard);
    }

    initializeBoard(board: Column[][]) {
        for (let r = 0; r < this._height; r++) {
            const row: Column[] = [];
            for (let c = 0; c < this._width; c++) {
                const id = uuid();
                const column = new Column(id);
                this._columnsMap.set(column.id, column);
                row.push(column);
            }
            board.push(row);
        }
        console.log('3333', board);
    }

    selectShip(ship: Ship) {
        this.selectedShip = ship;
        this.shipPlacementCount = 0;
        console.log('Selected ship:', ship);
    }

    private _placeShip(id: string, ship: Ship) {
        console.log(`placing ship on ${id})`);

        if (!this.selectedShip) {
            console.log('No ship selected or ship already fully placed.');
            return;
        }

        if (this.shipPlacementCount < this.selectedShip.length) {
            const partId = uuid();
            const part = new ShipPart(this.selectedShip.id, partId, false);
            const column = this._columnsMap.get(id);
            if (column.isEmpty) {
                column.setPart(part);
                column.ship = ship;
                this.shipPlacementCount++;
            }
            else {
                console.log('Cell already occupied');
            }

            

            /*
            if (
                this.isValidCell(row, col) &&
                this.playerBoard[row][col].ship === null
            ) {
                console.log(`Placing ship at (${row}, ${col})`);
                const partId = `${row}-${col}`;
                const part = new ShipPart(this.selectedShip.id, partId, false);
                this.playerBoard[row][col].setPart(part);
                this.playerBoard[row][col].ship = this.selectedShip;
                this.selectedShip.addPart(partId);

                this.shipPlacementCount++;
                if (this.shipPlacementCount === this.selectedShip.length) {
                    console.log(`Ship ${this.selectedShip.name} fully placed.`);
                    this.selectedShip = null;
                    this.currentShipIndex++;
                }
            } else {
                console.log('Cell already occupied');
            }
            */
        } else {
            console.log('Ship already fully placed.');
        }
    }

    columnClick(id: string) {
        
        switch (this._gameState) {
            case GameState.Pending:
                console.log('game not started yet');
                break;
            case GameState.Preparing:
                this._placeShip(id, this.selectedShip);
                break;
            case GameState.Battle:
                // TODO
                // implement game logic
                break;
            case GameState.Finished:
                console.log('the battle if finished');
                break;
            default:
                console.log('unknown state');
        }
        
        console.log(id, this._columnsMap.get(id));
    }

    // TODO ... remove
    canPlaceShipHorizontally(row: number, col: number, ship: Ship): boolean {
        if (col + ship.length > this._width) return false;
        for (let i = 0; i < ship.length; i++) {
            if (this.playerBoard[row][col + i].ship !== null) {
                return false;
            }
        }
        return true;
    }

    placeShipHorizontally(row: number, col: number, ship: Ship): void {
        for (let i = 0; i < ship.length; i++) {
            const partId = `${row}-${col + i}`;
            const part = new ShipPart(ship.id, partId, false);
            this.playerBoard[row][col + i].ship = ship;
            this.playerBoard[row][col + i].setPart(part);
            ship.addPart(partId);
        }
    }

    // TODO remove
    canPlaceShipVertycally(row: number, col: number, ship: Ship): boolean {
        if (row + ship.length > this._height) return false;
        for (let i = 0; i < ship.length; i++) {
            if (this.playerBoard[row + i][col].ship !== null) {
                return false;
            }
        }
        return true;
    }

    placeShipvertically(row: number, col: number, ship: Ship): void {
        for (let i = 0; i < ship.length; i++) {
            const partId = `${row + i}-${col}`;
            const part = new ShipPart(ship.id, partId, false);
            this.playerBoard[row + i][col].ship = ship;
            this.playerBoard[row + i][col].setPart(part);
            ship.addPart(partId);
        }
    }

    // TODO... remove
    isValidCell(row: number, col: number): boolean {
        return row >= 0 && row < this._height && col >= 0 && col < this._width;
    }

    start() {
        this.isStartGame = !this.isStartGame;
    }

    flip() {
        this.angle = this.angle === 0 ? 90 : 0;
        console.log(`Ship rotation angle: ${this.angle}`);
    }
}

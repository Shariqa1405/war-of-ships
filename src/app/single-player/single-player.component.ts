import { Component, OnInit } from '@angular/core';
import { Ship, ShipPart } from '../shared-models/ships.model';
import { Column } from '../shared-models/column.model';
import { v4 as uuid } from 'uuid';
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
    constructor() {}

    private _columnsMap: Map<string, Column> = new Map();

    playerBoard: Column[][] = [];
    computerBoard: Column[][] = [];

    private _width: number = 8;
    private _height: number = 8;

    // TODO... set initial state to Pending
    private _gameState: GameState = GameState.Preparing;

    currentShipIndex: number = 0;

    selectedShip: Ship | null = null;
    shipPlacementCount: number = 0;
    remainingParts: number | null = null;

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
        new Ship('Fulton', 2, 1),
        new Ship('Clermont', 3, 2),
        new Ship('Argo', 4, 3),
        new Ship('Dreadnought', 5, 4),
        new Ship('Titanic', 5, 5),
    ];

    ngOnInit() {
        this.initializeBoard(this.playerBoard);
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
        if (this.selectedShip && this.shipPlacementCount > 0) {
            console.log(
                'Please finish placing the current ship before selecting another.'
            );
            return;
        }
        this.selectedShip = ship;
        this.shipPlacementCount = ship.parts.size;
        this.remainingParts = ship.length - ship.parts.size;
        console.log('Selected ship:', ship);
    }

    shipDisable(): boolean {
        return this.selectedShip && this.shipPlacementCount > 0;
    }

    private _getPositionFromUUID(id: string): [number, number] | null {
        const allIds = Array.from(this._columnsMap.keys());
        const index = allIds.indexOf(id);
        if (index === -1) return null;
        const row = Math.floor(index / this._width);
        const col = index % this._width;
        return [row, col];
    }

    private areIdsAdjacent(id1: string, id2: string): boolean {
        const pos1 = this._getPositionFromUUID(id1);
        const pos2 = this._getPositionFromUUID(id2);
        if (!pos1 || !pos2) return false;

        const [row1, col1] = pos1;
        const [row2, col2] = pos2;

        return (
            (row1 === row2 && Math.abs(col1 - col2) === 1) ||
            (col1 === col2 && Math.abs(row1 - row2) === 1)
        );
    }

    private isAdjacent(newId: string): boolean {
        if (!this.selectedShip || this.shipPlacementCount === 0) {
            return true;
        }

        for (const part of this.selectedShip.parts.values()) {
            if (this.areIdsAdjacent(part.columnId, newId)) {
                return true;
            }
        }
        return false;
    }

    placedShips: Set<string> = new Set();

    private _placeShip(id: string, ship: Ship | null): boolean {
        if (!ship) {
            console.log('ship is not selected');
            return false;
        }

        if (this.placedShips.has(ship.name)) {
            console.log('ship already placed');
            return false;
        }

        const column = this._columnsMap.get(id);
        if (!column) {
            console.log('Invalid column ID');
            return false;
        }

        if (column.isEmpty && this.isAdjacent(id)) {
            const partId = uuid();
            const part = new ShipPart(ship.id, partId, false);
            column.setPart(part);
            column.ship = ship;
            ship.addPart(id);
            this.shipPlacementCount++;
            this.remainingParts--;

            this.placedShipParts.push(id);

            console.log('Ship part placed:', id);

            console.log('Cell.ship:', column.ship);

            if (this.shipPlacementCount === ship.length) {
                console.log('Ship fully placed:', ship.name);
                this.selectedShip = null;
                this.placedShips.add(ship.name);
                this.remainingParts = null;
            }

            return true;
        } else {
            console.log(
                'Cannot place ship part here. Must be adjacent to the previous part.'
            );
            return false;
        }
    }

    lastColumnClicked: string | null = null;
    placedShipParts: string[] = [];

    removeLastPlacedPart() {
        if (this.placedShipParts.length === 0) {
            console.log('no parts to remove');
            return;
        }
        const lastPlacedId = this.placedShipParts.pop();
        if (lastPlacedId) {
            this.removeShipPart(lastPlacedId);
        }
    }

    removeShipPart(columnId: string | null) {
        if (!columnId) {
            return;
        }

        const column = this._columnsMap.get(columnId);
        if (!column || !column.ship) {
            console.log('no ShipPart to remove');
            return;
        }

        const ship = column.ship;

        ship.removePart(columnId);
        column.setPart(null);
        column.ship = null;
        column.isEmpty = true;

        this.shipPlacementCount--;
        this.remainingParts++;

        console.log(`${ship.name}part removed from ${columnId} `);

        // this.selectedShip = ship
        this.resetSelectedShip(ship);
        this.placedShips.delete(ship.name);
        // if (ship.parts.size === 0) {
        //     this.placedShips.delete(ship.name);
        //     this.selectedShip = null;
        // }
    }

    private resetSelectedShip(ship: Ship | null) {
        this.selectedShip = ship;
        if (ship) {
            this.shipPlacementCount = ship.parts.size;
            this.remainingParts = ship.length - ship.parts.size;
        } else {
            this.shipPlacementCount = 0;
            this.remainingParts = null;
        }
    }

    columnClick(id: string, Cell?) {
        console.log('clicked column id:', id);
        this.lastColumnClicked = id;
        console.log('cell', Cell);
        switch (this._gameState) {
            case GameState.Pending:
                console.log('game not started yet');
                break;
            case GameState.Preparing:
                if (this.selectedShip) {
                    this._placeShip(id, this.selectedShip);
                } else {
                    console.log('no ship selected');
                }

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

    // allShipsPlaced(): boolean {
    //     return this.placedShips.size === this.ships.length;
    // }

    // disableButton(): boolean {
    //     if (this.allShipsPlaced()) {
    //         this._gameState === GameState.Battle;
    //         console.log('Game Started', GameState.Battle);
    //         return this.isStartGame;
    //     }
    //     if (!this.allShipsPlaced()) {
    //         this._gameState !== GameState.Pending;
    //         return !this.isStartGame;
    //     }
    // }

    // start() {
    //     this._gameState = GameState.Battle;
    // }
}

import { Component, OnInit } from '@angular/core';
import { Column } from '../../shared-models/column.model';
import { v4 as uuid } from 'uuid';
import { Ship } from '../../shared-models/ships.model';
import { ShipPart } from '../../shared-models/ships.model';

// enum GameState {
//     Pending,
//     Preparing,
//     Battle,
//     Finished,
// }
@Component({
    selector: 'app-computer',
    templateUrl: './computer.component.html',
    styleUrl: './computer.component.css',
})
export class ComputerComponent implements OnInit {
    constructor() {}

    boardId: [] = [];
    ships: Ship[] = [
        new Ship('Fulton', 2, 1),
        new Ship('Clermont', 3, 2),
        new Ship('Argo', 4, 3),
        new Ship('Dreadnought', 5, 4),
        new Ship('Titanic', 5, 5),
    ];

    private _columnsMap: Map<string, Column> = new Map();

    computerBoard: Column[][] = [];

    private _width: number = 8;
    private _height: number = 8;

    currentShipIndex: number = 0;

    PlacingShip: Ship | null = null;
    shipPlacementCount: number = 0;

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

    // addPart(columnId: string, side: string) {
    //     let board: Column[][];
    //     if (side === 'player') {
    //         board = this.playerBoard;
    //     } else {
    //         board = this.computerBoard;
    //     }

    //     const row = parseInt(columnId.split('-')[0]);
    //     const col = parseInt(columnId.split('-')[1]);

    //     const part = new ShipPart(null, columnId, false);
    //     board[row][col].setPart(part);

    //     console.log('77777', board);
    // }

    initializeBoard(board: Column[][]) {
        for (let r = 0; r < this._height; r++) {
            const row: Column[] = [];
            for (let c = 0; c < this._width; c++) {
                const id = uuid();
                // this.boardId.push(1);
                const column = new Column(id);
                this._columnsMap.set(column.id, column);
                row.push(column);
            }
            board.push(row);
        }
        console.log('4444', board);
        this.setComputerShips();
    }
    ngOnInit() {
        this.initializeBoard(this.computerBoard);
    }
    // TO DO
    // private _gameState: GameState = GameState.Preparing;

    // TO DO

    shipDisable(): boolean {
        return this.PlacingShip && this.shipPlacementCount > 0;
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
        if (!this.PlacingShip || this.shipPlacementCount === 0) {
            return true;
        }

        for (const part of this.PlacingShip.parts.values()) {
            if (this.areIdsAdjacent(part.columnId, newId)) {
                return true;
            }
        }
        return false;
    }

    placedShips: Set<string> = new Set();

    setComputerShips() {
        let possibleCoordinate = [];
        let rndX;
        let rndY;
        for (let ship of this.ships) {
            rndX = this.randomIntFromInterval(0, 7);
            rndY = this.randomIntFromInterval(0, 7);
            for (let i = 1; i < ship.length; i++) {
                if (rndY != 7) {
                    possibleCoordinate.push(
                        this.computerBoard[rndY + 1][rndX].id
                    );
                    console.log(
                        '!=7 rndY+1',
                        this.computerBoard[rndY + 1][rndX].id
                    );
                }
                if (rndY != 0) {
                    possibleCoordinate.push(
                        this.computerBoard[rndY - 1][rndX].id
                    );
                    console.log(
                        '!=0 rngY-1',
                        this.computerBoard[rndY - 1][rndX].id
                    );
                }

                if (rndX != 7) {
                    possibleCoordinate.push(
                        this.computerBoard[rndY][rndX + 1].id
                    );
                    console.log(
                        '!=7 rndX+1',
                        this.computerBoard[rndY][rndX + 1].id
                    );
                }

                if (rndX != 0) {
                    possibleCoordinate.push(
                        this.computerBoard[rndY][rndX - 1].id
                    );
                    console.log(
                        '!=0 rndX-1',
                        this.computerBoard[rndY][rndX - 1].id
                    );
                }

                if (possibleCoordinate && !this._columnsMap.get)
                    console.log('sadasd', this.computerBoard[rndY][rndX].id);
                console.log('poss coordinate', possibleCoordinate);
                let selectedItem = this.getRandomItem(possibleCoordinate);
                console.log(`Selected Item: ${selectedItem}`);
            }
        }
    }
    renderCoordinate(id: string) {
        // Implement your rendering logic here
        let column = this._columnsMap.get(id);
        if (column) {
            console.log(`Coordinate ${id} is empty: ${column.isEmpty}`);
            // Render logic for UI or game display
        }
    }

    getRandomItem(items: string[]): string {
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }

    generateRandomNumber(
        min: number,
        max: number,
        exclusions: number[]
    ): number {
        let num: number;
        const validNumbers = [];

        // Generate a list of valid numbers
        for (let i = min; i <= max; i++) {
            if (!exclusions.includes(i)) {
                validNumbers.push(i);
            }
        }

        if (validNumbers.length === 0) {
            throw new Error(
                'No valid numbers available within the specified range and exclusions.'
            );
        }

        console.log('Valid numbers:', validNumbers);

        // Pick a random number from the valid numbers list
        num = validNumbers[Math.floor(Math.random() * validNumbers.length)];

        return num;
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // TODO placing on random column
    placingShips(ship: Ship) {}

    private _placeShip(id: string, ship: Ship): boolean {
        // if (this.placedShips.has(ship.name)) {
        //     console.log('ship already placed');
        //     return false;
        // }

        const column = this._columnsMap.get(id);
        if (!column) {
            console.log('Invalid column ID2', id);
            return false;
        }

        if (column.isEmpty && this.isAdjacent(id)) {
            const partId = uuid();
            const part = new ShipPart(ship.id, partId, false);
            column.setPart(part);
            column.ship = ship;
            ship.addPart(id);
            this.shipPlacementCount++;
            console.log('Ship part placed2:', id);

            console.log('Cell.ship2:', column.ship);

            if (this.shipPlacementCount === ship.length) {
                console.log('Ship fully placed2:', ship.name);
                this.PlacingShip = null;
                this.placedShips.add(ship.name);
            }
        }
    }
}

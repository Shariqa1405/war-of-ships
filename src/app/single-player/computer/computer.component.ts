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
    // Map<string, Column>

    computerBoard: Column[][] = [];
    // columnsArray: Column[][] = [];

    private _width: number = 8;
    private _height: number = 8;

    currentShipIndex: number = 0;

    isPlaced: Ship | null = null;
    shipPlacementCount: number = 0;

    placShips: Set<string> = new Set();

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
        console.log('4444', board);
        this.setComputerShips();
    }
    ngOnInit() {
        this.initializeBoard(this.computerBoard);
    }

    placingShips(ship: Ship) {
        if (this.isPlaced && this.shipPlacementCount > 0) {
            return;
        }
        this.isPlaced = ship;
        this.shipPlacementCount = 0;
    }

    shipDisable(): boolean {
        return this.isPlaced && this.shipPlacementCount > 0;
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
        if (!this.isPlaced || this.shipPlacementCount === 0) {
            return true;
        }

        for (const part of this.isPlaced.parts.values()) {
            if (this.areIdsAdjacent(part.columnId, newId)) {
                return true;
            }
        }
        return false;
    }

    setComputerShips() {
        for (let ship of this.ships) {
            let placed = false;

            while (!placed) {
                let rndX = this.randomIntFromInterval(0, this._width - 1);
                let rndY = this.randomIntFromInterval(0, this._height - 1);

                if (
                    this.computerBoard[rndY][rndX].isEmpty &&
                    this.isAdjacent(this.computerBoard[rndY][rndX].id)
                ) {
                    placed = this.placeShipPart(ship, rndX, rndY);
                }
            }
        }
        console.log('all ships ships placed:', this.ships);
    }

    private placeShipPart(ship: Ship, startX: number, startY: number): boolean {
        let currentX = startX;
        let currentY = startY;
        let partCount = 0;
        const placedParts: string[] = [];

        while (partCount < ship.length) {
            if (
                !this.computerBoard[currentY] ||
                !this.computerBoard[currentY][currentX].isEmpty
            ) {
                placedParts.forEach((partId) => {
                    const [x, y] = this.getCoordinateFromUUID(partId);
                    this.computerBoard[y][x].ship = null;
                    this.computerBoard[y][x].part = null;
                });
                return false;
            }

            let id = this.computerBoard[currentY][currentX].id;
            ship.addPart(id);
            this.computerBoard[currentY][currentX].ship = ship;
            this.computerBoard[currentY][currentX].setPart(
                new ShipPart(ship.id, id, false)
            );
            placedParts.push(id);

            console.log(
                `Ship ${ship.name} at (${currentX}, ${currentY}), id: ${id}`
            );
            console.log(`${ship.name} part: ${partCount + 1}`);

            let possibleCoordinates = this.possibleCoordinate(
                currentX,
                currentY
            );
            if (possibleCoordinates.length === 0) {
                placedParts.forEach((partId) => {
                    const [x, y] = this.getCoordinateFromUUID(partId);
                    this.computerBoard[y][x].ship = null;
                    this.computerBoard[y][x].part = null;
                });
                return false;
            }

            let selectedCoordinate = this.getRandomItem(possibleCoordinates);
            [currentX, currentY] =
                this.getCoordinateFromUUID(selectedCoordinate);

            partCount++;
        }

        this.shipPlacementCount += ship.length;
        console.log(`ship ${ship.name} fullyplaced with ${ship.length} parts`);
        return true;
    }

    private possibleCoordinate(currentX: number, currentY: number): string[] {
        let possibleCoordinates: string[] = [];
        if (
            currentY > 0 &&
            this.computerBoard[currentY - 1][currentX].isEmpty
        ) {
            possibleCoordinates.push(
                this.computerBoard[currentY - 1][currentX].id
            );
        }
        if (
            currentY < this._height - 1 &&
            this.computerBoard[currentY + 1][currentX].isEmpty
        ) {
            possibleCoordinates.push(
                this.computerBoard[currentY + 1][currentX].id
            );
        }
        if (
            currentX > 0 &&
            this.computerBoard[currentY][currentX - 1].isEmpty
        ) {
            possibleCoordinates.push(
                this.computerBoard[currentY][currentX - 1].id
            );
        }
        if (
            currentX < this._width - 1 &&
            this.computerBoard[currentY][currentX + 1].isEmpty
        ) {
            possibleCoordinates.push(
                this.computerBoard[currentY][currentX + 1].id
            );
        }
        // console.log('sssss', possibleCoordinates);
        return possibleCoordinates;
    }

    private getCoordinateFromUUID(id: string): [number, number] {
        for (let r = 0; r < this._height; r++) {
            for (let c = 0; c < this._width; c++) {
                // console.log('oooo', !this.computerBoard[r][c].part?.columnUsed);

                // console.log('ppp', this.computerBoard[r][c]);

                if (this.computerBoard[r][c].id === id) {
                    return [c, r];
                }
            }
        }
        throw new Error('Invalid UUID: Could not find coordinates.');
    }

    getRandomItem<T>(items: T[]): T {
        return items[Math.floor(Math.random() * items.length)];
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

        // Pick a random number from the valid numbers
        num = validNumbers[Math.floor(Math.random() * validNumbers.length)];

        return num;
    }

    randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

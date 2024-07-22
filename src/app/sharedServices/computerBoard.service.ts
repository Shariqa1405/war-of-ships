import { Injectable } from '@angular/core';
import { Ship, ShipPart } from '../shared-models/ships.model';
import { Column } from '../shared-models/column.model';
import { v4 as uuid } from 'uuid';

@Injectable({
    providedIn: 'root',
})
export class ComputerBoardService {
    private _columnsMap: Map<string, Column> = new Map();
    private _width: number = 8;
    private _height: number = 8;

    constructor() {}

    initializeBoard(): Column[][] {
        const board: Column[][] = [];
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
        return board;
    }

    placeShips(board: Column[][], ships: Ship[]) {
        ships.forEach((ship) => {
            let placed = false;
            while (!placed) {
                let rndX = this.randomIntFromInterval(0, this._width - 1);
                let rndY = this.randomIntFromInterval(0, this._height - 1);
                if (
                    board[rndY][rndX].isEmpty &&
                    this.isAdjacent(board, ship, board[rndY][rndX].id)
                ) {
                    placed = this.placeShipPart(board, ship, rndX, rndY);
                }
            }
        });
    }

    private placeShipPart(
        board: Column[][],
        ship: Ship,
        startX: number,
        startY: number
    ): boolean {
        let currentX = startX;
        let currentY = startY;
        let partCount = 0;
        const placedParts: string[] = [];

        while (partCount < ship.length) {
            if (!board[currentY] || !board[currentY][currentX].isEmpty) {
                placedParts.forEach((partId) => {
                    const [x, y] = this.getCoordinateFromUUID(board, partId);
                    board[y][x].ship = null;
                    board[y][x].part = null;
                });
                return false;
            }

            let id = board[currentY][currentX].id;
            ship.addPart(id);
            board[currentY][currentX].ship = ship;
            board[currentY][currentX].setPart(new ShipPart(ship.id, id, false));
            placedParts.push(id);

            let possibleCoordinates = this.possibleCoordinate(
                board,
                currentX,
                currentY
            );
            if (possibleCoordinates.length === 0) {
                placedParts.forEach((partId) => {
                    const [x, y] = this.getCoordinateFromUUID(board, partId);
                    board[y][x].ship = null;
                    board[y][x].part = null;
                });
                return false;
            }

            let selectedCoordinate = this.getRandomItem(possibleCoordinates);
            [currentX, currentY] = this.getCoordinateFromUUID(
                board,
                selectedCoordinate
            );
            partCount++;
        }

        return true;
    }

    private possibleCoordinate(
        board: Column[][],
        currentX: number,
        currentY: number
    ): string[] {
        let possibleCoordinates: string[] = [];
        if (currentY > 0 && board[currentY - 1][currentX].isEmpty) {
            possibleCoordinates.push(board[currentY - 1][currentX].id);
        }
        if (
            currentY < this._height - 1 &&
            board[currentY + 1][currentX].isEmpty
        ) {
            possibleCoordinates.push(board[currentY + 1][currentX].id);
        }
        if (currentX > 0 && board[currentY][currentX - 1].isEmpty) {
            possibleCoordinates.push(board[currentY][currentX - 1].id);
        }
        if (
            currentX < this._width - 1 &&
            board[currentY][currentX + 1].isEmpty
        ) {
            possibleCoordinates.push(board[currentY][currentX + 1].id);
        }
        return possibleCoordinates;
    }

    private getCoordinateFromUUID(
        board: Column[][],
        id: string
    ): [number, number] {
        for (let r = 0; r < this._height; r++) {
            for (let c = 0; c < this._width; c++) {
                if (board[r][c].id === id) {
                    return [c, r];
                }
            }
        }
        throw new Error('Invalid UUID: Could not find coordinates.');
    }

    private isAdjacent(board: Column[][], ship: Ship, newId: string): boolean {
        if (!ship.parts.size) return true;
        for (const part of ship.parts.values()) {
            if (this.areIdsAdjacent(board, part.columnId, newId)) {
                return true;
            }
        }
        return false;
    }

    private areIdsAdjacent(
        board: Column[][],
        id1: string,
        id2: string
    ): boolean {
        const pos1 = this.getCoordinateFromUUID(board, id1);
        const pos2 = this.getCoordinateFromUUID(board, id2);
        if (!pos1 || !pos2) return false;

        const [row1, col1] = pos1;
        const [row2, col2] = pos2;

        return (
            (row1 === row2 && Math.abs(col1 - col2) === 1) ||
            (col1 === col2 && Math.abs(row1 - row2) === 1)
        );
    }

    private randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private getRandomItem<T>(items: T[]): T {
        return items[Math.floor(Math.random() * items.length)];
    }
}

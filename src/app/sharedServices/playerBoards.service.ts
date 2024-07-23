import { Injectable } from '@angular/core';
import { Column } from '../shared-models/column.model';
import { v4 as uuid } from 'uuid';
import { Ship, ShipPart } from '../shared-models/ships.model';

@Injectable({ providedIn: 'root' })
export class playerBoardsService {
    private _columnsMap: Map<string, Column> = new Map();

    private _width: number = 8;
    private _height: number = 8;
    constructor() {}

    initalizeBoard(): Column[][] {
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

    getColumnsMap(): Map<string, Column> {
        return this._columnsMap;
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

    private isAdjacent(
        newId: string,
        selectedShip: Ship | null,
        shipPlacementCount: number
    ): boolean {
        if (!selectedShip || shipPlacementCount === 0) {
            return true;
        }

        for (const part of selectedShip.parts.values()) {
            if (this.areIdsAdjacent(part.columnId, newId)) {
                return true;
            }
        }
        return false;
    }

    placeShip(
        id: string,
        ship: Ship | null,
        shipPlacementCount: number,
        remainingParts: number | null,
        placedShips: Set<string>,
        placedShipParts: string[]
    ): {
        success: boolean;
        shipPlacementCount: number;
        remainingParts: number | null;
    } {
        if (!ship) {
            console.log('ship is not selected');
            return { success: false, shipPlacementCount, remainingParts };
        }

        if (placedShips.has(ship.name)) {
            console.log('ship already placed');
            return { success: false, shipPlacementCount, remainingParts };
        }

        const column = this._columnsMap.get(id);
        if (!column) {
            console.log('Invalid column ID');
            return { success: false, shipPlacementCount, remainingParts };
        }

        if (column.isEmpty && this.isAdjacent(id, ship, shipPlacementCount)) {
            const partId = uuid();
            const part = new ShipPart(ship.id, partId, false);
            column.setPart(part);
            column.ship = ship;
            ship.addPart(id);
            shipPlacementCount++;
            remainingParts =
                remainingParts !== null ? remainingParts - 1 : null;

            placedShipParts.push(id);

            console.log('Ship part placed:', id);

            console.log('Cell.ship:', column.ship);

            if (shipPlacementCount === ship.length) {
                console.log('Ship fully placed:', ship.name);
                placedShips.add(ship.name);
                remainingParts = null;
            }

            return { success: true, shipPlacementCount, remainingParts };
        } else {
            console.log(
                'Cannot place ship part here. Must be adjacent to the previous part.'
            );
            return { success: false, shipPlacementCount, remainingParts };
        }
    }

    removeShipPart(
        columnId: string | null,
        shipPlacementCount: number,
        remainingParts: number | null,
        placedShips: Set<string>,
        selectedShip: Ship | null
    ): {
        shipPlacementCount: number;
        remainingParts: number;
        selectedShip: Ship | null;
    } {
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

        shipPlacementCount--;
        remainingParts = remainingParts !== null ? remainingParts + 1 : null;

        console.log(`${ship.name}part removed from ${columnId} `);

        selectedShip = ship;
        // resetSelectedShip(ship);
        placedShips.delete(ship.name);
        return { shipPlacementCount, remainingParts, selectedShip };
    }
}

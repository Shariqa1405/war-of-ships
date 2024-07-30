import { Injectable } from "@angular/core";
import { Ship } from "../shared-models/ships.model";
import { Column } from "../shared-models/column.model";
import { v4 as uuid } from "uuid";

@Injectable({
  providedIn: "root",
})
export class BoardServiceService {
  private _columnsMap: Map<string, Column> = new Map();

  private _width: number = 8;
  private _height: number = 8;
  constructor() {}

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

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

  isAdjacent(
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

  isAdjacentOnBoard(board: Column[][], ship: Ship, newId: string): boolean {
    if (!ship.parts.size) return true;
    for (const part of ship.parts.values()) {
      if (this.areIdsAdjacent(part.columnId, newId)) {
        return true;
      }
    }
    return false;
  }
}

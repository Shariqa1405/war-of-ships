import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { IUser } from '../models/interfaces/user.interface';
import { Column } from '../models/classes/column.class';

@Injectable({ providedIn: 'root' })
export class BoardsService {
    public user = new BehaviorSubject<IUser | null>(null);

    private _playerColumnsMap: Map<string, Map<string, Column>> = new Map();
    private _playerBoardsMap: Map<string, Column[][]> = new Map();

    constructor() {}

    public create(id: string, width: number, height: number) {
        const board = this._initData(id, width, height);
        this._playerBoardsMap.set(id, board);
        return board;
    }

    private _initData(playerId: string, width: number, height: number): Column[][] {
        this._playerColumnsMap.set(playerId, new Map());

        const board: Column[][] = [];
        for (let r = 0; r < height; r++) {
            const row: Column[] = [];
            for (let c = 0; c < width; c++) {
                const id = uuid();
                const column = new Column(id);
                this._playerColumnsMap.get(playerId)!.set(column.id, column);
                row.push(column);
            }
            board.push(row);
        }

        return board;
    }
}

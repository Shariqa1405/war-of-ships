import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column } from '../../models/classes/column.class';

export interface IBoardConfig {
    id: string;
    board: Column[][];
}

export interface IBoardEvent {
    id: string;
    column: Column;
}

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [],
    templateUrl: './board.component.html',
    styleUrl: './board.component.css',
})
export class BoardComponent {
    //#region Private Members
    private _id: string | undefined;
    private _board: Column[][] | undefined;
    //#endregion

    @Input()
    public set config(value: IBoardConfig | undefined) {
        this._setConfig(value);
    }

    @Output()
    public onClick: EventEmitter<IBoardEvent> = new EventEmitter();

    public get board() {
        return this._board;
    }

    public get id() {
        return this._id;
    }

    //#region  Private API
    public onCellClick(column: Column) {
        this.onClick.emit({
            id: this._id!,
            column,
        });
    }

    private _setConfig(value: IBoardConfig | undefined) {
        this._id = value?.id;
        this._board = value?.board;
    }
    //#endregion
}

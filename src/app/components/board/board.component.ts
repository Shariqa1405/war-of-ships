import { Component, Input } from '@angular/core';
import { Column } from '../../models/classes/column.class';

export interface IBoardConfig {
    id: string;
    board: Column[][];
}

@Component({
    selector: 'app-board',
    standalone: true,
    imports: [],
    templateUrl: './board.component.html',
    styleUrl: './board.component.css',
})
export class BoardComponent {
    private _id: string | undefined;
    private _board: Column[][] | undefined;

    @Input()
    public set config(value: IBoardConfig | undefined) {
        this._setConfig(value);
    }

    public get board() {
        return this._board;
    }

    public onCellClick(cell: Column) {
        console.log('cell clicked', cell);
        
        //cell.setState('hit');
    }

    private _setConfig(value: IBoardConfig | undefined) {
        this._id = value?.id;
        this._board = value?.board;
    }
}

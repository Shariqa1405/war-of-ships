import { Component } from '@angular/core';
import { BoardsService } from '../../../services/boards.service';
import { IBoardConfig, BoardComponent } from '../../../components/board/board.component';

@Component({
    selector: 'app-match',
    standalone: true,
    imports: [BoardComponent],
    templateUrl: './match.component.html',
    styleUrl: './match.component.css',
})
export class MatchComponent {
    private _tmpUserId: string = '123';
    private _width: number = 6;
    private _height: number = 6;

    public p1Bload: IBoardConfig | undefined;

    constructor(private readonly _boardService: BoardsService) {
        const board = this._boardService.create(this._tmpUserId, this._width, this._height);
        this.p1Bload = {
            board,
            id: this._tmpUserId,
        };
    }
}

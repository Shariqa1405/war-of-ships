import { Component } from '@angular/core';
import { BoardsService } from '../../../services/boards.service';
import { IBoardConfig, BoardComponent, IBoardEvent } from '../../../components/board/board.component';
import { Ship } from '../../../models/classes/ship.class';

interface IBattleShip {
    id: string;
    name: string;
    color: string;
    partsCount: number;
}

@Component({
    selector: 'app-match',
    standalone: true,
    imports: [BoardComponent],
    templateUrl: './match.component.html',
    styleUrl: './match.component.css',
})
export class MatchComponent {
    private _state: 'prepearing' | 'battle' | 'result' = 'prepearing';
    public turn: string | undefined;

    private _playerId: string = '1';
    private _npcId: string = '2';

    private _width: number = 6;
    private _height: number = 6;

    public playerBload: IBoardConfig | undefined;
    public npcBload: IBoardConfig | undefined;

    private _battleShips: Map<string, Ship> = new Map();
    private _army: IBattleShip[] = [];
    private _selectedArmy: string | null | undefined;

    // TODO
    // battleshipTypes
    // selectedBattleShip

    public get army() {
        return this._army;
    }

    constructor(private readonly _boardService: BoardsService) {
        this._initArmy();

        const board1 = this._boardService.create(this._playerId, this._width, this._height);
        const board2 = this._boardService.create(this._npcId, this._width, this._height);

        this.playerBload = {
            board: board1,
            id: this._playerId,
        };

        this.npcBload = {
            board: board2,
            id: this._npcId,
        };
    }

    public onPlayerBoardClick(event: IBoardEvent) {
        if (this._state === 'prepearing') {
            if (this._selectedArmy) {
                const army = this.getArmyById(this._selectedArmy);
                if (!army) {
                    console.error('something went really wrong');
                    return;
                }
                
                if (this.getBattleshipPartsLength(this._selectedArmy) < army.partsCount) {
                    // TODO...
                    console.log('>>>>>');
                }
            }
        }
    }

    public onNPCBoardClick(event: IBoardEvent) {
        if (this._state === 'battle') {
            //
        }
    }

    public onArmySelect(id: string) {
        this._selectedArmy = this._selectedArmy !== id ? id : null;
    }

    public getBattleshipPartsLength(id: string) {
        const ship = this._battleShips.get(id);
        return ship ? ship.partsLength : 0;
    }

    public isArmySelected(id: string) {
        return id === this._selectedArmy;
    }

    public getArmyById(id: string) {
        for (let item of this.army) {
            if (item.id === id) return item;
        }
        return null;
    }

    private _initArmy() {
        this._army.push({
            id: 'one-part-ship',
            name: '1 Part Ship',
            color: 'blue',
            partsCount: 1,
        });

        this._army.push({
            id: 'three-part-ship',
            name: '3 Part Ship',
            color: 'purple',
            partsCount: 3,
        });
    }
}

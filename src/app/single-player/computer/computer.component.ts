import {
    ChangeDetectionStrategy,
    Component,
    NgZone,
    OnInit,
} from '@angular/core';
import { Column } from '../../shared-models/column.model';
import { Ship } from '../../shared-models/ships.model';
import { ComputerBoardService } from '../../sharedServices/computerBoard.service';
import { BoardServiceService } from '../../sharedServices/board-service.service';
import { AttackService } from '../../sharedServices/attack.service';
import {
    GameState,
    GameStateService,
} from '../../sharedServices/game-state.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-computer',
    templateUrl: './computer.component.html',
    styleUrl: './computer.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComputerComponent implements OnInit {
    ships: Ship[] = [
        new Ship('Fulton', 2, 1),
        new Ship('Clermont', 3, 2),
        // new Ship('Argo', 4, 3),
        // new Ship('Dreadnought', 5, 4),
        // new Ship('Titanic', 5, 5),
    ];

    computerBoard: Column[][] = [];
    playerBoard: Column[][] = [];
    hitCells: Set<string> = new Set();
    missedCells: Set<string> = new Set();
    isMissedCell: boolean = false;
    isHitCell: boolean = false;
    isComputerTurn: boolean = false;
    hit: boolean = false;
    miss: boolean = false;

    constructor(
        private computerBoardService: ComputerBoardService,
        private boardsService: BoardServiceService,
        private attackService: AttackService,
        private GameStateService: GameStateService,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.computerBoard = this.boardsService.initalizeBoard();
        this.computerBoardService.placeShips(this.computerBoard, this.ships);
        this.playerBoard = this.boardsService.initalizeBoard();
    }

    onColumnClick(columnId: string) {
        if (this.GameStateService.gameState !== GameState.Battle) {
            console.log('Game is not started');
            return;
        }

        if (this.isComputerTurn) {
            console.log('computer is making move');
            return;
        }

        // debugger;

        const result = this.attackService.hitOnColumn(
            columnId,
            this.computerBoard
        );

        this.isHitCell = false;
        this.isMissedCell = false;

        if (result.hit) {
            if (!this.missedCells.has(columnId)) {
                this.hitCells.add(columnId);
                console.log(`Player hit: ${columnId}`);
                this.isHitCell = true;
                if (result.shipDestroyed) {
                    console.log('Player destroyed a ship');
                }
            }
        } else {
            if (!this.hitCells.has(columnId)) {
                this.missedCells.add(columnId);
                this.isMissedCell = true;
                console.log(`Player missed: ${columnId}`);
            }
        }

        this.cdr.detectChanges();

        this.triggerComputerTurn();
    }

    triggerComputerTurn() {
        if (this.GameStateService.gameState !== GameState.Battle) {
            return;
        }

        this.isComputerTurn = true;

        setTimeout(() => {
            this.ngZone.run(() => {
                const result = this.computerBoardService.computerAttack(
                    this.playerBoard
                );
                console.log('result:', result);

                if (result.hit) {
                    this.computerBoardService.hit = true;
                    console.log('Computer hit');

                    this.hitCells.add(result.columnId);
                    if (result.shipDestroyed) {
                        console.log('Computer destroyed a ship');
                    }
                } else {
                    this.computerBoardService.miss = true;
                    console.log('Computer missed');
                    this.missedCells.add(result.columnId);
                }

                // this.cdr.markForCheck();
                this.isComputerTurn = false;
                this.cdr.detectChanges();
            });
        }, 1000);
    }

    isHit(columnId: string): boolean {
        // return (
        //     this.hitCells.has(columnId) ||
        //     this.computerBoard.some((row) =>
        //         row.some((col) => col.id === columnId && col.hittedColumn)
        //     )
        // );

        return this.hitCells.has(columnId);
        // if (result) {
        //     console.log(`${columnId} marked as hit `);
        // }
        // this.isHitCell = true;
        // return result;
    }

    isMissed(columnId: string): boolean {
        // return (
        //     this.missedCells.has(columnId) ||
        //     this.computerBoard.some((row) =>
        //         row.some((col) => col.id === columnId && col.missedColumn)
        //     )
        // );
        return this.missedCells.has(columnId);

        // if (columnId) {
        //     return result;
        // }
        // console.log(result, 'result missed');

        // if (result) {
        //     console.log(`${columnId} marked as missed`);
        // }
        // this.isMissedCell = true;
        // return result;
    }

    get gameState(): GameState {
        return this.GameStateService.gameState;
    }
}

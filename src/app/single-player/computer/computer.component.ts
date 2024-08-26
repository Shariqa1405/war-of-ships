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

        // debugger;

        const result = this.attackService.hitOnColumn(
            columnId,
            this.computerBoard
        );

        if (result.hit) {
            this.hitCells.add(columnId);
            console.log(`Player hit: ${columnId}`);
            if (result.shipDestroyed) {
                console.log('Player destroyed a ship');
            }
        } else {
            this.missedCells.add(columnId);
            console.log(`Player missed: ${columnId}`);
        }

        this.cdr.detectChanges();

        this.triggerComputerTurn();
    }

    triggerComputerTurn() {
        if (this.GameStateService.gameState !== GameState.Battle) {
            return;
        }

        setTimeout(() => {
            this.ngZone.run(() => {
                const result = this.computerBoardService.computerAttack(
                    this.playerBoard
                );

                if (result.hit) {
                    console.log('Computer hit');
                    this.hitCells.add(result.columnId);
                    if (result.shipDestroyed) {
                        console.log('Computer destroyed a ship');
                    }
                } else {
                    console.log('Computer missed');
                    this.missedCells.add(result.columnId);
                }

                this.cdr.markForCheck();
            });
        }, 1000);
    }

    isHit(columnId: string): boolean {
        return (
            this.hitCells.has(columnId) ||
            this.computerBoard.some((row) =>
                row.some((col) => col.id === columnId && col.hittedColumn)
            )
        );
    }

    isMissed(columnId: string): boolean {
        return (
            this.missedCells.has(columnId) ||
            this.computerBoard.some((row) =>
                row.some((col) => col.id === columnId && col.missedColumn)
            )
        );
    }

    get gameState(): GameState {
        return this.GameStateService.gameState;
    }
}

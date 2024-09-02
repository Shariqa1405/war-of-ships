import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Ship, ShipPart } from '../shared-models/ships.model';
import { Column } from '../shared-models/column.model';
import { playerBoardsService } from '../sharedServices/playerBoards.service';
import { BoardServiceService } from '../sharedServices/board-service.service';
import { MatchServiceService } from '../sharedServices/matchservice.service';
import { ComputerBoardService } from '../sharedServices/computerBoard.service';
import {
    GameState,
    GameStateService,
} from '../sharedServices/game-state.service';

// export enum GameState {
//     Pending,
//     Preparing,
//     Battle,
//     Finished,
// }
export enum Turn {
    player,
    computer,
}

@Component({
    selector: 'app-single-player',
    templateUrl: './single-player.component.html',
    styleUrl: './single-player.component.css',
})
export class SinglePlayerComponent implements OnInit {
    constructor(
        private playerBoardsService: playerBoardsService,
        private boardsService: BoardServiceService,
        private matchService: MatchServiceService,
        public computerBoardService: ComputerBoardService,
        private GameStateService: GameStateService,
        private cdr: ChangeDetectorRef
    ) {
        this.matchService.changeTurn.subscribe((turn) => {
            if (turn == 'computer') {
                this.computerTurn();
            }
        });
    }

    playerBoard: Column[][] = [];
    computerBoard: Column[][] = [];

    gameStatus: GameState = GameState.Preparing;
    // gameBattle: GameState = GameState.Battle;
    // gameFinished: GameState = GameState.Finished;
    gameBattle: GameState = GameState.Battle;

    // get gameState() {
    //     return this.GameStateService.gameState;
    // }

    currentShipIndex: number = 0;

    selectedShip: Ship | null = null;
    shipPlacementCount: number = 0;
    remainingParts: number | null = null;

    placedShips: Set<string> = new Set();
    hitCells: Set<string> = new Set();
    missedCells: Set<string> = new Set();
    lastColumnClicked: string | null = null;
    placedShipParts: string[] = [];

    boards: string[][] = [];
    // hitCells: Set<string> = new Set();
    // missedCells: Set<string> = new Set();

    currTurn: Turn = Turn.player;

    // get getState(): GameState {
    //     return this._gameState;
    // }

    addPart(columnId: string, side: string) {
        let board: Column[][];
        if (side === 'player') {
            board = this.playerBoard;
        } else {
            board = this.computerBoard;
        }

        const row = parseInt(columnId.split('-')[0]);
        const col = parseInt(columnId.split('-')[1]);

        const part = new ShipPart(null, columnId, false);
        board[row][col].setPart(part);

        console.log('77777', board);
    }

    ships: Ship[] = [
        new Ship('Fulton', 2, 1),
        new Ship('Clermont', 3, 2),
        // new Ship('Argo', 4, 3),
        // new Ship('Dreadnought', 5, 4),
        // new Ship('Titanic', 5, 5),
    ];

    ngOnInit() {
        this.playerBoard = this.boardsService.initalizeBoard();
    }

    initializeBoard() {
        this.playerBoard = this.boardsService.initalizeBoard();
        this.computerBoard = this.boardsService.initalizeBoard();
    }

    selectShip(ship: Ship) {
        if (this.placedShips.has(ship.name)) {
            console.log(`${ship.name} is fully placed`);
            return;
        }

        if (this.selectedShip && this.shipPlacementCount > 0) {
            console.log(
                'Please finish placing the current ship before selecting another.'
            );
            return;
        }
        this.selectedShip = ship;
        this.shipPlacementCount = ship.parts.size;
        this.remainingParts = ship.length - ship.parts.size;
        console.log('Selected ship:', ship);
    }

    shipDisable(): boolean {
        return this.selectedShip && this.shipPlacementCount > 0;
    }

    removeLastPlacedPart() {
        if (this.placedShipParts.length === 0) {
            console.log('no parts to remove');
            return;
        }
        const lastPlacedId = this.placedShipParts.pop();
        if (lastPlacedId) {
            const result = this.playerBoardsService.removeShipPart(
                lastPlacedId,
                this.shipPlacementCount,
                this.remainingParts,
                this.placedShips,
                this.selectedShip
            );
            this.shipPlacementCount = result.shipPlacementCount;
            this.remainingParts = result.remainingParts;
            this.selectedShip = result.selectedShip;
            this.resetSelectedShip(this.selectedShip);
        }
    }

    private resetSelectedShip(ship: Ship | null) {
        if (ship) {
            this.shipPlacementCount = ship.parts.size;
            this.remainingParts = ship.length - ship.parts.size;
        } else {
            this.shipPlacementCount = 0;
            this.remainingParts = null;
        }
    }

    columnClick(id: string, side: 'player' | 'computer') {
        // if (this.currTurn !== Turn.player) {
        //     console.log('not player Turn');
        //     return;
        // }

        if (
            this.currTurn !== Turn.player ||
            (side === 'player' &&
                this.GameStateService.gameState === GameState.Battle)
        ) {
            console.log(
                'Invalid action: Not player turn or clicking on player board during battle'
            );
            return;
        }

        this.lastColumnClicked = id;
        switch (this.GameStateService.gameState) {
            case GameState.Pending:
                console.log('game not started yet');
                break;
            case GameState.Preparing:
                if (side === 'player') {
                    if (this.selectedShip) {
                        const result = this.playerBoardsService.placeShip(
                            id,
                            this.selectedShip,
                            this.shipPlacementCount,
                            this.remainingParts,
                            this.placedShips,
                            this.placedShipParts
                        );
                        if (result.success) {
                            this.shipPlacementCount = result.shipPlacementCount;
                            this.remainingParts = result.remainingParts;
                            if (
                                this.shipPlacementCount ===
                                this.selectedShip.length
                            ) {
                                console.log(
                                    'Ship fully placed:',
                                    this.selectedShip.name
                                );
                                this.placedShips.add(this.selectedShip.name);
                                this.selectedShip = null;
                                this.remainingParts = null;
                            }
                        } else {
                            console.log('Failed to place ship part.');
                        }
                    } else {
                        console.log('no ship selected');
                    }
                }
                break;
            case GameState.Battle:
                this.playerAttack(id);
                break;
            case GameState.Finished:
                console.log('the battle is finished');
                break;
            default:
                console.log('unknown state');
        }

        console.log(id, this.boardsService.getColumnsMap().get(id));
    }

    playerAttack(columnId: string) {
        const result = this.matchService.hitOnColumn(
            columnId,
            this.computerBoard,
            this.playerBoard
        );

        let column: Column | null = null;

        for (let row = 0; row < this.computerBoard.length; row++) {
            for (let col = 0; col < this.computerBoard[row].length; col++) {
                if (this.computerBoard[row][col].id === columnId) {
                    column = this.computerBoard[row][col];
                    break;
                }
            }
            if (column) break;
        }

        if (column) {
            if (result.hit) {
                column.hitted();
                console.log('hit');
                if (result.shipDestroyed) {
                    console.log('ship is destroyed');
                }
            } else {
                column.missed();
                console.log('missed');
            }
        } else {
            console.log('Column not found.');
        }

        this.currTurn = Turn.computer;
        console.log('1234');

        this.computerTurn();
    }
    computerTurn() {
        const computerResult = this.matchService.computerTurn(this.playerBoard);
        console.log('playerboarddd', this.playerBoard);
        if (computerResult) {
            const { columnId, hit, shipDestroyed } = computerResult;

            if (hit) {
                console.log(`Computer hit at ${columnId}`);
                if (shipDestroyed) {
                    console.log('Computer destroyed a ship!');
                }
            } else {
                console.log(`Computer missed at ${columnId}`);
            }

            this.cdr.detectChanges();
        }
    }

    private areAllShipsDestroyed(board: Column[][]): boolean {
        for (let row of board) {
            for (let column of row) {
                if (column.part && !column.part.isDestroyed) {
                    return false;
                }
            }
        }

        return true;
    }

    gameFinished(winner: 'player' | 'computer') {
        this.GameStateService.gameState = GameState.Finished;
        console.log(`Game Over! ${winner} wins.`);
    }

    get gameState(): GameState {
        return this.GameStateService.gameState;
    }

    allShipsPlaced(): boolean {
        return this.placedShips.size === this.ships.length;
    }

    isHit(columnId: string) {
        // const computerResult = this.matchService.computerTurn(this.playerBoard);
        // this.computerTurn();
        if (columnId === this.computerBoardService.columnId) {
            console.log(columnId, 'ssssss');

            return this.hitCells.has(columnId);
        }

        // console.log('compresult', computerResult);
    }

    isMissed(columnId: string) {
        // const computerResult = this.matchService.computerTurn(this.playerBoard);
        // this.computerTurn();
        if (columnId === this.computerBoardService.columnId) {
            console.log(columnId, 'ssssss');

            return this.missedCells.has(columnId);
        }
        // console.log('compresult miss', computerResult);
    }

    onComputerColumnClick(columnId: string) {
        if (this.GameStateService.gameState !== GameState.Battle) {
            console.log('Game is not in battle state');
            return;
        }
        this.playerAttack(columnId);
    }

    start() {
        if (this.allShipsPlaced()) {
            this.GameStateService.gameState = GameState.Battle;
            console.log('Game Started');
            this.currTurn = Turn.player;
        } else {
            console.log('place all ships');
        }
    }
}

import { Component, OnInit } from '@angular/core';
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
        private computerService: ComputerBoardService,
        private GameStateService: GameStateService
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

    columnClick(id: string, Cell?) {
        if (this.currTurn !== Turn.player) {
            console.log('not player Turn');
            return;
        }
        this.lastColumnClicked = id;
        switch (this.GameStateService.gameState) {
            case GameState.Pending:
                console.log('game not started yet');
                break;
            case GameState.Preparing:
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
                            this.shipPlacementCount === this.selectedShip.length
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

        // Loop through the board to find the column by its ID
        for (let row = 0; row < this.computerBoard.length; row++) {
            for (let col = 0; col < this.computerBoard[row].length; col++) {
                if (this.computerBoard[row][col].id === columnId) {
                    column = this.computerBoard[row][col];
                    break;
                }
            }
            if (column) break; // Break the outer loop if column is found
        }

        // If the column is found, apply the attack result
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
        this.computerTurn();
    }
    computerTurn() {
        this.matchService.computerTurn(this.playerBoard);
    }

    get gameState(): GameState {
        return this.GameStateService.gameState;
    }

    allShipsPlaced(): boolean {
        return this.placedShips.size === this.ships.length;
    }

    isHit(columnId: string): boolean {
        // return (
        //     this.hitCells.has(columnId) ||
        //     this.playerBoard.some((row) =>
        //         row.some((col) => col.id === columnId && col.hittedColumn)
        //     )
        // );
        return this.hitCells.has(columnId);
    }

    isMissed(columnId: string): boolean {
        // return (
        //     this.missedCells.has(columnId) ||
        //     this.playerBoard.some((row) =>
        //         row.some((col) => col.id === columnId && col.missedColumn)
        //     )
        // );
        return this.missedCells.has(columnId);
    }

    // // disableButton(): boolean {
    // //     if (this.allShipsPlaced()) {
    // //         this._gameState === GameState.Battle;
    // //         console.log('Game Started', GameState.Battle);
    // //         return this.isStartGame;
    // //     }
    // //     if (!this.allShipsPlaced()) {
    // //         this._gameState !== GameState.Pending;
    // //         return !this.isStartGame;
    // //     }
    // // }
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

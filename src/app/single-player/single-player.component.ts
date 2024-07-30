import { Component, OnInit } from '@angular/core';
import { Ship, ShipPart } from '../shared-models/ships.model';
import { Column } from '../shared-models/column.model';
import { playerBoardsService } from '../sharedServices/playerBoards.service';
import { BoardServiceService } from '../sharedServices/board-service.service';
import { MatchServiceService } from '../sharedServices/matchservice.service';
import { ComputerBoardService } from '../sharedServices/computerBoard.service';
import { ComputerComponent } from './computer/computer.component';

enum GameState {
    Pending,
    Preparing,
    Battle,
    Finished,
}
enum Turn {
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
        private computerService: ComputerBoardService
    ) {}

    playerBoard: Column[][] = [];
    computerBoard: Column[][] = [];

    private _gameState: GameState = GameState.Preparing;
    gameBattle: GameState = GameState.Battle;
    gameFinished: GameState = GameState.Finished;

    currentShipIndex: number = 0;

    selectedShip: Ship | null = null;
    shipPlacementCount: number = 0;
    remainingParts: number | null = null;

    placedShips: Set<string> = new Set();
    lastColumnClicked: string | null = null;
    placedShipParts: string[] = [];

    boardsMap: Map<string, Map<string, Column>> = new Map();
    boards: string[][] = [];

    currTurn: Turn = Turn.player;

    get getState(): GameState {
        return this._gameState;
    }

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
        new Ship('Argo', 4, 3),
        new Ship('Dreadnought', 5, 4),
        new Ship('Titanic', 5, 5),
    ];

    ngOnInit() {
        this.playerBoard = this.boardsService.initalizeBoard();
    }

    initializeBoard() {
        this.playerBoard = this.boardsService.initalizeBoard();
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
        switch (this._gameState) {
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
                // TODO
                // implement game logic

                break;
            case GameState.Finished:
                console.log('the battle is finished');
                break;
            default:
                console.log('unknown state');
        }

        console.log(id, this.boardsService.getColumnsMap().get(id));
    }

    // playerAttack(columnId: string) {
    //     const result = this.matchService.hitOnColumn(
    //         columnId,
    //         this.computerBoard,
    //         this.playerBoard
    //     );

    //     if (result.hit) {
    //         console.log('hit');
    //         if (result.shipDestroyed) {
    //             console.log('ship is destroyed');
    //         }
    //     } else {
    //         console.log('missed');
    //     }
    //     this.currTurn = Turn.computer;
    //     this.computerTurn;
    // }
    // computerTurn() {
    //     // if (this._gameState !== GameState.Battle) {
    //     //     console.log('not in battle');
    //     //     return;
    //     // }
    //     // const result = this.computerService.computerAttack(this.playerBoard);
    //     // if (result.hit) {
    //     //     if (result.shipDestroyed) {
    //     //         console.log('ship is destroyed');
    //     //     } else {
    //     //         console.log('computer missied');
    //     //     }
    //     //     this.currTurn = Turn.player;
    //     // }
    // }

    // // allShipsPlaced(): boolean {
    // //     return this.placedShips.size === this.ships.length;
    // // }

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

    start() {
        this._gameState = GameState.Battle;
        console.log('Game Started');
    }
}

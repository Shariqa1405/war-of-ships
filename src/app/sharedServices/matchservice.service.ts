import { EventEmitter, Injectable, OnInit } from "@angular/core";
import { ComputerBoardService } from "./computerBoard.service";
import { BoardServiceService } from "./board-service.service";
import { Ship } from "../shared-models/ships.model";
import { Column } from "../shared-models/column.model";
import { AttackService } from "./attack.service";

@Injectable({
  providedIn: "root",
})
export class MatchServiceService implements OnInit {
  changeTurn: EventEmitter<string> = new EventEmitter<string>();

  currTurn: "player" | "computer" = "player";
  playerBoard: Column[][] = [];

  constructor(
    private boardsService: BoardServiceService,
    private computerBoardService: ComputerBoardService,
    private attackService: AttackService
  ) {}

  ngOnInit() {
    this.playerBoard = this.boardsService.initalizeBoard();
  }

  hitOnColumn(
    columnId: string,
    board: Column[][],
    targetBoard: Column[][]
  ): { hit: boolean; shipDestroyed: boolean } {
    console.log("Board before hit:", board);
    console.log("Target Board (Player's board) before hit:", targetBoard);
    // debugger;
    const result = this.attackService.hitOnColumn(columnId, board);

    console.log("Board after hit:", board);
    console.log("Target Board (Player's board) after hit:", targetBoard);

    this.computerTurn(targetBoard);
    return result;
  }

  toggleTurn() {
    this.currTurn = this.currTurn === "player" ? "computer" : "player";
    this.changeTurn.emit(this.currTurn);
  }

  computerTurn(playerBoard: Column[][]) {
    try {
      console.log("Computer turn started");

      const result = this.computerBoardService.computerAttack(playerBoard);

      if (result.hit) {
        console.log(
          "Computer hit a ship on the player's board at:",
          result.columnId
        );
        if (result.shipDestroyed) {
          console.log("Computer destroyed a ship on the player's board!");
        }
      } else {
        console.log(
          "Computer missed on the player's board at:",
          result.columnId
        );
      }

      console.log(
        "Player board after computer move:",
        JSON.stringify(playerBoard)
      );

      this.toggleTurn();

      return {
        columnId: result.columnId,
        hit: result.hit,
        shipDestroyed: result.shipDestroyed,
      };
    } catch (error) {
      console.error("Error during computer turn:", error);
    }
  }
}

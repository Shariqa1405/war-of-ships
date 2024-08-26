import { Injectable } from "@angular/core";
import { Column } from "../shared-models/column.model";
import { BoardServiceService } from "./board-service.service";
import { playerBoardsService } from "./playerBoards.service";
import { ShipPart } from "../shared-models/ships.model";

@Injectable({
  providedIn: "root",
})
export class AttackService {
  constructor(
    private boardService: BoardServiceService,
    private playerBoardService: playerBoardsService
  ) {}

  hitOnColumn(
    columnId: string,
    board: Column[][]
  ): { hit: boolean; shipDestroyed: boolean } {
    let targetColumn: Column | null = null;

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        // debugger;
        if (board[row][col].id === columnId) {
          targetColumn = board[row][col];
          break;
        }
      }
      if (targetColumn) break;
    }

    if (!targetColumn) {
      console.log("Board State:", board);
      return { hit: false, shipDestroyed: false };
    }

    const hitResult = targetColumn.hitted();
    console.log(
      `Column ${columnId} updated: hit = ${hitResult}, destroyed = ${targetColumn.ship?.isDestroyed()}`
    );

    targetColumn.hittedColumn = true;

    return {
      hit: hitResult,
      shipDestroyed: targetColumn.ship?.isDestroyed() || false,
    };
  }
}

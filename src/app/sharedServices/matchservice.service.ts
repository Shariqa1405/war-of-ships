import { forwardRef, Inject, Injectable, OnInit } from "@angular/core";
import { playerBoardsService } from "./playerBoards.service";
import { ComputerBoardService } from "./computerBoard.service";
import { BoardServiceService } from "./board-service.service";
import { Ship } from "../shared-models/ships.model";
import { Column } from "../shared-models/column.model";

@Injectable({
  providedIn: "root",
})
export class MatchServiceService implements OnInit {
  constructor(
    // private playerBoardService: playerBoardsService,
    private boardsService: BoardServiceService,
    // @Inject(forwardRef(() => ComputerBoardService))
    private computerBoardService: ComputerBoardService
  ) {}

  ngOnInit() {}

  hitOnColumn(
    columnId: string,
    board: Column[][],
    tragetBoard: Column[][]
  ): { hit: boolean; shipDestroyed: boolean } {
    const column = this.boardsService.getColumnsMap().get(columnId);

    if (!column) {
      console.log("invaled");
      return { hit: false, shipDestroyed: false };
    }

    if (column.ship) {
      const shipPart = column.ship.parts.get(columnId);
      if (shipPart) {
        shipPart.isDestroyed = true;
        column.hitted();

        console.log(`hit on ${columnId}. ${column.ship.name} part destroyed.`);

        const shipDestroyed = column.ship.isDestroyed();

        return { hit: true, shipDestroyed };
      } else {
        console.log(`missed ${columnId}`);
        return { hit: false, shipDestroyed: false };
      }
    } else {
      console.log(`missed ${columnId}`);
      return { hit: false, shipDestroyed: false };
    }
  }
}

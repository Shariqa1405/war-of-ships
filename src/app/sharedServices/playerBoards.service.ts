import { Injectable, OnInit } from "@angular/core";
import { Column } from "../shared-models/column.model";
import { v4 as uuid } from "uuid";
import { Ship, ShipPart } from "../shared-models/ships.model";
import { BoardServiceService } from "./board-service.service";
import { ComputerBoardService } from "./computerBoard.service";

@Injectable({ providedIn: "root" })
export class playerBoardsService implements OnInit {
  constructor(
    private boardService: BoardServiceService // private computerBoardService: ComputerBoardService
  ) {}
  ngOnInit() {}

  placeShip(
    id: string,
    ship: Ship | null,
    shipPlacementCount: number,
    remainingParts: number | null,
    placedShips: Set<string>,
    placedShipParts: string[]
  ): {
    success: boolean;
    shipPlacementCount: number;
    remainingParts: number | null;
  } {
    if (!ship) {
      console.log("ship is not selected");
      return { success: false, shipPlacementCount, remainingParts };
    }

    if (placedShips.has(ship.name)) {
      console.log("ship already placed");
      return { success: false, shipPlacementCount, remainingParts };
    }

    const column = this.boardService.getColumnsMap().get(id);
    if (!column) {
      console.log("Invalid column ID");
      return { success: false, shipPlacementCount, remainingParts };
    }

    if (
      column.isEmpty &&
      this.boardService.isAdjacent(id, ship, shipPlacementCount)
    ) {
      const partId = uuid();
      const part = new ShipPart(ship.id, partId, false);
      column.setPart(part);
      column.ship = ship;
      ship.addPart(id);
      shipPlacementCount++;
      remainingParts = remainingParts !== null ? remainingParts - 1 : null;

      placedShipParts.push(id);

      console.log("Ship part placed:", id);

      console.log("Cell.ship:", column.ship);

      if (shipPlacementCount === ship.length) {
        console.log("Ship fully placed:", ship.name);
        placedShips.add(ship.name);
        remainingParts = null;
      }

      return { success: true, shipPlacementCount, remainingParts };
    } else {
      console.log(
        "Cannot place ship part here. Must be adjacent to the previous part."
      );
      return { success: false, shipPlacementCount, remainingParts };
    }
  }

  removeShipPart(
    columnId: string | null,
    shipPlacementCount: number,
    remainingParts: number | null,
    placedShips: Set<string>,
    selectedShip: Ship | null
  ): {
    shipPlacementCount: number;
    remainingParts: number;
    selectedShip: Ship | null;
  } {
    if (!columnId) {
      return;
    }

    const column = this.boardService.getColumnsMap().get(columnId);
    if (!column || !column.ship) {
      console.log("no ShipPart to remove");
      return;
    }

    const ship = column.ship;

    ship.removePart(columnId);
    column.setPart(null);
    column.ship = null;
    column.isEmpty = true;

    shipPlacementCount--;
    remainingParts = remainingParts !== null ? remainingParts + 1 : null;

    console.log(`${ship.name}part removed from ${columnId} `);

    selectedShip = ship;
    placedShips.delete(ship.name);
    return { shipPlacementCount, remainingParts, selectedShip };
  }
}

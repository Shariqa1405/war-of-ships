import { forwardRef, Inject, inject, Injectable } from "@angular/core";
import { Ship, ShipPart } from "../shared-models/ships.model";
import { Column } from "../shared-models/column.model";
import { BoardServiceService } from "./board-service.service";
import { MatchServiceService } from "./matchservice.service";

@Injectable({
  providedIn: "root",
})
export class ComputerBoardService {
  constructor(
    private boardsService: BoardServiceService,
    // @Inject(forwardRef(() => MatchServiceService))
    private matchService: MatchServiceService
  ) {}

  placeShips(board: Column[][], ships: Ship[]) {
    ships.forEach((ship) => {
      let placed = false;
      while (!placed) {
        let rndX = this.randomIntFromInterval(0, this.boardsService.width - 1);
        let rndY = this.randomIntFromInterval(0, this.boardsService.height - 1);
        if (
          board[rndY][rndX].isEmpty &&
          this.boardsService.isAdjacentOnBoard(
            board,
            ship,
            board[rndY][rndX].id
          )
        ) {
          placed = this.placeShipPart(board, ship, rndX, rndY);
        }
      }
    });
  }

  private placeShipPart(
    board: Column[][],
    ship: Ship,
    startX: number,
    startY: number
  ): boolean {
    let currentX = startX;
    let currentY = startY;
    let partCount = 0;
    const placedParts: string[] = [];

    while (partCount < ship.length) {
      if (!board[currentY] || !board[currentY][currentX].isEmpty) {
        placedParts.forEach((partId) => {
          const [x, y] = this.getCoordinateFromUUID(board, partId);
          board[y][x].ship = null;
          board[y][x].part = null;
        });
        return false;
      }

      let id = board[currentY][currentX].id;
      ship.addPart(id);
      board[currentY][currentX].ship = ship;
      board[currentY][currentX].setPart(new ShipPart(ship.id, id, false));
      placedParts.push(id);

      let possibleCoordinates = this.possibleCoordinate(
        board,
        currentX,
        currentY
      );
      if (possibleCoordinates.length === 0) {
        placedParts.forEach((partId) => {
          const [x, y] = this.getCoordinateFromUUID(board, partId);
          board[y][x].ship = null;
          board[y][x].part = null;
        });
        return false;
      }

      let selectedCoordinate = this.getRandomItem(possibleCoordinates);
      [currentX, currentY] = this.getCoordinateFromUUID(
        board,
        selectedCoordinate
      );
      partCount++;
    }

    return true;
  }

  private possibleCoordinate(
    board: Column[][],
    currentX: number,
    currentY: number
  ): string[] {
    let possibleCoordinates: string[] = [];
    if (currentY > 0 && board[currentY - 1][currentX].isEmpty) {
      possibleCoordinates.push(board[currentY - 1][currentX].id);
    }
    if (
      currentY < this.boardsService.height - 1 &&
      board[currentY + 1][currentX].isEmpty
    ) {
      possibleCoordinates.push(board[currentY + 1][currentX].id);
    }
    if (currentX > 0 && board[currentY][currentX - 1].isEmpty) {
      possibleCoordinates.push(board[currentY][currentX - 1].id);
    }
    if (
      currentX < this.boardsService.width - 1 &&
      board[currentY][currentX + 1].isEmpty
    ) {
      possibleCoordinates.push(board[currentY][currentX + 1].id);
    }
    return possibleCoordinates;
  }

  private getCoordinateFromUUID(
    board: Column[][],
    id: string
  ): [number, number] {
    for (let r = 0; r < this.boardsService.height; r++) {
      for (let c = 0; c < this.boardsService.width; c++) {
        if (board[r][c].id === id) {
          return [c, r];
        }
      }
    }
    throw new Error("Invalid UUID: Could not find coordinates.");
  }

  private randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private getRandomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }
  computerAttack(playerBoard: Column[][]): {
    hit: boolean;
    shipDestroyed: boolean;
  } {
    const emptyColumns = Array.from(
      this.boardsService.getColumnsMap().values()
    ).filter((column) => column.isEmpty === false && column.ship !== null);

    if (emptyColumns.length === 0) {
      console.log("No valid target columns.");
      return { hit: false, shipDestroyed: false };
    }

    const randomColumn =
      emptyColumns[Math.floor(Math.random() * emptyColumns.length)];
    const columnId = randomColumn.id;

    const result = this.matchService.hitOnColumn(columnId, playerBoard, []);

    console.log(`Computer attacks ${columnId}: ${result.hit ? "Hit" : "Miss"}`);
    return result;
  }
}

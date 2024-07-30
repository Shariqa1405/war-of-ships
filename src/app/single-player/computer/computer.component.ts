import { Component, OnInit } from '@angular/core';
import { Column } from '../../shared-models/column.model';
import { Ship } from '../../shared-models/ships.model';
import { ComputerBoardService } from '../../sharedServices/computerBoard.service';
import { BoardServiceService } from '../../sharedServices/board-service.service';
import { MatchServiceService } from '../../sharedServices/matchservice.service';

@Component({
    selector: 'app-computer',
    templateUrl: './computer.component.html',
    styleUrl: './computer.component.css',
})
export class ComputerComponent implements OnInit {
    ships: Ship[] = [
        new Ship('Fulton', 2, 1),
        new Ship('Clermont', 3, 2),
        new Ship('Argo', 4, 3),
        new Ship('Dreadnought', 5, 4),
        new Ship('Titanic', 5, 5),
    ];

    computerBoard: Column[][] = [];

    constructor(
        private computerBoardService: ComputerBoardService,
        private boardsService: BoardServiceService,
        private matchService: MatchServiceService
    ) {}

    ngOnInit() {
        this.computerBoard = this.boardsService.initalizeBoard();
        this.computerBoardService.placeShips(this.computerBoard, this.ships);
    }

    // onColumnClick(columnId: string) {
    //     const result = this.matchService.hitOnColumn(
    //         columnId,
    //         this.computerBoard
    //     );

    //     if (result.hit) {
    //         console.log('hit');
    //         if (result.shipDestroyed) {
    //             console.log('ship is destroyed');
    //         }
    //     } else {
    //         console.log('missed');
    //     }
    // }
}

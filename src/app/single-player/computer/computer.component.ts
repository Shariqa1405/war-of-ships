import { Component, OnInit } from '@angular/core';
import { Column } from '../../shared-models/column.model';
import { Ship } from '../../shared-models/ships.model';
import { ComputerBoardService } from '../../sharedServices/computer-board.service';

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

    constructor(private computerBoardService: ComputerBoardService) {}

    ngOnInit() {
        this.computerBoard = this.computerBoardService.initializeBoard();
        this.computerBoardService.placeShips(this.computerBoard, this.ships);
    }
}

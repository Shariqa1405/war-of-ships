import { Component, OnInit } from '@angular/core';
import { ships } from './ships.model';

@Component({
  selector: 'app-single-player',
  templateUrl: './single-player.component.html',
  styleUrl: './single-player.component.css',
})
export class SinglePlayerComponent implements OnInit {
  playerBoard: any[][] = [];
  computerBoard: any[][] = [];

  ships: ships[] = [
    new ships('ship1', 2, 1),
    new ships('ship2', 3, 2),
    new ships('ship3', 4, 3),
    new ships('ship4', 5, 4),
    new ships('ship5', 5, 5),
  ];

  constructor() {
    this.initializeBoard(this.playerBoard);
    this.initializeBoard(this.computerBoard);
    this.placeShips(this.playerBoard);
    this.placeShips(this.computerBoard);
  }

  initializeBoard(board: any[][]) {
    for (let r = 0; r < 8; r++) {
      board[r] = [];
      for (let c = 0; c < 8; c++) {
        board[r][c] = { shipId: null };
      }
    }
  }

  placeShips(board: any[][]) {
    this.ships.forEach((ship) => {
      const length = ship.length;
      const row = Math.floor(Math.random() * 8);
      const col = Math.floor(Math.random() * (8 - length + 1));
      for (let i = 0; i < length; i++) {
        board[row][col + i].shipId = ship.id;
      }
    });
  }

  isStartGame = true;

  ngOnInit() {}

  start() {
    this.isStartGame = !this.isStartGame;
  }

  flip() {}
}

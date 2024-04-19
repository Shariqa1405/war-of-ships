import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.css',
})
export class GameInfoComponent implements OnInit {
  constructor(private router: Router) {}

  ToNavigate() {
    this.router.navigate(['/SinglePlayer']);
  }

  ngOnInit() {}
}

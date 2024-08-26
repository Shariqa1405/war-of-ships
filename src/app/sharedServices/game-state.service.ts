import { Injectable } from "@angular/core";
export enum GameState {
  Pending,
  Preparing,
  Battle,
  Finished,
}
@Injectable({
  providedIn: "root",
})
export class GameStateService {
  constructor() {}
  private _gameState: GameState = GameState.Preparing;

  get gameState(): GameState {
    return this._gameState;
  }

  set gameState(state: GameState) {
    this._gameState = state;
  }
}

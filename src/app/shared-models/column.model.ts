import { Ship, ShipPart } from './ships.model';

export class Column {
  id: string;
  part: ShipPart;
  ship: Ship;

  constructor(id: string, part?: ShipPart | null, ship?: Ship | null) {
    this.id = id;
    this.part = part;
    this.ship = ship;
  }

  setPart(part: ShipPart) {
    if (this.part !== null) {
      console.log('Replacing existing part in the column.');
      this.part = null;
    }
    this.part = part;
  }

  isEmpty(part: null) {
    this.part = part;
    if (this.part === null && this.ship === null) {
      return true;
    } else {
      return false;
    }
  }
}

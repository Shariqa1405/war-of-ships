import { Ship, ShipPart } from './ships.model';

export class Column {
    id: string;
    part: ShipPart;
    ship: Ship;
    public isEmpty: boolean;
    hittedColumn: boolean;
    missedColumn: boolean;

    constructor(id: string, part?: ShipPart | null, ship?: Ship | null) {
        this.id = id;
        this.part = part;
        this.ship = ship;
        this.isEmpty = true;
        this.hittedColumn = false;
        this.missedColumn = false;
    }

    setPart(part: ShipPart | null) {
        if (part) {
            this.isEmpty = false;
        } else {
            this.isEmpty = true;
        }
        this.part = part;
    }

    hitted(): boolean {
        // Return false if this column has already been hit or missed
        if (this.hittedColumn || this.missedColumn) {
            return false;
        }

        // Mark the column as hit
        this.hittedColumn = true;

        if (this.ship) {
            const part = this.ship.parts.get(this.id);
            if (part) {
                part.isDestroyed = true;
                return true; // Hit successful
            }
        }

        // If no ship or ship part found, mark as missed
        this.missedColumn = true;
        return false; // Hit unsuccessful
    }

    missed() {
        this.missedColumn = true;
    }
}

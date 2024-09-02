import { Ship, ShipPart } from './ships.model';

export class Column {
    id: string;
    part: ShipPart | null;
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
        if (this.hittedColumn || this.missedColumn) {
            console.log('222');

            return false;
        }

        this.hittedColumn = true;

        if (this.ship) {
            const part = this.ship.parts.get(this.id);
            if (part) {
                part.isDestroyed = true;
                console.log('111');
                return true;
            }
        }

        this.missedColumn = true;
        console.log('>>>>');
        return false;
    }

    missed() {
        if (!this.hittedColumn) {
            this.missedColumn = true;
        }
    }
}

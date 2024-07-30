import { Ship, ShipPart } from './ships.model';

export class Column {
    id: string;
    part: ShipPart;
    ship: Ship;
    neighbourColumns: Column[] = [];
    public isEmpty: boolean;
    hittedColumn = false;

    constructor(id: string, part?: ShipPart | null, ship?: Ship | null) {
        this.id = id;
        this.part = part;
        this.ship = ship;
        this.isEmpty = true;
    }

    setPart(part: ShipPart | null) {
        if (part) {
            this.isEmpty = false;
        } else {
            this.isEmpty = true;
        }
        this.part = part;
    }

    hitted() {
        this.hittedColumn = true;
    }
}

import { Ship, ShipPart } from './ships.model';

export class Column {
    id: string;
    part: ShipPart;
    ship: Ship;
    neighbourColumns: Column[] = [];
    array = [];
    public isEmpty: boolean;

    constructor(id: string, part?: ShipPart | null, ship?: Ship | null) {
        this.id = id;
        this.part = part;
        this.ship = ship;
        this.isEmpty = true;
        // console.log(this.part, '1212');
    }

    setPart(part: ShipPart | null) {
        if (part) {
            this.isEmpty = false;
        } else {
            this.isEmpty = true;
        }
        this.part = part;
    }
}

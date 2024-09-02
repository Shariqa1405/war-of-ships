import { ShipPart } from './ship-part.class';
import { Ship } from './ship.class';

export class Column {
    private _id: string;
    private _part: ShipPart | null | undefined;
    private _ship: Ship | null | undefined;

    private _state: 'unknown' | 'hit' | 'miss' = 'unknown';

    public get id() {
        return this._id;
    }

    public get ship() {
        return this._ship;
    }
    
    public get hitted(): boolean {
        return this._state === 'hit' ? true : false;
    }

    public get missed() {
        return this._state === 'miss' ? true : false;
    }

    constructor(id: string, part?: ShipPart | null, ship?: Ship | null) {
        this._id = id;
        this._part = part;
        this._ship = ship;
    }

    public setPart(part: ShipPart) {
        this._part = part;
        this._state = part.isDestroyed ? 'hit' : 'miss';
    }

    public setState(state: 'unknown' | 'hit' | 'miss') {
        this._state = state;
    }
}

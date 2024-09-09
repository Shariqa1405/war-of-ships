import { ShipPart } from './ship-part.class';

export class Ship {
    private _id: number;
    private _name: string;
    private _length: number;
    private _color: string = 'purple';
    private _parts: Map<string, ShipPart> = new Map();

    public get color() {
        return this._color;
    }

    public get partsLength() {
        return this._parts.size;
    }

    constructor(name: string, length: number, id: number) {
        this._name = name;
        this._length = length;
        this._id = id;
    }

    public addPart(columnId: string, isDestroyed: boolean = false) {
        this._parts.set(columnId, new ShipPart(this._id, columnId, isDestroyed));
    }

    public removePart(columnId: string) {
        this._parts.delete(columnId);
    }

    public isDestroyed() {
        for (let part of this._parts.values()) {
            if (!part.isDestroyed) {
                return false;
            }
        }
        return true;
    }
}

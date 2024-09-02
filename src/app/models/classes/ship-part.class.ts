export class ShipPart {
    private _shipId: number;
    private _columnId: string;
    private _isDestroyed: boolean;

    constructor(shipId: number, columnId: string, isDestroyed: boolean) {
        this._shipId = shipId;
        this._columnId = columnId;
        this._isDestroyed = isDestroyed;
    }

    public get isDestroyed() {
        return this._isDestroyed;
    }
}

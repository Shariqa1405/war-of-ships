export class Ship {
    name: string;
    length: number;
    id: number;
    parts: Map<string, ShipPart>;

    constructor(name: string, length: number, id: number) {
        this.name = name;
        this.length = length;
        this.id = id;
        this.parts = new Map();
    }

    addPart(columnId: string, isDestroyed: boolean = false) {
        if (!this.parts) {
            this.parts = new Map();
        }

        this.parts.set(columnId, new ShipPart(this.id, columnId, isDestroyed));
    }

    removePart(columnId: string) {
        this.parts.delete(columnId);
    }

    isDestroyed() {
        let isDestroyed = true;
        this.parts.forEach((part) => {
            if (!part.isDestroyed) {
                isDestroyed = false;
            }
        });
        return isDestroyed;
    }
}

export class ShipPart {
    shipId: number;
    columnId: string;
    isDestroyed: boolean;
    columnUsed: boolean = false;

    constructor(shipId: number, columnId: string, isDestroyed: boolean) {
        this.shipId = shipId;
        this.columnId = columnId;
        this.isDestroyed = isDestroyed;
    }
}

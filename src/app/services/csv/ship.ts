export class Ship {
    readonly id: string;
    readonly coordinates: Coordinate[] = [];

    constructor(id: string, speed: number, lon: number, lat: number) {
        this.id = id;
        this.coordinates.push({ lon, lat, speed });
    }
}

interface Coordinate {
    readonly lon: number;
    readonly lat: number;
    readonly speed: number;
    color?: string;
}

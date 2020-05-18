import { GameObject } from "./gameobject";

var lastID = 0;

export class Component {
    id: number;
    name: string;
    _type: string;
    parent: GameObject;

    constructor(name: string, type: string) {
        this.id = lastID;
        lastID++;

        this._type = type
        this.name = name;
    }

    get type() {
        return this._type;
    }

    update(): void {}

    draw(): void {}
}
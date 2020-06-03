import { GameObject } from "./gameobject";

var lastID = 0;

export class Component {
    id: number;
    name: string;
    type: string;
    parent: GameObject;

    constructor(name: string, type: string) {
        this.id = lastID;
        lastID++;

        this.type = type
        this.name = name;
    }

    onInit(): void {}

    loopStart(): void {}

    update(): void {}

    draw(): void {}
}
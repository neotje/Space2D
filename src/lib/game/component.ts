import { GameObject } from "./gameobject";

var lastID = 0;

/**
 * @category Component
 */
export class Component {
    readonly id: number; // unique component id
    name: string; // component name is not unique
    type: string; // component type
    parent: GameObject; // component parent gameobject
    enable: boolean = true;

    constructor(name: string, type: string) {
        this.id = lastID;
        lastID++;

        this.type = type
        this.name = name;
    }

    /**
     * Run this function when component gets added to gameobject
     */
    onInit(): void {}

    /**
     * This function will run before the update of every gameobject.
     */
    loopStart(): void {}

    /**
     * Gameobject update
     */
    update(): void {}

    /**
     * This function will run after the update of every gameobject
     */
    loopEnd(): void {}

    /**
     * Draw update called every frame
     */
    draw(): void {}
}
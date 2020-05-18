import { Component } from "../component";
import { Vector } from "../vector";

interface ViewPort {
    width: number;
    height: number;
    position: Vector;
}

export class CameraComponent extends Component {
    viewport: ViewPort;
    zoom: number = 0;

    private parentPos: Vector;

    constructor(canvas: HTMLCanvasElement, name: string = "camera", viewport: ViewPort) {
        super(name, "CameraComponent");

        this.viewport = viewport;
    }

    worldPosToViewport(v: Vector): Vector {
        return this.parentPos.difference(v).scale(this.zoom);
    }

    worldPosToCanvas(v: Vector): Vector {
        return this.viewport.position.copy().add(this.worldPosToViewport(v));
    }

    update() {
        this.parentPos = this.parent.worldPosition;
    }
}
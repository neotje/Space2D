import { Component } from "../component";
import { Vector } from "../vector";
import anime from "../anime.es";
import { renderer } from "../game";

interface ViewPort {
    width: number;
    height: number;
    position: Vector;
}

export class CameraComponent extends Component {
    viewport: ViewPort;
    zoom: number = 0;
    showBorders: boolean = false;
    overflow: boolean = true;
    backgroundColor: string = "#000000"

    private parentPos: Vector;

    constructor(canvas: HTMLCanvasElement, name: string = "camera", viewport: ViewPort, color?: string) {
        super(name, "CameraComponent");

        this.viewport = viewport;

        this.backgroundColor = (color) ? color : this.backgroundColor;
    }

    worldPosToViewport(v: Vector): Vector {
        return this.parentPos.difference(v).scale(this.zoom).add(new Vector(this.viewport.width / 2, this.viewport.height / 2));
    }

    worldPosToCanvas(v: Vector): Vector {
        return this.viewport.position.copy().add(this.worldPosToViewport(v));
    }

    zoomTo(z: number, callback: Function = function(){}) {
        anime({
            targets: this,
            zoom: z,
            easing: 'easeInOutExpo',
            duration: 1500,
            complete: callback
        });
    }

    update() {
        this.parentPos = this.parent.worldPosition;
    }
}
import { Component } from "../game/component";
import anime from "../anime.es";
import { Calc } from "../calc";

interface ViewPort {
    width: number;
    height: number;
    position: Calc.Vector;
}

/**
 * @category Component
 */
export class CameraComponent extends Component {
    viewport: ViewPort;
    zoom: number = 0;
    showBorders: boolean = false;
    overflow: boolean = true;
    backgroundColor: string = "#000000"

    private parentPos: Calc.Vector;

    constructor(canvas: HTMLCanvasElement, name: string = "camera", viewport: ViewPort, color?: string) {
        super(name, "CameraComponent");

        this.viewport = viewport;

        this.backgroundColor = (color) ? color : this.backgroundColor;
    }

    /**
     * convert world position to viewport position.
     * @param v 
     */
    worldPosToViewport(v: Calc.Vector): Calc.Vector {
        return this.parentPos.difference(v).scale(this.zoom).add(new Calc.Vector(this.viewport.width / 2, this.viewport.height / 2));
    }

    /**
     * convert world position to canvas position.
     * @param v 
     */
    worldPosToCanvas(v: Calc.Vector): Calc.Vector {
        return this.viewport.position.copy().add(this.worldPosToViewport(v));
    }

    /**
     * animated zooming to a value
     * @param z target
     * @param callback 
     */
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
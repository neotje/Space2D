import { Component } from "../game/component";
import { Game } from "../game";
import { Calc } from "../calc";
/**
 * @category Component
 */
export class MeshComponent extends Component {
    constructor() {
        super("mesh", "MeshComponent")
    }

    draw() {
        Game.renderer.drawLine({start: this.parent.relativePosToWorld(new Calc.Vector(0, 0)), end: this.parent.relativePosToWorld(new Calc.Vector(3,5))})

        Game.renderer.drawRect({
            start: this.parent.relativePosToWorld(new Calc.Vector(4, 3)),
            width: 2,
            height: 3,
            fill: {},
            stroke: {width: 3}
        });

        Game.renderer.drawCircle({
            pos: this.parent.relativePosToWorld(new Calc.Vector(-2, -2)),
            radius: 1,
            fill: {
                color: "#33cc33"
            }
        })
    }
}
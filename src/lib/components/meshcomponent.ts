import { Component } from "../game/component";
import { Vector } from "../math/vector";
import { Game } from "../game";

/**
 * @category Component
 */
export class MeshComponent extends Component {
    constructor() {
        super("mesh", "MeshComponent")
    }

    draw() {
        Game.renderer.drawLine({start: this.parent.relativePosToWorld(new Vector(0, 0)), end: this.parent.relativePosToWorld(new Vector(3,5))})

        Game.renderer.drawRect({
            start: this.parent.relativePosToWorld(new Vector(4, 3)),
            width: 2,
            height: 3,
            fill: {},
            stroke: {width: 3}
        });

        Game.renderer.drawCircle({
            pos: this.parent.relativePosToWorld(new Vector(-2, -2)),
            radius: 1,
            fill: {
                color: "#33cc33"
            }
        })
    }
}
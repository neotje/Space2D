import { Component } from "../component";
import { Vector } from "../vector";
import { renderer } from "../game";

export class MeshComponent extends Component {
    constructor() {
        super("mesh", "MeshComponent")
    }

    draw() {
        renderer.drawLine({start: this.parent.relativePosToWorld(new Vector(1, 1)), end: this.parent.relativePosToWorld(new Vector(3,5))})

        renderer.drawRect({
            start: this.parent.relativePosToWorld(new Vector(4, 3)),
            end: this.parent.relativePosToWorld(new Vector(5, 5)),
            fill: {},
            stroke: {width: 3}
        });

        renderer.drawCircle({
            pos: this.parent.relativePosToWorld(new Vector(-2, -2)),
            radius: 1,
            fill: {
                color: "#33cc33"
            }
        })
    }
}
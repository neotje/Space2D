import { Component } from "../component";
import { Vector } from "../vector";
import { renderer } from "../game";

export class MeshComponent extends Component {
    constructor() {
        super("mesh", "MeshComponent")
    }

    draw() {
        renderer.drawLine({start: this.parent.relativePosToWorld(new Vector(0, 0)), end: this.parent.relativePosToWorld(new Vector(3,5))})

        renderer.drawRect({
            start: this.parent.relativePosToWorld(new Vector(4, 3)),
            width: 2,
            height: 3,
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

        renderer.drawPolygon({
            points: [
                this.parent.relativePosToWorld(new Vector(-2, 0)),
                this.parent.relativePosToWorld(new Vector(-3, 1)),
                this.parent.relativePosToWorld(new Vector(-4, 0))
            ],
            fill: {}
        })
    }
}
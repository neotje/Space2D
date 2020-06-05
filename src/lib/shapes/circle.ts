import { Vector } from "../vector";
import { GameObject } from "../gameobject";
import { renderer } from "../game";

export class Circle {
    radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }

    render(parent: GameObject) {
        //renderer.drawEllipse({
        //    pos: parent.worldPosition,
        //    radius: new Vector(this.radius, this.radius).scaleX(parent.scale.x).scaleY(parent.scale.y)
        //});
    }
}
import { GameObject } from "../game/gameobject";

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
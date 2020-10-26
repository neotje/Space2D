import { GameObject } from "../game/gameobject";
import { LinearFunction } from "../math/linearfunction";
import { Vector } from "../math";
import { renderer } from "../game";

export class Circle {
    radius: number;
    type: string = 'Circle';

    constructor(radius: number) {
        this.radius = radius;
    }

    getLineIntersects(l: LinearFunction): Vector[] {
        return []
    }

    isPointInside(p: Vector): boolean {
        if (Math.abs(new Vector(0, 0).distanceTo(p)) <= this.radius) {
            return true;
        }
        return false;
    }

    draw(pos: Vector, angle: number): void {
        renderer.drawCircle({
            pos: pos,
            radius: this.radius,
            stroke: {
                color: "#00f"
            }
        });
    }
}
import { GameObject } from "../game/gameobject";
import { Calc } from "../calc";
import { Game } from "../game";

/**
 * @category Shape
 */
export class Circle {
    radius: number;
    type: string = 'Circle';
    angle: number = 0;

    constructor(radius: number) {
        this.radius = radius;
    }

    getLineIntersects(l: Calc.LinearFunction): Calc.Vector[] {
        return []
    }

    isPointInside(p: Calc.Vector): boolean {
        if (Math.abs(new Calc.Vector(0, 0).distanceTo(p)) <= this.radius) {
            return true;
        }
        return false;
    }

    draw(pos: Calc.Vector, angle: number): void {
        Game.renderer.drawCircle({
            pos: pos,
            radius: this.radius,
            stroke: {
                color: "#00f"
            }
        });
    }
}
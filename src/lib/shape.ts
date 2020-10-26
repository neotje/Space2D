import { Vector } from "./math/vector";

interface ShapeOptions {
    anchorX?: "left" | "center" | "right";
    anchorY?: "top" | "center" | "bottom";
}

/**
 * @category Shape
 */
class Shape {
    readonly points: Vector[];
    anchorX: "left" | "center" | "right";
    anchorY: "top" | "center" | "bottom";

    constructor(points: Vector[], opt: ShapeOptions) {

    }

    translate(v: Vector): this {
        for (const p of this.points) {
            p.add(v);
        }
        return this
    }


}
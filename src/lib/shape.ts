import { Calc } from "./calc"
import { Polygon } from "./shapes/polygon"

export namespace Shape {
    export interface BoundingBox {
        min: Calc.Vector
        max: Calc.Vector
    }

    export function boundingBoxOverlap(a: BoundingBox, b: BoundingBox): boolean {
        var d1x = b.min.x - a.max.x
        var d1y = b.min.y - a.max.y
        var d2x = a.min.x - b.max.x
        var d2y = a.min.y - b.max.y

        if (d1x > 0 || d1y > 0 || d2x > 0 || d2y > 0) {
            return false
        }
        return true
    }
    
    /**
     * Generate A polygon with a radius and number of sides.
     * 
     * Basic usage inside a PhysicsComponent:
     * 
     * ```ts
     * new PhysicsComponent('physics component', {
     *       mass: 4,
     *       collisionShape: Shape.genRegularPolygon(20, 10)
     * }),
     * ```
     * @param r Radius
     * @param s Sides
     */
    export function genRegularPolygon(r: number, s: number): Polygon {
        var points: Calc.Vector[] = []
        var step: number = (Math.PI + Math.PI) / s

        for (let i = 0; i < s; i++) {
            points.push(new Calc.Vector(0, r).rotate(i * step));
        }

        return new Polygon(points);
    }
}
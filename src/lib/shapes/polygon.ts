import { Game } from "../game";
import { Calc } from "../calc";
import { Shape } from "../shape";

/**
 * @category Shape
 */
export class Polygon {
    points: Calc.Vector[]
    angle: number = 0

    type: string = 'Polygon'

    constructor(points: Calc.Vector[]) {
        this.points = points
        this.translate(this.centerOfMass.scale(-1))
    }

    get centerOfMass(): Calc.Vector {
        return new Calc.Vector().average(this.points)
    }

    get rotatedPoints(): Calc.Vector[] {
        var points: Calc.Vector[] = []
        for (const p of this.points) {
            points.push(p.copy().rotateBy(this.angle))
        } 
        return points
    }

    get boundingBox(): Shape.BoundingBox {
        var box: Shape.BoundingBox = {
            min: new Calc.Vector(0, 0),
            max: new Calc.Vector(0, 0)
        }

        for (const p of this.rotatedPoints) {
            box.min.x = Math.min(box.min.x, p.x)
            box.min.y = Math.min(box.min.y, p.y)

            box.max.x = Math.max(box.max.x, p.x)
            box.max.y = Math.max(box.max.y, p.y)
        }
        
        return box
    }

    /**
     * Translate polygon by adding c to every point.
     * @param c 
     */
    translate(c: Calc.Vector): this {
        for (const p of this.points) {
            p.add(c)
        }
        return this
    }

    
    /**
     * Get Array of intersect point between a line and this polygon.
     * @param l line
     */
    getLineIntersects(l: Calc.LinearFunction): Calc.Vector[] {
        var intersects: Calc.Vector[] = [];

        var start: Calc.Vector = this.points[this.points.length - 1];
        var end: Calc.Vector;

        for (const p of this.rotatedPoints) {
            end = p;
            var result = l.crossesLineSection(start, end);

            if (result) {
                var add = true;
                for (const inter of intersects) {
                    if (inter.equalTo(result)) {
                        add = false;
                    }
                }
                if (add) {
                    intersects.push(result);
                }
            }
            start = end;
        }

        return intersects;
    }

    getInterectsWithPolygon(poly: Polygon, pos: Calc.Vector): Calc.Vector[] {
        var a: Calc.Vector = this.rotatedPoints[this.rotatedPoints.length - 1]
        var b: Calc.Vector
        var c: Calc.Vector
        var d: Calc.Vector

        var intersects: Calc.Vector[] = []

        poly.translate(pos)

        for (b of this.rotatedPoints) {
            c = poly.rotatedPoints[poly.rotatedPoints.length - 1]
            for (d of poly.rotatedPoints) {
                d

                //console.log("a", a, "b", b, "c", c, "d", d);

                var i: Calc.Vector = Calc.twoLineSectionIntersect(a, b, c, d)
                if (i) {
                    intersects.push(i)
                }

                c = d
            }
            a = b
        }

        return intersects
    }

    /**
     * Check if point is inside this polygon.
     * @param p 
     */
    isPointInside(p: Calc.Vector): boolean {
        var start: number = performance.now()
        var points: Calc.Vector[] = this.rotatedPoints
        var collision: boolean = false

        for (let current = 0; current < points.length; current++) {
            var next = (current == points.length - 1) ? 0 : current + 1
            
            var b: Calc.Vector = points[current]
            var c: Calc.Vector = points[next]

            if (
                ((b.y >= p.y && c.y < p.y) || (b.y < p.y && c.y >= p.y)) &&
                (p.x < (c.x-b.y)*(p.y-b.y) / (c.y-b.y) + b.y)
            ) {
                collision = !collision
            }
        }

        if (Game.renderer.options.drawStats) {
            console.log("Point inside poly performance: " + (performance.now() - start))
        }
        
        return collision
    }


    momentOfInertia(m: number): number {
        var c: number = 0
        var d: number = 0

        for (let i = 0; i < this.points.length - 1; i++) {
            const p = this.points[i]
            const p1 = this.points[i + 1]
            c += p1.crossproduct(p) * (p1.dotproduct(p1) + p1.dotproduct(p) + p.dotproduct(p))
            d += p1.crossproduct(p)
        }

        return (m/6) * (c/d)
    }

    draw(pos: Calc.Vector, angle: number): void {
        var points: Calc.Vector[] = this.rotatedPoints        

        //var box: Shape.BoundingBox = this.boundingBox
        /*Game.renderer.drawRect({
            start: box.min.add(pos),
            end: box.max.add(pos),
            stroke: { color: "#ff00ff"}
        })*/

        Game.renderer.drawPolygon({
            pos: pos,
            points: points,
            angle: 0,
            stroke: {
                color: "#0000ff"
            }
        })
    }
}

function isOdd(num: number): boolean { return (num % 2) == 1;}
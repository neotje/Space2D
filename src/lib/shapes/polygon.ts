import { Game } from "../game";
import { Calc } from "../calc";
import { Shape } from "../shape";


interface PolygonCollision {
    penetration: number
    normal: Calc.Vector
}

interface PolygonMinMax {
    max: number;
    min: number;
}


/**
 * @category Shape
 */
export class Polygon {
    points: Calc.Vector[]
    angle: number = 0

    type: string = 'Polygon'

    constructor(points: Calc.Vector[]) {
        this.points = points
        //this.translate(this.centerOfMass.scale(-1))
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

    get normals(): Calc.Vector[] {
        var result: Calc.Vector[] = []
        var points: Calc.Vector[] = this.rotatedPoints

        for (let i = 0; i < points.length; i++) {
            var first = points[i]
            var second = points[(i == points.length - 1)? 0 : i + 1]
            
            result.push(first.difference(second).leftNormal)
        }

        return result
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


    copy(): Polygon {
        var points: Calc.Vector[] = []
        for (const point of this.points) {
            points.push(point.copy())
        }
        var p = new Polygon(points)
        p.angle = this.angle
        return p
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


    /**
     * obsolete 
     * @param poly 
     * @param pos 
     */
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
            //console.log("Point inside poly performance: " + (performance.now() - start))
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

        Game.renderer.drawPolygon({
            pos: pos,
            points: points,
            angle: 0,
            stroke: {
                color: "#0000ff"
            }
<<<<<<< HEAD
        })
    }
}

/**
 * 
 * @param poly1 first polygon is positioned at 0,0.
 * @param poly2 second polygon is positioned relative to poly1 at position shape2pos.
 * @param shape2pos 
 */
export function isColliding(poly1: Polygon, poly2: Polygon, shape2pos: Calc.Vector): boolean {
    // polygon normals
    var poly1normals: Calc.Vector[] = poly1.normals
    var poly2normals: Calc.Vector[] = poly2.normals

    var isSeparated = false


    // first poly
    for (const n of poly1normals) {
        var r1 = getMinMaxPoly(poly1, n)
        var r2 = getMinMaxPoly(poly2, n, shape2pos)

        isSeparated = r1.max < r2.min || r2.max < r1.min
        if (isSeparated) break;
=======
        }
        return {
            penetration: 0.00000001,
            normal: rpos.unit
        }
>>>>>>> aeab9ab5772b1678dacf6e34741f84c9dda9fe97
    }

    if (!isSeparated) {
        for (const n of poly2normals) {
            var r1 = getMinMaxPoly(poly1, n)
            var r2 = getMinMaxPoly(poly2, n, shape2pos)                

            isSeparated = r1.max < r2.min || r2.max < r1.min
            if (isSeparated) break;
        }
    }

    /* if (isSeparated) {
        return {
            penetration: undefined,
            normal: shape2pos.unit
        }
    }
    return {
        penetration: 0.00000001,
        normal: shape2pos.unit
    } */

    return !isSeparated
}


/**
 * get the minimum and maximum projection on an axis of a polygon.
 * @param poly the polygon to get the minimum and maximum projection of.
 * @param axis axis to project the points on.
 * @param pos offset position
 */
export function getMinMaxPoly(poly: Polygon, axis: Calc.Vector, pos: Calc.Vector = new Calc.Vector(0, 0)): PolygonMinMax {
    var points: Calc.Vector[] = poly.rotatedPoints
    var min: number = points[0].copy().add(pos).dotproduct(axis)
    var max: number = min

    for (const p1 of points) {
        var currentProjection: number = p1.add(pos).dotproduct(axis)

        if (currentProjection > max) {
            max = currentProjection
        }
        if (currentProjection < min) {
            min = currentProjection                
        }
    }

    return {
        max,
        min
    }
}

function isOdd(num: number): boolean { return (num % 2) == 1;}
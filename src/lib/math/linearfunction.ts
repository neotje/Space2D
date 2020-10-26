import { Vector } from "../math";

/**
 * @category Math
 */
export class LinearFunction {
    d: number;
    b: number;

    constructor(d?: number, b?: number) {
        this.d = (d) ? d : undefined;
        this.b = (b) ? b : undefined;
    }

    get angle(): number {
        return Math.atan(this.d);
    }
    get direction(): number {
        return this.d;
    }

    /**
     * set linear function direction
     * @param d 
     */
    setDirection(d: number): this {
        this.d = d;
        return this;
    }
    /**
     * Determine direction based on two points
     * @param a point a
     * @param b point b
     */
    setDirectionFromPoints(a: Vector, b: Vector): this {
        this.d = (a.y - b.y) / (a.x - b.x);
        //this.setBfromPoint(a);
        return this;
    }
    mirror(): this {
        this.d *= -1;
        return this;
    }
    /**
     * set perpendicular to other linear function
     * @param l 
     */
    setPerpendicularTo(l: LinearFunction): this {
        this.d = 1 / -l.d;
        return this;
    }
    /**
     * check if this linear function is perpendicular to other linear function.
     * @param l 
     */
    isPerpendicularTo(l: LinearFunction): Boolean {
        if (this.d == 1 / -l.d) {
            return true;
        }
        return false;
    }
    /**
     * set parallel to other linear function
     * @param l 
     */
    setParallelTo(l: LinearFunction): this {
        this.d = l.d;
        return this;
    }
    /**
     * check if this linear function is parallel to other function.
     * @param l 
     */
    isParallelTo(l: LinearFunction): Boolean {
        if (l.d == this.d) {
            return true
        }
        return false
    }

    /**
     * set b aka intersection with y axis
     * @param b 
     */
    setB(b: number): this {
        this.b = b;
        return this;
    }
    /**
     * set b based on that this linear function crosses point a.
     * @param a 
     */
    setBfromPoint(a: Vector): this {
        if (this.d) {
            this.b = a.y - (this.d * a.x);
            return this;
        } else {
            throw new Error("Directional coefficient is not set!");
        }
    }

    /**
     * return point where this function and other function intersect.
     * @param l 
     */
    crossesLineIn(l: LinearFunction): Vector {
        var x = (l.b - this.b) / (this.d - l.d);
        var y = this.getY(x);
        return new Vector(x, y);
    }
    /**
     * return point where this function and other line section intersect.
     * @param l 
     */
    crossesLineSection(a: Vector, b: Vector): Vector {        
        if (a.x == b.x) {
            var y = this.getY(a.x);
            if (y >= Math.min(a.y, b.y) && y <= Math.max(a.y, b.y)) {
                return new Vector(a.x, y);
            }
            return undefined
        }
        if (a.y == b.y) {
            var x = this.getX(a.y);
            if (x >= Math.min(a.x, b.x) && x <= Math.max(a.x, b.x)) {
                return new Vector(x, a.y);
            }
            return undefined
        }

        var l = new LinearFunction().setDirectionFromPoints(a, b);
        var cross = this.crossesLineIn(l);

        if (
            cross.x >= Math.min(a.x, b.x) && cross.x <= Math.max(a.x, b.x) &&
            cross.y >= Math.min(a.y, b.y) && cross.y <= Math.max(a.y, b.y)
        ) {
            return cross;
        }
        return undefined;
    }

    /**
     * get y value with given x value
     * @param x 
     */
    getY(x: number): number {
        return this.d * x + this.b;
    }

    /**
     * get x value with given y value
     * @param y 
     */
    getX(y: number): number {
        return (-this.b + y) / this.d;
    }

    /**
     * calculate angle between this linear function and other linear function in radians.
     * @param l 
     */
    angleBetween(l: LinearFunction): number {
        return Math.atan((this.d - l.d) / (1 + (this.d * l.d)));
    }
}

/**
 * calculate distance between a line and a point.
 * @category Math
 * @param l line
 * @param p point
 */
export function distancePointToLine(l: LinearFunction, p: Vector) {
    var l2: LinearFunction = new LinearFunction().setPerpendicularTo(l).setBfromPoint(p);
    var s: Vector = l.crossesLineIn(l2);

    return Math.abs(p.distanceTo(s));
}
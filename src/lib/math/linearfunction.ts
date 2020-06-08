import { Vector } from "../math";

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

    setDirection(d: number): this {
        this.d = d;
        return this;
    }
    setDirectionFromPoints(a: Vector, b: Vector): this {
        this.d = (a.y - b.y) / (a.x - b.x);
        this.setBfromPoint(a);
        return this;
    }
    mirror(): this {
        this.d *= -1;
        return this;
    }
    setPerpendicularTo(l: LinearFunction): this {
        this.d = 1 / -l.d;
        return this;
    }
    isPerpendicularTo(l: LinearFunction): Boolean {
        if (this.d == 1 / -l.d) {
            return true;
        }
        return false;
    }
    setParallelTo(l: LinearFunction): this {
        this.d = l.d;
        return this;
    }
    isParallelTo(l: LinearFunction): Boolean {
        if (l.d == this.d) {
            return true
        }
        return false
    }

    setB(b: number): this {
        this.b = b;
        return this;
    }
    setBfromPoint(a: Vector): this {
        if (this.d) {
            this.b = a.y - (this.d * a.x);
            return this;
        } else {
            throw new Error("Directional coefficient is not set!");
        }
    }

    crossesLineIn(l: LinearFunction): Vector {
        var x = (l.b - this.b) / (this.d - l.d);
        var y = this.getY(x);
        return new Vector(x, y);
    }
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

    getY(x: number): number {
        return this.d * x + this.b;
    }

    getX(y: number): number {
        return (-this.b + y) / this.d;
    }

    angleBetween(l: LinearFunction): number {
        return Math.atan((this.d - l.d) / (1 + (this.d * l.d)));
    }
}
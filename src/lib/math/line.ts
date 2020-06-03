import { Vector } from "../vector";

export class Line {
    d: number;
    b: number;

    constructor(d?: number, b?: number) {
        this.d = (d) ? d : undefined;
        this.b = (b) ? b : undefined; 
    }

    get angle(): number {
        return Math.atan(this.d);
    }

    setDirection(d: number): this {
        this.d = d;
        return this;
    }
    setDirectionFromPoints(a: Vector, b: Vector): this {
        this.d = (a.y - b.y) / (a.x - b.x);
        return this;
    }
    mirror(): this {
        this.d *= -1;
        return this;
    }
    setPerpendicularTo(l: Line): this {
        this.d = 1 / -l.d;
        return this;
    }
    isPerpendicularTo(l: Line): Boolean {
        if (this.d == 1 / -l.d) {
            return true;
        } else {
            return false;
        }
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

    crossesLineIn(l: Line): Vector {
        var x = (l.b - this.b) / (this.d - l.d);        
        var y = this.getY(x);
        return new Vector(x, y);
    }

    getY(x: number): number {
        return this.d * x + this.b;
    }

    angleBetween(l: Line): number {
        return Math.atan((this.d - l.d) / (1 + (this.d * l.d)));
    }
}
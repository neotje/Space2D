export class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get magnitude(): number {
        return Math.sqrt(this.dotproduct(this));
    }
    set magnitude(l: number) {
        if (this.magnitude != 0) {
            this.scale(l / this.magnitude);
        }
    }

    equalTo(v: Vector): Boolean {
        return this.x == v.x && this.y == v.y;
    }

    add(v: Vector): this {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtract(v: Vector): this {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    difference(v: Vector): Vector {
        return v.copy().subtract(this);
    }

    scale(s: number): this {
        this.x *= s;
        this.y *= s;

        return this;
    }

    distanceTo(v: Vector): number {
        return Math.sqrt(this.dotproduct(v));
    }

    dotproduct(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    copy(): Vector {
        return new Vector(this.x, this.y);
    }
}
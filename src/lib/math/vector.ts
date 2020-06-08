import anime from "../anime.es";

export function vector(x: number, y: number): Vector {
    return new Vector(x, y);
}

/**
 * Vector class
 */
export class Vector {
    public x: number;
    public y: number;

    /**
     * Make new vector 2D with a X and Y value
     * @param x number
     * @param y number
     */
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

    get angle(): number {
        return Math.atan2(this.y, this.x)
    }
    set angle(a: number) {
        var r = this.magnitude;

        this.x = Math.cos(a) * r;
        this.y = Math.sin(a) * r;
        if (this.y < 1.3e-16 && this.y > -1.3e-16) this.y = 0;
        if (this.x < 1.3e-16 && this.x > -1.3e-16) this.x = 0;
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
    scaleX(s: number): this {
        this.x *= s;
        return this;
    }
    scaleY(s: number): this {
        this.y *= s;
        return this;
    }

    divide(s: number): this {
        if (s > 0) {
            this.x = this.x / s;
            this.y = this.y / s;
        }
        return this;
    }

    distanceTo(v: Vector): number {
        var v1 = this.difference(v);
        return v1.magnitude;
    }

    dotproduct(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    rotateBy(a: number): this {
        this.angle = this.angle + a;
        return this;
    }

    rotate(a: number, duration?: number): this {
        if (duration) {
            anime({
                targets: this,
                angle: this.angle + a,
                easing: 'linear',
                duration: duration
            });
        } else {
            this.angle += a;
            return this;
        }
    }

    lookAt(v: Vector): this {
        this.angle = this.difference(v).angle;
        return this;
    }

    copy(): Vector {
        return new Vector(this.x, this.y);
    }
}
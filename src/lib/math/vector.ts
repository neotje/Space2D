import anime from "../anime.es";

export function vector(x: number, y: number): Vector {
    return new Vector(x, y);
}

/**
 * @category Math
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

    mirror(): this {
        this.angle = -this.angle;
        return this;
    }
    /**
     * Mirror with other vector as mirrorline.
     * @param n other vector
     */
    mirrorWith(n: Vector): this {
        this.angle = n.angle + (Math.PI - (this.angle - n.angle));
        return this;
    }

    /**
     * Check if this vector is equel to other vector.
     * @param v other vector
     */
    equalTo(v: Vector): Boolean {
        return this.x == v.x && this.y == v.y;
    }

    /**
     * vector addition.
     * @param v 
     */
    add(v: Vector): this {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * vector substraction
     * @param v 
     */
    subtract(v: Vector): this {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /**
     * return difference between vectors as new vector.
     * @param v 
     */
    difference(v: Vector): Vector {
        return v.copy().subtract(this);
    }

    /**
     * vector scaling
     * @param s 
     */
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

    /**
     * Calculate distance between two vectors.
     * @param v 
     */
    distanceTo(v: Vector): number {
        var v1 = this.difference(v);
        return v1.magnitude;
    }

    dotproduct(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    crossproduct(v: Vector): any {
        
    }

    /**
     * rotate this vector angle by a
     * @param a angle in radians
     */
    rotateBy(a: number): this {
        this.angle = this.angle + a;
        return this;
    }

    /**
     * animated {@link Vector.rotateBy}
     * @param a 
     * @param duration 
     */
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

    /**
     * rotate this vector to point at the other vector
     * @param v 
     */
    lookAt(v: Vector): this {
        this.angle = this.difference(v).angle;
        return this;
    }

    copy(): Vector {
        return new Vector(this.x, this.y);
    }
}
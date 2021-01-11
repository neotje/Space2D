import * as main from "../../docs/assets/js/main";
import anime from "./anime.es";

export namespace Calc {
    /**
     * Round a number
     * @category Math
     * @param n 
     * @param d decimal points.
     */
    export function roundTo(n: number, d: number) {
        return Math.round((n + Number.EPSILON) * Math.pow(10, d)) / Math.pow(10, d);
    }


    export function twoLineSectionIntersect(a: Vector, b: Vector, c: Vector, d: Vector): Vector {
        var l1: LinearFunction = new LinearFunction().setDirectionFromPoints(a, b).setBfromPoint(a)
        var l2: LinearFunction = new LinearFunction().setDirectionFromPoints(c, d).setBfromPoint(c)

        var i: Calc.Vector = l1.crossesLineIn(l2)

        if (
            i.x >= Math.min(a.x, b.x, c.x, d.x) && i.x <= Math.max(a.x, b.x, c.x, d.x) && 
            i.y >= Math.min(a.y, b.y, c.y, d.y) && i.y <= Math.max(a.y, b.y, c.y, d.y)
        ) {
            return i
        }
        return undefined
    }

    
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



    /**
     * @category Math
     */
    export class Vector {
        public x: number;
        public y: number;

        /**
         * Make new vector 2D with a X and Y value.
         * @param x number
         * @param y number
         */
        constructor(x?: number, y?: number) {
            this.x = (x) ? x : 0
            this.y = (y) ? y : 0;
        }

        get magnitude(): number {
            return Math.sqrt(this.dotproduct(this));
        }
        set magnitude(l: number) {
            if (this.magnitude != 0) {
                this.scale(l / this.magnitude);
            }
        }

        /**
         * get angle in radians.
         */
        get angle(): number {
            return Math.atan2(this.y, this.x)
        }
        /**
         * set angle in radians.
         */
        set angle(a: number) {
            var r = this.magnitude;

            this.x = Math.cos(a) * r;
            this.y = Math.sin(a) * r;
            if (this.y < 1.3e-16 && this.y > -1.3e-16) this.y = 0;
            if (this.x < 1.3e-16 && this.x > -1.3e-16) this.x = 0;
        }

        /**
         * unit vector (direction vector).
         */
        get unit(): Vector {
            return new Vector(
                this.x / this.magnitude,
                this.y / this.magnitude
            )
        }


        /**
         * get dot product of this vector.
         */
        get dot(): number {
            return this.dotproduct(this)
        }


        get leftNormal(): Calc.Vector {
            return new Calc.Vector(-this.y, this.x).unit
        }
        get rightNormal(): Calc.Vector {
            return new Calc.Vector(this.y, -this.x).unit
        }


        /**
         * Get average of vector array.
         * 
         * ```typescript
         * // create empty vector
         * // return Vector{x: 3, y: 0.5}
         * new Calc.Vector().average([
         *    new Calc.Vector(2, 3),
         *    new Calc.Vector(4, -2)
         * ])
         * ```
         * @param l 
         */
        average(l: Vector[]): this {
            for (const v of l) {
                this.add(v)
            }
            return this.divide(l.length)
        }


        /**
         * mirror in x axis.
         */
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
            this.x += v.x
            this.y += v.y
            return this
        }
        addX(x: number): this {
            this.x += x
            return this
        }
        addY(y: number): this {
            this.y += y
            return this
        }

        /**
         * vector substraction.
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
         * vector scaling.
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

        /**
         * divide x and y by s.
         * @param s 
         */
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

        /**
         * the dot product of this vector and vector v.
         * @param v 
         */
        dotproduct(v: Vector): number {
            return (this.x * v.x) + (this.y * v.y)
        }

        /**
         * the cross product of this vector and vector v.
         * @param v 
         */
        crossproduct(v: Vector): number {
            return Math.abs((this.x * v.y) - (this.y * v.x))
        }

        /**
         * rotate this vector angle by a.
         * @param a angle in radians.
         */
        rotateBy(a: number): this {
            this.angle = this.angle + a;
            return this;
        }

        /**
         * animated version of {@link Vector.rotateBy}.
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
         * rotate this vector to point at the other vector.
         * @param v 
         */
        lookAt(v: Vector): this {
            this.angle = this.difference(v).angle;
            return this;
        }


        /**
         * project this vector along vector p.
         * @param p 
         */
        projectOn(p: Calc.Vector): this {
            this.x *= p.unit.x
            this.y *= p.unit.y
            return this
        }


        /**
         * copy this vector.
         */
        copy(): Vector {
            return new Vector(this.x, this.y);
        }
    }
}
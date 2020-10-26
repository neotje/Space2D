import { Vector } from "../math/vector";
import { LinearFunction } from "../math/linearfunction";
import { renderer } from "../game";

export class Polygon {
    points: Vector[];
    center: Vector = new Vector(0, 0);
    angle: number = 0;

    type: string = 'Polygon';

    constructor(points: Vector[]) {
        this.points = points;
    }

    translateTo(c: Vector): this {
        this.center.subtract(c);
        return this;
    }

    get rotatedPoints(): Vector[] {
        var points: Vector[] = []
        for (const p of this.points) {
            points.push(p.copy().rotateBy(this.angle));
        } 
        return points;
    }

    getLineIntersects(l: LinearFunction): Vector[] {
        var intersects: Vector[] = [];

        var start: Vector = this.points[this.points.length - 1];
        var end: Vector;

        for (const p of this.points) {
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

    isPointInside(p: Vector): boolean {
        var allIntersects = this.getLineIntersects(new LinearFunction(1).setBfromPoint(p));
        var intersects: Vector[] = [];

        for (const i of allIntersects) {
            if (i.x >= p.x) {
                intersects.push(i);
            }
        }
        

        if (intersects.length == 0) {
            return false;
        }

        if (intersects.length == 1) {
            var inside = true;
            for (const point of this.points) {
                if (point.equalTo(intersects[0])) {
                    inside = false;
                }
            }
            return inside;
        }

        if (isOdd(intersects.length)) {
            return true;
        }
        return false;
    }

    draw(pos: Vector, angle: number): void {
        var points: Vector[] = []
        for (const p of this.points) {
            points.push(p.copy());
        }        

        renderer.drawPolygon({
            pos: pos,
            points: points,
            angle: 0,
            stroke: {
                color: "#00f"
            }
        })
    }
}

function isOdd(num: number): boolean { return (num % 2) == 1;}
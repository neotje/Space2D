import { Vector } from "../math/vector";
import { LinearFunction } from "../math/linearfunction";

export class Polygon {
    points: Vector[];
    center: Vector = new Vector(0, 0);

    constructor(points: Vector[]) {
        this.points = points;
    }

    translateTo(c: Vector): this {
        this.center.subtract(c);
        return this;
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

    draw(pos: Vector): void {
        
    }
}

function isOdd(num: number): boolean { return (num % 2) == 1;}
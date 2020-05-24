import { Constants } from "./constants";
import { Vector } from "../vector";


export function escapeVelocity(M: number, r: number): number {
    return Math.sqrt((2 * Constants.G) * (M / r));
}

export function escapeVelocityVector(M: number, p1: Vector, p2: Vector): Vector {
    var velocity = escapeVelocity(M, Math.abs(p2.distanceTo(p1)));
    var angle = p1.copy().lookAt(p2).angle + (0.5 * Math.PI);
    var V = new Vector(velocity, 0);
    V.angle = angle;

    console.log(p1.distanceTo(p2), velocity);
    

    return V;
}

export function roundTo(n: number, d: number) {
    return Math.round((n + Number.EPSILON) * Math.pow(10, d)) / Math.pow(10, d);
}
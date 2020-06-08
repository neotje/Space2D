import { Constants } from "./constants";
import { Vector } from "../math";


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

export function gravityForce(M: number, m: number, r: number): number {
    return Constants.G * ((M * m) / (r * r));
}
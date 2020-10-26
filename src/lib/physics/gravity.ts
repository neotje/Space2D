import { Constants } from "./constants";
import { Vector } from "../math";

/**
 * calculate escape velocity
 * @category gravity
 * @param M mass
 * @param r distance
 */
export function escapeVelocity(M: number, r: number): number {
    return Math.sqrt((2 * Constants.G) * (M / r));
}

/**
 * @category gravity
 * @param M mass
 * @param r gravity
 */
export function firstCosmicVelocity(M: number, r: number): number {
    return Math.pow(M * Constants.G / r, 0.5);
}

/**
 * calculate escape velocity as vector
 * @category gravity
 * @param M mass
 * @param p1 point 1
 * @param p2 point 2
 */
export function escapeVelocityVector(M: number, p1: Vector, p2: Vector): Vector {
    var velocity = escapeVelocity(M, Math.abs(p2.distanceTo(p1)));
    var angle = p1.copy().lookAt(p2).angle + (0.5 * Math.PI);
    var V = new Vector(velocity, 0);
    V.angle = angle;  

    return V;
}

/**
 * calculate first cosmic velocity as vector
 * @category gravity
 * @param M mass
 * @param p1 point 1
 * @param p2 point 2
 */
export function firstCosmicVelocityVector(M: number, p1: Vector, p2: Vector): Vector {
    var velocity = firstCosmicVelocity(M, Math.abs(p2.distanceTo(p1)));
    var angle = p1.copy().lookAt(p2).angle + (0.5 * Math.PI);
    var V = new Vector(velocity, 0);
    V.angle = angle;  

    return V;
}

/**
 * Calculate gravitational force
 * @category gravity
 * @param M mass 1
 * @param m mass 2
 * @param r distance
 */
export function gravityForce(M: number, m: number, r: number): number {
    return Constants.G * ((M * m) / (r * r));
}
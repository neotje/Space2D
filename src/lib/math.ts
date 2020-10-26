export { LinearFunction, distancePointToLine } from "./math/linearfunction";
export { Vector } from "./math/vector";

/**
 * Round a number
 * @category Math
 * @param n 
 * @param d decimal points.
 */
export function roundTo(n: number, d: number) {
    return Math.round((n + Number.EPSILON) * Math.pow(10, d)) / Math.pow(10, d);
}
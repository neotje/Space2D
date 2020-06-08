export { LinearFunction } from "./math/linearfunction";
export { Vector } from "./math/vector";

export function roundTo(n: number, d: number) {
    return Math.round((n + Number.EPSILON) * Math.pow(10, d)) / Math.pow(10, d);
}
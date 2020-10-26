import { Constants } from "./constants";

/**
 * calculate electrical force between two charges
 * @category Electrical fields
 * @param q charge 1
 * @param Q charge 2
 * @param r distance
 */
export function electricalForce(q: number, Q: number, r: number): number {
    return Constants.f * ((q * Q) / (r * r));
}
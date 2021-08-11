export class HPoint {
    constructor(x: number, y: number);
    constructor(x: number, y: number, z: number);

    /**
     * Get X coordinate of point
     */
    getX(): number;
    /**
     * Get Y coordinate of point
     */
    getY(): number;
    /**
     * Get Z coordinate / height of point
     */
    getZ(): number;
    /**
     * Check if point equals other point
     * @param point value to compare it to
     */
    equals(point: HPoint): boolean;
    /**
     * Express point in a string
     */
    toString(): string;
}

export class HPoint {
    constructor(x: number, y: number);
    constructor(x: number, y: number, z: number);

    /**
     * Get X coordinate of point
     */
    get x(): number;

    /**
     * Set X coordinate of point
     * @param val Value to be set
     */
    set x(val: number);

    /**
     * Get Y coordinate of point
     */
    get y(): number;

    /**
     * Set Y coordinate of point
     * @param val Value to be set
     */
    set y(val: number);

    /**
     * Get Z coordinate / height of point
     */
    get z(): number;

    /**
     * Set Z coordinate of point
     * @param val Value to be set
     */
    set z(val: number);

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

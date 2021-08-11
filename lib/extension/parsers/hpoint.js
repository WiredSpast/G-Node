exports.HPoint = class HPoint {
    #x;
    #y;
    #z;

    constructor(x, y, z) {
        if(typeof z === "undefined") {
            z = 0;
        }

        if(!Number.isInteger(x) || !Number.isInteger(y) || typeof z !== 'number') {
            throw new Error("Invalid arguments passed");
        }

        this.#x = x;
        this.#y = y;
        this.#z = z;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    getZ() {
        return this.#z;
    }

    equals(point) {
        if(!(point instanceof HPoint)) {
            throw new Error("Invalid argument(s) passed");
        }

        return this.#x === point.#x && this.#y === point.#y && this.#z === point.#z;
    }

    toString() {
        return "(" + this.#x + "," + this.#y + "," + this.#z + ")";
    }
}

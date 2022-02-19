/**
 * Possible facing directions
 * @readonly
 * @enum {number}
 */
const HFacing = Object.freeze({
    North: 0,
    NorthEast: 1,
    East: 2,
    SouthEast: 3,
    South: 4,
    SouthWest: 5,
    West: 6,
    NorthWest: 7,
    identify(val) {
        for (let key in this)
            if (this[key] === val)
                return key;
    }
});

export { HFacing };

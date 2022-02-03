/**
 * Possible facing directions
 * @readonly
 * @enum {number}
 */
exports.HFacing = {
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
}

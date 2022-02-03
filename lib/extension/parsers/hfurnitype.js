/**
 * Furni type
 * @readonly
 * @enum {string}
 */
exports.HFurniType = {
    FLOOR: 'S',
    WALL: 'I',
    identify(val) {
        for (let key in this)
            if (this[key] === val)
                return key;
    }
}
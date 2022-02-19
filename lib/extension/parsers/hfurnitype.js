/**
 * Furni type
 * @readonly
 * @enum {string}
 */
const HFurniType = Object.freeze({
    FLOOR: 'S',
    WALL: 'I',
    identify(val) {
        for (let key in this)
            if (this[key] === val)
                return key;
    }
});

export { HFurniType };
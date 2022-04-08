/**
 * Product types
 * @readonly
 * @enum {string}
 */
const HProductType = Object.freeze({
    WallItem: 'I',
    FloorItem: 'S',
    Effect: 'E',
    Badge: 'B',

    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
});

export { HProductType };
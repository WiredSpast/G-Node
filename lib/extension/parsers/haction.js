/**
 * Performable entity actions
 * @readonly
 * @enum {number}
 */
const HAction = Object.freeze({
    None: 0,
    Move: 1,
    Sit: 2,
    Lay: 3,
    Sign: 4,
    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
});

export { HAction };
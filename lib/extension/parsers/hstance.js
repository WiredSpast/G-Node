/**
 * Entity stances
 * @readonly
 * @enum {number}
 */
const HStance = Object.freeze({
    Stand: 0,
    Sit: 1,
    Lay: 2,
    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
});

export { HStance };
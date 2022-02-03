/**
 * Entity stances
 * @readonly
 * @enum {number}
 */
exports.HStance = Object.freeze({
    Stand: 0,
    Sit: 1,
    Lay: 2,
    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
});
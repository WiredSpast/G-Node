/**
 * Activity point currencies
 * @readonly
 * @enum {number}
 */
const HActivityPoint = Object.freeze({
    DUCKET: 0,
    NO_OP_1: 1,
    NO_OP_2: 2,
    NO_OP_3: 3,
    NO_OP_4: 4,
    NO_OP_5: 5,
    SEASONAL_1: 1,
    SEASONAL_2: 2,
    SEASONAL_3: 3,
    SEASONAL_4: 4,
    SEASONAL_5: 5,

    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
});

export { HActivityPoint };
/**
 * Entity types
 * @readonly
 * @enum {number}
 */
const HEntityType = Object.freeze({
    HABBO: 1,
    PET: 2,
    OLD_BOT: 3,
    BOT: 4,
    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
});

export { HEntityType };
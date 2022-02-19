/**
 * Client type
 * @readonly
 * @enum {number}
 */
const HClient = Object.freeze({
    UNITY: 0,
    FLASH: 1,
    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
});

export { HClient };

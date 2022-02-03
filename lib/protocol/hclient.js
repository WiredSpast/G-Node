/**
 * Client type
 * @readonly
 * @enum {number}
 */
exports.HClient = {
    UNITY: 0,
    FLASH: 1,
    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
}

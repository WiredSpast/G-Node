/**
 * Direction of packet
 * @readonly
 * @enum {number}
 */
exports.HDirection = {
    TOCLIENT: 0,
    TOSERVER: 1,
    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
}

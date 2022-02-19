/**
 * Direction of packet
 * @readonly
 * @enum {number}
 */
const HDirection = Object.freeze({
    TOCLIENT: 0,
    TOSERVER: 1,
    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
});

export { HDirection };
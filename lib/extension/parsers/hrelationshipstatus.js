/**
 * Possible relationship statuses
 * @readonly
 * @enum {number}
 */
const HRelationshipStatus = Object.freeze({
    None: 0,
    Heart: 1,
    Smiley: 2,
    Skull: 3,
    identify(val) {
        for (let key in this)
            if (this[key] === val)
                return key;
    }
});

export { HRelationshipStatus };
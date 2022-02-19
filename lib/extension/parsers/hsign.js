/**
 * Holdable signs
 * @readonly
 * @enum {number}
 */
const HSign = Object.freeze({
    Zero: 0,
    One: 1,
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9,
    Ten: 10,
    Heart: 11,
    Skull: 12,
    Exclamation: 13,
    Soccerball: 14,
    Smiley: 15,
    Redcard: 16,
    Yellowcard: 17,
    Invisible: 18,
    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
});

export { HSign };
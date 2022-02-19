/**
 * Entity genders
 * @readonly
 * @enum {string}
 */
const HGender = Object.freeze({
    Unisex: 'U',
    Male: 'M',
    Female: 'F',
    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
});

export { HGender };
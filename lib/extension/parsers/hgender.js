/**
 * Entity genders
 * @readonly
 * @enum {string}
 */
exports.HGender = Object.freeze({
    Unisex: 'U',
    Male: 'M',
    Female: 'F',
    identify(val) {
        for(let key in this)
            if(this[key] === val)
                return key;
    }
});
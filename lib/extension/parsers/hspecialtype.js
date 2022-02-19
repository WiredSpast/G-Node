/**
 * Furni special type
 * @readonly
 * @enum {number}
 */
const HSpecialType = Object.freeze({
    Default: 1,
    WallPaper: 2,
    FloorPaint: 3,
    LandScape: 4,
    PostIt: 5,
    Poster: 6,
    SoundSet: 7,
    TraxSong: 8,
    Present: 9,
    EcotronBox: 10,
    Trophy: 11,
    CreditFurni: 12,
    PetShampoo: 13,
    PetCustomPart: 14,
    PetCustomPartShampoo: 15,
    PetSaddle: 16,
    GuildFurni: 17,
    GameFurni: 18,
    MonsterplantSeed: 19,
    MonsterplantRevival: 20,
    MonsterplantRebreed: 21,
    MonsterplantFertilize: 22,
    FigurePurchasableSet: 23,

    identify(val) {
        for (let key in this)
            if (this[key] === val)
                return key;
    }
});

export { HSpecialType };
const {HPoint} = require("./hpoint");
const {HPacket} = require("../../protocol/hpacket");

class HEntity {
    #id;
    #index;
    #tile;
    #name;
    #motto;
    #gender = null;
    #entityType;
    #figureId;
    #favoriteGroup = null;
    #lastUpdate = null;
    #stuff = [];

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("Invalid argument(s) passed");
        }

        this.#id = packet.readInteger();
        this.#name = packet.readString();
        this.#motto = packet.readString();
        this.#figureId = packet.readString();
        this.#index = packet.readInteger();
        this.#tile = new HPoint(packet.readInteger(), packet.readInteger(), Number.parseFloat(packet.readString()));

        packet.readInteger();
        let entityTypeId = packet.readInteger();
        this.#entityType = entityTypeId;

        switch(entityTypeId) {
            case HEntityType.HABBO:
                this.#gender = packet.readString().toUpperCase();
                this.#stuff.push(packet.readInteger());
                this.#stuff.push(packet.readInteger());
                this.#favoriteGroup = packet.readString();
                this.#stuff.push(packet.readString());
                this.#stuff.push(packet.readInteger());
                this.#stuff.push(packet.readBoolean());
                break;
            case HEntityType.PET:
                this.#stuff.push(packet.readInteger());
                this.#stuff.push(packet.readInteger());
                this.#stuff.push(packet.readString());
                this.#stuff.push(packet.readInteger());
                this.#stuff.push(packet.readBoolean());
                this.#stuff.push(packet.readBoolean());
                this.#stuff.push(packet.readBoolean());
                this.#stuff.push(packet.readBoolean());
                this.#stuff.push(packet.readBoolean());
                this.#stuff.push(packet.readBoolean());
                this.#stuff.push(packet.readInteger());
                this.#stuff.push(packet.readString());
                break;
            case HEntityType.BOT:
                this.#stuff.push(packet.readString());
                this.#stuff.push(packet.readInteger());
                this.#stuff.push(packet.readString());
                let n = packet.readInteger();
                let list = [];
                for(let i = 0; i < n; i++) {
                    list.push(packet.readShort());
                }
                this.#stuff.push(list);
                break;
        }
    }

    static parse(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("Invalid argument(s) passed");
        }

        let entities = [];
        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            entities.push(new HEntity(packet));
        }
        return entities;
    }

    tryUpdate(update) {
        if (!(update instanceof HEntityUpdate)) {
            throw new Error("Invalid argument(s) passed");
        }

        if (this.#index !== update.getIndex()) return false;

        this.#tile = update.getTile();
        this.#lastUpdate = update;
        return true;
    }

    getId() {
        return this.#id;
    }

    getIndex() {
        return this.#index;
    }

    getTile() {
        return this.#tile;
    }

    getName() {
        return this.#name;
    }

    getMotto() {
        return this.#motto;
    }

    getGender() {
        return this.#gender;
    }

    getEntityType() {
        return this.#entityType;
    }

    getFigureId() {
        return this.#figureId;
    }

    getFavoriteGroup() {
        return this.#favoriteGroup;
    }

    getLastUpdate() {
        return this.#lastUpdate;
    }

    getStuff() {
        return this.#stuff;
    }
}

exports.HEntity = HEntity;

class HEntityUpdate {
    #index;
    #isController = false;

    #tile;
    #movingTo = null;

    #sign = null;
    #stance = null;
    #action = null;
    #headFacing;
    #bodyFacing;

    constructor(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("Invalid argument(s) passed");
        }
        this.#index = packet.readInteger();
        this.#tile = new HPoint(packet.readInteger(), packet.readInteger(), Number.parseFloat(packet.readString()));

        this.#headFacing = packet.readInteger();
        this.#bodyFacing = packet.readInteger();

        let action = packet.readString();
        let actionData = action.split("/");

        for(let actionInfo of actionData) {
            let actionValues = actionInfo.split(" ");

            if(actionValues.length < 2) continue;
            if(actionValues[0] === "") continue;

            switch(actionValues[0]) {
                case "flatctrl":
                    this.#isController = true;
                    this.action = HAction.None;
                    break;
                case "mv":
                    let values = actionValues[1].split(",");
                    if(values.length >= 3)
                        this.#movingTo = new HPoint(Number.parseInt(values[0]), Number.parseInt(values[1]), Number.parseFloat(values[2]));
                    this.#action = HAction.Move;
                    break;
                case "sit":
                    this.#action = HAction.Sit;
                    this.#stance = HAction.Sit;
                    break;
                case "sign":
                    this.#sign = Number.parseInt(actionValues[1]);
                    this.#action = HAction.Sign;
                    break;
            }
        }
    }

    static parse(packet) {
        let updates = [];
        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            updates.push(new HEntityUpdate(packet));
        }
        return updates;
    }

    getIndex() {
        return this.#index;
    }

    isController() {
        return this.#isController;
    }

    getTile() {
        return this.#tile;
    }

    getMovingTo() {
        return this.#movingTo;
    }

    getSign() {
        return this.#sign;
    }

    getStance() {
        return this.#stance;
    }

    getAction() {
        return this.#action;
    }

    getHeadFacing() {
        return this.#headFacing;
    }

    getBodyFacing() {
        return this.#bodyFacing;
    }
}

exports.HEntityUpdate = HEntityUpdate;

/**
 * Entity types
 * @readonly
 * @enum {number}
 */
let HEntityType = {
    HABBO: 1,
    PET: 2,
    OLD_BOT: 3,
    BOT: 4
};

exports.HEntityType = HEntityType;

/**
 * Entity genders
 * @readonly
 * @enum {string}
 */
let HGender = {
    Unisex: 'U',
    Male: 'M',
    Female: 'F'
}

exports.HGender = HGender;

/**
 * Holdable signs
 * @readonly
 * @enum {number}
 */
let HSign = {
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
    Invisible: 18
}

exports.HSign = HSign;

/**
 * Entity stances
 * @readonly
 * @enum {number}
 */
let HStance = {
    Stand: 0,
    Sit: 1,
    Lay: 2
}

exports.HStance = HStance;

/**
 * Performable entity actions
 * @readonly
 * @enum {number}
 */
let HAction = {
    None: 0,
    Move: 1,
    Sit: 2,
    Lay: 3,
    Sign: 4
}

exports.HAction = HAction;

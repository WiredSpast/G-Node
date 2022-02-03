const { HPoint } = require("./hpoint");
const { HPacket } = require("../../protocol/hpacket");
const { HFacing } = require("./hfacing");
const { HGender } = require("./hgender");
const { HEntityType } = require("./hentitytype");
const { HEntityUpdate } = require("./hentityupdate");
const util = require("util");

exports.HEntity = class HEntity {
    #id;
    #index;
    #tile;
    #bodyFacing;
    #headFacing;
    #name;
    #motto;
    #gender = null;
    #entityType;
    #figureId;
    #favoriteGroup = null;
    #lastUpdate = null;
    #stuff = [];

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HEntity {\n${indent}  id: ${util.inspect(this.#id, {colors: true})}\n`
            + `${indent}  index: ${util.inspect(this.#index, {colors: true})}\n`
            + `${indent}  tile: ${util.inspect(this.#tile, false, depth + 1)}\n`
            + `${HFacing.identify(this.#bodyFacing) ? `${indent}  bodyFacing: HFacing.\x1b[36m${HFacing.identify(this.#bodyFacing)}\x1b[0m\n` : ''}`
            + `${HFacing.identify(this.#headFacing) ? `${indent}  headFacing: HFacing.\x1b[36m${HFacing.identify(this.#headFacing)}\x1b[0m\n` : ''}`
            + `${indent}  name: ${util.inspect(this.#name, {colors: true})}\n`
            + `${indent}  motto: ${util.inspect(this.#motto, {colors: true})}\n`
            + `${HGender.identify(this.#gender) ? `${indent}  gender: HGender.\x1b[36m${HGender.identify(this.#gender)}\x1b[0m\n` : ''}`
            + `${HEntityType.identify(this.#entityType) ? `${indent}  entityType: HEntityType.\x1b[36m${HEntityType.identify(this.#entityType)}\x1b[0m\n` : ''}`
            + `${indent}  figureId: ${util.inspect(this.#figureId, {colors: true})}\n`
            + `${this.#favoriteGroup != null ? `${indent}  favoriteGroup: ${util.inspect(this.#favoriteGroup, {colors: true})}\n` : ''}`
            + `${this.#lastUpdate != null ? `${indent}  lastUpdate: ${util.inspect(this.#lastUpdate, false, depth + 1)}\n` : ''}`
            + `${indent}  stuff: ${util.inspect(this.#stuff, {colors: true})}\n`
            + `${indent}}`;
    }

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HEntity.constructor: packet must be an instance of HPacket");
        }

        this.#id = packet.readInteger();
        this.#name = packet.readString();
        this.#motto = packet.readString();
        this.#figureId = packet.readString();
        this.#index = packet.readInteger();
        this.#tile = new HPoint(packet.readInteger(), packet.readInteger(), Number.parseFloat(packet.readString()));

        this.#bodyFacing = packet.readInteger();
        this.#headFacing = this.#bodyFacing;
        this.#entityType = packet.readInteger();

        switch(this.#entityType) {
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
            throw new Error("HEntity.parse: packet must be an instance of HPacket");
        }

        let entities = [];
        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            entities.push(new HEntity(packet));
        }
        return entities;
    }

    static constructPacket(entities, headerId) {
        if(!Array.isArray(entities))  {
            throw new Error("HEntity.constructPacket: entities must be an array of HEntity instances");
        }
        if(!Number.isInteger(headerId)) {
            throw new Error("HEntity.constructPacket: headerId must be an integer");
        }

        let packet = new HPacket(headerId)
            .appendInt(entities.length);

        for(let entity of entities) {
            if(!(entity instanceof HEntity)) {
                throw new Error("HEntity.constructPacket: entities must be an array of HEntity instances");
            }
            entity.appendToPacket(packet);
        }

        return packet;
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HEntity.appendToPacket: packet must be an instance of HPacket");
        }

        packet.appendInt(this.#id);
        packet.appendString(this.#name);
        packet.appendString(this.#motto);
        packet.appendString(this.#figureId);
        packet.appendInt(this.#index);
        packet.appendInt(this.#tile.x);
        packet.appendInt(this.#tile.y);
        packet.appendString(`${this.#tile.z}`);

        packet.appendInt(this.#bodyFacing);
        packet.appendInt(this.#entityType);

        switch(this.#entityType) {
            case HEntityType.HABBO:
                packet.appendString(this.#gender.toLowerCase());
                packet.appendInt(this.#stuff[0]);
                packet.appendInt(this.#stuff[1]);
                packet.appendString(this.#favoriteGroup);
                packet.appendString(this.#stuff[2]);
                packet.appendInt(this.#stuff[3]);
                packet.appendBoolean(this.#stuff[4]);
                break;
            case HEntityType.PET:
                packet.appendInt(this.#stuff[0]);
                packet.appendInt(this.#stuff[1]);
                packet.appendString(this.#stuff[2]);
                packet.appendInt(this.#stuff[3]);
                packet.appendBoolean(this.#stuff[4]);
                packet.appendBoolean(this.#stuff[5]);
                packet.appendBoolean(this.#stuff[6]);
                packet.appendBoolean(this.#stuff[7]);
                packet.appendBoolean(this.#stuff[8]);
                packet.appendBoolean(this.#stuff[9]);
                packet.appendInt(this.#stuff[10]);
                packet.appendString(this.#stuff[11]);
                break;
            case HEntityType.BOT:
                packet.appendString(this.#stuff[0]);
                packet.appendInt(this.#stuff[1]);
                packet.appendString(this.#stuff[2]);
                packet.appendInt(this.#stuff[3].length);
                for(let i = 0; i < this.#stuff[3].length; i++) {
                    packet.appendShort(this.#stuff[3][i]);
                }
                break;
        }
    }

    tryUpdate(update) {
        if (!(update instanceof HEntityUpdate)) {
            throw new Error("HEntity.update: update must be an instance op HEntityUpdate");
        }

        if (this.#index !== update.index) return false;

        this.#tile = update.tile;
        this.#lastUpdate = update;
        return true;
    }

    getId() {
        console.error("\x1b[31mHEntity.getId(): Deprecated method used, use the getter HEntity.id instead\x1b[0m");
        return this.#id;
    }

    get id() {
        return this.#id;
    }

    set id(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HEntity.id: must be an integer')
        }

        this.#id = val;
    }

    getIndex() {
        console.error("\x1b[31mHEntity.getIndex(): Deprecated method used, use the getter HEntity.index instead\x1b[0m");
        return this.#index;
    }

    get index() {
        return this.#index;
    }

    set index(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HEntity.index: must be an integer');
        }

        this.#index = val;
    }

    getTile() {
        console.error("\x1b[31mHEntity.getTile(): Deprecated method used, use the getter HEntity.tile instead\x1b[0m");
        return this.#tile;
    }

    get tile() {
        return this.#tile;
    }

    set tile(val) {
        if(!(val instanceof HPoint)) {
            throw new Error('HEntity.tile: must be an instance of HPoint');
        }

        this.#tile = val;
    }

    getName() {
        console.error("\x1b[31mHEntity.getName(): Deprecated method used, use the getter HEntity.name instead\x1b[0m");
        return this.#name;
    }

    get name() {
        return this.#name;
    }

    set name(val) {
        if(typeof val != 'string') {
            throw new Error('HEntity.name: must be a string');
        }

        this.#name = val;
    }

    getMotto() {
        console.error("\x1b[31mHEntity.getMotto(): Deprecated method used, use the getter HEntity.motto instead\x1b[0m");
        return this.#motto;
    }

    get motto() {
        return this.#motto;
    }

    set motto(val) {
        if(typeof val != 'string') {
            throw new Error('HEntity.motto: must be a string');
        }

        this.#motto = val;
    }

    getGender() {
        console.error("\x1b[31mHEntity.getGender(): Deprecated method used, use the getter HEntity.gender instead\x1b[0m");
        return this.#gender;
    }

    get gender() {
        return this.#gender;
    }

    set gender(val) {
        if(!HGender.identify(val) && val != null) {
            throw new Error('HEntity.gender: must be a value of HGender or null')
        }

        this.#gender = val;
    }

    getEntityType() {
        console.error("\x1b[31mHEntity.getEntityType(): Deprecated method used, use the getter HEntity.entityType instead\x1b[0m");
        return this.#entityType;
    }

    get entityType() {
        return this.#entityType;
    }

    set entityType(val) {
        if(!HEntityType.identify(val)) {
            throw new Error('HEntity.entityType: must be a value of HEntityType')
        }

        this.#entityType = val;
    }

    getFigureId() {
        console.error("\x1b[31mHEntity.getFigureId(): Deprecated method used, use the getter HEntity.figureId instead\x1b[0m");
        return this.#figureId;
    }

    get figureId() {
        return this.#figureId;
    }

    set figureId(val) {
        if(typeof val != 'string') {
            throw new Error('HEntity.figureId: must be a string');
        }

        this.#figureId = val;
    }

    getFavoriteGroup() {
        console.error("\x1b[31mHEntity.getFavoriteGroup(): Deprecated method used, use the getter HEntity.favoriteGroup instead\x1b[0m");
        return this.#favoriteGroup;
    }

    get favoriteGroup() {
        return this.#favoriteGroup;
    }

    set favoriteGroup(val) {
        if(typeof val != 'string' && val != null) {
            throw new Error('HEntity.favoriteGroup: must be a string or null');
        }

        this.#favoriteGroup = val;
    }

    getLastUpdate() {
        console.error("\x1b[31mHEntity.getLastUpdate(): Deprecated method used, use the getter HEntity.lastUpdate instead\x1b[0m");
        return this.#lastUpdate;
    }

    get lastUpdate() {
        return this.#lastUpdate;
    }

    set lastUpdate(val) {
        if(!(val instanceof HEntityUpdate) && val != null) {
            throw new Error('HEntity.lastUpdate: must be an instance of HEntityUpdate or null');
        }

        this.#lastUpdate = val;
    }

    getStuff() {
        console.error("\x1b[31mHEntity.getStuff(): Deprecated method used, use the getter HEntity.stuff instead\x1b[0m");
        return this.#stuff;
    }

    get stuff() {
        return this.#stuff;
    }

    set stuff(val) {
        if(!Array.isArray(val)) {
            throw new Error('HEntity.stuff: must be an array');
        }

        this.#stuff = val;
    }
}

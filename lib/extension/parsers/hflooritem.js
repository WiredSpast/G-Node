import { HFacing } from './hfacing.js';
import util from "util";
import { HPacket } from "../../protocol/hpacket.js";
import { HPoint } from "./hpoint.js";
import { HStuff } from "./hstuff.js";

export class HFloorItem {
    #id;
    #typeId;
    #tile;
    #sizeZ;
    #extra;
    #facing;

    #stuffCategory;

    #secondsToExpiration;
    #usagePolicy;
    #ownerId;
    #ownerName;
    #stuff;

    #staticClass = undefined;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HFloorItem {\n`
            + `${indent}  id: ${util.inspect(this.#id, {colors: true})}\n`
            + `${indent}  typeId: ${util.inspect(this.#typeId, {colors: true})}\n`
            + `${indent}  tile: ${util.inspect(this.#tile, false, depth + 1)}\n`
            + `${indent}  sizeZ: ${util.inspect(this.#sizeZ, {colors: true})}\n`
            + `${indent}  extra: ${util.inspect(this.#extra, {colors: true})}\n`
            + `${HFacing.identify(this.#facing) ? `${indent}  facing: HFacing.\x1b[36m${HFacing.identify(this.#facing)}\x1b[0m\n` : ''}`
            + `${indent}  category: ${util.inspect(this.#stuffCategory, {colors: true})}\n`
            + `${indent}  secondsToExpiration: ${util.inspect(this.#secondsToExpiration, {colors: true})}\n`
            + `${indent}  usagePolicy: ${util.inspect(this.#usagePolicy, {colors: true})}\n`
            + `${indent}  ownerId: ${util.inspect(this.#ownerId, {colors: true})}\n`
            + `${indent}  ownerName: ${util.inspect(this.#ownerName, {colors: true})}\n`
            + `${indent}  stuff: ${util.inspect(this.#stuff, {colors: true})}\n`
            + `${this.#staticClass ? `${indent}  staticClass: ${util.inspect(this.#staticClass, {colors: true})}\n` : ''}`
            + `${indent}}`;
    }

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HFloorItem.constructor: Invalid argument(s) passed");
        }

        let x, y;
        [ this.#id, this.#typeId, x, y, this.#facing ] = packet.read('iiiii');

        this.#tile = new HPoint(x, y, Number.parseFloat(packet.readString()));

        this.#sizeZ = Number.parseFloat(packet.readString());

        [ this.#extra, this.#stuffCategory ] = packet.read('ii');

        this.#stuff = HStuff.readData(packet, this.#stuffCategory);

        [ this.#secondsToExpiration, this.#usagePolicy, this.#ownerId ] = packet.read('iii');

        if(this.#typeId < 0) {
            this.#staticClass = packet.readString();
        }
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HFloorItem.appendToPacket: packet must be an instance of HPacket");
        }

        packet.append('iiiiiSSii',
            this.#id,
            this.#typeId,
            this.#tile.x,
            this.#tile.y,
            this.#facing,
            `${this.#tile.z}`,
            `${this.#sizeZ}`,
            this.#extra,
            this.#stuffCategory);

        HStuff.appendData(packet, this.#stuffCategory, this.#stuff);

        packet.append('iii',
            this.#secondsToExpiration,
            this.#usagePolicy,
            this.#ownerId);

        if(this.#typeId < 0) {
            packet.appendString(this.#staticClass || "");
        }
    }

    static parse(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HFloorItem.parse: packet must be an instance of HPacket");
        }

        packet.resetReadIndex();

        let ownersCount = packet.readInteger();
        let owners = new Map();

        for(let i = 0; i < ownersCount; i++) {
            owners.set(...packet.read('iS'))
        }

        let furniture = [];
        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            let furni = new HFloorItem(packet);
            furni.#ownerName = owners.get(furni.#ownerId);

            furniture.push(furni);
        }
        return furniture;
    }

    static constructPacket(floorItems, headerId) {
        if(!(Array.isArray(floorItems) || !Number.isInteger(headerId)))  {
            throw new Error("HFloorItem.constructPacket: headerId must be an integer");
        }

        if(!(Array.isArray(floorItems))) {
            throw new Error("HFloorItem.constructPacket: floorItems must be an array of HFloorItem instances");
        }

        let owners = new Map();
        for(let floorItem of floorItems) {
            if(!(floorItem instanceof HFloorItem)) {
                throw new Error("HFloorItem.constructPacket: floorItems must be an array of HFloorItem instances");
            }

            owners.set(floorItem.#ownerId, floorItem.#ownerName);
        }

        let packet = new HPacket(headerId);
        packet.appendInt(owners.size);
        for(let ownerEntry of Array.from(owners.entries())) {
            packet.append('iS', ...ownerEntry);
        }

        packet.appendInt(floorItems.length);
        for(let floorItem of floorItems) {
            floorItem.appendToPacket(packet);
        }

        return packet;
    }

    getId() {
        console.error("\x1b[31mHFloorItem.getId(): Deprecated method used, use the getter HFloorItem.id instead\x1b[0m");
        return this.#id;
    }

    get id() {
        return this.#id;
    }

    getTypeId() {
        console.error("\x1b[31mHFloorItem.getTypeId(): Deprecated method used, use the getter HFloorItem.typeId instead\x1b[0m");
        return this.#typeId;
    }

    get typeId() {
        return this.#typeId;
    }

    getUsagePolicy() {
        console.error("\x1b[31mHFloorItem.getUsagePolicy(): Deprecated method used, use the getter HFloorItem.usagePolicy instead\x1b[0m");
        return this.#usagePolicy;
    }

    get usagePolicy() {
        return this.#usagePolicy;
    }

    getOwnerId() {
        console.error("\x1b[31mHFloorItem.getOwnerId(): Deprecated method used, use the getter HFloorItem.ownerId instead\x1b[0m");
        return this.#ownerId;
    }

    get ownerId() {
        return this.#ownerId;
    }

    getOwnerName() {
        console.error("\x1b[31mHFloorItem.getOwnerName(): Deprecated method used, use the getter HFloorItem.ownerName instead\x1b[0m");
        return this.#ownerName;
    }

    get ownerName() {
        return this.#ownerName;
    }

    getSecondsToExpiration()  {
        console.error("\x1b[31mHFloorItem.getSecondsToExpiration(): Deprecated method used, use the getter HFloorItem.secondsToExpiration instead\x1b[0m");
        return this.#secondsToExpiration;
    }

    get secondsToExpiration() {
        return this.#secondsToExpiration;
    }

    getCategory() {
        console.error("\x1b[31mHFloorItem.getCategory(): Deprecated method used, use the getter HFloorItem.category instead\x1b[0m");
        return this.#stuffCategory;
    }

    get category() {
        return this.#stuffCategory;
    }

    get sizeZ() {
        return this.#sizeZ;
    }

    get extra() {
        return this.#extra;
    }

    getFacing() {
        console.error("\x1b[31mHFloorItem.getFacing(): Deprecated method used, use the getter HFloorItem.facing instead\x1b[0m");
        return this.#facing;
    }

    get facing() {
        return this.#facing;
    }

    getTile() {
        console.error("\x1b[31mHFloorItem.getTile(): Deprecated method used, use the getter HFloorItem.tile instead\x1b[0m");
        return this.#tile;
    }

    get tile() {
        return this.#tile;
    }

    getStuff() {
        console.error("\x1b[31mHFloorItem.getStuff(): Deprecated method used, use the getter HFloorItem.stuff instead\x1b[0m");
        return this.#stuff;
    }

    get stuff() {
        return this.#stuff;
    }

    get staticClass() {
        return this.#staticClass;
    }


    setOwnerName(ownerName) {
        console.error("\x1b[31mHFloorItem.setOwnerName(): Deprecated method used, use the setter HFloorItem.ownerName = ... instead\x1b[0m");
        if(typeof ownerName !== 'string') {
            throw new Error("HFloorItem.setOwnerName: ownerName must be a string");
        }

        this.#ownerName = ownerName;
    }

    set ownerName(val) {
        if(typeof val !== 'string') {
            throw new Error("HFloorItem.ownerName: must be a string");
        }

        this.#ownerName = val;
    }

    setId(id) {
        console.error("\x1b[31mHFloorItem.setId(): Deprecated method used, use the setter HFloorItem.id = ... instead\x1b[0m");
        if(!Number.isInteger(id)) {
            throw new Error("HFloorItem.setId: id must be an integer");
        }

        this.#id = id;
    }

    set id(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HFloorItem.id: must be an integer");
        }

        this.#id = val;

    }

    setTypeId(typeId) {
        console.error("\x1b[31mHFloorItem.setTypeId(): Deprecated method used, use the setter HFloorItem.typeId = ... instead\x1b[0m");
        if(!Number.isInteger(typeId)) {
            throw new Error("HFloorItem.setTypeId: typeId must be an integer");
        }

        this.#typeId = typeId;
    }

    set typeId(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HFloorItem.typeId: must be an integer");
        }

        this.#typeId = val;
    }

    setTile(tile) {
        console.error("\x1b[31mHFloorItem.setTile(): Deprecated method used, use the setter HFloorItem.tile = ... instead\x1b[0m");
        if(!(tile instanceof HPoint)) {
            throw new Error("HFloorItem.setTile: tile must be an instance of HPoint");
        }

        this.#tile = tile;
    }

    set tile(val) {
        if(!(val instanceof HPoint)) {
            throw new Error("HFloorItem.tile: must be an instance of HPoint");
        }

        this.#tile = val;
    }

    set sizeZ(val) {
        if(Number.isNaN(val) || typeof val !== 'number') {
            throw new Error("HFloorItem.sizeZ: must be a double");
        }

        this.#sizeZ = val;
    }

    setFacing(facing) {
        console.error("\x1b[31mHFloorItem.SetFacing(): Deprecated method used, use the setter HFloorItem.facing = ... instead\x1b[0m");
        if(!HFacing.identify(facing)) {
            throw new Error("HFloorItem.setFacing: facing must be a value of HFacing");
        }

        this.#facing = facing;
    }

    set facing(val) {
        if(!HFacing.identify(val)) {
            throw new Error("HFloorItem.facing: must be a value of HFacing");
        }

        this.#facing = val;
    }

    setCategory(category) {
        console.error("\x1b[31mHFloorItem.setCategory(): Deprecated method used, use the setter HFloorItem.stuffCategory = ... instead\x1b[0m");
        if(!Number.isInteger(category)) {
            throw new Error("HFloorItem.setCategory: category must be an integer");
        }

        this.#stuffCategory = category;
    }

    set stuffCategory(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HFloorItem.stuffCategory: must be an integer");
        }

        this.#stuffCategory = val;
    }

    setSecondsToExpiration(secondsToExpiration) {
        console.error("\x1b[31mHFloorItem.setSecondsToExpiration(): Deprecated method used, use the setter HFloorItem.secondsToExpiration = ... instead\x1b[0m");
        if(!Number.isInteger(secondsToExpiration)) {
            throw new Error("HFloorItem.setSecondsToExpiration: secondsToExpiration must be an integer");
        }

        this.#secondsToExpiration = secondsToExpiration;
    }

    set secondsToExpiration(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HFloorItem.secondsToExpiration: must be an integer");
        }

        this.#secondsToExpiration = val;
    }

    setUsagePolicy(usagePolicy) {
        console.error("\x1b[31mHFloorItem.setUsagePolicy(): Deprecated method used, use the setter HFloorItem.usagePolicy = ... instead\x1b[0m");
        if(!Number.isInteger(usagePolicy)) {
            throw new Error("HFloorItem.setUsagePolicy: usagePolicy must be an integer");
        }

        this.#usagePolicy = usagePolicy;
    }

    set usagePolicy(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HFloorItem.usagePolicy: must be an integer");
        }

        this.#usagePolicy = val;
    }

    setOwnerId(ownerId) {
        console.error("\x1b[31mHFloorItem.setOwnerId(): Deprecated method used, use the setter HFloorItem.ownerId = ... instead\x1b[0m");
        if(!Number.isInteger(ownerId)) {
            throw new Error("HFloorItem.setOwnerId: ownerId must be an integer");
        }

        this.#ownerId = ownerId;
    }

    set ownerId(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HFloorItem.ownerId: must be an integer");
        }

        this.#ownerId = val;
    }

    setStuff(stuff) {
        console.error("\x1b[31mHFloorItem.setStuff(): Deprecated method used, use the setter HFloorItem.stuff = ... instead\x1b[0m");
        if(!Array.isArray(stuff)) {
            throw new Error("HFloorItem.setStuff: stuff must be an array");
        }

        this.#stuff = stuff;
    }

    set stuff(val) {
        if(!Array.isArray(val)) {
            throw new Error("HFloorItem.stuff: must be an array");
        }

        this.#stuff = val;
    }

    set staticClass(val) {
        if(typeof val !== 'string' && typeof val !== 'undefined') {
            throw new Error("HFloorItem.staticClass: must be a string or undefined");
        }

        this.#staticClass = val;
    }
}

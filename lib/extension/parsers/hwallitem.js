import { HPacket } from "../../protocol/hpacket.js";
import util from "util";

export class HWallItem {
    #id;
    #typeId;

    #state;
    #location;
    #usagePolicy;
    #secondsToExpiration;

    #ownerId;
    #ownerName;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HWallItem {\n`
            + `${indent}  id: ${util.inspect(this.#id, {colors: true})}\n`
            + `${indent}  typeId: ${util.inspect(this.#typeId, {colors: true})}\n`
            + `${indent}  state: ${util.inspect(this.#state, {colors: true})}\n`
            + `${indent}  location: ${util.inspect(this.#location, {colors: true})}\n`
            + `${indent}  usagePolicy: ${util.inspect(this.#usagePolicy, {colors: true})}\n`
            + `${indent}  secondsToExpiration: ${util.inspect(this.#secondsToExpiration, {colors: true})}\n`
            + `${indent}  ownerId: ${util.inspect(this.#ownerId, {colors: true})}\n`
            + `${indent}  ownerName: ${util.inspect(this.#ownerName, {colors: true})}\n`
            + `${indent}}`;
    }

    constructor(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HWallItem.constructor: packet must be an instance of HPacket");
        }

        let idString;
        [ idString, this.#typeId, this.#location, this.#state, this.#secondsToExpiration,
          this.#usagePolicy, this.#ownerId ] = packet.read('SiSSiii');

        this.#id = Number.parseInt(idString);
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HWallItem.appendToPacket: packet must be an instance of HPacket");
        }

        packet.append('SiSSiii',
            `${this.#id}`,
            this.#typeId,
            this.#location,
            this.#state,
            this.#secondsToExpiration,
            this.#usagePolicy,
            this.#ownerId);
    }

    static parse(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HWallItem.parse: packet must be an instance of HPacket");
        }

        let ownersCount = packet.readInteger();
        let owners = new Map();

        for(let i = 0; i < ownersCount; i++) {
            owners.set(...packet.read('iS'));
        }

        let furniture = [];

        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            let furni = new HWallItem(packet);
            furni.#ownerName = owners.get(furni.#ownerId);

            furniture.push(furni);
        }

        return furniture;
    }

    static constructPacket(wallItems, headerId) {
        if(!Number.isInteger(headerId)) {
            throw new Error("HWallItem.constructPacket: headerId must be an integer")
        }
        if(!Array.isArray(wallItems)) {
            throw new Error("HWallItem.constructPacket: wallItems must be an array of HWallItem instances")
        }

        let owners = new Map();
        for(let wallItem of wallItems) {
            if(!(wallItem instanceof HWallItem)) {
                throw new Error("HWallItem.constructPacket: wallItems must be an array of HWallItem instances")
            }
            owners.set(wallItem.#ownerId, wallItem.#ownerName);
        }

        let packet = new HPacket(headerId)
            .appendInt(owners.size);
        for(let ownerEntry of Array.from(owners.entries())) {
            packet.append('iS', ...ownerEntry);
        }

        packet.appendInt(wallItems.length);
        for(let wallItem of wallItems) {
            wallItem.appendToPacket(packet);
        }

        return packet;
    }

    get id() {
        return this.#id;
    }

    set id(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HWallItem.id: must be an integer");
        }

        this.#id = val;
    }

    get typeId() {
        return this.#typeId;
    }

    set typeId(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HWallItem.typeId: must be an integer");
        }

        this.#typeId = val;
    }

    get usagePolicy() {
        return this.#usagePolicy;
    }

    set usagePolicy(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HWallItem.usagePolicy: must be an integer");
        }

        this.#usagePolicy = val;
    }

    get ownerId() {
        return this.#ownerId;
    }

    set ownerId(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HWallItem.ownerId: must be an integer");
        }

        this.#ownerId = val;
    }

    get ownerName() {
        return this.#ownerName
    }

    set ownerName(val) {
        if(typeof val !== 'string') {
            throw new Error("HWallItem.ownerName: must be a string");
        }

        this.#ownerName = val;
    }

    get state() {
        return this.#state
    }

    set state(val) {
        if(typeof val !== 'string') {
            throw new Error("HWallItem.state: must be a string");
        }

        this.#state = val;
    }

    get location() {
        return this.#location
    }

    set location(val) {
        if(typeof val !== 'string') {
            throw new Error("HWallItem.location: must be a string");
        }

        this.#location = val;
    }

    get secondsToExpiration() {
        return this.#secondsToExpiration;
    }

    set secondsToExpiration(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HWallItem.secondsToExpiration: must be an integer");
        }

        this.#secondsToExpiration = val;
    }



    getId() {
        console.error("\x1b[31mHWallItem.getId(): Deprecated method used, use the getter HWallItem.id instead\x1b[0m");
        return this.#id;
    }

    getTypeId() {
        console.error("\x1b[31mHWallItem.getTypeId(): Deprecated method used, use the getter HWallItem.typeId instead\x1b[0m");
        return this.#typeId;
    }

    getUsagePolicy() {
        console.error("\x1b[31mHWallItem.getUsagePolicy(): Deprecated method used, use the getter HWallItem.usagePolicy instead\x1b[0m");
        return this.#usagePolicy;
    }

    getOwnerId() {
        console.error("\x1b[31mHWallItem.getOwnerId(): Deprecated method used, use the getter HWallItem.ownerId instead\x1b[0m");
        return this.#ownerId;
    }

    getOwnerName() {
        console.error("\x1b[31mHWallItem.getOwnerName(): Deprecated method used, use the getter HWallItem.ownerName instead\x1b[0m");
        return this.#ownerName;
    }

    getState() {
        console.error("\x1b[31mHWallItem.getState(): Deprecated method used, use the getter HWallItem.state instead\x1b[0m");
        return this.#state;
    }

    getLocation() {
        console.error("\x1b[31mHWallItem.getLocation(): Deprecated method used, use the getter HWallItem.location instead\x1b[0m");
        return this.#location;
    }

    getSecondsToExpiration() {
        console.error("\x1b[31mHWallItem.getSecondsToExpiration(): Deprecated method used, use the getter HWallItem.secondsToExpiration instead\x1b[0m");
        return this.#secondsToExpiration;
    }


    setOwnerName(ownerName) {
        console.error("\x1b[31mHWallItem.setOwnerName(): Deprecated method used, use the setter HWallItem.ownerName = ... instead\x1b[0m");
        if(typeof ownerName !== 'string') {
            throw new Error("HWallItem.setOwnerName: ownerName must be a string");
        }

        this.#ownerName = ownerName;
    }

    setId(id) {
        console.error("\x1b[31mHWallItem.setId(): Deprecated method used, use the setter HWallItem.id = ... instead\x1b[0m");
        if(!Number.isInteger(id)) {
            throw new Error("HWallItem.setId: id must be an integer");
        }

        this.#id = id;
    }

    setTypeId(typeId) {
        console.error("\x1b[31mHWallItem.setTypeId(): Deprecated method used, use the setter HWallItem.typeId = ... instead\x1b[0m");
        if(!Number.isInteger(typeId)) {
            throw new Error("HWallItem.setTypeId: typeId must be an integer");
        }

        this.#typeId = typeId;
    }

    setState(state) {
        console.error("\x1b[31mHWallItem.setState(): Deprecated method used, use the setter HWallItem.state = ... instead\x1b[0m");
        if(typeof state !== 'string') {
            throw new Error("HWallItem.setState: state must be a string");
        }

        this.#state = state;
    }

    setLocation(location) {
        console.error("\x1b[31mHWallItem.setLocation(): Deprecated method used, use the setter HWallItem.location = ... instead\x1b[0m");
        if(typeof location !== 'string') {
            throw new Error("HWallItem.setLocation: location must be a string");
        }

        this.#location = location;
    }

    setUsagePolicy(usagePolicy) {
        console.error("\x1b[31mHWallItem.setUsagePolicy(): Deprecated method used, use the setter HWallItem.usagePolicy = ... instead\x1b[0m");
        if(!Number.isInteger(usagePolicy)) {
            throw new Error("HWallItem.setUsagePolicy: usagePolicy must be an integer");
        }

        this.#usagePolicy = usagePolicy;
    }

    setSecondsToExpiration(secondsToExpiration) {
        console.error("\x1b[31mHWallItem.setSecondsToExpiration(): Deprecated method used, use the setter HWallItem.secondsToExpiration = ... instead\x1b[0m");
        if(!Number.isInteger(secondsToExpiration)) {
            throw new Error("HWallItem.setSecondsToExpiration: secondsToExpiration must be an integer");
        }

        this.#secondsToExpiration = secondsToExpiration;
    }

    setOwnerId(ownerId) {
        console.error("\x1b[31mHWallItem.setOwnerId(): Deprecated method used, use the setter HWallItem.ownerId = ... instead\x1b[0m");
        if(!Number.isInteger(ownerId)) {
            throw new Error("HWallItem.setOwnerId: ownerId must be an integer");
        }

        this.#ownerId = ownerId;
    }
}

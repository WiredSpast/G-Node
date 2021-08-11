import { HPacket } from "../../protocol/hpacket";

export class HWallItem {
    #id;
    #typeId;

    #state;
    #location;
    #usagePolicy;
    #secondsToExpiration;

    #ownerId;
    #ownerName;

    constructor(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#id = Number.parseInt(packet.readString());
        this.#typeId = packet.readInteger();

        this.#location = packet.readString();
        this.#state = packet.readString();
        this.#secondsToExpiration = packet.readInteger();
        this.#usagePolicy = packet.readInteger();

        this.#ownerId = packet.readInteger();
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("Invalid argument(s) passed");
        }

        packet.appendString("" + this.#id);
        packet.appendInt(this.#typeId);
        packet.appendString(this.#location);
        packet.appendString(this.#state);
        packet.appendInt(this.#secondsToExpiration);
        packet.appendInt(this.#usagePolicy);
        packet.appendInt(this.#ownerId);
    }

    static parse(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("Invalid argument(s) passed")
        }

        let ownersCount = packet.readInteger();
        let owners = new Map();

        for(let i = 0; i < ownersCount; i++) {
            owners.set(packet.readInteger(), packet.readString());
        }

        let furniture = [];

        for(let i = 0; i < furniture.length; i++) {
            let furni = new HWallItem(packet);
            furni.#ownerName = owners.get(furni.#ownerId);

            furniture.push(furni);
        }

        return furniture;
    }

    static constructPacket(wallItems, headerId) {
        if(!Array.isArray(wallItems) || !Number.isInteger(headerId)) {
            throw new Error("Invalid argument(s) passed")
        }

        let owners = new Map();
        for(let wallItem of wallItems) {
            if(!(wallItem instanceof HWallItem)) {
                throw new Error("Invalid argument(s) passed")
            }
            owners.set(wallItem.#ownerId, wallItem.#ownerName);
        }

        let packet = new HPacket(headerId);
        packet.appendInt(owners.size);
        for(let ownerId of Array.from(owners.keys())) {
            packet.appendInt(ownerId);
            packet.appendString(owners.get(ownerId));
        }

        packet.appendInt(wallItems.length);
        for(let wallItem of wallItems) {
            wallItem.appendToPacket(packet);
        }

        return packet;
    }

    getId() {
        return id;
    }

    getTypeId() {
        return this.#typeId;
    }

    getUsagePolicy() {
        return this.#usagePolicy;
    }

    getOwnerId() {
        return this.#ownerId;
    }

    getOwnerName() {
        return this.#ownerName;
    }

    getState() {
        return this.#state;
    }

    getLocation() {
        return this.#location;
    }

    getSecondsToExpiration() {
        return this.#secondsToExpiration;
    }


    setOwnerName(ownerName) {
        if(typeof ownerName !== 'string') {
            throw new Error("Invalid argument(s) passed");
        }

        this.#ownerName = ownerName;
    }

    setId(id) {
        if(!Number.isInteger(id)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#id = id;
    }

    setTypeId(typeId) {
        if(!Number.isInteger(typeId)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#typeId = typeId;
    }

    setState(state) {
        if(typeof state !== 'string') {
            throw new Error("Invalid argument(s) passed");
        }

        this.#state = state;
    }

    setLocation(location) {
        if(typeof location !== 'string') {
            throw new Error("Invalid argument(s) passed");
        }

        this.#location = location;
    }

    setUsagePolicy(usagePolicy) {
        if(!Number.isInteger(usagePolicy)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#usagePolicy = usagePolicy;
    }

    setSecondsToExpiration(secondsToExpiration) {
        if(!Number.isInteger(secondsToExpiration)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#secondsToExpiration = secondsToExpiration;
    }

    setOwnerId(ownerId) {
        if(!Number.isInteger(ownerId)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#ownerId = ownerId;
    }
}

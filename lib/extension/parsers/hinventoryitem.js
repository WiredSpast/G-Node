import { HPacket } from "../../protocol/hpacket";
import { HStuff } from "./hflooritem";

export class HInventoryItem {
    #furniType;
    #id;
    #typeId;
    #category;
    #stuff;

    #isGroupable;
    #isTradeable;
    #isAllowedOnMarketplace;
    #hasRentPeriodStarted;
    #secondsToExpiration;
    #roomId;
    #slotId;

    #ignore1;
    #ignore2;
    #ignore3;
    #ignore4;

    constructor(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#ignore1 = packet.readInteger();
        this.#furniType = packet.readString();
        this.#id = packet.readInteger();
        this.#typeId = packet.readInteger();

        this.#ignore2 = packet.readInteger();

        this.#category = packet.readInteger();

        this.#stuff = HStuff.readData(packet, this.#category);

        this.#isGroupable = packet.readBoolean();
        this.#isTradeable = packet.readBoolean();
        this.#ignore3 = packet.readBoolean();
        this.#isAllowedOnMarketplace = packet.readBoolean();
        this.#secondsToExpiration = packet.readInteger();
        this.#hasRentPeriodStarted = packet.readBoolean();
        this.#roomId = packet.readInteger();

        if(this.#furniType === HFurniType.FLOOR) {
            this.#slotId = packet.readString();
            this.#ignore4 = packet.readInteger();
        }
    }

    static parse(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("Invalid argument(s) passed");
        }

        let items = [];
        packet.setReadIndex(14);
        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            items.push(new HInventoryItem(packet));
        }

        return items;
    }

    static constructPackets(inventoryItems, headerId) {
        if(!Array.isArray(inventoryItems) || !Number.isInteger(headerId)) {
            throw new Error("Invalid argument(s) passed");
        }

        let n = Math.ceil(inventoryItems.length / 600);
        let packets = [];
        for(let i = 0; i < n; i++) {
            let packet = new HPacket(headerId);
            packet.appendInt(n);
            packet.appendInt(i);
            let count = inventoryItems.length - i * 600;
            count = count > 600 ? 600 : count;
            packet.appendInt(count);
            for(let j = 0; j < count; j++) {
                let item = inventoryItems[0];
                inventoryItems = inventoryItems.slice(1);

                // this.#ignore1 = packet.readInteger();
                packet.appendInt(item.#ignore1);
                // this.#type = packet.readString();
                packet.appendString(item.#furniType);
                // this.#id = packet.readInteger();
                packet.appendInt(item.#id);
                // this.#typeId = packet.readInteger();
                packet.appendInt(item.#typeId)
                // this.#ignore2 = packet.readInteger();
                packet.appendInt(item.#ignore2);
                // this.#category = packet.readInteger();
                packet.appendInt(item.#category);
                // this.#stuff = HStuff.readData(packet, this.#category);
                HStuff.appendData(packet, item.#category, item.#stuff);
                // this.#isGroupable = packet.readBoolean();
                packet.appendBoolean(item.#isGroupable);
                // this.#isTradeable = packet.readBoolean();
                packet.appendBoolean(item.#isTradeable);
                // this.#ignore3 = packet.readBoolean();
                packet.appendBoolean(item.#ignore3);
                // this.#isAllowedOnMarketplace = packet.readBoolean();
                packet.appendBoolean(item.#isAllowedOnMarketplace);
                // this.#secondsToExpiration = packet.readInteger();
                packet.appendInt(item.#secondsToExpiration);
                // this.#hasRentPeriodStarted = packet.readBoolean();
                packet.appendBoolean(item.#hasRentPeriodStarted);
                // this.#roomId = packet.readInteger();
                packet.appendInt(item.#roomId);
                if(item.#furniType === HFurniType.FLOOR) {
                //     this.#slotId = packet.readString();
                    packet.appendString(item.#slotId);
                //     this.#ignore4 = packet.readInteger();
                    packet.appendString(item.#ignore4);
                }
            }
            packets.push(packet);
        }

        return packets;
    }

    getFurniType() {
        return this.#furniType;
    }

    getId() {
        return this.#id;
    }

    getTypeId() {
        return this.#typeId;
    }

    getCategory() {
        return this.#category;
    }

    getStuff() {
        return this.#stuff;
    }

    isGroupable() {
        return this.#isGroupable;
    }

    isTradeable() {
        return this.#isTradeable;
    }

    isAllowedOnMarketplace() {
        return this.#isAllowedOnMarketplace;
    }

    getSecondsToExpiration() {
        return this.#secondsToExpiration;
    }

    hasRentPeriodStarted() {
        return this.#hasRentPeriodStarted;
    }

    getRoomId() {
        return this.#roomId;
    }

    getSlotId() {
        return this.#slotId;
    }


    setFurniType(furniType) {
        if(!(furniType === HFurniType.FLOOR || furniType === HFurniType.WALL)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#furniType = furniType;
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

    setCategory(category) {
        if(!Number.isInteger(category)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#category = category;
    }

    setStuff(stuff) {
        if(!Array.isArray(stuff)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#stuff = stuff;
    }

    setIsGroupable(isGroupable) {
        if(typeof isGroupable !== 'boolean') {
            throw new Error("Invalid argument(s) passed");
        }

        this.#isGroupable = isGroupable;
    }

    setIsTradeable(isTradeable) {
        if(typeof isTradeable !== 'boolean') {
            throw new Error("Invalid argument(s) passed");
        }

        this.#isTradeable = isTradeable;
    }

    setIsAllowedOnMarketplace(isAllowedOnMarketplace) {
        if(typeof isAllowedOnMarketplace !== 'boolean') {
            throw new Error("Invalid argument(s) passed");
        }

        this.#isAllowedOnMarketplace = isAllowedOnMarketplace;
    }

    setSecondsToExpiration(secondsToExpiration) {
        if(!Number.isInteger(secondsToExpiration)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#secondsToExpiration = secondsToExpiration;
    }

    setHasRentPeriodStarted(hasRentPeriodStarted) {
        if(typeof hasRentPeriodStarted !== 'boolean') {
            throw new Error("Invalid argument(s) passed");
        }

        this.#hasRentPeriodStarted = hasRentPeriodStarted;
    }

    setRoomId(roomId) {
        if(!Number.isInteger(roomId)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#roomId = roomId;
    }

    setSlotId(slotId) {
        if(typeof slotId !== 'string' && typeof slotId !== 'undefined') {
            throw new Error("Invalid argument(s) passed");
        }

        this.#slotId = slotId;
    }
}

/**
 * Furni type
 * @readonly
 * @enum {string}
 */
let HFurniType = {
    FLOOR: 'S',
    WALL: 'I'
}

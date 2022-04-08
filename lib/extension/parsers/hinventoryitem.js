import { HPacket } from "../../protocol/hpacket.js";
import util from "util";
import { HStuff } from "./hstuff.js";
import { HProductType } from "./hproducttype.js";
import { HSpecialType } from "./hspecialtype.js";

export class HInventoryItem {
    #itemId;
    #furniType;
    #id;
    #typeId;
    #category;
    #stuffCategory;
    #stuff;

    #isRecyclable;
    #isTradeable;
    #isGroupable;
    #isSellable;
    #secondsToExpiration;
    #isRented;
    #hasRentPeriodStarted;
    #roomId;

    #slotId;
    #extra;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HInventoryItem {\n`
            + `${indent}  itemId: ${util.inspect(this.#id, {colors: true})}\n`
            + `${HProductType.identify(this.#furniType) ? `${indent}  furniType: HProductType.\x1b[36m${HProductType.identify(this.#furniType)}\x1b[0m\n` : ''}`
            + `${indent}  id: ${util.inspect(this.#id, {colors: true})}\n`
            + `${indent}  typeId: ${util.inspect(this.#typeId, {colors: true})}\n`
            + `${indent}  category: ${util.inspect(this.#category, {colors: true})}\n`
            + `${indent}  stuffCategory: ${util.inspect(this.#stuffCategory, {colors: true})}\n`
            + `${indent}  stuff: ${util.inspect(this.#stuff, {colors: true})}\n`
            + `${indent}  isRecyclable: ${util.inspect(this.#isRecyclable, {colors: true})}\n`
            + `${indent}  isTradeable: ${util.inspect(this.#isTradeable, {colors: true})}\n`
            + `${indent}  isGroupable: ${util.inspect(this.#isGroupable, {colors: true})}\n`
            + `${indent}  isSellable: ${util.inspect(this.#isSellable, {colors: true})}\n`
            + `${indent}  secondsToExpiration: ${util.inspect(this.#secondsToExpiration, {colors: true})}\n`
            + `${indent}  isRented: ${util.inspect(this.#isRented, {colors: true})}\n`
            + `${indent}  hasRentPeriodStarted: ${util.inspect(this.#hasRentPeriodStarted, {colors: true})}\n`
            + `${indent}  roomId: ${util.inspect(this.#roomId, {colors: true})}\n`
            + `${this.#furniType === HProductType.FloorItem ? `${indent}  slotId: ${util.inspect(this.#slotId, {colors: true})}\n` : ''}`
            + `${this.#furniType === HProductType.FloorItem ? `${indent}  extra: ${util.inspect(this.#extra, {colors: true})}\n` : ''}`
            + `${indent}}`;
    }

    constructor(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HInventoryItem.constructor: packet must be an instance of HPacket");
        }

        [ this.#itemId, this.#furniType, this.#id, this.#typeId, this.#category,
          this.#stuffCategory ] = packet.read('iSiiii');

        this.#stuff = HStuff.readData(packet, this.#stuffCategory);

        [ this.#isRecyclable, this.#isTradeable, this.#isGroupable, this.#isSellable, this.#secondsToExpiration,
          this.#hasRentPeriodStarted, this.#roomId ] = packet.read('BBBBiBi');

        if(this.#furniType === HProductType.FloorItem) {
            [ this.#slotId, this.#extra ] = packet.read('Si');
        }
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HInventoryItem.appendToPacket: packet must be an instance of HPacket");
        }

        packet.append('iSiiii',
            this.#itemId,
            this.#furniType,
            this.#id,
            this.#typeId,
            this.#category,
            this.#stuffCategory);

        HStuff.appendData(packet, this.#stuffCategory, this.#stuff);

        packet.append('BBBBiBi',
            this.#isRecyclable,
            this.#isTradeable,
            this.#isGroupable,
            this.#isSellable,
            this.#secondsToExpiration,
            this.#hasRentPeriodStarted,
            this.#roomId);

        if(this.#furniType === HProductType.FloorItem) {
            packet.append('Si',
                this.#slotId || "",
                this.#extra || 0);
        }
    }

    static parse(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HInventoryItem.parse: packet must be an instance of HPacket");
        }

        let items = [];
        packet.readIndex = 14;
        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            items.push(new HInventoryItem(packet));
        }

        return items;
    }

    static constructPackets(inventoryItems, headerId) {
        if(!Array.isArray(inventoryItems)) {
            throw new Error("HInventoryItem.constructPackets: inventoryItems must be an array of HInventoryItem instances");
        }
        if(!Number.isInteger(headerId)) {
            throw new Error("HInventoryItem.constructPackets: headerId must be an integer");
        }

        let packetCount = Math.ceil(inventoryItems.length / 600);
        let packets = [];
        for(let i = 0; i < packetCount; i++) {
            let packet = new HPacket(headerId)
                .append('iii',
                    packetCount,
                    i,
                    i === packetCount - 1 && inventoryItems.length % 600 !== 0 ? inventoryItems.length % 600 : 600);

            for(let j = i * 600; j < inventoryItems.length && j < (i + 1) * 100; j++) {
                if(!(inventoryItems[j] instanceof HInventoryItem)) {
                    throw new Error("HInventoryItem.constructPackets: inventoryItems must be an array of HInventoryItem instances");
                }
                inventoryItems[j].appendToPacket(packet);
            }
            packets.push(packet);
        }

        return packets;
    }

    getFurniType() {
        console.error("\x1b[31mHInventoryItem.getFurniType(): Deprecated method used, use the getter HInventoryItem.furniType instead\x1b[0m");
        return this.#furniType;
    }

    getId() {
        console.error("\x1b[31mHInventoryItem.getId(): Deprecated method used, use the getter HInventoryItem.id instead\x1b[0m");
        return this.#id;
    }

    getTypeId() {
        console.error("\x1b[31mHInventoryItem.getTypeId(): Deprecated method used, use the getter HInventoryItem.typeId instead\x1b[0m");
        return this.#typeId;
    }

    getCategory() {
        console.error("\x1b[31mHInventoryItem.getCategory(): Deprecated method used, use the getter HInventoryItem.category instead\x1b[0m");
        return this.#stuffCategory;
    }

    getStuff() {
        console.error("\x1b[31mHInventoryItem.getStuff(): Deprecated method used, use the getter HInventoryItem.stuff instead\x1b[0m");
        return this.#stuff;
    }

    isGroupable() {
        console.error("\x1b[31mHInventoryItem.isGroupable(): Deprecated method used, use the getter HInventoryItem.isGroupable instead\x1b[0m");
        return this.#isGroupable;
    }

    isTradeable() {
        console.error("\x1b[31mHInventoryItem.isTradeable(): Deprecated method used, use the getter HInventoryItem.isTradeable instead\x1b[0m");
        return this.#isTradeable;
    }

    isAllowedOnMarketplace() {
        console.error("\x1b[31mHInventoryItem.isAllowedOnMarketplace(): Deprecated method used, use the getter HInventoryItem.isSellable instead\x1b[0m");
        return this.#isSellable;
    }

    getSecondsToExpiration() {
        console.error("\x1b[31mHInventoryItem.getSecondsToExpiration(): Deprecated method used, use the getter HInventoryItem.secondsToExpiration instead\x1b[0m");
        return this.#secondsToExpiration;
    }

    hasRentPeriodStarted() {
        console.error("\x1b[31mHInventoryItem.hasRentPeriodStarted(): Deprecated method used, use the getter HInventoryItem.hasRentPeriodStarted instead\x1b[0m");
        return this.#hasRentPeriodStarted;
    }

    getRoomId() {
        console.error("\x1b[31mHInventoryItem.getRoomId(): Deprecated method used, use the getter HInventoryItem.roomId instead\x1b[0m");
        return this.#roomId;
    }

    getSlotId() {
        console.error("\x1b[31mHInventoryItem.getSlotId(): Deprecated method used, use the getter HInventoryItem.slotId instead\x1b[0m");
        return this.#slotId;
    }


    setFurniType(furniType) {
        console.error("\x1b[31mHInventoryItem.setFurniType(): Deprecated method used, use the setter HInventoryItem.furniType = ... instead\x1b[0m");
        if(!HProductType.identify(furniType)) {
            throw new Error("HInventoryItem.setFurniType: furnitype must be a value of HProductType");
        }

        this.#furniType = furniType;
    }

    setId(id) {
        console.error("\x1b[31mHInventoryItem.setId(): Deprecated method used, use the setter HInventoryItem.id = ... instead\x1b[0m");
        if(!Number.isInteger(id)) {
            throw new Error("HInventoryItem.setId: id must be an integer");
        }

        this.#id = id;
    }

    setTypeId(typeId) {
        console.error("\x1b[31mHInventoryItem.setTypeId(): Deprecated method used, use the setter HInventoryItem.typeId = ... instead\x1b[0m");
        if(!Number.isInteger(typeId)) {
            throw new Error("HInventoryItem.setTypeId: typeId must be an integer");
        }

        this.#typeId = typeId;
    }

    setCategory(category) {
        console.error("\x1b[31mHInventoryItem.setCategory(): Deprecated method used, use the setter HInventoryItem.category = ... instead\x1b[0m");
        if(!Number.isInteger(category)) {
            throw new Error("HInventoryItem.setCategory: category must be an integer");
        }

        this.#stuffCategory = category;
    }

    setStuff(stuff) {
        console.error("\x1b[31mHInventoryItem.setStuff(): Deprecated method used, use the setter HInventoryItem.stuff = ... instead\x1b[0m");
        if(!Array.isArray(stuff)) {
            throw new Error("HInventoryItem.setStuff: stuff must be an array");
        }

        this.#stuff = stuff;
    }

    setIsGroupable(isGroupable) {
        console.error("\x1b[31mHInventoryItem.setIsGroupable(): Deprecated method used, use the setter HInventoryItem.isGroupable = ... instead\x1b[0m");
        if(typeof isGroupable !== 'boolean') {
            throw new Error("HInventoryItem.setIsGroupable: isGroupable must be a boolean");
        }

        this.#isGroupable = isGroupable;
    }

    setIsTradeable(isTradeable) {
        console.error("\x1b[31mHInventoryItem.setIsTradeable(): Deprecated method used, use the setter HInventoryItem.isTradeable = ... instead\x1b[0m");
        if(typeof isTradeable !== 'boolean') {
            throw new Error("HInventoryItem.setIsTradeable: isTradeable must be a boolean");
        }

        this.#isTradeable = isTradeable;
    }

    setIsAllowedOnMarketplace(isAllowedOnMarketplace) {
        console.error("\x1b[31mHInventoryItem.setIsAllowedOnMarketplace(): Deprecated method used, use the setter HInventoryItem.isSellable = ... instead\x1b[0m");
        if(typeof isAllowedOnMarketplace !== 'boolean') {
            throw new Error("HInventoryItem.setIsAllowedOnMarketPlace: isAllowedOnMarketplace must be a boolean");
        }

        this.#isSellable = isAllowedOnMarketplace;
    }

    setSecondsToExpiration(secondsToExpiration) {
        console.error("\x1b[31mHInventoryItem.setSecondsToExpiration(): Deprecated method used, use the setter HInventoryItem.secondsToExpiration = ... instead\x1b[0m");
        if(!Number.isInteger(secondsToExpiration)) {
            throw new Error("HInventoryItem.setSecondsToExpiration: secondsToExpiration must be an integer");
        }

        this.#secondsToExpiration = secondsToExpiration;
    }

    setHasRentPeriodStarted(hasRentPeriodStarted) {
        console.error("\x1b[31mHInventoryItem.setHasRentPeriodStarted(): Deprecated method used, use the setter HInventoryItem.hasRentPeriodStarted = ... instead\x1b[0m");
        if(typeof hasRentPeriodStarted !== 'boolean') {
            throw new Error("HInventoryItem.setHasRentPeriodStarted: hasRentPeriodStarted must be a boolean");
        }

        this.#hasRentPeriodStarted = hasRentPeriodStarted;
    }

    setRoomId(roomId) {
        console.error("\x1b[31mHInventoryItem.setRoomId(): Deprecated method used, use the setter HInventoryItem.roomId = ... instead\x1b[0m");
        if(!Number.isInteger(roomId)) {
            throw new Error("HInventoryItem.setRoomId: roomId must be an integer");
        }

        this.#roomId = roomId;
    }

    setSlotId(slotId) {
        console.error("\x1b[31mHInventoryItem.setSlotId(): Deprecated method used, use the setter HInventoryItem.slotId = ... instead\x1b[0m");
        if(typeof slotId !== 'string' && typeof slotId !== 'undefined') {
            throw new Error("HInventoryItem.setSlotId: slotId must be a string or undefined");
        }

        this.#slotId = slotId;
    }

    get itemId() {
        return this.#itemId;
    }

    set itemId(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HInventoryItem.itemId: must be an integer");
        }

        this.#itemId = val;
    }

    get furniType() {
        return this.#furniType;
    }

    set furniType(val) {
        if(!HProductType.identify(val)) {
            throw new Error("HInventoryItem.furniType: must be a value of HProductType");
        }

        this.#furniType = val;
    }

    get id() {
        return this.#id;
    }

    set id(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HInventoryItem.id: must be an integer");
        }

        this.#id = val;
    }

    get typeId() {
        return this.#typeId;
    }

    set typeId(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HInventoryItem.typeId: must be an integer");
        }

        this.#typeId = val;
    }

    get category() {
        return this.#category;
    }

    set category(val) {
        if(!HSpecialType.identify(val)) {
            throw new Error("HInventoryItem.category: must be a value of HSpecialType");
        }

        this.#category = val;
    }

    get stuffCategory() {
        return this.#stuffCategory;
    }

    set stuffCategory(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HInventoryItem.stuffCategory: must be an integer");
        }

        this.#stuffCategory = val;
    }

    get stuff() {
        return this.#stuff;
    }

    set stuff(val) {
        if(!Array.isArray(val)) {
            throw new Error("HInventoryItem.stuff: must be an array");
        }

        this.#stuff = val;
    }

    get isRecyclable() {
        return this.#isRecyclable;
    }

    set isRecyclable(val) {
        if(typeof val !== 'boolean') {
            throw new Error("HInventoryItem.isRecyclable: must be a boolean");
        }

        this.#isRecyclable = val;
    }

    get isTradeable() {
        return this.#isTradeable;
    }

    set isTradeable(val) {
        if(typeof val !== 'boolean') {
            throw new Error("HInventoryItem.isTradeable: must be a boolean");
        }

        this.#isTradeable = val;
    }

    get isGroupable() {
        return this.#isGroupable;
    }

    set isGroupable(val) {
        if(typeof val !== 'boolean') {
            throw new Error("HInventoryItem.isGroupable: must be a boolean");
        }

        this.#isGroupable = val;
    }

    get isSellable() {
        return this.#isSellable;
    }

    set isSellable(val) {
        if(typeof val !== 'boolean') {
            throw new Error("HInventoryItem.isSellable: must be a boolean");
        }

        this.#isSellable = val;
    }

    get secondsToExpiration() {
        return this.#secondsToExpiration;
    }

    set secondsToExpiration(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HInventoryItem.secondsToExpiration: must be an integer");
        }

        this.#secondsToExpiration = val;
    }

    get isRented() {
        return this.#isRented;
    }

    set isRented(val) {
        if(typeof val !== 'boolean') {
            throw new Error("HInventoryItem.isRented: must be a boolean");
        }

        this.#isRented = val;
    }

    get hasRentPeriodStarted() {
        return this.#hasRentPeriodStarted;
    }

    set hasRentPeriodStarted(val) {
        if(typeof val !== 'boolean') {
            throw new Error("HInventoryItem.hasRentPeriodStarted: must be a boolean");
        }

        this.#hasRentPeriodStarted = val;
    }

    get roomId() {
        return this.#roomId;
    }

    set roomId(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HInventoryItem.roomId: must be an integer");
        }

        this.#roomId = val;
    }

    get slotId() {
        return this.#slotId;
    }

    set slotId(val) {
        if(typeof val !== 'string' && typeof val !== 'undefined') {
            throw new Error("HInventoryItem.slotId: must be a string or undefined")
        }

        this.#slotId = val;
    }

    get extra() {
        return this.#extra;
    }

    set extra(val) {
        if(!Number.isInteger(val) && typeof val !== 'undefined') {
            throw new Error("HInventoryItem.extra: must be an integer or undefined");
        }

        this.#extra = val;
    }
}

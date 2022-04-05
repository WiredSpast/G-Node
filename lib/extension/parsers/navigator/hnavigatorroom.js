import { HPacket } from "../../../protocol/hpacket.js";
import util from "util";

export class HNavigatorRoom {
    #flatId;
    #roomName;
    #ownerId;
    #ownerName;
    #doorMode;
    #userCount;
    #maxUserCount;
    #description;
    #tradeMode;
    #score;
    #ranking;
    #categoryId;
    #tags;

    #officialRoomPicRef;

    #groupId;
    #groupName;
    #groupBadgeCode;

    #roomAdName;
    #roomAdDescription;
    #roomAdExpiresInMin;

    #showOwner;
    #allowPets;
    #displayRoomEntryAd;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HNavigatorRoom {\n`
            + `${indent}  flatId: ${util.inspect(this.#flatId, {colors: true})}\n`
            + `${indent}  roomName: ${util.inspect(this.#roomName, {colors: true})}\n`
            + `${indent}  ownerId: ${util.inspect(this.#ownerId, {colors: true})}\n`
            + `${indent}  ownerName: ${util.inspect(this.#ownerName, {colors: true})}\n`
            + `${indent}  doorMode: ${util.inspect(this.#doorMode, {colors: true})}\n`
            + `${indent}  userCount: ${util.inspect(this.#userCount, {colors: true})}\n`
            + `${indent}  maxUserCount: ${util.inspect(this.#maxUserCount, {colors: true})}\n`
            + `${indent}  description: ${util.inspect(this.#description, {colors: true})}\n`
            + `${indent}  tradeMode: ${util.inspect(this.#tradeMode, {colors: true})}\n`
            + `${indent}  score: ${util.inspect(this.#score, {colors: true})}\n`
            + `${indent}  ranking: ${util.inspect(this.#ranking, {colors: true})}\n`
            + `${indent}  categoryId: ${util.inspect(this.#categoryId, {colors: true})}\n`
            + `${indent}  tags: ${util.inspect(this.#tags, {colors: true})}\n`
            + `${this.#officialRoomPicRef !== undefined ? `${indent}  officialRoomPicRef: ${util.inspect(this.#officialRoomPicRef, {colors: true})}\n` : ''}`
            + `${this.#groupId !== undefined && this.#groupName !== undefined && this.#groupBadgeCode !== undefined ? `${indent}  groupId: ${util.inspect(this.#groupId, {colors: true})}\n` : ''}`
            + `${this.#groupId !== undefined && this.#groupName !== undefined && this.#groupBadgeCode !== undefined ? `${indent}  groupName: ${util.inspect(this.#groupName, {colors: true})}\n` : ''}`
            + `${this.#groupId !== undefined && this.#groupName !== undefined && this.#groupBadgeCode !== undefined ? `${indent}  groupBadgeCode: ${util.inspect(this.#groupBadgeCode, {colors: true})}\n` : ''}`
            + `${this.#roomAdName !== undefined && this.#roomAdDescription !== undefined && this.#roomAdExpiresInMin !== undefined ? `${indent}  roomAdName: ${util.inspect(this.#roomAdName, {colors: true})}\n` : ''}`
            + `${this.#roomAdName !== undefined && this.#roomAdDescription !== undefined && this.#roomAdExpiresInMin !== undefined ? `${indent}  roomAdDescription: ${util.inspect(this.#roomAdDescription, {colors: true})}\n` : ''}`
            + `${this.#roomAdName !== undefined && this.#roomAdDescription !== undefined && this.#roomAdExpiresInMin !== undefined ? `${indent}  roomAdExpiresInMin: ${util.inspect(this.#roomAdExpiresInMin, {colors: true})}\n` : ''}`
            + `${indent}  showOwner: ${util.inspect(this.#showOwner, {colors: true})}\n`
            + `${indent}  allowPets: ${util.inspect(this.#allowPets, {colors: true})}\n`
            + `${indent}  displayRoomEntryAd: ${util.inspect(this.#displayRoomEntryAd, {colors: true})}\n`
            + `${indent}}`;
    }

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HNavigatorRoom.constructor: packet must be an instance of HPacket");
        }

        [ this.#flatId, this.#roomName, this.#ownerId, this.#ownerName, this.#doorMode, this.#userCount,
          this.#maxUserCount, this.#description, this.#tradeMode, this.#score, this.#ranking, this.#categoryId ]
            = packet.read('iSiSiiiSiiii');

        this.#tags = packet.read('S'.repeat(packet.readInteger()));

        let multiUse = packet.readInteger();

        if ((multiUse & 1) > 0)
            this.#officialRoomPicRef = packet.readString();

        if ((multiUse & 2) > 0) {
            this.#groupId = packet.readInteger();
            this.#groupName = packet.readString();
            this.#groupBadgeCode = packet.readString();
        }

        if ((multiUse & 4) > 0) {
            this.#roomAdName = packet.readString();
            this.#roomAdDescription = packet.readString();
            this.#roomAdExpiresInMin = packet.readInteger();
        }

        this.#showOwner = (multiUse & 8) > 0;
        this.#allowPets = (multiUse & 16) > 0;
        this.#displayRoomEntryAd = (multiUse & 32) > 0;
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HNavigatorRoom.appendToPacket: packet must be an instance of HPacket");
        }

        packet.append('iSiSiiiSiiii',
            this.#flatId, this.#roomName, this.#ownerId, this.#ownerName, this.#doorMode, this.#userCount,
            this.#maxUserCount, this.#description, this.#tradeMode, this.#score, this.#ranking, this.#categoryId);

        packet.appendInt(this.#tags.length);
        packet.append('S'.repeat(this.#tags.length), ...this.#tags);

        let multiUse = 0;
        let objectsToAppend = [];
        let structureToAppend = "";

        if (this.#officialRoomPicRef !== undefined) {
            multiUse |= 1;
            objectsToAppend.push(this.#officialRoomPicRef);
            structureToAppend += "S";
        }

        if (this.#groupId !== undefined && this.#groupName !== undefined && this.#groupBadgeCode !== undefined) {
            multiUse |= 2;
            objectsToAppend.push(this.#groupId, this.#groupName, this.#groupBadgeCode);
            structureToAppend += "iSS";
        }

        if (this.#roomAdName !== undefined && this.#roomAdDescription !== undefined && this.#roomAdExpiresInMin !== undefined) {
            multiUse |= 4;
            objectsToAppend.push(this.#roomAdName, this.#roomAdDescription, this.#roomAdExpiresInMin);
            structureToAppend += "SSi"
        }

        if (this.#showOwner) multiUse |= 8;
        if (this.#allowPets) multiUse |= 16;
        if (this.#displayRoomEntryAd) multiUse |= 32;

        packet.appendInt(multiUse);
        packet.append(structureToAppend, ...objectsToAppend);
    }

    get flatId() {
        return this.#flatId;
    }

    set flatId(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HNavigatorRoom.flatId: must be an integer')
        }

        this.#flatId = val;
    }

    get roomName() {
        return this.#roomName;
    }

    set roomName(val) {
        if(typeof val != 'string') {
            throw new Error('HNavigatorRoom.roomName: must be a string');
        }

        this.#roomName = val;
    }

    get ownerId() {
        return this.#ownerId;
    }

    set ownerId(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HNavigatorRoom.ownerId: must be an integer')
        }

        this.#ownerId = val;
    }

    get ownerName() {
        return this.#ownerName;
    }

    set ownerName(val) {
        if(typeof val != 'string') {
            throw new Error('HNavigatorRoom.ownerName: must be a string');
        }

        this.#ownerName = val;
    }

    get doorMode() {
        return this.#doorMode;
    }

    set doorMode(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HNavigatorRoom.doorMode: must be an integer')
        }

        this.#doorMode = val;
    }

    get userCount() {
        return this.#userCount;
    }

    set userCount(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HNavigatorRoom.userCount: must be an integer')
        }

        this.#userCount = val;
    }

    get maxUserCount() {
        return this.#maxUserCount;
    }

    set maxUserCount(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HNavigatorRoom.maxUserCount: must be an integer')
        }

        this.#maxUserCount = val;
    }

    get description() {
        return this.#description;
    }

    set description(val) {
        if(typeof val != 'string') {
            throw new Error('HNavigatorRoom.description: must be a string');
        }

        this.#description = val;
    }

    get tradeMode() {
        return this.#tradeMode;
    }

    set tradeMode(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HNavigatorRoom.tradeMode: must be an integer')
        }

        this.#tradeMode = val;
    }

    get score() {
        return this.#score;
    }

    set score(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HNavigatorRoom.score: must be an integer')
        }

        this.#score = val;
    }

    get ranking() {
        return this.#ranking;
    }

    set ranking(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HNavigatorRoom.ranking: must be an integer')
        }

        this.#ranking = val;
    }

    get categoryId() {
        return this.#categoryId;
    }

    set categoryId(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HNavigatorRoom.categoryId: must be an integer')
        }

        this.#categoryId = val;
    }

    get tags() {
        return this.#tags;
    }

    set tags(val) {
        if(!Array.isArray(val) || val.any(v => typeof v != 'string')) {
            throw new Error('HNavigatorRoom.tags: must be an array of string')
        }

        this.#tags = val;
    }

    get officialRoomPicRef() {
        return this.#officialRoomPicRef;
    }

    set officialRoomPicRef(val) {
        if(typeof val != 'string' && val !== undefined) {
            throw new Error('HNavigatorRoom.officialRoomPicRef: must be a string or undefined');
        }

        this.#officialRoomPicRef = val;
    }

    get groupId() {
        return this.#groupId;
    }

    set groupId(val) {
        if(!Number.isInteger(val) && val !== undefined) {
            throw new Error('HNavigatorRoom.groupId: must be an integer or undefined')
        }

        this.#groupId = val;
    }

    get groupName() {
        return this.#groupName;
    }

    set groupName(val) {
        if(typeof val != 'string' && val !== undefined) {
            throw new Error('HNavigatorRoom.groupName: must be a string or undefined');
        }

        this.#groupName = val;
    }

    get groupBadgeCode() {
        return this.#groupBadgeCode;
    }

    set groupBadgeCode(val) {
        if(typeof val != 'string' && val !== undefined) {
            throw new Error('HNavigatorRoom.groupBadgeCode: must be a string or undefined');
        }

        this.#groupBadgeCode = val;
    }

    get roomAdName() {
        return this.#roomAdName;
    }

    set roomAdName(val) {
        if(typeof val != 'string' && val !== undefined) {
            throw new Error('HNavigatorRoom.roomAdName: must be a string or undefined');
        }

        this.#roomAdName = val;
    }

    get roomAdDescription() {
        return this.#roomAdDescription;
    }

    set roomAdDescription(val) {
        if(typeof val != 'string' && val !== undefined) {
            throw new Error('HNavigatorRoom.roomAdDescription: must be a string or undefined');
        }

        this.#roomAdDescription = val;
    }

    get roomAdExpiresInMin() {
        return this.#roomAdExpiresInMin;
    }

    set roomAdExpiresInMin(val) {
        if(!Number.isInteger(val) && val !== undefined) {
            throw new Error('HNavigatorRoom.roomAdExpiresInMin: must be an integer or undefined')
        }

        this.#roomAdExpiresInMin = val;
    }

    get showOwner() {
        return this.#showOwner;
    }

    set showOwner(val) {
        if(typeof val != 'boolean') {
            throw new Error('HNavigatorRoom.showOwner: must be a boolean');
        }

        this.#showOwner = val;
    }

    get allowPets() {
        return this.#allowPets;
    }

    set allowPets(val) {
        if(typeof val != 'boolean') {
            throw new Error('HNavigatorRoom.allowPets: must be a boolean');
        }

        this.#allowPets = val;
    }

    get displayRoomEntryAd() {
        return this.#displayRoomEntryAd;
    }

    set displayRoomEntryAd(val) {
        if(typeof val != 'boolean') {
            throw new Error('HNavigatorRoom.displayRoomEntryAd: must be a boolean');
        }

        this.#displayRoomEntryAd = val;
    }
}
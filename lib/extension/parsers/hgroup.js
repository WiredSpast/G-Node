import { HPacket } from "../../protocol/hpacket.js";
import util from "util";

export class HGroup {
    #id;
    #name;
    #badgeCode;
    #primaryColor;
    #secondaryColor;

    #isFavorite;
    #ownerId;
    #hasForum;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HGroup {\n`
            + `${indent}  id: ${util.inspect(this.#id, {colors: true})}\n`
            + `${indent}  name: ${util.inspect(this.#name, {colors: true})}\n`
            + `${indent}  badgeCode: ${util.inspect(this.#badgeCode, {colors: true})}\n`
            + `${indent}  primaryColor: ${util.inspect(this.#primaryColor, {colors: true})}\n`
            + `${indent}  secondaryColor: ${util.inspect(this.#secondaryColor, {colors: true})}\n`
            + `${indent}  isFavorite: ${util.inspect(this.#isFavorite, {colors: true})}\n`
            + `${indent}  ownerId: ${util.inspect(this.#ownerId, {colors: true})}\n`
            + `${indent}  hasForum: ${util.inspect(this.#hasForum, {colors: true})}\n`
            + `${indent}}`
    }

    constructor(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HGroup.constructor: packet must be an instance of HPacket");
        }

        [ this.#id, this.#name, this.#badgeCode, this.#primaryColor, this.#secondaryColor,
          this.#isFavorite, this.#ownerId, this.#hasForum ] = packet.read('iSSSSBiB');
    }

    constructPacket(headerId) {
        if(!Number.isInteger(headerId)) {
            throw new Error("HGroup.constructPacket: headerId must be an integer")
        }

        let packet = new HPacket(headerId);
        this.appendToPacket(packet);
        return packet;
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HGroup.appendToPacket: packet must be an instance of HPacket")
        }

        packet.append('iSSSSBiB',
            this.#id,
            this.#name,
            this.#badgeCode,
            this.#primaryColor,
            this.#secondaryColor,
            this.#isFavorite,
            this.#ownerId,
            this.#hasForum);
    }

    getId() {
        console.error("\x1b[31mHGroup.getId(): Deprecated method used, use the getter HGroup.id instead\x1b[0m");
        return this.#id;
    }

    get id() {
        return this.#id;
    }

    set id(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HGroup.id: must be an integer");
        }

        this.#id = val;
    }

    getName() {
        console.error("\x1b[31mHGroup.getName(): Deprecated method used, use the getter HGroup.name instead\x1b[0m");
        return this.#name;
    }

    get name() {
        return this.#name;
    }

    set name(val) {
        if(typeof val != 'string') {
            throw new Error("HGroup.name: must be a string");
        }

        this.#name = val;
    }

    getBadgeCode() {
        console.error("\x1b[31mHGroup.getBadgeCode(): Deprecated method used, use the getter HGroup.badgeCode instead\x1b[0m");
        return this.#badgeCode;
    }

    get badgeCode() {
        return this.#badgeCode;
    }

    set badgeCode(val) {
        if(typeof val != 'string') {
            throw new Error("HGroup.badgeCode: must be a string");
        }

        this.#badgeCode = val;
    }

    getPrimaryColor() {
        console.error("\x1b[31mHGroup.getPrimaryColor(): Deprecated method used, use the getter HGroup.primaryColor instead\x1b[0m");
        return this.#primaryColor;
    }

    get primaryColor() {
        return this.#primaryColor;
    }

    set primaryColor(val) {
        if(typeof val != 'string') {
            throw new Error("HGroup.primaryColor: must be a string");
        }

        this.#primaryColor = val;
    }

    getSecondaryColor() {
        console.error("\x1b[31mHGroup.getSecondaryColor(): Deprecated method used, use the getter HGroup.secondaryColor instead\x1b[0m");
        return this.#secondaryColor;
    }

    get secondaryColor() {
        return this.#secondaryColor;
    }

    set secondaryColor(val) {
        if(typeof val != 'string') {
            throw new Error("HGroup.secondaryColor: must be a string");
        }

        this.#secondaryColor = val;
    }

    isFavorite() {
        console.error("\x1b[31mHGroup.isFavorite(): Deprecated method used, use the getter HGroup.favorite instead\x1b[0m");
        return this.#isFavorite;
    }

    get isFavorite() {
        return this.#isFavorite;
    }

    set isFavorite(val) {
        if(typeof val != 'boolean') {
            throw new Error("HGroup.isFavorite: must be a boolean");
        }

        this.#isFavorite = val;
    }

    getOwnerId() {
        console.error("\x1b[31mHGroup.getOwnerId(): Deprecated method used, use the getter HGroup.ownerId instead\x1b[0m");
        return this.#ownerId;
    }

    get ownerId() {
        return this.#ownerId;
    }

    set ownerId(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HGroup.ownerId: must be an integer");
        }

        this.#ownerId = val;
    }

    hasForum() {
        console.error("\x1b[31mHGroup.hasForum(): Deprecated method used, use the getter HGroup.hasForum instead\x1b[0m");
        return this.#hasForum;
    }

    get hasForum() {
        return this.#hasForum;
    }

    set hasForum(val) {
        if(typeof val != 'boolean') {
            throw new Error("HGroup.hasForum: must be a boolean");
        }

        this.#hasForum = val;
    }
}

import { HPacket } from "../../../protocol/hpacket.js";
import { HNavigatorRoom } from "./hnavigatorroom.js";
import util from "util";

export class HNavigatorBlock {
    #searchCode;
    #text;
    #actionAllowed;
    #forceClosed;
    #viewMode;
    #rooms = [];

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HNavigatorBlock {\n`
            + `${indent}  searchCode: ${util.inspect(this.#searchCode, {colors: true})}\n`
            + `${indent}  text: ${util.inspect(this.#text, {colors: true})}\n`
            + `${indent}  actionAllowed: ${util.inspect(this.#actionAllowed, {colors: true})}\n`
            + `${indent}  forceClosed: ${util.inspect(this.#forceClosed, {colors: true})}\n`
            + `${indent}  viewMode: ${util.inspect(this.#viewMode, {colors: true})}\n`
            + `${indent}  rooms: ${util.inspect(this.#rooms, {colors: true, maxArrayLength: 0})}\n`
            + `${indent}}`;
    }

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HNavigatorBlock.constructor: packet must be an instance of HPacket");
        }

        [ this.#searchCode, this.#text, this.#actionAllowed, this.#forceClosed, this.#viewMode ]
            = packet.read('SSiBi');

        let count = packet.readInteger();
        for (let i = 0; i < count; i++)
            this.#rooms.push(new HNavigatorRoom(packet));
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HNavigatorBlock.appendToPacket: packet must be an instance of HPacket");
        }

        packet.append('SSiBi',
            this.#searchCode, this.#text, this.#actionAllowed, this.#forceClosed, this.#viewMode);

        packet.appendInt(this.#rooms.length);
        for (let room of this.#rooms) {
            room.appendToPacket(packet);
        }
    }

    get searchCode() {
        return this.#searchCode;
    }

    set searchCode(val) {
        if(typeof val != 'string') {
            throw new Error('HNavigatorBlock.searchCode: must be a string');
        }

        this.#searchCode = val;
    }

    get text () {
        return this.#text ;
    }

    set text (val) {
        if(typeof val != 'string') {
            throw new Error('HNavigatorBlock.text : must be a string');
        }

        this.#text  = val;
    }

    get actionAllowed() {
        return this.#actionAllowed;
    }

    set actionAllowed(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HNavigatorBlock.actionAllowed: must be an integer')
        }

        this.#actionAllowed = val;
    }

    get forceClosed() {
        return this.#forceClosed;
    }

    set forceClosed(val) {
        if(typeof val != 'boolean') {
            throw new Error('HNavigatorBlock.forceClosed: must be a boolean');
        }

        this.#forceClosed = val;
    }

    get viewMode() {
        return this.#viewMode;
    }

    set viewMode(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HNavigatorBlock.viewMode: must be an integer')
        }

        this.#viewMode = val;
    }

    get rooms() {
        return this.#rooms;
    }

    set rooms(val) {
        if(!Array.isArray(val) || val.any(v => !(v instanceof HNavigatorRoom))) {
            throw new Error('HNavigatorBlock.rooms: must be an array of HNavigatorRoom instances')
        }

        this.#rooms = val;
    }
}
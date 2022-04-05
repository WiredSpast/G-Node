import { HPacket } from "../../../protocol/hpacket.js";
import { HNavigatorBlock } from "./hnavigatorblock.js";
import util from "util";

export class HNavigatorSearchResult {
    #searchCode;
    #filteringData;
    #blocks = [];

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HNavigatorSearchResult {\n`
            + `${indent}  searchCode: ${util.inspect(this.#searchCode, {colors: true})}\n`
            + `${indent}  filteringData: ${util.inspect(this.#filteringData, {colors: true})}\n`
            + `${indent}  blocks: ${util.inspect(this.#blocks, {colors: true, maxArrayLength: 0})}\n`
            + `${indent}}`;
    }

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HNavigatorSearchResult.constructor: packet must be an instance of HPacket");
        }

        [ this.#searchCode, this.#filteringData ] = packet.read('SS');

        let count = packet.readInteger();
        for (let i = 0; i < count; i++)
            this.#blocks.push(new HNavigatorBlock(packet));
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HNavigatorSearchResult.appendToPacket: packet must be an instance of HPacket");
        }

        packet.append('SS',
            this.#searchCode, this.#filteringData);

        packet.appendInt(this.#blocks.length);
        for (let block of this.#blocks)
            block.appendToPacket(packet);
    }

    get searchCode() {
        return this.#searchCode;
    }

    set searchCode(val) {
        if(typeof val != 'string') {
            throw new Error('HNavigatorSearchResult.searchCode: must be a string');
        }

        this.#searchCode = val;
    }

    get filteringData() {
        return this.#filteringData;
    }

    set filteringData(val) {
        if(typeof val != 'string') {
            throw new Error('HNavigatorSearchResult.filteringData: must be a string');
        }

        this.#filteringData = val;
    }

    get blocks() {
        return this.#blocks;
    }

    set blocks(val) {
        if(!Array.isArray(val) || val.any(v => !(v instanceof HNavigatorBlock))) {
            throw new Error('HNavigatorSearchResult.blocks: must be an array of HNavigatorBlock instances')
        }

        this.#blocks = val;
    }
}
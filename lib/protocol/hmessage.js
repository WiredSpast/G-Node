import { HDirection } from "./hdirection.js";
import util from "util";
import { HPacket } from "./hpacket.js";

export class HMessage {
    #hPacket;
    #index;
    #direction;
    #isBlocked;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HMessage {\n`
            + `${indent}  getPacket(): \n${util.inspect(this.#hPacket, {colors: true, depth: depth + 2})}\n`
            + `${indent}  getIndex(): ${util.inspect(this.#index, {colors: true})}\n`
            + `${indent}  getDestination(): HDirection.\x1b[36m${HDirection.identify(this.#direction)}\x1b[0m\n`
            + `${indent}  blocked: ${util.inspect(this.#isBlocked, {colors: true})}\n`
            + `${indent}  stringify(): ${util.inspect(this.stringify(), {colors: true, maxStringLength: 50})}\n`
            + `${indent}}`;
    }

    constructor(...args) {
        if(args.length > 0) {
            if(typeof(args[0]) == 'string' || args[0] instanceof String) {
                this.#constructFromString(args[0]);
                return;
            } else if(args[0] instanceof HMessage) {
                this.#constructFromHMessage(args[0]);
                return;
            } else if(args[0] instanceof HPacket && args.length > 2 && (args[1] === HDirection.TOCLIENT || args[1] === HDirection.TOSERVER) && typeof(args[2]) == 'number') {
                this.#constructFromHPacket(args[0], args[1], args[2]);
                return;
            }
        }

        throw new Error("HMessage.constructor: Invalid constructor arguments");
    }

    #constructFromString = (str) => {
        let parts = str.split('\t');

        for(let i = 4; i < parts.length; i++) {
            parts[3] += "\t" + parts[i];
        }

        this.#isBlocked = parts[0] === "1";
        this.#index = Number(parts[1]);
        this.#direction = parts[2] === "TOCLIENT" ? HDirection.TOCLIENT : HDirection.TOSERVER;
        let p = new HPacket(new Uint8Array(0));
        p.constructFromString(parts[3]);
        this.#hPacket = p;
    }

    #constructFromHMessage = (hMessage) => {
        this.#isBlocked = hMessage.blocked;
        this.#index = hMessage.getIndex();
        this.#direction = hMessage.getDestination();
        this.#hPacket = new HPacket(hMessage.getPacket());
    }

    #constructFromHPacket = (hPacket, direction, index) => {
        this.#direction = direction;
        this.#hPacket = hPacket;
        this.#index = index;
        this.#isBlocked = false;
    }

    getIndex() {
        console.error("\x1b[31mHMessage.getIndex(): Deprecated method used, use the getter HMessage.index instead\x1b[0m");
        return this.#index;
    }

    get blocked() {
        return this.#isBlocked;
    }

    set blocked(val) {
        if(typeof(val) !== "boolean") {
            throw new Error("HMessage.blocked: must be a boolean");
        }

        this.#isBlocked = val;
    }

    setBlocked(block) {
        console.error("\x1b[31mHMessage.setBlocked(): Deprecated method used, use the getter HMessage.blocked = ... instead\x1b[0m");
        if(typeof(block) !== "boolean") {
            throw new Error("HMessage.setBlocked: block must be a boolean");
        }

        this.#isBlocked = block;
    }

    isBlocked() {
        console.error("\x1b[31mHMessage.isBlocked(): Deprecated method used, use the getter HMessage.blocked instead\x1b[0m");
        return this.#isBlocked;
    }

    getPacket() {
        return this.#hPacket;
    }

    getDestination() {
        return this.#direction;
    }

    isCorrupted() {
        return this.#hPacket.isCorrupted();
    }

    stringify() {
        return (this.#isBlocked ? "1" : "0") + "\t" + this.#index + "\t" + (this.#direction === HDirection.TOCLIENT ? "TOCLIENT" : "TOSERVER") + "\t" + this.#hPacket.stringify();
    }

    equals(message) {
        if(!(message instanceof HMessage)) return false;

        return message.#hPacket.equals(this.#hPacket) && (message.#direction === this.#direction) && (message.#index === this.#index);
    }
}

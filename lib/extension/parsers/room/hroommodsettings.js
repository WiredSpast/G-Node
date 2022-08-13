import util from "util";
import { HPacket } from "../../../protocol/hpacket.js";

export class HRoomModSettings {
    #whoCanMute;
    #whoCanKick;
    #whoCanBan;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HRoomModSettings {\n`
            + `${indent}  whoCanMute: ${util.inspect(this.#whoCanMute, {colors: true})}\n`
            + `${indent}  whoCanKick: ${util.inspect(this.#whoCanKick, {colors: true})}\n`
            + `${indent}  whoCanBan: ${util.inspect(this.#whoCanBan, {colors: true})}\n`
            + `${indent}}`
    }

    constructor(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HRoomModSettings.constructor: packet must be an instance of HPacket");
        }

        [ this.#whoCanMute, this.#whoCanKick, this.#whoCanBan ] = packet.read('iii');
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HRoomModSettings.appendToPacket: packet must be an instance of HPacket")
        }

        packet.append('iii',
            this.#whoCanMute, this.#whoCanKick, this.#whoCanBan);
    }

    get whoCanMute() {
        return this.#whoCanMute;
    }

    set whoCanMute(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HRoomModSettings.whoCanMute: must be an integer in the range of [0, 5]")
        }

        this.#whoCanMute = val;
    }

    get whoCanKick() {
        return this.#whoCanKick;
    }

    set whoCanKick(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HRoomModSettings.whoCanKick: must be an integer in the range of [0, 5]")
        }

        this.#whoCanKick = val;
    }

    get whoCanBan() {
        return this.#whoCanBan;
    }

    set whoCanBan(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HRoomModSettings.whoCanBan: must be an integer in the range of [0, 5]")
        }

        this.#whoCanBan = val;
    }
}
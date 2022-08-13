import util from "util";
import { HPacket } from "../../../protocol/hpacket.js";

export class HRoomChatSettings {
    #mode;
    #bubbleWidth;
    #scrollSpeed;
    #fullHearRange;
    #floodSensitivity;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HRoomChatSettings {\n`
            + `${indent}  mode: ${util.inspect(this.#mode, {colors: true})}\n`
            + `${indent}  bubbleWidth: ${util.inspect(this.#bubbleWidth, {colors: true})}\n`
            + `${indent}  scrollSpeed: ${util.inspect(this.#scrollSpeed, {colors: true})}\n`
            + `${indent}  fullHearRange: ${util.inspect(this.#fullHearRange, {colors: true})}\n`
            + `${indent}  floodSensitivity: ${util.inspect(this.#floodSensitivity, {colors: true})}\n`
            + `${indent}}`
    }

    constructor(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HRoomChatSettings.constructor: packet must be an instance of HPacket");
        }

        [ this.#mode, this.#bubbleWidth, this.#scrollSpeed, this.#fullHearRange, this.#floodSensitivity ]
            = packet.read('iiiii');
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HRoomModSettings.appendToPacket: packet must be an instance of HPacket")
        }

        packet.append('iiiii',
            this.#mode, this.#bubbleWidth, this.#scrollSpeed, this.#fullHearRange, this.#floodSensitivity);
    }

    get mode() {
        return this.#mode;
    }

    set mode(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HRoomChatSettings.mode: must be an integer")
        }

        this.#mode = val;
    }

    get bubbleWidth() {
        return this.#bubbleWidth;
    }

    set bubbleWidth(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HRoomChatSettings.bubbleWidth: must be an integer")
        }

        this.#bubbleWidth = val;
    }

    get scrollSpeed() {
        return this.#scrollSpeed;
    }

    set scrollSpeed(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HRoomChatSettings.scrollSpeed: must be an integer")
        }

        this.#scrollSpeed = val;
    }

    get fullHearRange() {
        return this.#fullHearRange;
    }

    set fullHearRange(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HRoomChatSettings.fullHearRange: must be an integer")
        }

        this.#fullHearRange = val;
    }

    get floodSensitivity() {
        return this.#floodSensitivity;
    }

    set floodSensitivity(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HRoomChatSettings.floodSensitivity: must be an integer")
        }

        this.#floodSensitivity = val;
    }
}
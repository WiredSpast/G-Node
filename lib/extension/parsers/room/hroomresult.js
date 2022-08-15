import { HPacket } from "../../../protocol/hpacket.js";
import util from "util";
import { HNavigatorRoom } from "../navigator/hnavigatorroom.js";
import { HRoomModSettings } from "./hroommodsettings.js";
import { HRoomChatSettings } from "./hroomchatsettings.js";

export class HRoomResult {
    #isEnterRoom;
    #data;
    #isRoomForward;
    #isStaffPick;
    #isGroupMember;
    #moderationSettings;
    #allInRoomMuted;
    #youCanMute;
    #chatSettings;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HRoomResult {\n`
            + `${indent}  isEnterRoom: ${util.inspect(this.#isEnterRoom, {colors: true})}\n`
            + `${indent}  data: ${util.inspect(this.#data, {colors: true})}\n`
            + `${indent}  isRoomForward: ${util.inspect(this.#isRoomForward, {colors: true})}\n`
            + `${indent}  isStaffPick: ${util.inspect(this.#isStaffPick, {colors: true})}\n`
            + `${indent}  isGroupMember: ${util.inspect(this.#isGroupMember, {colors: true})}\n`
            + `${indent}  moderationSettings: ${util.inspect(this.#moderationSettings, {colors: true})}\n`
            + `${indent}  allInRoomMuted: ${util.inspect(this.#allInRoomMuted, {colors: true})}\n`
            + `${indent}  youCanMute: ${util.inspect(this.#youCanMute, {colors: true})}\n`
            + `${indent}  chatSettings: ${util.inspect(this.#chatSettings, {colors: true})}\n`
            + `${indent}}`
    }

    constructor(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HRoomResult.constructor: packet must be an instance of HPacket");
        }

        this.#isEnterRoom = packet.readBoolean();
        this.#data = new HNavigatorRoom(packet);
        [ this.#isRoomForward, this.#isStaffPick, this.#isGroupMember, this.#allInRoomMuted ]
            = packet.read('BBBB');
        this.#moderationSettings = new HRoomModSettings(packet);
        this.#youCanMute = packet.readBoolean();
        this.#chatSettings = new HRoomChatSettings(packet);
    }

    constructPacket(headerId) {
        if(!Number.isInteger(headerId)) {
            throw new Error("HRoomResult.constructPacket: headerId must be an integer")
        }

        let packet = new HPacket(headerId);
        this.appendToPacket(packet);
        return packet;
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HRoomResult.appendToPacket: packet must be an instance of HPacket")
        }

        packet.appendBoolean(this.#isEnterRoom);
        this.#data.appendToPacket(packet);
        packet.append('BBBB',
            this.#isRoomForward, this.#isStaffPick, this.#isGroupMember, this.#allInRoomMuted)
        this.#moderationSettings.appendToPacket(packet);
        packet.appendBoolean(this.#youCanMute);
        this.#chatSettings.appendToPacket(packet);
    }

    get isEnterRoom() {
        return this.#isEnterRoom;
    }

    set isEnterRoom(val) {
        if(typeof val != 'boolean') {
            throw new Error("HRoomResult.isEnterRoom: must be a boolean");
        }

        this.#isEnterRoom = val;
    }

    get data() {
        return this.#data;
    }

    set data(val) {
        if(!(val instanceof HNavigatorRoom)) {
            throw new Error("HRoomResult.data: must be an instance of HNavigatorRoom");
        }

        this.#data = val;
    }

    get isRoomForward() {
        return this.#isRoomForward;
    }

    set isRoomForward(val) {
        if(typeof val != 'boolean') {
            throw new Error("HRoomResult.isRoomForward: must be a boolean");
        }

        this.#isRoomForward = val;
    }

    get isStaffPick() {
        return this.#isStaffPick;
    }

    set isStaffPick(val) {
        if(typeof val != 'boolean') {
            throw new Error("HRoomResult.isStaffPick: must be a boolean");
        }

        this.#isStaffPick = val;
    }

    get isGroupMember() {
        return this.#isGroupMember;
    }

    set isGroupMember(val) {
        if(typeof val != 'boolean') {
            throw new Error("HRoomResult.isGroupMember: must be a boolean");
        }

        this.#isGroupMember = val;
    }

    get allInRoomMuted() {
        return this.#allInRoomMuted;
    }

    set allInRoomMuted(val) {
        if(typeof val != 'boolean') {
            throw new Error("HRoomResult.allInRoomMuted: must be a boolean");
        }

        this.#allInRoomMuted = val;
    }

    get moderationSettings() {
        return this.#moderationSettings;
    }

    set moderationSettings(val) {
        if(!(val instanceof HRoomModSettings)) {
            throw new Error("HRoomResult.moderationSettings: must be an instance of HRoomModSettings");
        }

        this.#moderationSettings = val;
    }

    get youCanMute() {
        return this.#youCanMute;
    }

    set youCanMute(val) {
        if(typeof val != 'boolean') {
            throw new Error("HRoomResult.youCanMute: must be a boolean");
        }

        this.#youCanMute = val;
    }

    get chatSettings() {
        return this.#chatSettings;
    }

    set chatSettings(val) {
        if(!(val instanceof HRoomChatSettings)) {
            throw new Error("HRoomResult.chatSettings: must be an instance of HRoomChatSettings");
        }

        this.#chatSettings = val;
    }
}

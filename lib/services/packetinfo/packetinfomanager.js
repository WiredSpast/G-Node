import { HDirection } from "../../protocol/hdirection.js";
import { PacketInfo } from "./packetinfo.js";
import util from "util";

export class PacketInfoManager {
    #headerIdToMessage_incoming = new Map();
    #headerIdToMessage_outgoing = new Map();

    #hashToMessage_incoming = new Map();
    #hashToMessage_outgoing = new Map();

    #nameToMessage_incoming = new Map();
    #nameToMessage_outgoing = new Map();

    #packetInfoList = [];

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}PacketInfoManager {\n`
            + `${indent}  packetInfoList: ${util.inspect(this.#packetInfoList, {colors: true, maxArrayLength: 0})}\n`
            + `${indent}}`;
    }

    constructor(packetInfoList) {
        this.#packetInfoList = packetInfoList;
        packetInfoList.forEach(packetInfo => {
            this.#addMessage(packetInfo);
        });
    }

    #addMessage = (packetInfo) => {
        if(packetInfo.hash === null && packetInfo.name === null) return;

        let headerIdToMessage = packetInfo.destination === HDirection.TOCLIENT ? this.#headerIdToMessage_incoming : this.#headerIdToMessage_outgoing;

        let hashToMessage = packetInfo.destination === HDirection.TOCLIENT ? this.#hashToMessage_incoming : this.#hashToMessage_outgoing;

        let nameToMessage = packetInfo.destination === HDirection.TOCLIENT ? this.#nameToMessage_incoming : this.#nameToMessage_outgoing;

        if(!headerIdToMessage.has(packetInfo.headerId)) {
            headerIdToMessage.set(packetInfo.headerId, []);
        }

        headerIdToMessage.get(packetInfo.headerId).push(packetInfo);

        if(packetInfo.hash != null) {
            if(!hashToMessage.has(packetInfo.hash)) {
                hashToMessage.set(packetInfo.hash, []);
            }

            hashToMessage.get(packetInfo.hash).push(packetInfo);
        }

        if(packetInfo.name != null) {
            if(!nameToMessage.has(packetInfo.name)) {
                nameToMessage.set(packetInfo.name, []);
            }

            nameToMessage.get(packetInfo.name).push(packetInfo);
        }
    }

    getAllPacketInfoFromHeaderId(direction, headerId) {
        if(!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || !Number.isInteger(headerId)) {
            throw new Error("Invalid arguments passed")
        }

        let headerIdToMessage = direction === HDirection.TOCLIENT ? this.#headerIdToMessage_incoming : this.#headerIdToMessage_outgoing;

        return headerIdToMessage.get(headerId) === undefined ? [] : headerIdToMessage.get(headerId);
    }

    getAllPacketInfoFromHash(direction, hash) {
        if(!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || typeof(hash) !== "string") {
            throw new Error("Invalid arguments passed")
        }

        let hashToMessage = direction === HDirection.TOCLIENT ? this.#hashToMessage_incoming : this.#hashToMessage_outgoing;

        return hashToMessage.get(hash) === undefined ? [] : hashToMessage.get(hash);
    }

    getAllPacketInfoFromName(direction, name) {
        if(!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || typeof(name) !== "string") {
            throw new Error("Invalid arguments passed")
        }

        let nameToMessage = direction === HDirection.TOCLIENT ? this.#nameToMessage_incoming : this.#nameToMessage_outgoing;

        return nameToMessage.get(name) === undefined ? [] : nameToMessage.get(name);
    }

    getPacketInfoFromHeaderId(direction, headerId) {
        if(!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || !Number.isInteger(headerId)) {
            throw new Error("Invalid arguments passed")
        }

        let all = this.getAllPacketInfoFromHeaderId(direction, headerId);
        return all.length === 0 ? null : all[0];
    }

    getPacketInfoFromHash(direction, hash) {
        if(!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || typeof(hash) !== "string") {
            throw new Error("Invalid arguments passed")
        }

        let all = this.getAllPacketInfoFromHash(direction, hash);
        return all.length === 0 ? null : all[0];
    }

    getPacketInfoFromName(direction, name) {
        if(!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || typeof(name) !== "string") {
            throw new Error("Invalid arguments passed")
        }

        let all = this.getAllPacketInfoFromName(direction, name);
        return all.length === 0 ? null : all[0];
    }

    get packetInfoList() {
        return this.#packetInfoList;
    }

    getPacketInfoList() {
        console.error("\x1b[31mPacketInfoManager.getPacketInfoList(): Deprecated method used, use the getter PacketInfoManager.packetInfoList instead\x1b[0m");
        return this.#packetInfoList;
    }

    static readFromPacket(hPacket) {
        let packetInfoList = [];
        let size = hPacket.readInteger();

        for(let i = 0; i < size; i++) {
            let packetInfo = new PacketInfo(...hPacket.read('iSSSbS'))
            packetInfoList.push(packetInfo);
        }

        return new PacketInfoManager(packetInfoList);
    }
}

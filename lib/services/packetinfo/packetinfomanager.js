const {HDirection} = require("../../protocol/hdirection");
const {PacketInfo} = require("./packetinfo");
exports.PacketInfoManager = class PacketInfoManager {
    #headerIdToMessage_incoming = new Map();
    #headerIdToMessage_outgoing = new Map();

    #hashToMessage_incoming = new Map();
    #hashToMessage_outgoing = new Map();

    #nameToMessage_incoming = new Map();
    #nameToMessage_outgoing = new Map();

    #packetInfoList = [];

    constructor(packetInfoList) {
        this.#packetInfoList = packetInfoList;
        packetInfoList.forEach(packetInfo => {
            this.#addMessage(packetInfo);
        });
    }

    #addMessage(packetInfo) {
        if(packetInfo.getHash() === null && packetInfo.getName() === null) return;

        let headerIdToMessage = packetInfo.getDestination() === HDirection.TOCLIENT ? this.#headerIdToMessage_incoming : this.#headerIdToMessage_outgoing;

        let hashToMessage = packetInfo.getDestination() === HDirection.TOCLIENT ? this.#hashToMessage_incoming : this.#hashToMessage_outgoing;

        let nameToMessage = packetInfo.getDestination() === HDirection.TOCLIENT ? this.#nameToMessage_incoming : this.#nameToMessage_outgoing;

        if(!headerIdToMessage.has(packetInfo.getHeaderId())) {
            headerIdToMessage.set(packetInfo.getHeaderId(), []);
        }

        headerIdToMessage.get(packetInfo.getHeaderId()).push(packetInfo);

        if(packetInfo.getHash() != null) {
            if(!hashToMessage.has(packetInfo.getHash())) {
                hashToMessage.set(packetInfo.getHash(), []);
            }

            hashToMessage.get(packetInfo.getHash()).push(packetInfo);
        }

        if(packetInfo.getName() != null) {
            if(!nameToMessage.has(packetInfo.getName())) {
                nameToMessage.set(packetInfo.getName(), []);
            }

            nameToMessage.get(packetInfo.getName()).push(packetInfo);
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

    getPacketInfoList() {
        return this.#packetInfoList;
    }

    static readFromPacket(hPacket) {
        let packetInfoList = [];
        let size = hPacket.readInteger();

        for(let i = 0; i < size; i++) {
            let headerId = hPacket.readInteger();
            let hash = hPacket.readString();
            let name = hPacket.readString();
            let structure = hPacket.readString();
            let destination = hPacket.readBoolean() ? HDirection.TOSERVER : HDirection.TOCLIENT;
            let source = hPacket.readString();
            let packetInfo = new PacketInfo(destination, headerId, hash, name, structure, source)

            packetInfoList.push(packetInfo);
        }

        return new PacketInfoManager(packetInfoList);
    }
}

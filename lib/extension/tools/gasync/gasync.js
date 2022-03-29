import { Extension } from "../../extension.js";
import { AwaitingPacket } from "./awaitingpacket.js";
import { HDirection } from "../../../protocol/hdirection.js";

export class GAsync {
    #packetInfoManager = undefined;
    #awaitingPackets = [];

    constructor(ext) {
        if (!(ext instanceof Extension)) {
            throw new Error("GAsync.constructor: ext must be an instance of Extension");
        }
        this.#packetInfoManager = ext.getPacketInfoManager();
        ext.on('start', () => {
            this.#packetInfoManager = ext.getPacketInfoManager();
        });

        ext.interceptAll(HDirection.TOSERVER, this.#onMessageToServer.bind(this));
        ext.interceptAll(HDirection.TOCLIENT, this.#onMessageToClient.bind(this));
    }

    #onMessageToServer = (hMessage) => {
        if (this.#packetInfoManager !== undefined) {
            let info = this.#packetInfoManager.getPacketInfoFromHeaderId(HDirection.TOSERVER, hMessage.getPacket().headerId());
            if(info === null) {
                return;
            }

            this.#awaitingPackets
                .filter(p => p.direction === HDirection.TOSERVER)
                .filter(p => p.headerName === info.name)
                .filter(p => p.test(hMessage))
                .forEach(p => p.packet = hMessage.getPacket());
        }
    }

    #onMessageToClient = (hMessage) => {
        if(this.#packetInfoManager !== undefined) {
            let info = this.#packetInfoManager.getPacketInfoFromHeaderId(HDirection.TOCLIENT, hMessage.getPacket().headerId());
            if(info === null) {
                return;
            }

            this.#awaitingPackets
                .filter(p => p.direction === HDirection.TOCLIENT)
                .filter(p => p.headerName === info.name)
                .filter(p => p.test(hMessage))
                .forEach(p => p.packet = hMessage.getPacket());
        }
    }

    async awaitPacket(...packets) {
        for (let packet of packets) {
            if (!(packet instanceof AwaitingPacket)) {
                throw new Error("GAsync.awaitMultiplePackets: all packets must be an instance of AwaitingPacket");
            }
        }

        this.#awaitingPackets.push(...packets);

        return new Promise(resolve => {
            let interval = setInterval(() => {
                for (let packet of packets.filter(p => p.ready)) {
                    clearInterval(interval);
                    this.#awaitingPackets = this.#awaitingPackets.filter(p => !packets.includes(p));
                    resolve(packet.packet);
                }
            }, 1);
        });
    }

    async awaitMultiplePackets(...packets) {
        for(let packet of packets) {
            if(!(packet instanceof AwaitingPacket)) {
                throw new Error("GAsync.awaitMultiplePackets: all packets must be an instance of AwaitingPacket");
            }
        }

        this.#awaitingPackets.push(...packets);

        return new Promise(resolve => {
            let interval = setInterval(() => {
                if(!packets.map(p => p.ready).includes(false)) {
                    clearInterval(interval);
                    this.#awaitingPackets = this.#awaitingPackets.filter(p => !packets.includes(p));
                    resolve(packets.map(p => p.packet));
                }
            }, 1);
        });
    }

    clear() {
        this.#awaitingPackets = [];
    }
}
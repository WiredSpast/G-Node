import {PacketInfo} from "./packetinfo";
import {HDirection} from "../../protocol/hdirection";
import {HPacket} from "../../protocol/hpacket";

export class PacketInfoManager {
    constructor(packetInfoList: PacketInfo[]);

    getAllPacketInfoFromHeaderId(direction: HDirection, headerId: number): PacketInfo[];
    getAllPacketInfoFromHash(direction: HDirection, hash: string): PacketInfo[];
    getAllPacketInfoFromName(direction: HDirection, name: string): PacketInfo[];

    getPacketInfoFromHeaderId(direction: HDirection, headerId: number): PacketInfo | null;
    getPacketInfoFromHash(direction: HDirection, hash: string): PacketInfo | null;
    getPacketInfoFromName(direction: HDirection, name: string): PacketInfo | null;

    get packetInfoList(): PacketInfo[];

    static readFromPacket(hPacket: HPacket): PacketInfoManager;
}

import { Extension } from "../../extension";
import { AwaitingPacket } from "./awaitingpacket";
import { HPacket } from "../../../protocol/hpacket";


export class GAsync {
    constructor(ext: Extension);

    /**
     * Asynchronously await a packet
     * @param packets
     */
    awaitPacket(...packets: AwaitingPacket[]): Promise<HPacket | undefined>;

    /**
     * Asynchronously await multiple packets
     * @param packets
     */
    awaitMultiplePackets(...packets: AwaitingPacket[]): Promise<(HPacket | undefined)[]>;

    /**
     * Clear all awaiting packets
     */
    clear();
}
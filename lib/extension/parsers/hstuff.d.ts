import { HPacket } from "../../protocol/hpacket";

export class HStuff {
    /**
     * Read stuff from packet
     * @param packet Packet to read from
     * @param category Stuff category
     */
    static readData(packet: HPacket, category: number): any[];

    /**
     * Append stuff to packet
     * @param packet Packet to append to
     * @param category Stuff category
     * @param stuff Stuff to append
     */
    static appendData(packet: HPacket, category: number, stuff: any[]): void;
}
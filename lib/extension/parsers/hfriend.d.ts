import { HPacket } from "../../protocol/hpacket";

export class HFriend {
    constructor(packet: HPacket);

    /**
     * Parse all friends from packet
     * @param packet Packet to parse from
     */
    static parse(packet: HPacket): HFriend[];

    /**
     * Get id of friend
     */
    getId(): number;

    /**
     * Get name of friend
     */
    getName(): string;

    /**
     * Get figure string of friend
     */
    getFigure(): string;

    /**
     * Get motto of friend
     */
    getMotto(): string;
}

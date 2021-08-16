import { HPacket } from "../../protocol/hpacket";

export class HFriend {
    constructor(packet: HPacket);

    /**
     * Parse all friends from fragment packet
     * @param packet Packet to parse from
     */
    static parseFromFragment(packet: HPacket): HFriend[];

    /**
     * Parse all friends from update packet
     * @param packet Packet to parse from
     */
    static parseFromUpdate(packet: HPacket): HFriend[];

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

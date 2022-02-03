import { HPacket } from "../../protocol/hpacket";

export class HGroup {
    constructor(packet: HPacket);

    /**
     * Construct packet with group
     * @param headerId Header id of packet to construct
     */
    constructPacket(headerId: number): HPacket;

    /**
     * Append group to packet
     * @param packet Packet to append group to
     */
    appendToPacket(packet: HPacket): void;

    /**
     * Get group id
     */
    get id(): number;

    /**
     * Set group id
     */
    set id(val: number);

    /**
     * Get group name
     */
    getName(): string;

    /**
     * Set group name
     */
    setName(val: string);

    /**
     * Get group badge code
     */
    getBadgeCode(): string;

    /**
     * Set group badge code
     */
    setBadgeCode(val: string);

    /**
     * Get primary color
     */
    getPrimaryColor(): string;

    /**
     * Set primary color
     */
    setPrimaryColor(val: string);

    /**
     * Get secondary color
     */
    getSecondaryColor(): string;

    /**
     * Set secondary color
     */
    setSecondaryColor(val: string);

    /**
     * Is favorite group
     */
    get isFavorite(): string;

    /**
     * Set is favorite group
     */
    set isFavorite(val: string);

    /**
     * Get id of group owner
     */
    get ownerId(): number;

    /**
     * Set id of group owner
     */
    set ownerId(val: number);

    /**
     * Check if group has a forum
     */
    get hasForum(): boolean;

    /**
     * Set whether group has a forum
     */
    set hasForum(val: boolean);
}

import { HPacket } from "../../protocol/hpacket";

export class HWallItem {
    constructor(packet: HPacket);

    /**
     * Append wall item to packet
     * @param packet Packet to append to
     */
    appendToPacket(packet: HPacket): void;

    /**
     * Parse all wall items from packet
     * @param packet Packet to parse from
     */
    static parse(packet: HPacket): HWallItem[];

    /**
     * Construct packet with header id containing all wall items
     * @param wallItems Wall items to add to packet
     * @param headerId Header id for packet
     */
    static constructPacket(wallItems: HWallItem[], headerId: number): HPacket;

    /**
     * Get id of wall item
     */
    get id(): number;

    /**
     * Get type id of wall item
     */
    get typeId(): number;

    /**
     * Get usage policy of wall item
     */
    get usagePolicy(): number;

    /**
     * Get owner id of wall item
     */
    get ownerId(): number;

    /**
     * Get owner name of wall item
     */
    get ownerName(): string;

    /**
     * Get state of wall item
     */
    get state(): string;

    /**
     * Get location of wall item
     */
    get location(): string;

    /**
     * Get seconds to expiration of wall item
     */
    get secondsToExpiration(): number;


    /**
     * Set owner name of wall item
     * @param val Owner name to be set
     */
    set ownerName(val: string);

    /**
     * Set id of wall item
     * @param val Id to be set
     */
    set id(val: number);

    /**
     * Set type id of wall item
     * @param val Type id to be set
     */
    set typeId(val: number);

    /**
     * Set state of wall item
     * @param val State to be set
     */
    set state(val: string);

    /**
     * Set location of wall item
     * @param val Location to be set
     */
    set location(val: string);

    /**
     * Set usage policy of wall item
     * @param val Usage policy to be set
     */
    set usagePolicy(val: number);

    /**
     * Set seconds to expiration of wall item
     * @param val Seconds to expiration to be set
     */
    set secondsToExpiration(val: number);

    /**
     * Set owner id of wall item
     * @param val Owner id to be set
     */
    set ownerId(val: number);
}

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
    getId(): number;

    /**
     * Get type id of wall item
     */
    getTypeId(): number;

    /**
     * Get usage policy of wall item
     */
    getUsagePolicy(): number;

    /**
     * Get owner id of wall item
     */
    getOwnerId(): number;

    /**
     * Get owner name of wall item
     */
    getOwnerName(): string;

    /**
     * Get state of wall item
     */
    getState(): string;

    /**
     * Get location of wall item
     */
    getLocation(): string;

    /**
     * Get seconds to expiration of wall item
     */
    getSecondsToExpiration(): number;


    /**
     * Set owner name of wall item
     * @param ownerName Owner name to be set
     */
    setOwnerName(ownerName: string): void;

    /**
     * Set id of wall item
     * @param id Id to be set
     */
    setId(id: number): void;

    /**
     * Set type id of wall item
     * @param typeId Type id to be set
     */
    setTypeId(typeId: number): void;

    /**
     * Set state of wall item
     * @param state State to be set
     */
    setState(state: string): void;

    /**
     * Set location of wall item
     * @param location Location to be set
     */
    setLocation(location: string): void;

    /**
     * Set usage policy of wall item
     * @param usagePolicy Usage policy to be set
     */
    setUsagePolicy(usagePolicy: number): void;

    /**
     * Set seconds to expiration of wall item
     * @param secondsToExpiration Seconds to expiration to be set
     */
    setSecondsToExpiration(secondsToExpiration: number): void;

    /**
     * Set owner id of wall item
     * @parram ownerId Owner id to be set
     */
    setOwnerId(ownerId: number): void;
}

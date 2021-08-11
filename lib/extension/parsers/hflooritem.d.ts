import { HPacket } from "../../protocol/hpacket";
import { HFacing } from "./hfacing";
import { HPoint } from "./hpoint";

export class HFloorItem {
    constructor(packet: HPacket);

    /**
     * Append floor item to a packet
     * @param packet Packet to be appended to
     */
    appendToPacket(packet: HPacket): void;

    /**
     * Parse all floor items from a packet
     * @param packet Packet to parse from
     */
    static parse(packet: HPacket): HFloorItem[];

    /**
     * Construct packet with header id containing all floor items
     * @param floorItems Floor items to add to packet
     * @param headerId Header id of packet
     */
    static constructPacket(floorItems: HFloorItem[], headerId: number): HPacket;

    /**
     * Get id of floor item
     */
    getId(): number;

    /**
     * Get type id of floor item
     */
    getTypeId(): number;

    /**
     * Get usage policy of floor item
     */
    getUsagePolicy(): number;

    /**
     * Get owner id of floor item
     */
    getOwnerId(): number;

    /**
     * Get owner name of floor item
     */
    getOwnerName(): string;

    /**
     * Get seconds to expiration
     */
    getSecondsToExpiration(): number;

    /**
     * Get category of floor item
     */
    getCategory(): number;

    /**
     * Get direction in which floor item is facing
     */
    getFacing(): HFacing;

    /**
     * Get position of floor item
     */
    getTile(): HPoint;

    /**
     * Get stuff of floor item
     */
    getStuff(): any[];


    /**
     * Set owner name of floor item
     * @param ownerName Owner name to be set
     */
    setOwnerName(ownerName: String): void;

    /**
     * Set id of floor item
     * @param id Id to be set
     */
    setId(id: number): void;

    /**
     * Set type id of floor item
     * @param typeId Type id to be set
     */
    setTypeId(typeId: number): void;

    /**
     * Set position of floor item
     * @param tile Position to be set
     */
    setTile(tile: HPoint): void;

    /**
     * Set direction in which floor item is facing
     * @param facing Direction to set
     */
    setFacing(facing: HFacing): void;

    /**
     * Set category of floor item
     * @param category Category to set
     */
    setCategory(category: number): void;

    /**
     * Set seconds to expiration of floor item
     * @param secondsToExpiration Seconds to expiration to be set
     */
    setSecondsToExpiration(secondsToExpiration: number): void;

    /**
     * Set usage policy of floor item
     * @param usagePolicy Usage policy to be set
     */
    setUsagePolicy(usagePolicy: number): void;

    /**
     * Set owner id of floor item
     * @param ownerId Owner id to be set
     */
    setOwnerId(ownerId: number): void;

    /**
     * Set stuff of floor item
     * @param stuff Stuff to be set
     */
    setStuff(stuff: any[]): void;
}

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

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
    get typeId(): number;

    /**
     * Get usage policy of floor item
     */
    get usagePolicy(): number;

    /**
     * Get owner id of floor item
     */
    get ownerId(): number;

    /**
     * Get owner name of floor item
     */
    get ownerName(): string;

    /**
     * Get seconds to expiration
     */
    get secondsToExpiration(): number;

    /**
     * Get stuff category of floor item
     */
    get stuffCategory(): number;

    /**
     * Get direction in which floor item is facing
     */
    get facing(): HFacing;

    /**
     * Get position of floor item
     */
    get tile(): HPoint;

    /**
     * Get sizeZ of floor item
     */
    get sizeZ(): number;

    /**
     * Get extra of floor item
     */
    get extra(): number;

    /**
     * Get stuff of floor item
     */
    get stuff(): any[];

    /**
     * Get staticClass of floor item
     */
    get staticClass(): string | undefined;


    /**
     * Set owner name of floor item
     * @param val Owner name to be set
     */
    set ownerName(val: String);

    /**
     * Set id of floor item
     * @param val Id to be set
     */
    set id(val: number);

    /**
     * Set type id of floor item
     * @param val Type id to be set
     */
    set typeId(val: number);

    /**
     * Set position of floor item
     * @param val Position to be set
     */
    set tile(val: HPoint);

    /**
     * Set sizeZ of floor item
     * @param val Value to be set
     */
    set sizeZ(val: number);

    /**
     * Set extra of floor item
     * @param val Value to be set
     */
    set extra(val: number);

    /**
     * Set direction in which floor item is facing
     * @param val Direction to set
     */
    set facing(val: HFacing);

    /**
     * Set stuff category of floor item
     * @param val Category to set
     */
    set stuffCategory(val: number);

    /**
     * Set seconds to expiration of floor item
     * @param val Seconds to expiration to be set
     */
    set secondsToExpiration(val: number);

    /**
     * Set usage policy of floor item
     * @param val Usage policy to be set
     */
    set usagePolicy(val: number);

    /**
     * Set owner id of floor item
     * @param val Owner id to be set
     */
    set ownerId(val: number);

    /**
     * Set stuff of floor item
     * @param val Stuff to be set
     */
    set stuff(val: any[]);

    /**
     * Set static class of floor item
     * @param val Value to be set
     */
    set staticClass(val: string | undefined);
}

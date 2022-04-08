import { HPacket } from "../../protocol/hpacket";
import { HSpecialType } from "./hspecialtype";
import { HProductType } from "./hproducttype";

export class HInventoryItem {
    constructor(packet: HPacket);

    /**
     * Append inventory item to a packet
     * @param packet Packet to be appended to
     */
    appendToPacket(packet: HPacket): void;

    /**
     * Parse all inventory items from a packet
     * @param packet Packet to parse from
     */
    static parse(packet: HPacket): HInventoryItem[];

    /**
     * Construct inventory packets (600 items per max)
     * @param inventoryItems Inventory items to append to packet
     * @param headerId Header id of packet
     */
    static constructPackets(inventoryItems: HInventoryItem[], headerId: number): HPacket[];

    /**
     * Get itemId of inventory item
     */
    get itemId(): number;

    /**
     * Set itemId of inventory item
     * @param val Value to be set
     */
    set itemId(val: number);

    /**
     * Get furnitype (WALL or FLOOR) of inventory item
     */
    get furniType(): HProductType;

    /**
     * Set furnitype (WALL or FLOOR) of inventory item
     * @param val Value to be set
     */
    set furniType(val: HProductType);

    /**
     * Get id of inventory item
     */
    get id(): number;

    /**
     * Set id of inventory item
     * @param val Value to be set
     */
    set id(val: number);

    /**
     * Get type id of inventory item
     */
    get typeId(): number;

    /**
     * Set type id of inventory item
     * @param val Value to be set
     */
    set typeId(val: number);

    /**
     * Get category of inventory item
     */
    get category(): HSpecialType;

    /**
     * Set category of inventory item
     * @param val Value to be set
     */
    set category(val: HSpecialType);

    /**
     * Get stuff category of inventory item
     */
    get stuffCategory(): number;

    /**
     * Set stuff category of inventory item
     * @param val Value to be set
     */
    set stuffCategory(val: number);

    /**
     * Get stuff of inventory item
     */
    get stuff(): any[];

    /**
     * Get stuff of inventory item
     * @param val Value to be set
     */
    set stuff(val: any[]);

    /**
     * Check if inventory item is recyclable
     */
    get isRecyclable(): boolean;

    /**
     * Set whether inventory item is recyclable
     * @param val Value to be set
     */
    set isRecyclable(val: boolean);

    /**
     * Check if inventory item is tradeable
     */
    get isTradeable(): boolean;

    /**
     * Set whether inventory item is tradeable
     * @param val Value to be set
     */
    set isTradeable(val: boolean);

    /**
     * Check if inventory item is groupable
     */
    get isGroupable(): boolean;

    /**
     * Set whether inventory item is groupable
     * @param val Value to be set
     */
    set isGroupable(val: boolean);

    /**
     * Check if inventory item is sellable
     */
    get isSellable(): boolean;

    /**
     * Set whether inventory item is sellable
     * @param val Value to be set
     */
    set isSellable(val: boolean);

    /**
     * Get amount of seconds to expiration of inventory item
     */
    get secondsToExpiration(): number;

    /**
     * Set amount of seconds to expiration of inventory item
     * @param val Value to be set
     */
    set secondsToExpiration(val: number);

    /**
     * Check if inventory item is rented
     */
    get isRented(): boolean;

    /**
     * Set whether inventory item is rented
     * @param val Value to be set
     */
    set isRented(val: boolean);

    /**
     * Check if rent period of inventory item has started
     */
    get hasRentPeriodStarted(): boolean;

    /**
     * Set whether rent period of inventory item has started
     * @param val Value to be set
     */
    set hasRentPeriodStarted(val: boolean);

    /**
     * Get room id of inventory item
     */
    get roomId(): number;

    /**
     * Get room id of inventory item
     * @param val Value to be set
     */
    set roomId(val: number);

    /**
     * Get slot id of inventory item (Floor items only)
     */
    get slotId(): string | undefined;

    /**
     * Set slot id of inventory item (Floor items only)
     * @param val Value to be set
     */
    set slotId(val: string | undefined);

    /**
     * Get extra of inventory item
     */
    get extra(): number;

    /**
     * Set extra of inventory item
     * @param val Value to be set
     */
    set extra(val: number | undefined);
}

import { HPacket } from "../../protocol/hpacket";

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
     * Get furnitype (WALL or FLOOR) of inventory item
     */
    getFurniType(): HFurniType;

    /**
     * Get id of inventory item
     */
    getId(): number;

    /**
     * Get type id of inventory item
     */
    getTypeId(): number;

    /**
     * Get category of inventory item
     */
    getCategory(): number;

    /**
     * Get stuff of inventory item
     */
    getStuff(): any[];

    /**
     * Check if inventory item is groupable
     */
    isGroupable(): boolean;

    /**
     * Check if inventory item is tradeable
     */
    isTradeable(): boolean;

    /**
     * Check if inventory item is allow on marketplace
     */
    isAllowedOnMarketplace(): boolean;

    /**
     * Get amount of seconds to expiration of inventory item
     */
    getSecondsToExpiration(): number;

    /**
     * Check if rent period of inventory item has started
     */
    hasRentPeriodStarted(): boolean;

    /**
     * Get room id of inventory item
     */
    getRoomId(): number;

    /**
     * Get slot id of inventory item (Floor items only)
     */
    getSlotId(): string | undefined;


    /**
     * Set furni type of inventory item
     * @param furniType Furni type to be set
     */
    setFurniType(furniType: HFurniType): void;

    /**
     * Set id of inventory item
     * @param id Id to be set
     */
    setId(id: number): void;

    /**
     * Set type id of inventory item
     * @param typeId Type id to be set
     */
    setTypeId(typeId: number): void;

    /**
     * Set category of inventory item
     * @param category Category to be set
     */
    setCategory(category: number): void;

    /**
     * Set stuff of inventory item
     * @param stuff Stuff to be set
     */
    setStuff(stuff: any[]): void;

    /**
     * Set whether inventory item is groupable
     * @param isGroupable Boolean value to be set
     */
    setIsGroupable(isGroupable: boolean): void;

    /**
     * Set whether inventory item is tradeable
     * @param isTradeable Boolean value to be set
     */
    setIsTradeable(isTradeable: boolean): void;

    /**
     * Set whether inventory item is allowed on marketplace
     * @param isAllowedOnMarketplace Boolean value to be set
     */
    setIsAllowedOnMarketplace(isAllowedOnMarketplace: boolean): void;

    /**
     * Set seconds to expiration of inventory item
     * @param secondsToExpiration Seconds to expiration to be set
     */
    setSecondsToExpiration(secondsToExpiration: number): void;

    /**
     * Set whether rent period of inventory item has started
     * @param hasRentPeriodStarted Boolean value to be set
     */
    setHasRentPeriodStarted(hasRentPeriodStarted: number): void;

    /**
     * Set room id of inventory item
     * @param roomId Room id to be set
     */
    setRoomId(roomId: number): void;

    /**
     * Set slot id of inventory item
     * @param slotId Slot id to be set
     */
    setSlotId(slotId: string | undefined): void;
}

export enum HFurniType {
    FLOOR = 'S',
    WALL = 'I'
}

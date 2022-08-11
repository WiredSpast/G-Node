import { HPacket } from "../../../protocol/hpacket";
import { HProductType } from "../hproducttype";

export class HProduct {
    constructor(packet: HPacket);

    /**
     * Append product to a packet
     * @param packet Packet to be appended to
     */
    appendToPacket(packet: HPacket): void;

    get productType(): HProductType;
    set productType(val: HProductType);

    get furniClassId(): number;
    set furniClassId(val: number);

    get extraParam(): string;
    set extraParam(val: string);

    get productCount(): number;
    set productCount(val: number);

    get isUniqueLimitedItem(): boolean;
    set isUniqueLimitedItem(val: boolean);

    get uniqueLimitedItemSeriesSize(): number;
    set uniqueLimitedItemSeriesSize(val: number);

    get uniqueLimitedItemsLeft(): number;
    set uniqueLimitedItemsLeft(val: number);
}
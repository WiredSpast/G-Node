import { HProductType } from "../hproducttype.js";
import { HPacket } from "../../../protocol/hpacket.js";
import util from "util";

export class HProduct {
    #productType;
    #furniClassId = 0;
    #extraParam;
    #productCount = 0;
    #uniqueLimitedItem = false;
    #uniqueLimitedItemSeriesSize = 0;
    #uniqueLimitedItemsLeft = 0;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HProductType {\n`
            + `${HProductType.identify(this.#productType) ? `${indent}  productType: HProductType.\x1b[36m${HProductType.identify(this.#productType)}\x1b[0m\n` : ''}`
            + `${this.#productType !== HProductType.Badge ? `${indent}  furniClassId: ${util.inspect(this.#furniClassId, {colors: true})}\n` : ''}`
            + `${indent}  extraParam: ${util.inspect(this.#extraParam, {colors: true})}\n`
            + `${this.#productType !== HProductType.Badge ? `${indent}  productCount: ${util.inspect(this.#productCount, {colors: true})}\n` : ''}`
            + `${this.#productType !== HProductType.Badge ? `${indent}  uniqueLimitedItem: ${util.inspect(this.#uniqueLimitedItem, {colors: true})}\n` : ''}`
            + `${this.#productType !== HProductType.Badge && this.#uniqueLimitedItem ? `${indent}  uniqueLimitedItemSeriesSize: ${util.inspect(this.#uniqueLimitedItemSeriesSize, {colors: true})}\n` : ''}`
            + `${this.#productType !== HProductType.Badge && this.#uniqueLimitedItem ? `${indent}  uniqueLimitedItemsLeft: ${util.inspect(this.#uniqueLimitedItemsLeft, {colors: true})}\n` : ''}`
            + `${indent}}`;
    }

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HProduct.constructor: packet must be an instance of HPacket");
        }

        this.#productType = packet.readString().toUpperCase();
        if (this.#productType !== HProductType.Badge) {
            [ this.#furniClassId, this.#extraParam, this.#productCount, this.#uniqueLimitedItem ]
                = packet.read('iSiB');
            if (this.#uniqueLimitedItem) {
                [ this.#uniqueLimitedItemSeriesSize, this.#uniqueLimitedItemsLeft ]
                    = packet.read('ii');
            }
        } else {
            this.#extraParam = packet.readString();
        }
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HProduct.appendToPacket: packet must be an instance of HPacket");
        }

        packet.appendString(this.#productType);
        if (this.#productType !== HProductType.Badge) {
            packet.append('iSiB',
                this.#furniClassId, this.#extraParam, this.#productCount, this.#uniqueLimitedItem);
            if (this.#uniqueLimitedItem) {
                packet.append('ii',
                    this.#uniqueLimitedItemSeriesSize, this.#uniqueLimitedItemsLeft);
            }
        } else {
            packet.appendString(this.#extraParam);
        }
    }

    get productType() {
        return this.#productType;
    }

    set productType(val) {
        if(!HProductType.identify(val)) {
            throw new Error('HProduct.productType: must be a value of HProductType')
        }

        this.#productType = val;
    }

    get furniClassId() {
        return this.#furniClassId;
    }

    set furniClassId(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HProduct.furniClassId: must be an integer');
        }

        this.#furniClassId = val;
    }

    get extraParam() {
        return this.#extraParam;
    }

    set extraParam(val) {
        if(typeof val != 'string') {
            throw new Error('HProduct.extraParam: must be a string');
        }

        this.#extraParam = val;
    }

    get productCount() {
        return this.#productCount;
    }

    set productCount(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HProduct.productCount: must be an integer');
        }

        this.#productCount = val;
    }

    get isUniqueLimitedItem() {
        return this.#uniqueLimitedItem;
    }

    set isUniqueLimitedItem(val) {
        if(typeof val !== 'boolean') {
            throw new Error('HProduct.isUniqueLimitedItem: must be a boolean');
        }

        this.#uniqueLimitedItem = val;
    }

    get uniqueLimitedItemSeriesSize() {
        return this.#uniqueLimitedItemSeriesSize;
    }

    set uniqueLimitedItemSeriesSize(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HProduct.uniqueLimitedItemSeriesSize: must be an integer');
        }

        this.#uniqueLimitedItemSeriesSize = val;
    }

    get uniqueLimitedItemsLeft() {
        return this.#uniqueLimitedItemSeriesSize;
    }

    set uniqueLimitedItemsLeft(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HProduct.uniqueLimitedItemSeriesSize: must be an integer');
        }

        this.#uniqueLimitedItemSeriesSize = val;
    }
}
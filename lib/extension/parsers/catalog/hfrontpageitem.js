import { HPacket } from "../../../protocol/hpacket.js";

export class HFrontPageItem {
    #position;
    #itemName;
    #itemPromoImage;
    #type;
    #cataloguePageLocation = "";
    #productOfferId = 0;
    #productCode = "";
    #expirationTime;

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HFrontPageItem.constructor: packet must be an instance of HPacket");
        }

        [ this.#position, this.#itemName, this.#itemPromoImage, this.#type ]
            = packet.read('iSSi');

        switch (this.#type) {
            case 0:
                this.#cataloguePageLocation = packet.readString();
                break;
            case 1:
                this.#productOfferId = packet.readInteger();
                break;
            case 2:
                this.#productCode = packet.readString();
                break;
        }

        this.#expirationTime = packet.readInteger();
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HFrontPageItem.appendToPacket: packet must be an instance of HPacket");
        }

        packet.append('iSSi',
            this.#position, this.#itemName, this.#itemPromoImage, this.#type);

        switch (this.#type) {
            case 0:
                packet.appendString(this.#cataloguePageLocation);
                break;
            case 1:
                packet.appendInt(this.#productOfferId);
                this.#productOfferId = packet.readInteger();
                break;
            case 2:
                packet.appendString(this.#productCode)
                break;
        }

        packet.appendInt(this.#expirationTime);
    }
}
import { HPacket } from "../../protocol/hpacket";


export class HGroup {
    #id;
    #name;
    #badgeCode;
    #primaryColor;
    #secondaryColor;

    #isFavorite;
    #ownerId;
    #hasForum;

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("Invalid argument(s) passed");
        }

        this.#id = packet.readInteger();
        this.#name = packet.readString();
        this.#badgeCode = packet.readString();
        this.#primaryColor = packet.readString();
        this.#secondaryColor = packet.readString();

        this.#isFavorite = packet.readBoolean();
        this.#ownerId = packet.readInteger();
        this.#hasForum = packet.readBoolean();
    }

    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getBadgeCode() {
        return this.#badgeCode;
    }

    getPrimaryColor() {
        return this.#primaryColor;
    }

    getSecondaryColor() {
        return this.#secondaryColor;
    }

    isFavorite() {
        return this.#isFavorite;
    }

    getOwnerId() {
        return this.#ownerId;
    }

    hasForum() {
        return this.#hasForum;
    }
}

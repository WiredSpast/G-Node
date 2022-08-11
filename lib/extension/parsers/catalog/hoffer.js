import { HPacket } from "../../../protocol/hpacket.js";
import { HProduct } from "./hproduct.js";
import { HActivityPoint } from "./hactivitypoint.js";

export class HOffer {
    #offerId;
    #localizationId;
    #isRent;
    #priceInCredits;
    #priceInActivityPoints;
    #activityPointType;
    #isGiftable;
    #products = [];
    #clubLevel;
    #isBundlePurchaseAllowed;
    #isPet;
    #previewImage;

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HOffer.constructor: packet must be an instance of HPacket");
        }

        [ this.#offerId, this.#localizationId, this.#isRent, this.#priceInCredits,
            this.#priceInActivityPoints, this.#activityPointType, this.#isGiftable ]
            = packet.read('iSBiiiB');

        let productCount = packet.readInteger();
        for (let i = 0; i < productCount; i++) {
            this.#products.push(new HProduct(packet));
        }

        [ this.#clubLevel, this.#isBundlePurchaseAllowed, this.#isPet, this.#previewImage ]
            = packet.read('iBBS');
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HOffer.appendToPacket: packet must be an instance of HPacket");
        }

        packet.append('iSBiiiB',
            this.#offerId, this.#localizationId, this.#isRent, this.#priceInCredits,
            this.#priceInActivityPoints, this.#activityPointType, this.#isGiftable);

        packet.appendInt(this.#products.length);
        for (let product of this.#products) {
            product.appendToPacket(packet);
        }

        packet.append('iBBS',
            this.#clubLevel, this.#isBundlePurchaseAllowed, this.#isPet, this.#previewImage);
    }


    get offerId() {
        return this.#offerId;
    }

    set offerId(val) {
        if (!Number.isInteger(val)) {
            throw new Error('HOffer.offerId: must be an integer');
        }

        this.#offerId = val;
    }

    get localizationId() {
        return this.#localizationId;
    }

    set localizationId(val) {
        if (typeof val !== 'string') {
            throw new Error('HOffer.localizationId: must be a string');
        }

        this.#localizationId = val;
    }

    get isRent() {
        return this.#isRent;
    }

    set isRent(val) {
        if (typeof val !== 'boolean') {
            throw new Error('HOffer.isRent: must be a boolean');
        }

        this.#isRent = val;
    }

    get priceInCredits() {
        return this.#priceInCredits;
    }

    set priceInCredits(val) {
        if (!Number.isInteger(val)) {
            throw new Error('HOffer.priceInCredits: must be an integer');
        }

        this.#priceInCredits = val;
    }

    get priceInActivityPoints() {
        return this.#priceInActivityPoints;
    }

    set priceInActivityPoints(val) {
        if (!Number.isInteger(val)) {
            throw new Error('HOffer.priceInActivityPoints: must be an integer');
        }

        this.#priceInActivityPoints = val;
    }

    get activityPointType() {
        return this.#activityPointType;
    }

    set activityPointType(val) {
        if (!HActivityPoint.identify(val)) {
            throw new Error('HOffer.activityPointType: must be a value of HActivityPoint');
        }

        this.#activityPointType = val;
    }

    get isGiftable() {
        return this.#isGiftable;
    }

    set isGiftable(val) {
        if (typeof val !== 'boolean') {
            throw new Error('HOffer.isGiftable: must be a boolean');
        }

        this.#isGiftable = val;
    }

    get products() {
        return this.#products;
    }

    set products(val) {
        if (!Array.isArray(val) || val.any(v => !(v instanceof HProduct)))
        this.#products = val;
    }

    get clubLevel() {
        return this.#clubLevel;
    }

    set clubLevel(val) {
        if (!Number.isInteger(val)) {
            throw new Error('HOffer.clubLevel: must be an integer');
        }

        this.#clubLevel = val;
    }

    get isBundlePurchaseAllowed() {
        return this.#isBundlePurchaseAllowed;
    }

    set isBundlePurchaseAllowed(val) {
        if (typeof val !== 'boolean') {
            throw new Error('HOffer.isBundlePurchaseAllowed: must be a boolean');
        }

        this.#isBundlePurchaseAllowed = val;
    }

    get isPet() {
        return this.#isPet;
    }

    set isPet(val) {
        if (typeof val !== 'boolean') {
            throw new Error('HOffer.isPet: must be a boolean');
        }

        this.#isPet = val;
    }

    get previewImage() {
        return this.#previewImage;
    }

    set previewImage(val) {
        if (typeof val !== 'string') {
            throw new Error('HOffer.previewImage: must be a string');
        }

        this.#previewImage = val;
    }
}
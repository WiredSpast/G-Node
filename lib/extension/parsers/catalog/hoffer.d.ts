import { HPacket } from "../../../protocol/hpacket";
import { HActivityPoint } from "./hactivitypoint";
import { HProduct } from "./hproduct";

export class HOffer {
    constructor(packet: HPacket);

    appendToPacket(packet: HPacket): void;

    get offerId(): number;
    set offerId(val: number);

    get localizationId(): string;
    set localizationId(val: string);

    get isRent(): boolean;
    set isRent(val: boolean);

    get priceInCredits(): number;
    set priceInCredits(val: number);

    get priceInActivityPoints(): number;
    set priceInActivityPoints(val: number);

    get activityPointType(): HActivityPoint;
    set activityPointType(val: HActivityPoint);

    get isGiftable(): boolean;
    set isGiftable(val: boolean);

    get products(): HProduct[];
    set products(val: HProduct[]);

    get clubLevel(): number;
    set clubLevel(val: number);

    get isBundlePurchaseAllowed(): boolean;
    set isBundlePurchaseAllowed(val: boolean);

    get isPet(): boolean;
    set isPet(val: boolean);

    get previewImage(): string;
    set previewImage(val: string);
}
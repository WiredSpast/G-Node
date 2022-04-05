import { HPacket } from "../../../protocol/hpacket";

export class HNavigatorRoom {
    constructor(packet: HPacket);

    appendToPacket(packet: HPacket): void;

    get flatId(): number;
    set flatId(val: number);

    get roomName(): string;
    set roomName(val: string);

    get ownerId(): number;
    set ownerId(val: number);

    get ownerName(): string;
    set ownerName(val: string);

    get doorMode(): number;
    set doorMode(val: number);

    get userCount(): number;
    set userCount(val: number);

    get maxUserCount(): number;
    set maxUserCount(val: number);

    get description(): string;
    set description(val: string);

    get tradeMode(): number;
    set tradeMode(val: number);

    get score(): number;
    set score(val: number);

    get ranking(): number;
    set ranking(val: number);

    get categoryId(): number;
    set categoryId(val: number);

    get tags(): string[];
    set tags(val: string[]);

    get officialRoomPicRef(): string | undefined;
    set officialRoomPicRef(val: string | undefined);

    get groupId(): number | undefined;
    set groupId(val: number | undefined);

    get groupName(): string | undefined;
    set groupName(val: string | undefined);

    get groupBadgeCode(): string | undefined;
    set groupBadgeCode(val: string | undefined);

    get roomAdName(): string | undefined;
    set roomAdName(val: string | undefined);

    get roomAdDescription(): string | undefined;
    set roomAdDescription(val: string | undefined);

    get roomAdExpiresInMin(): number | undefined;
    set roomAdExpiresInMin(val: number | undefined);

    get showOwner(): boolean;
    set showOwner(val: boolean);

    get allowPets(): boolean;
    set allowPets(val: boolean);

    get displayRoomEntryAd(): boolean;
    set displayRoomEntryAd(val: boolean);
}
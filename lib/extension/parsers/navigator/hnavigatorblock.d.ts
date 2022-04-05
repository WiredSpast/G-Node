import { HPacket } from "../../../protocol/hpacket";
import { HNavigatorRoom } from "./hnavigatorroom";

export class HNavigatorBlock {
    constructor(packet: HPacket);

    appendToPacket(packet: HPacket): void;

    get searchCode(): string;
    set searchCode(val: string);

    get text(): string;
    set text(val: string);

    get actionAllowed(): number;
    set actionAllowed(val: number);

    get forceClosed(): boolean;
    set forceClosed(val: boolean);

    get viewMode(): number;
    set viewMode(val: number);

    get rooms(): HNavigatorRoom[];
    set rooms(val: HNavigatorRoom[]);
}
import { HPacket } from "../../../protocol/hpacket";
import { HNavigatorBlock } from "./hnavigatorblock";

export class HNavigatorSearchResult {
    constructor(packet: HPacket);

    appendToPacket(packet: HPacket): void;

    get searchCode(): string;

    set searchCode(val: string);

    get filteringData(): string;
    set filteringData(val: string);

    get blocks(): HNavigatorBlock[];
    set blocks(val: HNavigatorBlock[]);
}
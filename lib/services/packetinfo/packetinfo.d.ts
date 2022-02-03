import {HDirection} from "../../protocol/hdirection";

export class PacketInfo {
    constructor(destination: HDirection, headerId: number, hash: string, name: string, structure: string, source: string);

    get name(): string | null;
    get hash(): string | null;
    get headerId(): number;
    get destination(): HDirection;
    get structure(): string | null;
    get source(): string;
    toString(): string;
}

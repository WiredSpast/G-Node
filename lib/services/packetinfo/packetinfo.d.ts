import {HDirection} from "../../protocol/hdirection";

export class PacketInfo {
    constructor(headerId: number, hash: string, name: string, structure: string, destination: HDirection, source: string);

    get name(): string | null;
    get hash(): string | null;
    get headerId(): number;
    get destination(): HDirection;
    get structure(): string | null;
    get source(): string;
    toString(): string;
}

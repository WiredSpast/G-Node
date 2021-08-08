import {HDirection} from "../../protocol/hdirection";

export class PacketInfo {
    constructor(destination: HDirection, headerId: number, hash: string, name: string, structure: string, source: string);

    getName(): string;
    getHash(): string;
    getHeaderId(): number;
    getDestination(): HDirection;
    getStructure(): string;
    getSource(): string;
    toString(): string;
}

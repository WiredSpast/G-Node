import util from "util";

export class PacketInfo {
    #destination;
    #headerId;
    #hash;
    #name;
    #structure;
    #source;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}PacketInfo {\n`
            + `${indent}  destination: ${util.inspect(this.#destination, {colors: true})}\n`
            + `${indent}  headerId: ${util.inspect(this.#headerId, {colors: true})}\n`
            + `${indent}  hash: ${util.inspect(this.#hash, {colors: true})}\n`
            + `${indent}  name: ${util.inspect(this.#name, {colors: true})}\n`
            + `${indent}  structure: ${util.inspect(this.#structure, {colors: true})}\n`
            + `${indent}  source: ${util.inspect(this.#source, {colors: true})}\n`
            + `${indent}}`;
    }

    constructor(headerId, hash, name, structure, destination, source) {
        this.#destination = destination;
        this.#headerId = headerId;
        this.#hash = hash;
        this.#name = name;
        this.#structure = structure;
        this.#source = source;
    }

    get name() {
        return this.#name;
    }

    getName() {
        console.error("\x1b[31mPacketInfo.getName(): Deprecated method used, use the getter PacketInfo.name instead\x1b[0m");
        return this.#name;
    }

    get hash() {
        return this.#hash;
    }

    getHash() {
        console.error("\x1b[31mPacketInfo.getHash(): Deprecated method used, use the getter PacketInfo.hash instead\x1b[0m");
        return this.#hash;
    }

    get headerId() {
        return this.#headerId;
    }

    getHeaderId() {
        console.error("\x1b[31mPacketInfo.getHeaderId(): Deprecated method used, use the getter PacketInfo.headerId instead\x1b[0m");
        return this.#headerId;
    }

    get destination() {
        return this.#destination;
    }

    getDestination() {
        console.error("\x1b[31mPacketInfo.getDestination(): Deprecated method used, use the getter PacketInfo.destination instead\x1b[0m");
        return this.#destination;
    }

    get structure() {
        return this.#structure;
    }

    getStructure() {
        console.error("\x1b[31mPacketInfo.getStructure(): Deprecated method used, use the getter PacketInfo.structure instead\x1b[0m");
        return this.#structure;
    }

    get source() {
        return this.#source;
    }

    getSource() {
        console.error("\x1b[31mPacketInfo.getSource(): Deprecated method used, use the getter PacketInfo.source instead\x1b[0m");
        return this.#source;
    }

    toString() {
        return this.#headerId + ": [" + this.#name + "][" + this.#structure + "]";
    }
}

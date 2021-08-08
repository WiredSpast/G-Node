exports.PacketInfo = class PacketInfo {
    #destination;
    #headerId;
    #hash;
    #name;
    #structure;
    #source;

    constructor(destination, headerId, hash, name, structure, source) {
        this.#destination = destination;
        this.#headerId = headerId;
        this.#hash = hash;
        this.#name = name;
        this.#structure = structure;
        this.#source = source;
    }

    getName() {
        return this.#name;
    }

    getHash() {
        return this.#hash;
    }

    getHeaderId() {
        return this.#headerId;
    }

    getDestination() {
        return this.#destination;
    }

    getStructure() {
        return this.#structure;
    }

    getSource() {
        return this.#source;
    }

    toString() {
        return this.#headerId + ": [" + this.#name + "][" + this.#structure + "]";
    }
}

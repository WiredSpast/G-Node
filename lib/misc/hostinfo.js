import util from "util";

export class HostInfo {
    #packetlogger;
    #version;
    #attributes;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HostInfo {\n`
            + `${indent}  packetlogger: ${util.inspect(this.#packetlogger, {colors: true})}\n`
            + `${indent}  version: ${util.inspect(this.#version, {colors: true})}\n`
            + `${indent}  attributes: ${util.inspect(this.#attributes, {colors: true})}\n`
            + `${indent}}`
    }

    constructor(packetlogger, version, attributes) {
        this.#packetlogger = packetlogger;
        this.#version = version;
        this.#attributes = attributes;
    }

    static fromPacket(packet) {
        let [packetlogger, version, attributeCount] = packet.read('SSi');
        let attributes = new Map();

        for (let i = 0; i < attributeCount; i++) {
            attributes.set(...packet.read('SS'));
        }

        return new HostInfo(packetlogger, version, attributes);
    }

    get packetlogger() {
        return this.#packetlogger;
    }

    get version() {
        return this.#version;
    }

    get attributes() {
        return this.#attributes;
    }
}
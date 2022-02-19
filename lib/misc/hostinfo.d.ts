import { HPacket } from "../protocol/hpacket";

export class HostInfo {
    constructor(packetlogger: string, version: string, attributes: Map<string, string>);

    static fromPacket(packet: HPacket): HostInfo;

    get packetlogger(): string;

    get version(): string;

    get attributes(): Map<string, string>;
}
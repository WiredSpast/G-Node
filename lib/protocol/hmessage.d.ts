import { HDirection } from "./hdirection";
import { HPacket } from "./hpacket";

export class HMessage {
    constructor(fromString: String | string);
    constructor(message: HMessage);
    constructor(packet: HPacket, direction: HDirection, index: number);

    /**
     * Get the private parameter #index
     */
    getIndex(): number;

    /**
     * Change the private parameter #isBlocked
     * @param block Boolean value to be set to private parameter #isBlocked
     */
    setBlocked(block: boolean): void;

    /**
     * Get the private parameter #isBlocked
     */
    isBlocked(): boolean;

    /**
     * Get the private parameter #hPacket
     */
    getPacket(): HPacket;

    /**
     * Get the private parameter #direction
     */
    getDestination(): HDirection;

    /**
     * Returns whether private #hPacket is corrupted
     */
    isCorrupted(): boolean;

    /**
     * Convert the message to a string
     */
    stringify(): string;

    /**
     * Compare other hMessage to hMessage (compares packet, direction and index)
     * @param message hMessage to compare with current hMessage
     */
    equals(message: HMessage): boolean;
}

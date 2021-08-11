import { HPacket } from "../../protocol/hpacket";

export class HGroup {
    constructor(packet: HPacket);

    /**
     * Get group id
     */
    getId(): number;

    /**
     * Get group name
     */
    getName(): string;

    /**
     * Get group badge code
     */
    getBadgeCode(): string;

    /**
     * Get primary color
     */
    getPrimaryColor(): string;

    /**
     * Get secondary color
     */
    getSecondaryColor(): string;

    /**
     * Is favorite group
     */
    isFavorite(): string;

    /**
     * Get id of group owner
     */
    getOwnerId(): number;

    /**
     * Check if group has a forum
     */
    hasForum(): boolean;
}

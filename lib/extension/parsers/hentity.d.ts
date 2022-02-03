import { HPacket } from "../../protocol/hpacket";
import { HPoint } from "./hpoint";
import { HEntityType } from "./hentitytype";
import { HGender } from "./hgender";
import { HEntityUpdate } from "./hentityupdate";

export class HEntity {
    constructor(packet: HPacket);

    /**
     * Parse all HEntities from packet
     * @param packet
     */
    static parse(packet: HPacket): HEntity[];

    /**
     * Append entity to a packet
     * @param packet Packet to be appended to
     */
    appendToPacket(packet: HPacket): void;

    /**
     * Construct packet with header id containing all entities
     * @param entities Entities to add to packet
     * @param headerId Header id of packet
     */
    static constructPacket(entities: HEntity[], headerId: number): HPacket;

    /**
     * Try performing an entity update on entity
     * @param update entity update to try
     */
    tryUpdate(update: HEntityUpdate): boolean;

    /**
     * Get id from entity
     */
    get id(): number;

    /**
     * Set id from entity
     */
    set id(val: number);

    /**
     * Get entity index in room
     */
    get index(): number;

    /**
     * Set entity index in room
     */
    set index(val: number);

    /**
     * Get entity position in room
     */
    get tile(): HPoint;

    /**
     * Set entity position in room
     */
    set tile(val: HPoint);

    /**
     * Get entity name
     */
    get name(): string;

    /**
     * Set entity name
     */
    set name(val: string);

    /**
     * Get entity motto
     */
    get motto(): string;

    /**
     * Set entity motto
     */
    set motto(val: string);

    /**
     * Get entity gender
     */
    get gender(): HGender | null;

    /**
     * Set entity gender
     */
    set gender(val: HGender | null);

    /**
     * Get entity type
     */
    get entityType(): HEntityType;

    /**
     * Set entity type
     */
    set entityType(val: HEntityType);

    /**
     * Get figure
     */
    get figureId(): string;

    /**
     * Set figure
     */
    set figureId(val: string);

    /**
     * Get favorite group
     */
    get favoriteGroup(): string | null;

    /**
     * Set favorite group
     */
    set favoriteGroup(val: string | null);

    /**
     * Get last entity update
     */
    get lastUpdate(): HEntityUpdate | null;

    /**
     * Set last entity update
     */
    set lastUpdate(val: HEntityUpdate | null);

    /**
     * Get stuff
     */
    get stuff(): any[];

    /**
     * Set stuff
     */
    set stuff(val: any[]);
}



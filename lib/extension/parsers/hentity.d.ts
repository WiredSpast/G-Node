import { HPacket } from "../../protocol/hpacket";
import { HPoint } from "./hpoint";
import { HFacing } from "./hfacing";

export class HEntity {
    constructor(packet: HPacket);

    /**
     * Parse all HEntities from packet
     * @param packet
     */
    static parse(packet: HPacket): HEntity[];

    /**
     * Try performing an entity update on entity
     * @param update entity update to try
     */
    tryUpdate(update: HEntityUpdate): boolean;

    /**
     * Get id from entity
     */
    getId(): number;

    /**
     * Get entity index in room
     */
    getIndex(): number;

    /**
     * Get entity position in room
     */
    getTile(): HPoint;

    /**
     * Get entity name
     */
    getName(): string;

    /**
     * Get entity motto
     */
    getMotto(): string;

    /**
     * Get entity gender
     */
    getGender(): HGender;

    /**
     * Get entity type
     */
    getEntityType(): HEntityType;

    /**
     * Get figure
     */
    getFigureId(): string;

    /**
     * Get favorite group
     */
    getFavoriteGroup(): string;

    /**
     * Get last entity update
     */
    getLastUpdate(): HEntityUpdate;

    /**
     * Get stuff
     */
    getStuff(): any[];
}

export class HEntityUpdate {
    constructor(packet: HPacket);

    /**
     * Parse all HEntityUpdates from packet
     * @param packet Packet to parse
     */
    static parse(packet: HPacket): HEntityUpdate[];
    /**
     * Get user index of update
     */
    getIndex(): number;
    /**
     * Check is user has room rights
     */
    isController(): boolean;
    /**
     * Get current tile position of entity
     */
    getTile(): HPoint;
    /**
     * Get tile position where entity is moving towards
     */
    getMovingTo(): HPoint;
    /**
     * Get sign entity is holding
     */
    getSign(): HSign;
    /**
     * Get stance of entity
     */
    getStance(): HStance;
    /**
     * Get action that entity is doing
     */
    getAction(): HAction;
    /**
     * Get direction in which the entity's head is facing
     */
    getHeadFacing(): HFacing;
    /**
     * Get direction in which the entity's body is facing
     */
    getBodyFacing(): HFacing;
}

export enum HEntityType {
    HABBO = 1,
    PET,
    OLD_BOT,
    BOT
}

export enum HGender {
    Unisex = 'U',
    Male = 'M',
    Female = 'F'
}

export enum HSign {
    Zero,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Heart,
    Skull,
    Exclamation,
    Soccerball,
    Smiley,
    Redcard,
    Yellowcard,
    Invisible
}

export enum HStance {
    Stand,
    Sit,
    Lay
}

export enum HAction {
    None,
    Move,
    Sit,
    Lay,
    Sign
}

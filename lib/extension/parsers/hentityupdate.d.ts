import { HPacket } from "../../protocol/hpacket";
import { HPoint } from "./hpoint";
import { HSign } from "./hsign";
import { HStance } from "./hstance";
import { HAction } from "./haction";
import { HFacing } from "./hfacing";

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
    get index(): number;

    /**
     * Set user index of update
     */
    set index(val: number);

    /**
     * Check is user has room rights
     */
    get isController(): boolean;

    /**
     * Set if user has room rights
     */
    set isController(val: boolean);

    /**
     * Get current tile position of entity
     */
    get tile(): HPoint;

    /**
     * Set current tile position of entity
     */
    set tile(val: HPoint);

    /**
     * Get tile position where entity is moving towards
     */
    get movingTo(): HPoint | null;

    /**
     * Set tile position where entity is moving towards
     */
    set movingTo(val: HPoint | null);

    /**
     * Get sign entity is holding
     */
    get sign(): HSign | null;

    /**
     * Set sign entity is holding
     */
    set sign(val: HSign | null);

    /**
     * Get stance of entity
     */
    get stance(): HStance | null;

    /**
     * Set stance of entity
     */
    set stance(val: HStance | null);

    /**
     * Get action that entity is doing
     */
    get action(): HAction | null;

    /**
     * Set action that entity is doing
     */
    set action(val: HAction | null);

    /**
     * Get direction in which the entity's head is facing
     */
    get headFacing(): HFacing;

    /**
     * Set direction in which the entity's head is facing
     */
    set headFacing(val: HFacing);

    /**
     * Get direction in which the entity's body is facing
     */
    get bodyFacing(): HFacing;

    /**
     * Set direction in which the entity's body is facing
     */
    set bodyFacing(val: HFacing);
}

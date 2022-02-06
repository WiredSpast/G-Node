import { HPacket } from "../../protocol/hpacket";
import { HGroup } from "./hgroup";

export class HUserProfile {
    constructor(packet: HPacket);

    /**
     * Construct a packet containing the user profile
     * @param headerId Header id to assign to created packet
     */
    constructPacket(headerId: number): HPacket;

    /**
     * Get user id
     */
    get id(): number;

    /**
     * Set user id
     * @param val Value to be set
     */
    set id(val: number);

    /**
     * Get username
     */
    get username(): string;

    /**
     * Set username
     */
    set username(val: string);

    /**
     * Get user motto
     */
    get motto(): string;

    /**
     * Set user motto
     */
    set motto(val: string);

    /**
     * Get user figure string
     */
    get figure(): string;

    /**
     * Set user figure string
     */
    set figure(val: string);

    /**
     * Get creation date of account
     */
    get creationDate(): string;

    /**
     * Set creation date of account
     */
    set creationDate(val: string);

    /**
     * Get achievement score
     */
    get achievementsScore(): number;

    /**
     * Set achievement score
     */
    set achievementsScore(val: number);

    /**
     * Get friend count
     */
    get friendCount(): number;

    /**
     * Set friend count
     */
    set friendCount(val: number);

    /**
     * Is friend of user
     */
    get isFriend(): boolean;

    /**
     * Set whether you are shown as friend of user
     */
    set isFriend(val: boolean);

    /**
     * Friend request has been send out
     */
    get isRequestedFriend(): boolean;

    /**
     * Set whether friend request has been send out
     */
    set isRequestedFriend(val: boolean);

    /**
     * Is user online
     */
    get isOnline(): boolean;

    /**
     * Set whether user appears as online
     */
    set isOnline(val: boolean);

    /**
     * Get all groups from user
     */
    get groups(): HGroup[];

    /**
     * Set all groups from user
     */
    set groups(val: HGroup[]);

    /**
     * Check when user was last online
     */
    get lastAccessSince(): number;

    /**
     * Set when user was last online
     */
    set lastAccessSince(val: number);

    /**
     * Check if profile is public
     */
    get openProfile(): boolean;

    /**
     * Set if profile is public
     */
    set openProfile(val: boolean);
}

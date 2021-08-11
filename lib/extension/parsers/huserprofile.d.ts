import { HPacket } from "../../protocol/hpacket";
import { HGroup } from "./hgroup";

export class HUserProfile {
    constructor(packet: HPacket);

    /**
     * Get user id
     */
    getId(): number;

    /**
     * Get username
     */
    getUsername(): string;

    /**
     * Get user motto
     */
    getMotto(): string;

    /**
     * Get user figure string
     */
    getFigure(): string;

    /**
     * Get creation date of account
     */
    getCreationData(): string;

    /**
     * Get achievement score
     */
    getAchievementsScore(): number;

    /**
     * Get friend count
     */
    getFriendCount(): number;

    /**
     * Is friend of user
     */
    isFriend(): boolean;

    /**
     * Friend request has been send out
     */
    isRequestedFriend(): boolean;

    /**
     * Is user online
     */
    isOnline(): boolean;

    /**
     * Get all groups from user
     */
    getGroups(): HGroup[];

    /**
     * Check when user was last online
     */
    getLastAccessSince(): number;

    /**
     * Check if profile is public
     */
    isOpenProfile(): boolean;
}

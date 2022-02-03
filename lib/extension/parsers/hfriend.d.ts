import { HPacket } from "../../protocol/hpacket";
import { HGender } from "./hgender";
import { HRelationshipStatus } from "./hrelationshipstatus";

export class HFriend {
    constructor(packet: HPacket);

    /**
     * Parse all friends from fragment packet
     * @param packet Packet to parse from
     */
    static parseFromFragment(packet: HPacket): HFriend[];

    /**
     * Parse all friends from update packet
     * @param packet Packet to parse from
     */
    static parseFromUpdate(packet: HPacket): HFriend[];

    /**
     * Construct fragment packets from friends with headerId
     * @param friends Array of friends
     * @param headerId HeaderId to assign to packet
     */
    static constructFragmentPackets(friends, headerId): HPacket[];

    /**
     * Construct update packet from friends with headerId
     * @param friends Array of friends
     * @param headerId HeaderId to assign to packet
     */
    static constructUpdatePacket(friends, headerId): HPacket;

    /**
     * Append friend to packet
     * @param packet Packet to append to
     */
    appendToPacket(packet: HPacket): void;

    /**
     * Get removed friend ids from update packet
     * @param packet Packet to parse from
     */
    static getRemovedFriendIdsFromUpdate(packet: HPacket): number[];

    /**
     * Get categories from update packet
     * @param packet Packet to parse from
     */
    static getCategoriesFromUpdate(packet: HPacket): Map<number, string>;

    /**
     * Get id of friend
     */
    get id(): number;

    /**
     * Set id of friend
     */
    set id(val: number);

    /**
     * Get name of friend
     */
    get name(): string;

    /**
     * Set name of friend
     */
    set name(val: string);

    /**
     * Get gender of friend
     */
    get gender(): HGender;

    /**
     * Set gender of friend
     */
    set gender(val: HGender);

    /**
     * Get online status of friend
     */
    get online(): boolean;

    /**
     * Set online status of friend
     */
    set online(val: boolean);

    /**
     * Get whether following is allowed for friend
     */
    get followingAllowed(): boolean;

    /**
     * Set whether following is allowed for friend
     */
    set followingAllowed(val: boolean);

    /**
     * Get figure string of friend
     */
    get figure(): string;

    /**
     * Set figure string of friend
     */
    set figure(val: string);

    /**
     * Get category id of friend
     */
    get categoryId(): number;

    /**
     * Set category id of friend
     */
    set categoryId(val: number);

    /**
     * Get category name of friend
     */
    get categoryName(): string;

    /**
     * Set category name of friend
     */
    set categoryName(val: string);

    /**
     * Get motto of friend
     */
    get motto(): string;

    /**
     * Set motto of friend
     */
    set motto(val: string);

    /**
     * Get real name of friend
     */
    get realName(): string;

    /**
     * Set real name of friend
     */
    set realName(val: string);

    /**
     * Get facebook id of friend
     */
    get facebookId(): string;

    /**
     * Set facebook id of friend
     */
    set facebookId(val: string);

    /**
     * Get persisted message user of friend
     */
    get persistedMessageUser(): boolean;

    /**
     * Set persisted message user of friend
     */
    set persistedMessageUser(val: boolean);

    /**
     * Get whether friend is a vip member
     */
    get vipMember(): boolean;

    /**
     * Set whether friend is a vip member
     */
    set vipMember(val: boolean);

    /**
     * Get whether friend is a pocket Habbo user
     */
    get pocketHabboUser(): boolean;

    /**
     * Set whether friend is a pocket Habbo user
     */
    set pocketHabboUser(val: boolean);

    /**
     * Get relationship status of friend
     */
    get relationshipStatus(): HRelationshipStatus;

    /**
     * Set relationship status of friend
     */
    set relationshipStatus(val: HRelationshipStatus);
}

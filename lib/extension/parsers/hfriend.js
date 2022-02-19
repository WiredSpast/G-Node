import { HPacket } from "../../protocol/hpacket.js";
import util from "util";
import { HGender } from "./hgender.js";
import { HRelationshipStatus } from "./hrelationshipstatus.js";

export class HFriend {
    #categories;

    #id;
    #name;
    #gender;
    #online;
    #followingAllowed;
    #figure;
    #categoryId;
    #categoryName;
    #motto;
    #realName;
    #facebookId;
    #persistedMessageUser;
    #vipMember;
    #pocketHabboUser;
    #relationshipStatus;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HFriend {\n`
            + `${indent}  id: ${util.inspect(this.#id, {colors: true})}\n`
            + `${indent}  name: ${util.inspect(this.#name, {colors: true})}\n`
            + `${HGender.identify(this.#gender) ? `${indent}  facing: HGender.\x1b[36m${HGender.identify(this.#gender)}\x1b[0m\n` : ''}`
            + `${indent}  online: ${util.inspect(this.#online, {colors: true})}\n`
            + `${indent}  followingAllowed: ${util.inspect(this.#followingAllowed, {colors: true})}\n`
            + `${indent}  figure: ${util.inspect(this.#figure, {colors: true})}\n`
            + `${indent}  categoryId: ${util.inspect(this.#categoryId, {colors: true})}\n`
            + `${this.#categoryName ? `${indent}  categoryName: ${util.inspect(this.#categoryName, {colors: true})}\n` : ''}`
            + `${indent}  motto: ${util.inspect(this.#motto, {colors: true})}\n`
            + `${indent}  realName: ${util.inspect(this.#realName, {colors: true})}\n`
            + `${indent}  facebookId: ${util.inspect(this.#facebookId, {colors: true})}\n`
            + `${indent}  persistedMessageUser: ${util.inspect(this.#persistedMessageUser, {colors: true})}\n`
            + `${indent}  vipMember: ${util.inspect(this.#vipMember, {colors: true})}\n`
            + `${indent}  pocketHabboUser: ${util.inspect(this.#pocketHabboUser, {colors: true})}\n`
            + `${HRelationshipStatus.identify(this.#relationshipStatus) ? `${indent}  facing: HRelationshipStatus.\x1b[36m${HRelationshipStatus.identify(this.#relationshipStatus)}\x1b[0m\n` : ''}`
            + `${indent}}`
    }

    constructor(packet, categories = new Map()) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HFriend.constructor: packet must be an instance of HPacket");
        }

        if(!(categories instanceof Map)) {
            throw new Error("HFriend.constructor: categories must be an instance of Map");
        }

        this.#categories = categories;

        let genderIdentifier;
        [ this.#id, this.#name, genderIdentifier, this.#online, this.#followingAllowed, this.#figure,
          this.#categoryId, this.#motto, this.#realName, this.#facebookId, this.#persistedMessageUser,
          this.#vipMember, this.#pocketHabboUser, this.#relationshipStatus ] = packet.read('iSiBBSiSSSBBBs');

        this.#gender = genderIdentifier === 0 ? HGender.Female : HGender.Male;
        this.#categoryName = categories.get(this.#categoryId);
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HFriend.appendToPacket: packet must be an instance of HPacket");
        }

        packet.append('iSiBBSiSSSBBBs',
            this.#id,
            this.#name,
            this.#gender === HGender.Female ? 0 : 1,
            this.#online,
            this.#followingAllowed,
            this.#figure,
            this.#categoryId,
            this.#motto,
            this.#realName,
            this.#facebookId,
            this.#persistedMessageUser,
            this.#vipMember,
            this.#pocketHabboUser,
            this.#relationshipStatus);
    }

    static parseFromFragment(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HFriend.parseFromFragment: packet must be an instance of HPacket");
        }

        packet.resetReadIndex();
        let friends = [];
        let vars = packet.read('iii');
        for(let i = 0; i < vars[2]; i++) {
            friends.push(new HFriend(packet));
        }
        return friends;
    }

    static constructFragmentPackets(friends, headerId) {
        if(!Number.isInteger(headerId)) {
            throw new Error("HFriend.constructFragmentPacket: headerId must be an integer");
        }
        if(!Array.isArray(friends)) {
            throw new Error("HFriend.constructFragmentPacket: friends must be an array of HFriend instances")
        }

        let packetCount = Math.ceil(friends.length / 100);
        let packets = [];

        for(let i = 0; i < packetCount; i++) {
            let packet = new HPacket(headerId)
                .append('iii',
                    packetCount,
                    i,
                    i === packetCount - 1 && friends.length % 100 !== 0 ? friends.length % 100 : 100);

            for(let j = i * 100; j < friends.length && j < (i + 1) * 100; j++) {
                if(!(friends[j] instanceof HFriend)) {
                    throw new Error("HFriend.constructFragmentPacket: friends must be an array of HFriend instances")
                }

                friends[j].appendToPacket(packet)
            }

            packets.push(packet);
        }

        return packets;
    }

    static parseFromUpdate(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HFriend.parseFromUpdate: packet must be an instance of HPacket");
        }

        packet.resetReadIndex();
        let categories = new Map();
        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            categories.set(...packet.read('iS'));
        }
        n = packet.readInteger();
        let friends = [];
        for (let i = 0; i < n; i++) {
            if(packet.readInteger() !== -1) {
                friends.push(new HFriend(packet, categories));
            } else {
                packet.readInteger();
            }
        }
        return friends;
    }

    static getRemovedFriendIdsFromUpdate(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HFriend.getRemovedFriendIdsFromUpdate: packet must be an instance of HPacket");
        }

        packet.resetReadIndex();
        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            packet.read('iS');
        }

        n = packet.readInteger();
        let removedIds = [];
        for(let i = 0; i < n; i++) {
            if(packet.readInteger() !== -1) {
                new HFriend(packet);
            } else {
                removedIds.push(packet.readInteger());
            }
        }

        return removedIds;
    }

    static getCategoriesFromUpdate(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HFriend.getCategoriesFromUpdate: packet must be an instance of HPacket");
        }

        packet.resetReadIndex();
        let n = packet.readInteger();
        let categories = new Map();
        for(let i = 0; i < n; i++) {
            categories.set(packet.readInteger(), packet.readString());
        }

        return categories;
    }

    static constructUpdatePacket(friends, headerId) {
        if(!Number.isInteger(headerId)) {
            throw new Error("HFriend.constructUpdatePacket: headerId must be an integer");
        }
        if(!Array.isArray(friends)) {
            throw new Error("HFriend.constructUpdatePacket: friends must be an array of HFriend instances")
        }

        let categories = new Map();
        for(let friend of friends) {
            if(!(friend instanceof HFriend)) {
                throw new Error("HFriend.constructUpdatePacket: friends must be an array of HFriend instances")
            }

            categories = new Map([...categories, ...friend.#categories]);

            if(friend.categoryName) {
                categories.set(friend.categoryId, friend.categoryName);
            }
        }

        let packet = new HPacket(headerId)
            .appendInt(categories.size);
        for(let category of [...categories]) {
            packet.append('iS', ...category);
        }

        packet.appendInt(friends.length);
        for(let friend of friends) {
            friend.appendToPacket(packet);
        }

        return packet;
    }

    getId() {
        console.error("\x1b[31mHFriend.getId(): Deprecated method used, use the getter HFriend.id instead\x1b[0m");
        return this.#id;
    }

    get id() {
        return this.#id;
    }

    set id(val) {
        if(!Number.isInteger(val)) {
            throw new Error("HFriend.id: must be an integer");
        }

        this.#id = val;
    }

    getName() {
        console.error("\x1b[31mHFriend.getName(): Deprecated method used, use the getter HFriend.name instead\x1b[0m");
        return this.#name;
    }

    get name() {
        return this.#name;
    }

    set name(val) {
        if(typeof val != 'string') {
            throw new Error("HFriend.name: must be a string");
        }

        this.#name = val;
    }

    get gender() {
        return this.#gender;
    }

    set gender(val) {
        if(!HGender.identify(val)) {
            throw new Error("HFriend.gender: must be a value of HGender")
        }

        this.#gender = val;
    }

    get online() {
        return this.#online;
    }

    set online(val) {
        if(typeof val !== 'boolean') {
            throw new Error("HFriend.online: must be a boolean")
        }

        this.#online = val;
    }

    get followingAllowed() {
        return this.#followingAllowed;
    }

    set followingAllowed(val) {
        if(typeof val !== 'boolean') {
            throw new Error("HFriend.followingAllowed: must be a boolean")
        }

        this.#followingAllowed = val;
    }

    getFigure() {
        return this.#figure;
    }

    get figure() {
        return this.#figure;
    }

    set figure(val) {
        if(typeof val != 'string') {
            throw new Error("HFriend.figure: must be a string");
        }

        this.#figure = val;
    }

    get categoryId() {
        return this.#categoryId;
    }

    set categoryId(val) {
        if(!Number.isInteger()) {
            throw new Error("HFriend.categoryId: must be an integer");
        }

        this.#categoryId = val;
    }

    get categoryName() {
        return this.#categoryName;
    }

    set categoryName(val) {
        if(typeof val != 'string') {
            throw new Error("HFriend.categoryName: must be a string");
        }

        this.#categoryName = val;
    }

    getMotto() {
        console.error("\x1b[31mHFriend.getMotto(): Deprecated method used, use the getter HFriend.motto instead\x1b[0m");
        return this.#motto;
    }

    get motto() {
        return this.#motto;
    }

    set motto(val) {
        if(typeof val != 'string') {
            throw new Error("HFriend.motto: must be a string");
        }

        this.#motto = val;
    }

    get realName() {
        return this.#realName;
    }

    set realName(val) {
        if(typeof val != 'string') {
            throw new Error("HFriend.realName: must be a string");
        }

        this.#realName = val;
    }

    get facebookId() {
        return this.#facebookId;
    }

    set facebookId(val) {
        if(typeof val != 'string') {
            throw new Error("HFriend.facebookId: must be a string");
        }

        this.#facebookId = val;
    }

    get persistedMessageUser() {
        return this.#persistedMessageUser;
    }

    set persistedMessageUser(val) {
        if(typeof val != 'boolean') {
            throw new Error("HFriend.persistedMessageUser: must be a boolean");
        }

        this.#persistedMessageUser = val;
    }

    get vipMember() {
        return this.#vipMember;
    }

    set vipMember(val) {
        if(typeof val != 'boolean') {
            throw new Error("HFriend.vipMember: must be a boolean");
        }

        this.#vipMember = val;
    }

    get pocketHabboUser() {
        return this.#pocketHabboUser;
    }

    set pocketHabboUser(val) {
        if(typeof val != 'boolean') {
            throw new Error("HFriend.pocketHabboUser: must be a boolean");
        }

        this.#pocketHabboUser = val;
    }

    get relationshipStatus() {
        return this.#relationshipStatus;
    }

    set relationshipStatus(val) {
        if(!HRelationshipStatus.identify(val)) {
            throw new Error("HFriend.relationshipStatus: must be a value of HRelationshipStatus");
        }

        this.#relationshipStatus = val;
    }
}

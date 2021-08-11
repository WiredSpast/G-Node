let { HPacket } = require("../../protocol/hpacket");
let { HGroup } = require("./hgroup");

exports.HUserProfile = class HUserProfile {
    #id;
    #username;
    #motto;
    #figure;
    #creationDate;
    #achievementScore;
    #friendCount;

    #isFriend;
    #isRequestedFriend;
    #isOnline;

    #groups = [];

    #lastAccessSince;
    #openProfile;

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("Invalid argument(s) passed");
        }

        this.#id = packet.readInteger();
        this.#username = packet.readString();
        this.#motto = packet.readString();
        this.#figure = packet.readString();
        this.#creationDate = packet.readString();
        this.#achievementScore = packet.readInteger();
        this.#friendCount = packet.readInteger();

        this.#isFriend = packet.readBoolean();
        this.#isRequestedFriend = packet.readBoolean();
        this.#isOnline = packet.readBoolean();

        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            this.#groups.push(new HGroup(packet));
        }

        this.#lastAccessSince = packet.readInteger();
        this.#openProfile = packet.readBoolean();
    }

    getId() {
        return this.#id;
    }

    getUsername() {
        return this.#username;
    }

    getMotto() {
        return this.#motto;
    }

    getFigure() {
        return this.#figure;
    }

    getCreationDate() {
        return this.#creationDate;
    }

    getAchievementScore() {
        return this.#achievementScore;
    }

    getFriendCount() {
        return this.#friendCount;
    }

    isFriend() {
        return this.#isFriend;
    }

    isRequestedFriend() {
        return this.#isRequestedFriend;
    }

    isOnline() {
        return this.#isOnline;
    }

    getGroups() {
        return this.#groups;
    }

    getLastAccessSince() {
        return this.#lastAccessSince;
    }

    isOpenProfile() {
        return this.#openProfile;
    }
}

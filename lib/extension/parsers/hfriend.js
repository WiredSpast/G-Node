let { HPacket } = require("../../protocol/hpacket");

exports.HFriend = class HFriend {
    #id;
    #name;
    #figure;
    #motto;

    constructor(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("Invalid argument(s) passed");
        }

        let vars = packet.read('iSiBBSiSSSBBBs');
        this.#id = vars[0];
        this.#name = vars[1];
        this.#figure = vars[5];
        this.#motto = vars[7];
    }

    static parseFromFragment(packet) {
        packet.resetReadIndex();
        let friends = [];
        let vars = packet.read('iii');
        for(let i = 0; i < vars[2]; i++) {
            friends.push(new HFriend(packet));
        }
        return friends;
    }

    static parseFromUpdate(packet) {
        packet.resetReadIndex();
        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            packet.read('iS');
        }
        n = packet.readInteger();
        let friends = [];
        for (let i = 0; i < n; i++) {
            if(packet.readInteger() !== -1) {
                friends.push(new HFriend(packet));
            } else {
                packet.readInteger();
            }
        }
        return friends;
    }

    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getFigure() {
        return this.#figure;
    }

    getMotto() {
        return this.#motto;
    }
}

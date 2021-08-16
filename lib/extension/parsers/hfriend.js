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

        let vars = packet.read('iSiBBSiS')
        this.#id = vars[0];
        this.#name = vars[1];
        this.#figure = vars[5];
        this.#motto = vars[7];
        if(packet.readInteger() === 0) {
            packet.read('BB');
        }
        packet.read('BS');
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
        let vars = packet.read('ii');
        let friends = [];
        if(vars[1] !== -1) {
            for (let i = 0; i < vars[0]; i++) {
                friends.push(new HFriend(packet));
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

import { HPacket } from "../../protocol/hpacket";

export class HFriend {
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

    static parse(packet) {
        let friends = [];
        let vars = packet.read('iii');
        for(let i = 0; i < vars[2]; i++) {
            friends.push(new HFriend(packet));
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

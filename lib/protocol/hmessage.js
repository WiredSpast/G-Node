const { HDirection } = require("./hdirection")
const { HPacket } = require("./hpacket");

exports.HMessage = class HMessage {
    #hPacket;
    #index;
    #direction;
    #isBlocked;

    constructor(...args) {
        if(args.length > 0) {
            if(typeof(args[0]) == 'string' || args[0] instanceof String) {
                this.#constructFromString(args[0]);
                return;
            } else if(args[0] instanceof HMessage) {
                this.#constructFromHMessage(args[0]);
                return;
            } else if(args[0] instanceof HPacket && args.length > 2 && (args[1] === HDirection.TOCLIENT || args[1] === HDirection.TOSERVER) && typeof(args[2]) == 'number') {
                this.#constructFromHPacket(args[0], args[1], args[2]);
                return;
            }
        }

        throw new Error("hMessage: Invalid constructor arguments");
    }

    #constructFromString(str) {
        let parts = str.split('\t');

        for(let i = 4; i < parts.length; i++) {
            parts[3] += "\t" + parts[i];
        }

        this.#isBlocked = parts[0] === "1";
        this.#index = Number(parts[1]);
        this.#direction = parts[2] === "TOCLIENT" ? HDirection.TOCLIENT : HDirection.TOSERVER;
        let p = new HPacket(new Uint8Array(0));
        p.constructFromString(parts[3]);
        this.#hPacket = p;
    }

    #constructFromHMessage(hMessage) {
        this.#isBlocked = hMessage.isBlocked();
        this.#index = hMessage.getIndex();
        this.#direction = hMessage.getDestination();
        this.#hPacket = new HPacket(hMessage.getPacket());
    }

    #constructFromHPacket(hPacket, direction, index) {
        this.#direction = direction;
        this.#hPacket = hPacket;
        this.#index = index;
        this.#isBlocked = false;
    }

    getIndex() {
        return this.#index;
    }

    setBlocked(block) {
        if(typeof(block) !== "boolean") {
            throw new Error("hMessage.setBlocked: invalid argument(s) passed");
        }

        this.#isBlocked = block;
    }

    isBlocked() {
        return this.#isBlocked;
    }

    getPacket() {
        return this.#hPacket;
    }

    getDestination() {
        return this.#direction;
    }

    isCorrupted() {
        return this.#hPacket.isCorrupted();
    }

    stringify() {
        return (this.#isBlocked ? "1" : "0") + "\t" + this.#index + "\t" + (this.#direction === HDirection.TOCLIENT ? "TOCLIENT" : "TOSERVER") + "\t" + this.#hPacket.stringify();
    }

    equals(message) {
        if(!(message instanceof HMessage)) return false;

        return message.#hPacket.equals(this.#hPacket) && (message.#direction === this.#direction) && (message.#index === this.#index);
    }
}

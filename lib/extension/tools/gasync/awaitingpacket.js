import { HDirection } from "../../../protocol/hdirection.js";
import { HPacket } from "../../../protocol/hpacket.js";
import { HMessage } from "../../../protocol/hmessage.js";

export class AwaitingPacket {
    #headerName;
    #direction;
    #packet;
    #received = false;
    #conditions = [];
    #start;
    #minWait = 0;

    constructor(headerName, direction, maxWaitingTimeMillis) {
        if (typeof headerName !== 'string') {
            throw new Error("AwaitingPacket.constructor: headerName must be a string");
        }
        if (!HDirection.identify(direction)) {
            throw new Error("AwaitingPacket.constructor: direction must be a value of HDirection");
        }
        if (!Number.isInteger(maxWaitingTimeMillis)) {
            throw new Error("AwaitingPacket.constructor: maxWaitingTimeMillis must be an integer");
        }

        if(maxWaitingTimeMillis < 30) {
            maxWaitingTimeMillis = 30;
        }

        setTimeout(() => {
            this.#received = true;
        }, maxWaitingTimeMillis);

        this.#start = Date.now();

        this.#direction = direction;
        this.#headerName = headerName;
    }

    get headerName() {
        return this.#headerName;
    }

    get direction() {
        return this.#direction;
    }

    setMinWaitingTime(millis) {
        if (!Number.isInteger(millis)) {
            throw new Error("AwaitingPacket.setMinWaitingTime: millis must be an integer");
        }

        this.minWait = millis;

        return this;
    }

    addCondition(condition) {
        if (typeof condition !== 'function') {
            throw new Error("AwaitingPacket.addCondition: condition must be a function");
        }

        this.#conditions.push(condition);

        return this;
    }

    set packet(val) {
        if (!(val instanceof HPacket)) {
            throw new Error("AwaitingPacket.setPacket: packet must be an instance of HPacket")
        }

        this.#packet = val;
        this.#received = true;
    }

    get packet() {
        if (this.#packet !== undefined) {
            this.#packet.resetReadIndex();
        }

        return this.#packet;
    }

    test(hMessage) {
        if (!(hMessage instanceof HMessage)) {
            throw new Error("AwaitingPacket.test: hMessage must be an instance of HMessage");
        }

        for (let condition of this.#conditions) {
            let packet = hMessage.getPacket();
            packet.resetReadIndex();
            if(!condition(packet)) {
                return false;
            }
        }

        return true;
    }

    get ready() {
        return this.#received && (this.#start + this.#minWait) < Date.now();
    }
}
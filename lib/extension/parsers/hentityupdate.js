import { HPoint } from "./hpoint.js";
import { HPacket } from "../../protocol/hpacket.js";
import { HFacing } from "./hfacing.js";
import { HSign } from "./hsign.js";
import { HStance } from "./hstance.js";
import { HAction } from "./haction.js";
import util from "util";

export class HEntityUpdate {
    #index;
    #isController = false;

    #tile;
    #movingTo = null;

    #sign = null;
    #stance = null;
    #action = null;
    #headFacing;
    #bodyFacing;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}HEntityUpdate {\n`
        + `${indent}  index: ${util.inspect(this.#index, {colors: true})}\n`
        + `${indent}  isController: ${util.inspect(this.#isController, {colors: true})}\n`
        + `${indent}  tile: ${util.inspect(this.#tile, false, depth + 1)}\n`
        + `${this.#movingTo != null ? `${indent}  movingTo: ${util.inspect(this.#movingTo, false, depth + 1)}\n` : ''}`
        + `${HSign.identify(this.#sign) ? `${indent}  sign: HSign.\x1b[36m${HSign.identify(this.#sign)}\x1b[0m\n` : ''}`
        + `${HStance.identify(this.#stance) ? `${indent}  stance: HStance.\x1b[36m${HStance.identify(this.#stance)}\x1b[0m\n` : ''}`
        + `${HAction.identify(this.#action) ? `${indent}  action: HAction.\x1b[36m${HAction.identify(this.#action)}\x1b[0m\n` : ''}`
        + `${HFacing.identify(this.#bodyFacing) ? `${indent}  bodyFacing: HFacing.\x1b[36m${HFacing.identify(this.#bodyFacing)}\x1b[0m\n` : ''}`
        + `${HFacing.identify(this.#headFacing) ? `${indent}  headFacing: HFacing.\x1b[36m${HFacing.identify(this.#headFacing)}\x1b[0m\n` : ''}`
        + `${indent}}`;
    }

    constructor(packet) {
        if(!(packet instanceof HPacket)) {
            throw new Error("HEntityUpdate.constructor: packet must be an instance of HPacket");
        }

        this.#index = packet.readInteger();
        this.#tile = new HPoint(packet.readInteger(), packet.readInteger(), Number.parseFloat(packet.readString()));

        let action;
        [ this.#headFacing, this.#bodyFacing, action ] = packet.read('iiS');

        let actionData = action.split("/");

        for(let actionInfo of actionData) {
            let actionValues = actionInfo.split(" ");

            if(actionValues.length < 2) continue;
            if(actionValues[0] === "") continue;

            switch(actionValues[0]) {
                case "flatctrl":
                    this.#isController = true;
                    this.action = HAction.None;
                    break;
                case "mv":
                    let values = actionValues[1].split(",");
                    if(values.length >= 3)
                        this.#movingTo = new HPoint(Number.parseInt(values[0]), Number.parseInt(values[1]), Number.parseFloat(values[2]));
                    this.#action = HAction.Move;
                    break;
                case "sit":
                    this.#action = HAction.Sit;
                    this.#stance = HAction.Sit;
                    break;
                case "sign":
                    this.#sign = Number.parseInt(actionValues[1]);
                    this.#action = HAction.Sign;
                    break;
            }
        }
    }

    static parse(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HEntityUpdate.parse: packet must be an instance of HPacket");
        }

        packet.resetReadIndex();
        let updates = [];
        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            updates.push(new HEntityUpdate(packet));
        }
        return updates;
    }

    getIndex() {
        console.error("\x1b[31mHEntityUpdate.getIndex(): Deprecated method used, use the getter HEntity.index instead\x1b[0m");
        return this.#index;
    }

    isController() {
        console.error("\x1b[31mHEntityUpdate.isController(): Deprecated method used, use the getter HEntity.isController instead\x1b[0m");
        return this.#isController;
    }

    getTile() {
        console.error("\x1b[31mHEntityUpdate.getTile(): Deprecated method used, use the getter HEntity.tile instead\x1b[0m");
        return this.#tile;
    }

    getMovingTo() {
        console.error("\x1b[31mHEntityUpdate.getMovingTo(): Deprecated method used, use the getter HEntity.movingTo instead\x1b[0m");
        return this.#movingTo;
    }

    getSign() {
        console.error("\x1b[31mHEntityUpdate.getSign(): Deprecated method used, use the getter HEntity.sign instead\x1b[0m");
        return this.#sign;
    }

    getStance() {
        console.error("\x1b[31mHEntityUpdate.getStance(): Deprecated method used, use the getter HEntity.stance instead\x1b[0m");
        return this.#stance;
    }

    getAction() {
        console.error("\x1b[31mHEntityUpdate.getAction(): Deprecated method used, use the getter HEntity.action instead\x1b[0m");
        return this.#action;
    }

    getHeadFacing() {
        console.error("\x1b[31mHEntityUpdate.getHeadFacing(): Deprecated method used, use the getter HEntity.headFacing instead\x1b[0m");
        return this.#headFacing;
    }

    getBodyFacing() {
        console.error("\x1b[31mHEntityUpdate.getBodyFacing(): Deprecated method used, use the getter HEntity.bodyFacing instead\x1b[0m");
        return this.#bodyFacing;
    }

    get index() {
        return this.#index;
    }

    set index(val) {
        if(!Number.isInteger(val)) {
            throw new Error('HEntityUpdate.index: must be an integer')
        }

        this.#index = val;
    }

    get isController() {
        return this.#isController;
    }

    set isController(val) {
        if(typeof val != 'boolean') {
            throw new Error('HEntityUpdate.isController: must be a boolean')
        }

        this.#isController = val;
    }

    get tile() {
        return this.#tile;
    }

    set tile(val) {
        if(!(val instanceof HPoint)) {
            throw new Error('HEntityUpdate.tile: must be an instance of HPoint')
        }

        this.#tile = val
    }

    get movingTo() {
        return this.#movingTo;
    }

    set movingTo(val) {
        if(!(val instanceof HPoint) && val != null) {
            throw new Error('HEntityUpdate.movingTo: must be an instance of HPoint or null')
        }

        this.#movingTo = val
    }

    get sign() {
        return this.#sign;
    }

    set sign(val) {
        if(!HSign.identify(val) && val != null) {
            throw new Error('HEntityUpdate.sign: must be a value of HSign or null')
        }

        this.#sign = val
    }

    get stance() {
        return this.#stance;
    }

    set stance(val) {
        if(!HStance.identify(val) && val != null) {
            throw new Error('HEntityUpdate.stance: must be a value of HStance or null')
        }

        this.#stance = val
    }

    get action() {
        return this.#action;
    }

    set action(val) {
        if(!HAction.identify(val) && val != null) {
            throw new Error('HEntityUpdate.action: must be a value of HAction or null')
        }

        this.#action = val
    }

    get headFacing() {
        return this.#headFacing;
    }

    set headFacing(val) {
        if(!HFacing.identify(val)) {
            throw new Error('HEntityUpdate.headFacing: must be a value of HFacing')
        }

        this.#headFacing = val
    }

    get bodyFacing() {
        return this.#bodyFacing;
    }

    set bodyFacing(val) {
        if(!HFacing.identify(val)) {
            throw new Error('HEntityUpdate.bodyFacing: must be a value of HFacing')
        }

        this.#bodyFacing = val
    }
}
import { Extension } from "../../extension.js";
import { HDirection } from "../../../protocol/hdirection.js";
import util from "util";

export class GHeightMap {
    #width;
    #height;
    #tiles;

    #heightMapChangeListener;

    [util.inspect.custom](depth) {
        const indent = "  ".repeat(depth > 2 ? depth - 2 : 0);
        return    `${indent}GHeightMap {\n`
            + `${indent}  width: ${util.inspect(this.width, {colors: true})}\n`
            + `${indent}  height: ${util.inspect(this.height, {colors: true})}\n`
            + `${indent}  tiles: ${util.inspect(this.tiles, {colors: true, maxArrayLength: 0})}\n`
            + `${indent}}`;
    }

    constructor(ext) {
        if (!(ext instanceof Extension)) {
            throw new Error("GHeightMap.constructor: ext must be an instance of Extension");
        }

        ext.interceptByNameOrHash(HDirection.TOCLIENT, 'HeightMap', this.#onHeightMap.bind(this));
        ext.interceptByNameOrHash(HDirection.TOCLIENT, 'HeightMapUpdate', this.#onHeightMapUpdate.bind(this));
    }

    #onHeightMap = (hMessage) => {
        const packet = hMessage.getPacket();
        let tileCount;
        [ this.#width, tileCount ] = packet.read('ii');

        this.#height = tileCount / this.#width;

        this.#tiles = packet.read('s'.repeat(tileCount));

        if (this.#heightMapChangeListener) {
            this.#heightMapChangeListener(this);
        }
    }

    #onHeightMapUpdate = (hMessage) => {
        const packet = hMessage.getPacket();
        const count = packet.readByte();
        for (let i = 0; i < count; i++) {
            const [x, y, value] = packet.read('bbs');
            this.#tiles[this.getTileIndex(x, y)] = value;
        }

        if (this.#heightMapChangeListener) {
            this.#heightMapChangeListener(this);
        }
    }

    getTileIndex(x, y) {
        return y * this.#width + x;
    }

    getCoords(index) {
        let y = index % this.#width;
        let x = (index - y) / this.#width;
        return [ x, y ];
    }

    getTileValue(x, y) {
        return this.#tiles[this.getTileIndex(x, y)];
    }

    #decodeTileHeight = (value) => {
        return value < 0 ? -1 : Number((value & 16383) / 256);
    }

    #decodeIsStackingBlocked = (value) => {
        return Boolean(value & 16384);
    }

    #decodeIsRoomTile = (value) => {
        return value >= 0;
    }

    getTileHeight (x, y) {
        if (x < 0 || x >= this.#width || y < 0 || y >= this.#height)
            return -1;
        return this.#decodeTileHeight(this.getTileValue(x, y));
    }

    isRoomTile(x, y) {
        if (x < 0 || x >= this.#width || y < 0 || y >= this.#height)
            return -1;
        return this.#decodeIsRoomTile(this.getTileValue(x, y));
    }

    isStackingBlocked(x, y) {
        if (x < 0 || x >= this.#width || y < 0 || y >= this.#height)
            return -1;
        return this.#decodeIsStackingBlocked(this.getTileValue(x, y));
    }

    getTile(x, y) {
        return {
            x: x,
            y: y,
            tileValue: this.getTileValue(x, y),
            isRoomTile: this.isRoomTile(x, y),
            tileHeight: this.getTileHeight(x, y),
            isStackingBlocked: this.isStackingBlocked(x, y)
        };
    }

    get tiles() {
        return this.#tiles.map((value, index) => {
            return this.getTile(...this.getCoords(index));
        });
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    set changeListener(listener) {
        this.#heightMapChangeListener = listener;
    }
}
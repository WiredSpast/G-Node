import { HDirection } from "../../protocol/hdirection.js";
import { Extension } from "../extension.js";
import { HInventoryItem } from "../parsers/hinventoryitem.js";

export class GInventory {
    #items = new Map();
    #loaded = false;
    #loadedListener;

    constructor(ext, loadedListener = undefined) {
        if (!(ext instanceof Extension)) {
            throw new Error("GInventory.constructor: ext must be an instance of Extension");
        }
        if (typeof loadedListener !== "undefined" && !(typeof loadedListener === "function" || loadedListener.length === 1)) {
            throw new Error("GInventory.constructor: loadedListener must be undefined or a function with 1 parameter");
        }

        this.#loadedListener = loadedListener;
        ext.interceptByNameOrHash(HDirection.TOCLIENT, "FurniList", (hMessage) => this.#onFurniList(hMessage));
        ext.interceptByNameOrHash(HDirection.TOCLIENT, "FurniListAddOrUpdate", (hMessage) => this.#onFurniListAddOrUpdate(hMessage));
        ext.interceptByNameOrHash(HDirection.TOCLIENT, "FurniListRemove", (hMessage) => this.#onFurniListRemove(hMessage));
    }

    #onFurniList(hMessage) {
        let items = HInventoryItem.parse(hMessage.getPacket());

        items.forEach(item => this.#items.set(item.id, item));
    }

    #onFurniListAddOrUpdate(hMessage) {
        let item = new HInventoryItem(hMessage.getPacket());

        this.#items.set(item.id, item);
    }

    #onFurniListRemove(hMessage) {
        let id = hMessage.getPacket().readInteger();
    }
}
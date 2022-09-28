import { HDirection } from '../../protocol/hdirection.js';
import { Extension } from '../extension.js';
import { HInventoryItem } from '../parsers/hinventoryitem.js';
import { GAsync } from './gasync/gasync.js';
import { AwaitingPacket } from './gasync/awaitingpacket.js';
import { HPacket } from '../../protocol/hpacket.js';
import EventEmitter from 'events';

export class GInventory extends EventEmitter {
  #items = new Map();
  #alreadyLoading = false;
  #gAsync;
  #ext;

  constructor (ext) {
    super();
    if (!(ext instanceof Extension)) {
      throw new Error('GInventory.constructor: ext must be an instance of Extension');
    }

    this.#ext = ext;
    this.#gAsync = new GAsync(ext);

    ext.interceptByNameOrHash(HDirection.TOCLIENT, 'FurniList', (hMessage) => this.#onFurniList(hMessage));
    ext.interceptByNameOrHash(HDirection.TOCLIENT, 'FurniListAddOrUpdate', (hMessage) => this.#onFurniListAddOrUpdate(hMessage));
    ext.interceptByNameOrHash(HDirection.TOCLIENT, 'FurniListRemove', (hMessage) => this.#onFurniListRemove(hMessage));
  }

  async #onFurniList (hMessage) {
    if (this.#alreadyLoading) return;

    this.#alreadyLoading = true;
    this.#items.clear();

    const packet = hMessage.getPacket();

    const packetCount = packet.readInteger(6);
    const packetIndex = packet.readInteger(10);

    const awaitingPackets = [];

    for (let i = 0; i < packetCount; i++) {
      if (i !== packetIndex) {
        awaitingPackets.push(
          new AwaitingPacket('FurniList', HDirection.TOCLIENT, 10000)
            .addCondition((packet) => packet.readInteger(10) === i)
        );
      }
    }

    const furniListPackets = [packet, ...(await this.#gAsync.awaitMultiplePackets(...awaitingPackets))];

    this.#alreadyLoading = false;

    for (const furniListPacket of furniListPackets) {
      HInventoryItem.parse(furniListPacket)
        .forEach(item => this.#items.set(item.id, item));
    }

    this.emit('loaded', this.#items);
  }

  #onFurniListAddOrUpdate (hMessage) {
    const item = new HInventoryItem(hMessage.getPacket());
    this.#items.set(item.id, item);
    this.emit('itemAddedOrUpdated', this.#items, item);
  }

  #onFurniListRemove (hMessage) {
    const id = hMessage.getPacket().readInteger();
    this.#items.delete(id);
    this.emit('itemRemoved', this.#items, id);
  }

  reload () {
    this.#ext.sendToServer(new HPacket('{out:RequestFurniInventory}'));
  }
}

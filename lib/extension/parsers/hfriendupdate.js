import { HPacket } from '../../protocol/hpacket.js';
import { HFriend } from './hfriend.js';

export class HFriendUpdate {
  #categories = new Map();
  #updatedFriends = [];
  #addedFriends = [];
  #removedFriendIds = [];

  constructor (packet) {
    if (!(packet instanceof HPacket)) {
      throw new Error('HFriend.constructor: packet must be an instance of HPacket');
    }

    packet.resetReadIndex();

    let n = packet.readInteger();
    for (let i = 0; i < n; i++) { this.#categories.set(...packet.read('iS')); }

    n = packet.readInteger();
    for (let i = 0; i < n; i++) {
      const type = packet.readInteger();
      if (type === -1) { this.#removedFriendIds.push(packet.readInteger()); } else if (type === 0) { this.#updatedFriends.push(new HFriend(packet, this.#categories)); } else { this.#addedFriends.push(new HFriend(packet, this.#categories)); }
    }
  }

  constructPacket (headerId) {
    if (!Number.isInteger(headerId)) { throw new Error('HFriendUpdate.constructPacket: headerId must be an integer'); }

    const packet = new HPacket(headerId);

    packet.appendInt(this.#categories.size);
    for (const entry of this.#categories.entries()) { packet.append('iS', entry); }

    packet.appendInt(this.#removedFriendIds.length + this.#updatedFriends.length + this.#addedFriends.length);

    for (const id of this.#removedFriendIds) { packet.append('ii', -1, id); }

    for (const friend of this.#updatedFriends) {
      packet.appendInt(0);
      friend.appendToPacket(packet);
    }

    for (const friend of this.#addedFriends) {
      packet.appendInt(1);
      friend.appendToPacket(packet);
    }
  }

  get categories () {
    return this.#categories;
  }

  set categories (val) {
    if (!(val instanceof Map) ||
      ![...val.keys()].every(key => Number.isInteger(key)) ||
      ![...val.values()].every(value => typeof value === 'string')) { throw new Error('HFriendUpdate.categories: must be a Map instance with every key an integer and every value a string'); }

    this.#categories = val;
  }

  get updatedFriends () {
    return this.#updatedFriends;
  }

  set updatedFriends (val) {
    if (!Array.isArray(val) || !val.every(e => e instanceof HFriend)) { throw new Error('HFriendUpdate.updatedFriends: must be an array of HFriend instances'); }

    this.#updatedFriends = val;
  }

  get addedFriends () {
    return this.#addedFriends;
  }

  set addedFriends (val) {
    if (!Array.isArray(val) || !val.every(e => e instanceof HFriend)) { throw new Error('HFriendUpdate.updatedFriends: must be an array of HFriend instances'); }

    this.#addedFriends = val;
  }

  get removedFriendIds () {
    return this.#removedFriendIds;
  }

  set removedFriendIds (val) {
    if (!Array.isArray(val) || !val.every(e => Number.isInteger(e))) { throw new Error('HFriendUpdate.updatedFriends: must be an array of integers'); }

    this.#removedFriendIds = val;
  }
}

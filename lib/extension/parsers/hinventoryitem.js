import { HPacket } from '../../protocol/hpacket.js';
import { inspect } from 'util';
import { HStuff } from './hstuff.js';
import { HProductType } from './hproducttype.js';
import { HSpecialType } from './hspecialtype.js';

export class HInventoryItem {
  #itemId;
  #furniType;
  #id;
  #typeId;
  #category;
  #stuffCategory;
  #stuff;

  #isRecyclable;
  #isTradeable;
  #isGroupable;
  #isSellable;
  #secondsToExpiration;
  #isRented;
  #hasRentPeriodStarted;
  #roomId;

  #slotId;
  #extra;

  [inspect.custom] (depth) {
    const indent = '  '.repeat(depth > 2 ? depth - 2 : 0);
    return `${indent}HInventoryItem {\n` +
      `${indent}  itemId: ${inspect(this.#id, { colors: true })}\n` +
      `${HProductType.identify(this.#furniType) ? `${indent}  furniType: HProductType.\x1b[36m${HProductType.identify(this.#furniType)}\x1b[0m\n` : ''}` +
      `${indent}  id: ${inspect(this.#id, { colors: true })}\n` +
      `${indent}  typeId: ${inspect(this.#typeId, { colors: true })}\n` +
      `${indent}  category: ${inspect(this.#category, { colors: true })}\n` +
      `${indent}  stuffCategory: ${inspect(this.#stuffCategory, { colors: true })}\n` +
      `${indent}  stuff: ${inspect(this.#stuff, { colors: true })}\n` +
      `${indent}  isRecyclable: ${inspect(this.#isRecyclable, { colors: true })}\n` +
      `${indent}  isTradeable: ${inspect(this.#isTradeable, { colors: true })}\n` +
      `${indent}  isGroupable: ${inspect(this.#isGroupable, { colors: true })}\n` +
      `${indent}  isSellable: ${inspect(this.#isSellable, { colors: true })}\n` +
      `${indent}  secondsToExpiration: ${inspect(this.#secondsToExpiration, { colors: true })}\n` +
      `${indent}  isRented: ${inspect(this.#isRented, { colors: true })}\n` +
      `${indent}  hasRentPeriodStarted: ${inspect(this.#hasRentPeriodStarted, { colors: true })}\n` +
      `${indent}  roomId: ${inspect(this.#roomId, { colors: true })}\n` +
      `${this.#furniType === HProductType.FloorItem ? `${indent}  slotId: ${inspect(this.#slotId, { colors: true })}\n` : ''}` +
      `${this.#furniType === HProductType.FloorItem ? `${indent}  extra: ${inspect(this.#extra, { colors: true })}\n` : ''}` +
      `${indent}}`;
  }

  constructor (packet) {
    if (!(packet instanceof HPacket)) {
      throw new Error('HInventoryItem.constructor: packet must be an instance of HPacket');
    }

    [this.#itemId, this.#furniType, this.#id, this.#typeId, this.#category,
      this.#stuffCategory] = packet.read('iSiiii');

    this.#stuff = HStuff.readData(packet, this.#stuffCategory);

    [this.#isRecyclable, this.#isTradeable, this.#isGroupable, this.#isSellable, this.#secondsToExpiration,
      this.#hasRentPeriodStarted, this.#roomId] = packet.read('BBBBiBi');

    if (this.#furniType === HProductType.FloorItem) {
      [this.#slotId, this.#extra] = packet.read('Si');
    }
  }

  appendToPacket (packet) {
    if (!(packet instanceof HPacket)) {
      throw new Error('HInventoryItem.appendToPacket: packet must be an instance of HPacket');
    }

    packet.append('iSiiii',
      this.#itemId,
      this.#furniType,
      this.#id,
      this.#typeId,
      this.#category,
      this.#stuffCategory);

    HStuff.appendData(packet, this.#stuffCategory, this.#stuff);

    packet.append('BBBBiBi',
      this.#isRecyclable,
      this.#isTradeable,
      this.#isGroupable,
      this.#isSellable,
      this.#secondsToExpiration,
      this.#hasRentPeriodStarted,
      this.#roomId);

    if (this.#furniType === HProductType.FloorItem) {
      packet.append('Si',
        this.#slotId || '',
        this.#extra || 0);
    }
  }

  static parse (packet) {
    if (!(packet instanceof HPacket)) {
      throw new Error('HInventoryItem.parse: packet must be an instance of HPacket');
    }

    const items = [];
    packet.readIndex = 14;
    const n = packet.readInteger();
    for (let i = 0; i < n; i++) {
      items.push(new HInventoryItem(packet));
    }

    return items;
  }

  static constructPackets (inventoryItems, headerId) {
    if (!Array.isArray(inventoryItems)) {
      throw new Error('HInventoryItem.constructPackets: inventoryItems must be an array of HInventoryItem instances');
    }
    if (!Number.isInteger(headerId)) {
      throw new Error('HInventoryItem.constructPackets: headerId must be an integer');
    }

    const packetCount = Math.ceil(inventoryItems.length / 600);
    const packets = [];
    for (let i = 0; i < packetCount; i++) {
      const packet = new HPacket(headerId)
        .append('iii',
          packetCount,
          i,
          i === packetCount - 1 && inventoryItems.length % 600 !== 0 ? inventoryItems.length % 600 : 600);

      for (let j = i * 600; j < inventoryItems.length && j < (i + 1) * 100; j++) {
        if (!(inventoryItems[j] instanceof HInventoryItem)) {
          throw new Error('HInventoryItem.constructPackets: inventoryItems must be an array of HInventoryItem instances');
        }
        inventoryItems[j].appendToPacket(packet);
      }
      packets.push(packet);
    }

    return packets;
  }

  get itemId () {
    return this.#itemId;
  }

  set itemId (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HInventoryItem.itemId: must be an integer');
    }

    this.#itemId = val;
  }

  get furniType () {
    return this.#furniType;
  }

  set furniType (val) {
    if (!HProductType.identify(val)) {
      throw new Error('HInventoryItem.furniType: must be a value of HProductType');
    }

    this.#furniType = val;
  }

  get id () {
    return this.#id;
  }

  set id (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HInventoryItem.id: must be an integer');
    }

    this.#id = val;
  }

  get typeId () {
    return this.#typeId;
  }

  set typeId (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HInventoryItem.typeId: must be an integer');
    }

    this.#typeId = val;
  }

  get category () {
    return this.#category;
  }

  set category (val) {
    if (!HSpecialType.identify(val)) {
      throw new Error('HInventoryItem.category: must be a value of HSpecialType');
    }

    this.#category = val;
  }

  get stuffCategory () {
    return this.#stuffCategory;
  }

  set stuffCategory (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HInventoryItem.stuffCategory: must be an integer');
    }

    this.#stuffCategory = val;
  }

  get stuff () {
    return this.#stuff;
  }

  set stuff (val) {
    if (!Array.isArray(val)) {
      throw new Error('HInventoryItem.stuff: must be an array');
    }

    this.#stuff = val;
  }

  get isRecyclable () {
    return this.#isRecyclable;
  }

  set isRecyclable (val) {
    if (typeof val !== 'boolean') {
      throw new Error('HInventoryItem.isRecyclable: must be a boolean');
    }

    this.#isRecyclable = val;
  }

  get isTradeable () {
    return this.#isTradeable;
  }

  set isTradeable (val) {
    if (typeof val !== 'boolean') {
      throw new Error('HInventoryItem.isTradeable: must be a boolean');
    }

    this.#isTradeable = val;
  }

  get isGroupable () {
    return this.#isGroupable;
  }

  set isGroupable (val) {
    if (typeof val !== 'boolean') {
      throw new Error('HInventoryItem.isGroupable: must be a boolean');
    }

    this.#isGroupable = val;
  }

  get isSellable () {
    return this.#isSellable;
  }

  set isSellable (val) {
    if (typeof val !== 'boolean') {
      throw new Error('HInventoryItem.isSellable: must be a boolean');
    }

    this.#isSellable = val;
  }

  get secondsToExpiration () {
    return this.#secondsToExpiration;
  }

  set secondsToExpiration (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HInventoryItem.secondsToExpiration: must be an integer');
    }

    this.#secondsToExpiration = val;
  }

  get isRented () {
    return this.#isRented;
  }

  set isRented (val) {
    if (typeof val !== 'boolean') {
      throw new Error('HInventoryItem.isRented: must be a boolean');
    }

    this.#isRented = val;
  }

  get hasRentPeriodStarted () {
    return this.#hasRentPeriodStarted;
  }

  set hasRentPeriodStarted (val) {
    if (typeof val !== 'boolean') {
      throw new Error('HInventoryItem.hasRentPeriodStarted: must be a boolean');
    }

    this.#hasRentPeriodStarted = val;
  }

  get roomId () {
    return this.#roomId;
  }

  set roomId (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HInventoryItem.roomId: must be an integer');
    }

    this.#roomId = val;
  }

  get slotId () {
    return this.#slotId;
  }

  set slotId (val) {
    if (typeof val !== 'string' && typeof val !== 'undefined') {
      throw new Error('HInventoryItem.slotId: must be a string or undefined');
    }

    this.#slotId = val;
  }

  get extra () {
    return this.#extra;
  }

  set extra (val) {
    if (!Number.isInteger(val) && typeof val !== 'undefined') {
      throw new Error('HInventoryItem.extra: must be an integer or undefined');
    }

    this.#extra = val;
  }
}

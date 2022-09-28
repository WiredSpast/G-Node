import { HFacing } from './hfacing.js';
import util from 'util';
import { HPacket } from '../../protocol/hpacket.js';
import { HPoint } from './hpoint.js';
import { HStuff } from './hstuff.js';

export class HFloorItem {
  #id;
  #typeId;
  #tile;
  #sizeZ;
  #extra;
  #facing;

  #stuffCategory;

  #secondsToExpiration;
  #usagePolicy;
  #ownerId;
  #ownerName;
  #stuff;

  #staticClass = undefined;

  [util.inspect.custom] (depth) {
    const indent = '  '.repeat(depth > 2 ? depth - 2 : 0);
    return `${indent}HFloorItem {\n` +
      `${indent}  id: ${util.inspect(this.#id, { colors: true })}\n` +
      `${indent}  typeId: ${util.inspect(this.#typeId, { colors: true })}\n` +
      `${indent}  tile: ${util.inspect(this.#tile, false, depth + 1)}\n` +
      `${indent}  sizeZ: ${util.inspect(this.#sizeZ, { colors: true })}\n` +
      `${indent}  extra: ${util.inspect(this.#extra, { colors: true })}\n` +
      `${HFacing.identify(this.#facing) ? `${indent}  facing: HFacing.\x1b[36m${HFacing.identify(this.#facing)}\x1b[0m\n` : ''}` +
      `${indent}  category: ${util.inspect(this.#stuffCategory, { colors: true })}\n` +
      `${indent}  secondsToExpiration: ${util.inspect(this.#secondsToExpiration, { colors: true })}\n` +
      `${indent}  usagePolicy: ${util.inspect(this.#usagePolicy, { colors: true })}\n` +
      `${indent}  ownerId: ${util.inspect(this.#ownerId, { colors: true })}\n` +
      `${indent}  ownerName: ${util.inspect(this.#ownerName, { colors: true })}\n` +
      `${indent}  stuff: ${util.inspect(this.#stuff, { colors: true })}\n` +
      `${this.#staticClass ? `${indent}  staticClass: ${util.inspect(this.#staticClass, { colors: true })}\n` : ''}` +
      `${indent}}`;
  }

  constructor (packet) {
    if (!(packet instanceof HPacket)) {
      throw new Error('HFloorItem.constructor: Invalid argument(s) passed');
    }

    let x, y;
    [this.#id, this.#typeId, x, y, this.#facing] = packet.read('iiiii');

    this.#tile = new HPoint(x, y, Number.parseFloat(packet.readString()));

    this.#sizeZ = Number.parseFloat(packet.readString());

    [this.#extra, this.#stuffCategory] = packet.read('ii');

    this.#stuff = HStuff.readData(packet, this.#stuffCategory);

    [this.#secondsToExpiration, this.#usagePolicy, this.#ownerId] = packet.read('iii');

    if (this.#typeId < 0) {
      this.#staticClass = packet.readString();
    }
  }

  appendToPacket (packet) {
    if (!(packet instanceof HPacket)) {
      throw new Error('HFloorItem.appendToPacket: packet must be an instance of HPacket');
    }

    packet.append('iiiiiSSii',
      this.#id,
      this.#typeId,
      this.#tile.x,
      this.#tile.y,
      this.#facing,
      `${this.#tile.z}`,
      `${this.#sizeZ}`,
      this.#extra,
      this.#stuffCategory);

    HStuff.appendData(packet, this.#stuffCategory, this.#stuff);

    packet.append('iii',
      this.#secondsToExpiration,
      this.#usagePolicy,
      this.#ownerId);

    if (this.#typeId < 0) {
      packet.appendString(this.#staticClass || '');
    }
  }

  static parse (packet) {
    if (!(packet instanceof HPacket)) {
      throw new Error('HFloorItem.parse: packet must be an instance of HPacket');
    }

    packet.resetReadIndex();

    const ownersCount = packet.readInteger();
    const owners = new Map();

    for (let i = 0; i < ownersCount; i++) {
      owners.set(...packet.read('iS'));
    }

    const furniture = [];
    const n = packet.readInteger();
    for (let i = 0; i < n; i++) {
      const furni = new HFloorItem(packet);
      furni.#ownerName = owners.get(furni.#ownerId);

      furniture.push(furni);
    }
    return furniture;
  }

  static constructPacket (floorItems, headerId) {
    if (!(Array.isArray(floorItems) || !Number.isInteger(headerId))) {
      throw new Error('HFloorItem.constructPacket: headerId must be an integer');
    }

    if (!(Array.isArray(floorItems))) {
      throw new Error('HFloorItem.constructPacket: floorItems must be an array of HFloorItem instances');
    }

    const owners = new Map();
    for (const floorItem of floorItems) {
      if (!(floorItem instanceof HFloorItem)) {
        throw new Error('HFloorItem.constructPacket: floorItems must be an array of HFloorItem instances');
      }

      owners.set(floorItem.#ownerId, floorItem.#ownerName);
    }

    const packet = new HPacket(headerId);
    packet.appendInt(owners.size);
    for (const ownerEntry of Array.from(owners.entries())) {
      packet.append('iS', ...ownerEntry);
    }

    packet.appendInt(floorItems.length);
    for (const floorItem of floorItems) {
      floorItem.appendToPacket(packet);
    }

    return packet;
  }

  get id () {
    return this.#id;
  }

  get typeId () {
    return this.#typeId;
  }

  get usagePolicy () {
    return this.#usagePolicy;
  }

  get ownerId () {
    return this.#ownerId;
  }

  get ownerName () {
    return this.#ownerName;
  }

  get secondsToExpiration () {
    return this.#secondsToExpiration;
  }

  get category () {
    return this.#stuffCategory;
  }

  get sizeZ () {
    return this.#sizeZ;
  }

  get extra () {
    return this.#extra;
  }

  get facing () {
    return this.#facing;
  }

  get tile () {
    return this.#tile;
  }

  get stuffCategory () {
    return this.#stuffCategory;
  }

  get stuff () {
    return this.#stuff;
  }

  get staticClass () {
    return this.#staticClass;
  }

  set ownerName (val) {
    if (typeof val !== 'string') {
      throw new Error('HFloorItem.ownerName: must be a string');
    }

    this.#ownerName = val;
  }

  set id (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HFloorItem.id: must be an integer');
    }

    this.#id = val;
  }

  set typeId (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HFloorItem.typeId: must be an integer');
    }

    this.#typeId = val;
  }

  set tile (val) {
    if (!(val instanceof HPoint)) {
      throw new Error('HFloorItem.tile: must be an instance of HPoint');
    }

    this.#tile = val;
  }

  set sizeZ (val) {
    if (Number.isNaN(val) || typeof val !== 'number') {
      throw new Error('HFloorItem.sizeZ: must be a double');
    }

    this.#sizeZ = val;
  }

  set facing (val) {
    if (!HFacing.identify(val)) {
      throw new Error('HFloorItem.facing: must be a value of HFacing');
    }

    this.#facing = val;
  }

  set stuffCategory (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HFloorItem.stuffCategory: must be an integer');
    }

    this.#stuffCategory = val;
  }

  set secondsToExpiration (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HFloorItem.secondsToExpiration: must be an integer');
    }

    this.#secondsToExpiration = val;
  }

  set usagePolicy (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HFloorItem.usagePolicy: must be an integer');
    }

    this.#usagePolicy = val;
  }

  set ownerId (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HFloorItem.ownerId: must be an integer');
    }

    this.#ownerId = val;
  }

  set stuff (val) {
    if (!Array.isArray(val)) {
      throw new Error('HFloorItem.stuff: must be an array');
    }

    this.#stuff = val;
  }

  set staticClass (val) {
    if (typeof val !== 'string' && typeof val !== 'undefined') {
      throw new Error('HFloorItem.staticClass: must be a string or undefined');
    }

    this.#staticClass = val;
  }
}

import { HPacket } from '../../protocol/hpacket.js';
import util from 'util';
import { HGroup } from './hgroup.js';

export class HUserProfile {
  #id;
  #username;
  #motto;
  #figure;
  #creationDate;
  #achievementScore;
  #friendCount;

  #isFriend;
  #isFriendRequestSent;
  #isOnline;

  #groups = [];

  #lastAccessSince;
  #openProfile;

  #accountLevel;
  #starGemCount;

  #unknownBoolean1 = false;
  #unknownBoolean2 = false;
  #unknownBoolean3 = false;
  #unknownInt = 0;

  [util.inspect.custom] (depth) {
    const indent = '  '.repeat(depth > 2 ? depth - 2 : 0);
    return `${indent}HUserProfile {\n` +
      `${indent}  id: ${util.inspect(this.#id, { colors: true })}\n` +
      `${indent}  username: ${util.inspect(this.#username, { colors: true })}\n` +
      `${indent}  motto: ${util.inspect(this.#motto, { colors: true })}\n` +
      `${indent}  figure: ${util.inspect(this.#figure, { colors: true })}\n` +
      `${indent}  creationDate: ${util.inspect(this.#creationDate, { colors: true })}\n` +
      `${indent}  achievementScore: ${util.inspect(this.#achievementScore, { colors: true })}\n` +
      `${indent}  friendCount: ${util.inspect(this.#friendCount, { colors: true })}\n` +
      `${indent}  isFriend: ${util.inspect(this.#isFriend, { colors: true })}\n` +
      `${indent}  isFriendRequestSent: ${util.inspect(this.#isFriendRequestSent, { colors: true })}\n` +
      `${indent}  isOnline: ${util.inspect(this.#isOnline, { colors: true })}\n` +
      `${indent}  groups: ${util.inspect(this.#groups, { colors: true, maxArrayLength: 0 })}\n` +
      `${indent}  lastAccessSince: ${util.inspect(this.#lastAccessSince, { colors: true })}\n` +
      `${indent}  openProfile: ${util.inspect(this.#openProfile, { colors: true })}\n` +
      `${indent}}`;
  }

  constructor (packet) {
    if (!(packet instanceof HPacket)) {
      throw new Error('HUserProfile.constructor: packet must be an instance of HPacket');
    }

    [this.#id, this.#username, this.#figure, this.#motto, this.#creationDate,
      this.#achievementScore, this.#friendCount, this.#isFriend,
      this.#isFriendRequestSent, this.#isOnline] = packet.read('iSSSSiiBBB');

    const n = packet.readInteger();
    for (let i = 0; i < n; i++) {
      this.#groups.push(new HGroup(packet));
    }

    [this.#lastAccessSince, this.#openProfile] = packet.read('iB');

    if (packet.readIndex < packet.getBytesLength()) {
      [this.#unknownBoolean1, this.#accountLevel, this.#unknownInt, this.#starGemCount,
        this.#unknownBoolean2, this.#unknownBoolean3] = packet.read('BiiiBB');
    }
  }

  constructPacket (headerId) {
    if (!Number.isInteger(headerId)) {
      throw new Error('HUserProfile.constructPacket: headerId must be an integer');
    }

    const packet = new HPacket(headerId)
      .append('iSSSSiiBBBi',
        this.#id,
        this.#username,
        this.#figure,
        this.#motto,
        this.#creationDate,
        this.#achievementScore,
        this.#friendCount,
        this.#isFriend,
        this.#isFriendRequestSent,
        this.#isOnline,
        this.#groups.length);

    for (const group of this.#groups) {
      group.appendToPacket(packet);
    }

    packet.append('iB',
      this.#lastAccessSince,
      this.#openProfile);

    if (this.#accountLevel && this.#starGemCount) {
      packet.append('BiiiBB',
        this.#unknownBoolean1,
        this.#accountLevel,
        this.#unknownInt,
        this.#starGemCount,
        this.#unknownBoolean2,
        this.#unknownBoolean3);
    }

    return packet;
  }

  get id () {
    return this.#id;
  }

  set id (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HUserProfile.id: must be an integer');
    }

    this.#id = val;
  }

  get username () {
    return this.#username;
  }

  set username (val) {
    if (typeof val !== 'string') {
      throw new Error('HUserProfile.username: must be a string');
    }

    this.#username = val;
  }

  get motto () {
    return this.#motto;
  }

  set motto (val) {
    if (typeof val !== 'string') {
      throw new Error('HUserProfile.motto: must be a string');
    }

    this.#motto = val;
  }

  get figure () {
    return this.#figure;
  }

  set figure (val) {
    if (typeof val !== 'string') {
      throw new Error('HUserProfile.figure: must be a string');
    }

    this.#figure = val;
  }

  get creationDate () {
    return this.#creationDate;
  }

  set creationDate (val) {
    if (typeof val !== 'string') {
      throw new Error('HUserProfile.creationData: must be a string');
    }

    this.#creationDate = val;
  }

  get achievementScore () {
    return this.#achievementScore;
  }

  set achievementScore (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HUserProfile.achievementScore: must be an integer');
    }

    this.#achievementScore = val;
  }

  get friendCount () {
    return this.#friendCount;
  }

  set friendCount (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HUserProfile.friendCount: must be an integer');
    }

    this.#friendCount = val;
  }

  get isFriend () {
    return this.#isFriend;
  }

  set isFriend (val) {
    if (typeof val !== 'boolean') {
      throw new Error('HUserProfile.isFriend: must be a boolean');
    }

    this.#isFriend = val;
  }

  get isFriendRequestSent () {
    return this.#isFriendRequestSent;
  }

  set isFriendRequestSent (val) {
    if (typeof val !== 'boolean') {
      throw new Error('HUserProfile.isFriendRequestSent: must be a boolean');
    }

    this.#isFriendRequestSent = val;
  }

  get isRequestedFriend () {
    console.error('\x1b[31mHUserProfile.isRequestedFriend: Deprecated getter used, use the getter HUserProfile.isFriendRequestSent instead\x1b[0m');

    return this.#isFriendRequestSent;
  }

  set isRequestedFriend (val) {
    console.error('\x1b[31mHUserProfile.isRequestedFriend: Deprecated setter used, use the getter HUserProfile.isFriendRequestSent instead\x1b[0m');

    if (typeof val !== 'boolean') {
      throw new Error('HUserProfile.isFriendRequestSent: must be a boolean');
    }

    this.#isFriendRequestSent = val;
  }

  get isOnline () {
    return this.#isOnline;
  }

  set isOnline (val) {
    if (typeof val !== 'boolean') {
      throw new Error('HUserProfile.isOnline: must be a boolean');
    }

    this.#isOnline = val;
  }

  get groups () {
    return this.#groups;
  }

  set groups (val) {
    if (!Array.isArray(val) || val.filter(g => !(g instanceof HGroup)).length > 0) {
      throw new Error('HUserProfile.groups: must be an array of HGroup instances');
    }

    this.#groups = val;
  }

  get lastAccessSince () {
    return this.#lastAccessSince;
  }

  set lastAccessSince (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HUserProfile.lastAccessSince: must be an integer');
    }

    this.#lastAccessSince = val;
  }

  get openProfile () {
    return this.#openProfile;
  }

  set openProfile (val) {
    if (typeof val !== 'boolean') {
      throw new Error('HUserProfile.isOpenProfile: must be a boolean');
    }

    this.#openProfile = val;
  }

  get accountLevel () {
    return this.#accountLevel;
  }

  set accountLevel (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HUserProfile.accountLevel: must be an integer');
    }

    this.#accountLevel = val;
  }

  get starGemCount () {
    return this.#starGemCount;
  }

  set starGemCount (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HUserProfile.starGemCount: must be an integer');
    }

    this.#starGemCount = val;
  }
}

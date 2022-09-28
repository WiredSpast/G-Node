import { HDirection } from './hdirection.js';
import { PacketInfoManager } from '../services/packetinfo/packetinfomanager.js';
import { inspect } from 'util';

export class HPacket {
  #isEdited = false;
  #packetInBytes;
  #readIndex = 6;

  #identifier = null;
  #identifierDirection = null;

  #rawHeaderIdUsed = false;

  [inspect.custom] (depth) {
    const indent = '  '.repeat(depth > 2 ? depth - 2 : 0);
    return `${indent}HPacket${this.#rawHeaderIdUsed ? '<\x1b[31mInsecure\x1b[0m>' : '<\x1b[32mSecure\x1b[0m>'} {\n` +
      `${indent}  headerId: ${inspect(this.headerId, { colors: true })}\n` +
      `${indent}  isEdited: ${inspect(this.#isEdited, { colors: true })}\n` +
      `${indent}  bytes: ${inspect(this.#packetInBytes, { colors: true, maxArrayLength: 0 })}\n` +
      `${indent}  readIndex: ${inspect(this.#readIndex, { colors: true })}\n` +
      `${this.#identifier != null ? `${indent}  identifier: ${inspect(this.#identifier, { colors: true })}\n` : ''}` +
      `${this.#identifierDirection != null ? `${indent}  identifierDirection: HDirection.\x1b[36m${HDirection.identify(this.#identifierDirection)}\x1b[0m\n` : ''}` +
      `${indent}  toString(): ${inspect(this.toString(), { colors: true, maxStringLength: 50 })}\n` +
      `${indent}  stringify(): ${inspect(this.stringify(), { colors: true, maxStringLength: 50 })}\n` +
      `${indent}}`;
  }

  constructor (...args) {
    if (args.length > 0) {
      if (typeof (args[0]) === 'number') {
        if (args.length > 1 && args[1] instanceof Uint8Array) {
          this.#constructFromHeaderIdAndBytesArray(args[0], args[1]);
          return;
        } else {
          this.#constructFromHeaderId(args[0]);
          return;
        }
      } else if (typeof (args[0]) === 'string') {
        if (args.length > 1 && (args[1] === HDirection.TOCLIENT || args[1] === HDirection.TOSERVER)) {
          this.#constructFromIdentifierAndDirection(args[0], args[1]);
          return;
        } else {
          this.#constructFromString(args[0]);
          return;
        }
      } else if (args[0] instanceof HPacket) {
        this.#constructFromPacket(args[0]);
        return;
      } else if (args[0] instanceof Uint8Array) {
        this.#constructFromBytesArray(args[0]);
        return;
      }
    }

    throw new Error('HPacket.constructor: Invalid constructor arguments');
  }

  #constructFromBytesArray = (packet) => {
    this.#packetInBytes = packet.slice(0);
  };

  #constructFromPacket = (packet) => {
    this.#packetInBytes = packet.#packetInBytes.slice(0);
    this.#isEdited = packet.#isEdited;
  };

  #constructFromHeaderId = (headerId) => {
    this.#packetInBytes = new Uint8Array([0, 0, 0, 2, 0, 0]);
    this.replaceShort(4, headerId);
    this.#isEdited = false;
  };

  #constructFromHeaderIdAndBytesArray = (headerId, bytes) => {
    this.#constructFromHeaderId(headerId);
    this.appendBytes(bytes);
    this.#isEdited = false;
  };

  #constructFromIdentifierAndDirection = (identifier, direction) => {
    this.#packetInBytes = new Uint8Array([0, 0, 0, 2, -1, -1]);
    this.#identifier = identifier;
    this.#identifierDirection = direction;
  };

  #constructFromString = (str) => {
    const packet = fromString(str);
    this.#constructFromPacket(packet);
    this.#identifier = packet.#identifier;
    this.#identifierDirection = packet.#identifierDirection;
  };

  toString () {
    return toString(this.bytes);
  }

  get EOF () {
    if (this.#readIndex < this.bytesLength) return 0;
    if (this.#readIndex > this.bytesLength) return 2;
    return 1;
  }

  get identifier () {
    return this.#identifier;
  }

  set identifier (val) {
    if (typeof (val) !== 'string') {
      throw new Error('HPacket.identifier: must be a string');
    }

    this.#identifier = val;
  }

  get identifierDirection () {
    return this.#identifierDirection;
  }

  set identifierDirection (val) {
    if (!HDirection.identify(val)) {
      throw new Error('HPacket.identifierDirection: must be a value of HDirection');
    }

    this.#identifierDirection = val;
  }

  canComplete (packetInfoManager) {
    if (!(packetInfoManager instanceof PacketInfoManager)) {
      throw new Error('HPacket.canComplete: packetInfoManager must be an instance of PacketInfoManager');
    }

    if (this.isCorrupted() || this.#identifier === null) return false;

    let packetInfo = packetInfoManager.getPacketInfoFromName(this.#identifierDirection, this.#identifier);
    if (packetInfo === null) {
      packetInfo = packetInfoManager.getPacketInfoFromName(this.#identifierDirection, this.#identifier);
      return packetInfo !== null;
    }

    return true;
  }

  canSendToClient () {
    return this.#identifierDirection == null || this.#identifierDirection === HDirection.TOCLIENT;
  }

  canSendToServer () {
    return this.#identifierDirection == null || this.#identifierDirection === HDirection.TOSERVER;
  }

  completePacket (packetInfoManager) {
    if (!(packetInfoManager instanceof PacketInfoManager)) {
      throw new Error('HPacket.completePacket: packetInfoManager must be an instance of PacketInfoManager');
    }

    if (this.isCorrupted() || this.#identifier === null) return;

    let packetInfo = packetInfoManager.getPacketInfoFromName(this.#identifierDirection, this.#identifier);
    if (packetInfo === null) {
      packetInfo = packetInfoManager.getPacketInfoFromName(this.#identifierDirection, this.#identifier);
      if (packetInfo === null) return;
    }

    const wasEdited = this.#isEdited;
    this.replaceShort(4, packetInfo.headerId);
    this.#identifier = null;

    this.#isEdited = wasEdited;
  }

  isPacketComplete () {
    return this.#identifier == null;
  }

  get bytes () {
    return this.#packetInBytes;
  }

  get readIndex () {
    return this.#readIndex;
  }

  set readIndex (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HPacket.readIndex: must be an integer');
    }

    this.#readIndex = val;
  }

  resetReadIndex () {
    this.#readIndex = 6;
  }

  isCorrupted () {
    if (this.bytesLength >= 6) {
      if (this.length === this.bytesLength - 4) {
        return false;
      }
    }
    return true;
  }

  readByte (index) {
    if (typeof index === 'undefined') {
      if (this.readIndex < this.#packetInBytes.length) {
        return this.#packetInBytes[this.#readIndex++];
      }
    } else if (Number.isInteger(index) && index < this.#packetInBytes.length) {
      return this.#packetInBytes[index];
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  readShort (index) {
    if (typeof index === 'undefined') {
      index = this.#readIndex;
      this.#readIndex += 2;
    }

    if (Number.isInteger(index) && index < this.#packetInBytes.length - 1) {
      return Buffer.from(this.#packetInBytes).readInt16BE(index);
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  readUShort (index) {
    if (typeof index === 'undefined') {
      index = this.#readIndex;
      this.#readIndex += 2;
    }

    if (Number.isInteger(index) && index < this.#packetInBytes.length - 1) {
      return Buffer.from(this.#packetInBytes).readUInt16BE(index);
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  get headerId () {
    return this.readShort(4);
  }

  readInteger (index) {
    if (typeof index === 'undefined') {
      index = this.#readIndex;
      this.#readIndex += 4;
    }

    if (Number.isInteger(index) && index < this.#packetInBytes.length - 3) {
      return Buffer.from(this.#packetInBytes).readInt32BE(index);
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  readDouble (index) {
    if (typeof index === 'undefined') {
      index = this.#readIndex;
      this.#readIndex += 8;
    }

    if (Number.isInteger(index) && index < this.#packetInBytes.length - 7) {
      return Buffer.from(this.#packetInBytes).readDoubleBE(index);
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  readFloat (index) {
    if (typeof index === 'undefined') {
      index = this.#readIndex;
      this.#readIndex += 4;
    }

    if (Number.isInteger(index) && index < this.#packetInBytes.length - 3) {
      return Buffer.from(this.#packetInBytes).readFloatBE(index);
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  get length () {
    return this.readInteger(0);
  }

  get bytesLength () {
    return this.#packetInBytes.length;
  }

  readBytes (length, index) {
    if (typeof length !== 'undefined' && Number.isInteger(length)) {
      if (typeof index === 'undefined') {
        index = this.#readIndex;
        this.#readIndex += length;
      }

      if (Number.isInteger(index) && index < this.#packetInBytes.length + 1 - length) {
        const newBytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          newBytes[i] = this.#packetInBytes[i + index];
        }
        return newBytes;
      }
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  readLong (index) {
    if (typeof index === 'undefined') {
      index = this.#readIndex;
      this.#readIndex += 8;
    }

    if (Number.isInteger(index) && index < this.#packetInBytes.length - 7) {
      return Number(Buffer.from(this.#packetInBytes).readBigInt64BE(index));
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  readString (index, charset) {
    if (Buffer.isEncoding(index) && typeof (charset) === 'undefined') {
      charset = index;
      index = undefined;
    }

    if (typeof index === 'undefined') {
      index = this.#readIndex;
      this.#readIndex += (2 + this.readUShort(this.#readIndex));
    }

    if (typeof charset === 'undefined') {
      charset = 'latin1';
    }

    if (Number.isInteger(index) && Buffer.isEncoding(charset)) {
      const length = this.readUShort(index);
      index += 2;
      if (index < this.#packetInBytes.length + 1 - length) {
        return Buffer.from(this.#packetInBytes).toString(charset, index, index + length);
      }
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  readLongString (index, charset) {
    if (Buffer.isEncoding(index) && typeof (charset) === 'undefined') {
      charset = index;
      index = undefined;
    }

    if (typeof index === 'undefined') {
      index = this.#readIndex;
      this.#readIndex += (4 + this.readUShort(this.#readIndex));
    }

    if (typeof charset === 'undefined') {
      charset = 'latin1';
    }

    if (Number.isInteger(index) && Buffer.isEncoding(charset)) {
      const length = this.readInteger(index);
      index += 4;
      if (index < this.#packetInBytes.length + 1 - length) {
        return Buffer.from(this.#packetInBytes).toString(charset, index, index + length);
      }
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  readBoolean (index) {
    if (typeof index === 'undefined') {
      index = this.#readIndex;
      this.#readIndex++;
    }

    if (Number.isInteger(index) && index < this.#packetInBytes.length) {
      return this.readByte(index) !== 0;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  read (structure) {
    if (typeof structure !== 'string') {
      throw new Error('Invalid argument(s) passed');
    }

    const result = [];

    for (const c of structure) {
      switch (c) {
        case 'b':
          result.push(this.readByte());
          break;
        case 'i':
          result.push(this.readInteger());
          break;
        case 's':
          result.push(this.readShort());
          break;
        case 'u':
          result.push(this.readUShort());
          break;
        case 'l':
          result.push(this.readLong());
          break;
        case 'd':
          result.push(this.readDouble());
          break;
        case 'f':
          result.push(this.readFloat());
          break;
        case 'B':
          result.push(this.readBoolean());
          break;
        case 'S':
          result.push(this.readString());
          break;
        default:
          throw new Error("Invalid structure string, '" + c + "' undefined");
      }
    }

    return result;
  }

  replaceBoolean (index, b) {
    if (Number.isInteger(index) && index < this.#packetInBytes.length && typeof (b) === 'boolean') {
      this.#isEdited = true;
      this.#packetInBytes[index] = b ? 1 : 0;
      return this;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  replaceInt (index, i) {
    if (Number.isInteger(index) && index < this.#packetInBytes.length - 3 && Number.isInteger(i)) {
      this.#isEdited = true;
      const buffer = Buffer.from(this.#packetInBytes);
      buffer.writeInt32BE(i, index);
      this.#packetInBytes = new Uint8Array(buffer);
      return this;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  replaceLong (index, l) {
    if (Number.isInteger(index) && index < this.#packetInBytes.length - 7 && Number.isInteger(l)) {
      this.#isEdited = true;
      const buffer = Buffer.from(this.#packetInBytes);
      buffer.writeBigInt64BE(BigInt(l), index);
      this.#packetInBytes = new Uint8Array(buffer);
      return this;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  replaceDouble (index, d) {
    if (Number.isInteger(index) && index < this.#packetInBytes.length - 7 && typeof (d) === 'number') {
      this.#isEdited = true;
      const buffer = Buffer.from(this.#packetInBytes);
      buffer.writeDoubleBE(d, index);
      this.#packetInBytes = new Uint8Array(buffer);
      return this;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  replaceFloat (index, f) {
    if (Number.isInteger(index) && index < this.#packetInBytes.length - 3 && typeof (f) === 'number') {
      this.#isEdited = true;
      const buffer = Buffer.from(this.#packetInBytes);
      buffer.writeFloatBE(f, index);
      this.#packetInBytes = new Uint8Array(buffer);
      return this;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  replaceByte (index, b) {
    if (Number.isInteger(index) && index < this.#packetInBytes.length && typeof (b) === 'number') {
      this.#isEdited = true;
      const buffer = Buffer.from(this.#packetInBytes);
      buffer.writeUInt8(b, index);
      this.#packetInBytes = new Uint8Array(buffer);
      return this;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  replaceBytes (index, bytes) {
    if (bytes instanceof Uint8Array && Number.isInteger(index) && index < this.#packetInBytes.length + 1 - bytes.length) {
      this.#isEdited = true;
      for (let i = 0; index + i < this.#packetInBytes.length && i < bytes.length; i++) {
        this.replaceByte(index + i, bytes[i]);
      }
      return this;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  replaceUShort (index, ushort) {
    if (Number.isInteger(index) && index < this.#packetInBytes.length - 1 && typeof (ushort) === 'number') {
      this.#isEdited = true;
      const buffer = Buffer.from(this.#packetInBytes);
      buffer.writeUInt16BE(ushort, index);
      this.#packetInBytes = new Uint8Array(buffer);
      return this;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  replaceShort (index, s) {
    if (Number.isInteger(index) && index < this.#packetInBytes.length - 1 && typeof (s) === 'number') {
      this.#isEdited = true;
      const buffer = Buffer.from(this.#packetInBytes);
      buffer.writeInt16BE(s, index);
      this.#packetInBytes = new Uint8Array(buffer);
      return this;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  replaceString (index, s, encoding = 'latin1') {
    if (Number.isInteger(index) && index < this.#packetInBytes.length - 1 && typeof (s) === 'string' && Buffer.isEncoding(encoding)) {
      this.#isEdited = true;
      const stringBuffer = Buffer.from(s, encoding);

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + stringBuffer.length - this.readUShort(index)));

      newPacketInBytes.set(this.#packetInBytes.slice(0, index));
      newPacketInBytes.set(stringBuffer, index + 2);
      newPacketInBytes.set(this.#packetInBytes.slice(index + 2 + this.readUShort(index)), index + 2 + stringBuffer.length);

      this.#packetInBytes = newPacketInBytes;

      this.replaceUShort(index, stringBuffer.length);

      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  canReadString (index) {
    if (Number.isInteger(index)) {
      if (index < this.#packetInBytes.length - 1) {
        const l = this.readUShort(index);
        if (index + 1 + l < this.#packetInBytes.length) {
          return true;
        }
      }
      return false;
    }

    throw new Error('Invalid argument(s) passed or read index out of bounds');
  }

  replaceFirstString (oldS, newS) {
    if (typeof (oldS) === 'string' && typeof (newS) === 'string') {
      return this.replaceXStrings(oldS, newS, 1);
    }

    throw new Error('Invalid argument(s) passed');
  }

  replaceXStrings (oldS, newS, amount) {
    if (Number.isInteger(amount) && typeof (oldS) === 'string' && typeof (newS) === 'string') {
      if (amount === 0) return this;

      let i = 6;
      while (i < this.#packetInBytes.length - 1 - oldS.length) {
        if (this.readUShort(i) === oldS.length && this.readString(i) === oldS) {
          this.replaceString(i, newS);
          i += 1 + newS.length;
          amount -= 1;
          if (amount === 0) return this;
        }
        i++;
      }
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  replaceAllStrings (oldS, newS) {
    if (typeof (oldS) === 'string' && typeof (newS) === 'string') {
      return this.replaceXStrings(oldS, newS, -1);
    }

    throw new Error('Invalid argument(s) passed');
  }

  replaceFirstSubstring (oldS, newS) {
    if (typeof (oldS) === 'string' && typeof (newS) === 'string') {
      return this.replaceXSubstrings(oldS, newS, 1);
    }

    throw new Error('Invalid argument(s) passed');
  }

  replaceXSubstrings (oldS, newS, amount) {
    if (Number.isInteger(amount) && typeof (oldS) === 'string' && typeof (newS) === 'string') {
      if (amount === 0) return this;

      let max = this.#packetInBytes.length;
      let i = this.#packetInBytes.length - 2 - oldS.length;
      while (i >= 6) {
        if (this.canReadString(i)) {
          const s = this.readString(i);
          if (s.contains(oldS) && i + 2 + s.length <= max) {
            const replacement = s.replaceAll(oldS, newS);

            this.replaceString(i, replacement);
            i -= (1 + oldS.length);
            amount -= 1;
            if (amount === 0) return this;

            max = i;
          }
        }
        i--;
      }
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  replaceAllSubstrings (oldS, newS) {
    if (typeof (oldS) === 'string' && typeof (newS) === 'string') {
      return this.replaceXSubstrings(oldS, newS, -1);
    }

    throw new Error('Invalid argument(s) passed');
  }

  replaceAllIntegers (val, replacement) {
    if (Number.isInteger(val) && Number.isInteger(replacement)) {
      let i = 6;
      while (i < this.#packetInBytes.length - 3) {
        if (this.readInteger(i) === val) {
          this.replaceInt(i, replacement);
          i += 3;
        }
        i++;
      }
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  appendInt (i) {
    if (Number.isInteger(i)) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 4));
      newPacketInBytes.set(this.#packetInBytes);
      this.#packetInBytes = newPacketInBytes;

      this.replaceInt(this.#packetInBytes.length - 4, i);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  appendLong (l) {
    if (Number.isInteger(l)) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 8));
      newPacketInBytes.set(this.#packetInBytes);
      this.#packetInBytes = newPacketInBytes;

      this.replaceLong(this.#packetInBytes.length - 8, l);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  appendDouble (d) {
    if (typeof (d) === 'number') {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 8));
      newPacketInBytes.set(this.#packetInBytes);
      this.#packetInBytes = newPacketInBytes;

      this.replaceDouble(this.#packetInBytes.length - 8, d);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  appendFloat (f) {
    if (typeof (f) === 'number') {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 4));
      newPacketInBytes.set(this.#packetInBytes);
      this.#packetInBytes = newPacketInBytes;

      this.replaceDouble(this.#packetInBytes.length - 4, f);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  appendByte (b) {
    if (Number.isInteger(b)) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 1));
      newPacketInBytes.set(this.#packetInBytes);
      this.#packetInBytes = newPacketInBytes;

      this.replaceByte(this.#packetInBytes.length - 1, b);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  appendBytes (bytes) {
    if (bytes instanceof Uint8Array) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + bytes.length));
      newPacketInBytes.set(this.#packetInBytes);
      this.#packetInBytes = newPacketInBytes;

      for (let i = 0; i < bytes.length; i++) {
        this.#packetInBytes[this.#packetInBytes.length - bytes.length + i] = bytes[i];
      }

      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  appendBoolean (b) {
    if (typeof (b) === 'boolean') {
      this.#isEdited = true;
      this.appendByte(b ? 1 : 0);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  appendUShort (ushort) {
    if (Number.isInteger(ushort)) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 2));
      newPacketInBytes.set(this.#packetInBytes);
      this.#packetInBytes = newPacketInBytes;

      const uShortBuffer = Buffer.alloc(4);
      uShortBuffer.writeUInt16BE(ushort, 2);
      const ushortArray = new Uint8Array(uShortBuffer);

      for (let i = 2; i < 4; i++) {
        this.#packetInBytes[this.#packetInBytes.length - 4 + i] = ushortArray[i];
      }

      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  appendShort (s) {
    if (Number.isInteger(s)) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 2));
      newPacketInBytes.set(this.#packetInBytes);
      this.#packetInBytes = newPacketInBytes;

      this.replaceShort(this.#packetInBytes.length - 2, s);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  appendString (s, encoding = 'latin1') {
    if (typeof (s) === 'string' && Buffer.isEncoding(encoding)) {
      this.#isEdited = true;
      const stringArray = new Uint8Array(Buffer.from(s, encoding));
      this.appendUShort(stringArray.length);
      this.appendBytes(stringArray);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  appendLongString (s, encoding = 'latin1') {
    if (typeof (s) === 'string' && Buffer.isEncoding(encoding)) {
      this.#isEdited = true;
      const stringArray = new Uint8Array(Buffer.from(s, encoding));
      this.appendInt(stringArray.length);
      this.appendBytes(stringArray);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  append (structure, ...objects) {
    if (typeof structure !== 'string' && Array.isArray(objects) && objects.length !== structure.length) {
      throw new Error('Invalid argument(s) passed');
    }

    for (let i = 0; i < structure.length; i++) {
      const o = objects[i];
      const c = structure.charAt(i);

      switch (c) {
        case 'b':
          this.appendByte(o);
          break;
        case 'i':
          this.appendInt(o);
          break;
        case 's':
          this.appendShort(o);
          break;
        case 'u':
          this.appendUShort(o);
          break;
        case 'l':
          this.appendLong(o);
          break;
        case 'd':
          this.appendDouble(o);
          break;
        case 'f':
          this.appendDouble(o);
          break;
        case 'B':
          this.appendBoolean(o);
          break;
        case 'S':
          this.appendString(o);
          break;
        default:
          throw new Error("Invalid structure string, '" + c + "' undefined");
      }
    }

    return this;
  }

  insertInt (index, i) {
    if (Number.isInteger(index) && Number.isInteger(i) && index < this.#packetInBytes.length && index >= 6) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 4));
      newPacketInBytes.set(this.#packetInBytes.slice(0, index));
      newPacketInBytes.set(this.#packetInBytes.slice(index), index + 4);
      this.#packetInBytes = newPacketInBytes;

      this.replaceInt(index, i);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  insertLong (index, l) {
    if (Number.isInteger(index) && Number.isInteger(l) && index < this.#packetInBytes.length && index >= 6) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 8));
      newPacketInBytes.set(this.#packetInBytes.slice(0, index));
      newPacketInBytes.set(this.#packetInBytes.slice(index), index + 8);
      this.#packetInBytes = newPacketInBytes;

      this.replaceLong(index, l);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  insertDouble (index, d) {
    if (Number.isInteger(index) && typeof d === 'number' && index < this.#packetInBytes.length && index >= 6) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 8));
      newPacketInBytes.set(this.#packetInBytes.slice(0, index));
      newPacketInBytes.set(this.#packetInBytes.slice(index), index + 8);
      this.#packetInBytes = newPacketInBytes;

      this.replaceDouble(index, d);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  insertFloat (index, f) {
    if (Number.isInteger(index) && typeof f === 'number' && index < this.#packetInBytes.length && index >= 6) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 4));
      newPacketInBytes.set(this.#packetInBytes.slice(0, index));
      newPacketInBytes.set(this.#packetInBytes.slice(index), index + 4);
      this.#packetInBytes = newPacketInBytes;

      this.replaceFloat(index, f);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  insertByte (index, b) {
    if (Number.isInteger(index) && Number.isInteger(b) && index < this.#packetInBytes.length && index >= 6) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 1));
      newPacketInBytes.set(this.#packetInBytes.slice(0, index));
      newPacketInBytes.set(this.#packetInBytes.slice(index), index + 1);
      this.#packetInBytes = newPacketInBytes;

      this.replaceByte(index, b);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  insertBytes (index, bytes) {
    if (Number.isInteger(index) && bytes instanceof Uint8Array && index < this.#packetInBytes.length && index >= 6) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + bytes.length));
      newPacketInBytes.set(this.#packetInBytes.slice(0, index));
      newPacketInBytes.set(this.#packetInBytes.slice(index), index + bytes.length);
      this.#packetInBytes = newPacketInBytes;

      this.replaceBytes(index, bytes);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  insertBoolean (index, b) {
    if (Number.isInteger(index) && (typeof b === 'boolean') && index < this.#packetInBytes.length && index >= 6) {
      this.#isEdited = true;

      this.insertByte(index, b ? 1 : 0);
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  insertUShort (index, ushort) {
    if (Number.isInteger(index) && Number.isInteger(ushort) && ushort >= 0 && index < this.#packetInBytes.length && index >= 6) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 2));
      newPacketInBytes.set(this.#packetInBytes.slice(0, index));
      newPacketInBytes.set(this.#packetInBytes.slice(index), index + 2);
      this.#packetInBytes = newPacketInBytes;

      this.replaceUShort(index, ushort);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  insertShort (index, s) {
    if (Number.isInteger(index) && Number.isInteger(s) && index < this.#packetInBytes.length && index >= 6) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 2));
      newPacketInBytes.set(this.#packetInBytes.slice(0, index));
      newPacketInBytes.set(this.#packetInBytes.slice(index), index + 2);
      this.#packetInBytes = newPacketInBytes;

      this.replaceShort(index, s);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  insertString (index, s, encoding = 'latin1') {
    if (typeof (s) === 'string' && Buffer.isEncoding(encoding) && index < this.#packetInBytes.length && index >= 6) {
      this.#isEdited = true;

      const newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 2));
      newPacketInBytes.set(this.#packetInBytes.slice(0, index));
      newPacketInBytes.set(this.#packetInBytes.slice(index), index + 2);
      this.#packetInBytes = newPacketInBytes;

      this.replaceString(index, s);
      this.fixLength();
      return this;
    }

    throw new Error('Invalid argument(s) passed');
  }

  insert (index, structure, ...objects) {
    if (typeof structure !== 'string' && Array.isArray(objects) && objects.length !== structure.length && index < this.#packetInBytes.length && index >= 6) {
      throw new Error('Invalid argument(s) passed');
    }

    for (let i = structure.length - 1; i >= 0; i--) {
      const o = objects[i];
      const c = structure.charAt(i);

      switch (c) {
        case 'b':
          this.insertByte(index, o);
          break;
        case 'i':
          this.insertInt(index, o);
          break;
        case 's':
          this.insertShort(index, o);
          break;
        case 'u':
          this.insertUShort(index, o);
          break;
        case 'l':
          this.insertLong(index, o);
          break;
        case 'd':
          this.insertDouble(index, o);
          break;
        case 'f':
          this.insertDouble(index, o);
          break;
        case 'B':
          this.insertBoolean(index, o);
          break;
        case 'S':
          this.insertString(index, o);
          break;
        default:
          throw new Error("Invalid structure string, '" + c + "' undefined");
      }
    }

    return this;
  }

  isReplaced () {
    return this.#isEdited;
  }

  fixLength () {
    const remember = this.#isEdited;
    this.replaceInt(0, this.#packetInBytes.length - 4);
    this.#isEdited = remember;
  }

  overrideEditedField (edited) {
    if (typeof (edited) === 'boolean') {
      this.#isEdited = edited;
      return;
    }

    throw new Error('Invalid argument(s) passed');
  }

  toExpression (structure) {
    if (typeof structure !== 'string') {
      throw new Error('Invalid argument(s) passed');
    }

    let exp = '';
    if (this.#identifier !== null && this.#identifierDirection !== null) {
      exp += `{${this.#identifierDirection === HDirection.TOCLIENT ? 'in' : 'out'}:${this.#identifier}}`;
    } else {
      exp += `{h:${this.headerId()}}`;
    }

    const readIndex = this.#readIndex;
    this.resetReadIndex();
    const objects = this.read(structure);
    this.#readIndex = readIndex;

    for (let i = 0; i < structure.length; i++) {
      const c = structure.charAt(i);
      const o = objects[i];

      if (typeof o === 'string') {
        exp += `{${c.toLowerCase()}:"${o}"}`;
      } else {
        exp += `{${c.toLowerCase()}:${o}}`;
      }
    }

    return exp;
  }

  stringify () {
    return (this.#isEdited ? '1' : '0') + Buffer.from(this.#packetInBytes).toString('latin1');
  }

  constructFromString (str) {
    if (typeof (str) === 'string') {
      this.#isEdited = str.charAt(0) === '1';
      const buffer = Buffer.from(str.substring(1), 'latin1');
      this.#packetInBytes = new Uint8Array(buffer);
      return;
    }

    throw new Error('Invalid argument(s) passed');
  }

  equals (packet) {
    if (!(packet instanceof HPacket)) return false;

    return typedArraysAreEqual(this.#packetInBytes, packet.#packetInBytes) && (this.#isEdited === packet.#isEdited);
  }
}

// compare TypedArrays
function typedArraysAreEqual (a, b) {
  if (a.byteLength !== b.byteLength) return false;
  return a.every((val, i) => val === b[i]);
}

const replaceAll = (str, regex, replacer) => {
  [...str.matchAll(regex)].forEach(match => {
    str = str.replaceAll(match[0], replacer(match[1]).replaceAll('$', '$$$$'));
  });

  return str;
};

const fromString = (packet) => {
  if (typeof (packet) !== 'string') {
    throw new Error('PacketStringUtils.fromString: packet must be a string');
  }

  let fixLengthLater = false;
  if (packet.startsWith('{l}')) {
    packet = packet.substring(3);
  }

  if (packet.startsWith('{h:')) {
    fixLengthLater = true;
  }

  packet = replaceAll(packet, /{i:(-?\d+)}/g,
    m => {
      const buffer = Buffer.alloc(4);
      buffer.writeInt32BE(m);
      return toString(new Uint8Array(buffer));
    }
  );

  packet = replaceAll(packet, /{l:(-?\d+)}/g,
    m => {
      m = BigInt(m);
      const buffer = Buffer.alloc(8);
      buffer.writeBigInt64BE(m);
      return toString(new Uint8Array(buffer));
    }
  );

  packet = replaceAll(packet, /{d:(-?\d*\.\d*)}/g,
    m => {
      const buffer = Buffer.alloc(8);
      buffer.writeDoubleBE(m);
      return toString(new Uint8Array(buffer));
    }
  );

  packet = replaceAll(packet, /{u:(\d+)}/g,
    m => {
      const buffer = Buffer.alloc(2);
      buffer.writeUInt16BE(m);
      return toString(new Uint8Array(buffer));
    }
  );

  packet = replaceAll(packet, /{h:(-?\d+)}/g,
    m => {
      const buffer = Buffer.alloc(2);
      buffer.writeInt16BE(m);
      return toString(new Uint8Array(buffer));
    }
  );

  packet = replaceAll(packet, /{b:([Ff]alse|[Tt]rue)}/g,
    m => m.toLowerCase() === 'true' ? '[1]' : '[0]');

  packet = replaceAll(packet, /{b:(\d{1,3})}/g,
    m => '[' + m + ']');

  while (packet.includes('{s:"')) {
    const start = packet.indexOf('{s:"');
    let end = -1;
    let valid;
    do {
      end = packet.indexOf('"}', end + 1);

      valid = false;
      if (end !== -1) {
        let amountBackslashes = 0;
        let pos = end - 1;

        while (pos >= start + 4 && packet.charAt(pos) === '\\') {
          amountBackslashes++;
          pos--;
        }

        valid = amountBackslashes % 2 === 0;
      }
    } while (end !== -1 && !valid);

    if (end === -1) {
      throw new Error('PacketStringUtils.toString: InvalidPacketException');
    }

    let match = packet.substring(start + 4, end);
    let actualString = '';

    while (match.includes('\\')) {
      const index = match.indexOf('\\');

      const c = match.charAt(index + 1);
      actualString += match.substring(0, index);

      switch (c) {
        case '"':
          actualString += '"';
          match = match.substring(index + 2);
          break;
        case 'r':
          actualString += '\r';
          match = match.substring(index + 2);
          break;
        case '\\':
          actualString += '\\';
          match = match.substring(index + 2);
          break;
        default:
          throw new Error('PacketStringUtils.toString: InvalidPacketException');
      }
    }
    actualString += match;

    const latin = Buffer.from(actualString, 'utf8').toString('latin1');
    const temp = new HPacket(0);
    temp.appendString(latin, 'latin1');

    packet = packet.substring(0, start) +
      toString(temp.readBytes(latin.length + 2, 6)) +
      packet.substring(end + 2);
  }

  const identifier = [null];
  if (!fixLengthLater && packet.startsWith('{')) {
    packet = replaceAll(packet, /^{((in|out):[^:{}]*)}/g, m => {
      identifier[0] = m;
      return '[255][255]';
    });
  }
  if (identifier[0] != null) fixLengthLater = true;

  if (packet.includes('{') || packet.includes('}')) {
    throw new Error('PacketStringUtils.toString: InvalidPacketException');
  }

  const corrupted = [false];
  packet = replaceAll(packet, /\[(\d{1,3})]/g, m => {
    if (m < 0 || m >= 256) {
      corrupted[0] = true;
      return '';
    }
    return Buffer.from(new Uint8Array([m])).toString('latin1');
  });
  if (corrupted[0]) {
    throw new Error('PacketStringUtils.toString: InvalidPacketException');
  }

  let packetInBytes = new Uint8Array(Buffer.from(packet, 'latin1'));
  if (fixLengthLater) {
    const combined = new Uint8Array(Buffer.alloc(packetInBytes.length + 4));
    combined.set(packetInBytes, 4);
    packetInBytes = combined;
  }

  const hPacket = new HPacket(packetInBytes);
  if (fixLengthLater) {
    hPacket.fixLength();
  }

  if (identifier[0] != null) {
    const split = identifier[0].split(':');
    hPacket.identifierDirection = split[0] === 'in' ? HDirection.TOCLIENT : HDirection.TOSERVER;
    hPacket.identifier = split[1];
  }

  return hPacket;
};

const toString = (packet) => {
  if (!(packet instanceof Uint8Array)) {
    throw new Error('PacketStringUtils.toString: packet must be an instance of Uint8Array');
  }

  let result = '';

  for (let i = 0; i < packet.length; i++) {
    const x = packet[i];
    if ((x < 32 && x >= 0) || x < -96 || x === 93 || x === 91 || x === 125 || x === 123 || x === 127) {
      result += '[' + ((x + 256) % 256) + ']';
    } else {
      result += Buffer.from(new Uint8Array([x])).toString('latin1');
    }
  }

  return result;
};

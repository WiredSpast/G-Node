let { HDirection } = require("./hdirection");
const {PacketInfoManager} = require("../services/packetinfo/packetinfomanager");

class HPacket {
    #isEdited = false;
    #packetInBytes;
    #readIndex = 6;

    #identifier = null;
    #identifierDirection = null;

    constructor(...args) {
        if(args.length > 0) {
            if(typeof(args[0]) == 'number') {
                if(args.length > 1 && args[1] instanceof Uint8Array) {
                    this.#constructFromHeaderIdAndBytesArray(args[0], args[1]);
                    return;
                } else {
                    this.#constructFromHeaderId(args[0]);
                    return;
                }
            } else if(typeof(args[0]) == 'string') {
                if(args.length > 1 && (args[1] === HDirection.TOCLIENT || args[1] === HDirection.TOSERVER)) {
                    this.#constructFromIdentifierAndDirection(args[0], args[1]);
                    return;
                } else {
                    this.#constructFromString(args[0]);
                    return;
                }
            } else if(args[0] instanceof HPacket) {
                this.#constructFromPacket(args[0]);
                return;
            } else if(args[0] instanceof Uint8Array) {
                this.#constructFromBytesArray(args[0]);
                return;
            }
        }

        throw new Error("Invalid constructor arguments");
    }

    #constructFromBytesArray(packet) {
        this.#packetInBytes = packet.slice(0);
    }

    #constructFromPacket(packet) {
        this.#packetInBytes = packet.#packetInBytes.slice(0);
        this.#isEdited = packet.#isEdited;
    }

    #constructFromHeaderId(headerId) {
        this.#packetInBytes = new Uint8Array([0, 0, 0, 2, 0, 0]);
        this.replaceShort(4, headerId);
        this.#isEdited = false;
    }

    #constructFromHeaderIdAndBytesArray(headerId, bytes) {
        this.#constructFromHeaderId(headerId);
        this.appendBytes(bytes);
        this.#isEdited = false;
    }

    #constructFromIdentifierAndDirection(identifier, direction) {
        this.#packetInBytes = new Uint8Array([0, 0, 0, 2, -1, -1]);
        this.#identifier = identifier;
        this.#identifierDirection = direction;
    }

    #constructFromString(str) {
        let packet = fromString(str);
        this.#constructFromPacket(packet);
        this.#identifier = packet.#identifier;
        this.#identifierDirection = packet.#identifierDirection;
    }

    toString() {
        return toString(this.toBytes());
    }

    // TODO structureEquals(structure) {}

    isEOF() {
        if(this.#readIndex < this.getBytesLength()) return 0;
        if(this.#readIndex > this.getBytesLength()) return 2;
        return 1;
    }

    setIdentifier(identifier) {
        if(typeof(identifier) != "string") {
            throw new Error("Invalid argument(s) passed");
        }

        this.#identifier = identifier;
    }

    setIdentifierDirection(identifierDirection) {
        if(identifierDirection !== HDirection.TOCLIENT && identifierDirection !== HDirection.TOSERVER) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#identifierDirection = identifierDirection;
    }

    getIdentifier() {
        return this.#identifier;
    }

    canComplete(packetInfoManager) {
        if(!(packetInfoManager instanceof PacketInfoManager)) {
            throw new Error("Invalid arguments passed");
        }

        if(this.isCorrupted() || this.#identifier === null) return false;

        let packetInfo = packetInfoManager.getPacketInfoFromName(this.#identifierDirection, this.#identifier);
        if(packetInfo === null) {
            packetInfo = packetInfoManager.getPacketInfoFromName(this.#identifierDirection, this.#identifier);
            return packetInfo !== null;
        }

        return true;
    }

    canSendToClient() {
        return this.#identifierDirection == null || this.#identifierDirection === HDirection.TOCLIENT;
    }

    canSendToServer() {
        return this.#identifierDirection == null || this.#identifierDirection === HDirection.TOSERVER;
    }

    completePacket(packetInfoManager) {
        if(!(packetInfoManager instanceof PacketInfoManager)) {
            throw new Error("Invalid arguments passed");
        }

        if(this.isCorrupted() || this.#identifier === null) return;

        let packetInfo = packetInfoManager.getPacketInfoFromName(this.#identifierDirection, this.#identifier);
        if(packetInfo === null) {
            packetInfo = packetInfoManager.getPacketInfoFromName(this.#identifierDirection, this.#identifier);
            if(packetInfo === null) return;
        }

        let wasEdited = this.#isEdited;
        this.replaceShort(4, packetInfo.getHeaderId());
        this.#identifier = null;

        this.#isEdited = wasEdited;
    }

    isPacketComplete() {
        return this.#identifier == null;
    }

    toBytes() {
        return this.#packetInBytes;
    }

    getReadIndex() {
        return this.#readIndex;
    }

    setReadIndex(number) {
        if(!Number.isInteger(number)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#readIndex = number;
    }

    resetReadIndex() {
        this.setReadIndex(6);
    }

    isCorrupted() {
        if(this.#packetInBytes.length >= 6) {
            if(this.length() === this.getBytesLength() - 4) {
                return false;
            }
        }
        return true;
    }

    readByte(index) {
        if(typeof index === 'undefined') {
            if (this.#readIndex < this.#packetInBytes.length) {
                return this.#packetInBytes[this.#readIndex++];
            }
        } else if(Number.isInteger(index) && index < this.#packetInBytes.length) {
            return this.#packetInBytes[index];
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    readShort(index) {
        if(typeof index === 'undefined') {
            index = this.#readIndex;
            this.#readIndex += 2;
        }

        if(Number.isInteger(index) && index < this.#packetInBytes.length - 1) {
            return Buffer.from(this.#packetInBytes).readInt16BE(index);
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    readUShort(index) {
        if(typeof index === 'undefined') {
            index = this.#readIndex;
            this.#readIndex += 2;
        }

        if(Number.isInteger(index) && index < this.#packetInBytes.length - 1) {
            return Buffer.from(this.#packetInBytes).readUInt16BE(index);
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    headerId() {
        return this.readShort(4);
    }

    readInteger(index) {
        if(typeof index === 'undefined') {
            index = this.#readIndex;
            this.#readIndex += 4;
        }

        if(Number.isInteger(index) && index < this.#packetInBytes.length - 3) {
            return Buffer.from(this.#packetInBytes).readInt32BE(index);
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    readDouble(index) {
        if(typeof index === 'undefined') {
            index = this.#readIndex;
            this.#readIndex += 8;
        }

        if(Number.isInteger(index) && index < this.#packetInBytes.length - 7) {
            return Buffer.from(this.#packetInBytes).readDoubleBE(index);
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    readFloat(index) {
        if(typeof index === 'undefined') {
            index = this.#readIndex;
            this.#readIndex += 4;
        }

        if(Number.isInteger(index) && index < this.#packetInBytes.length - 3) {
            return Buffer.from(this.#packetInBytes).readFloatBE(index);
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    length() {
        return this.readInteger(0);
    }

    getBytesLength() {
        return this.#packetInBytes.length;
    }

    readBytes(length, index) {
        if(typeof length !== 'undefined' && Number.isInteger(length)) {
            if (typeof index === 'undefined') {
                index = this.#readIndex;
                this.#readIndex += length;
            }

            if(Number.isInteger(index) && index < this.#packetInBytes.length + 1 - length) {
                let newBytes = new Uint8Array(length);
                for(let i = 0; i < length; i++) {
                    newBytes[i] = this.#packetInBytes[i + index];
                }
                return newBytes;
            }
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    readLong(index) {
        if(typeof index === 'undefined') {
            index = this.#readIndex;
            this.#readIndex += 8;
        }

        if(Number.isInteger(index) && index < this.#packetInBytes.length - 7) {
            return Number(Buffer.from(this.#packetInBytes).readBigInt64BE(index));
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    readString(index, charset) {
        if(Buffer.isEncoding(index) && typeof(charset) === "undefined") {
            charset = index;
            index = undefined;
        }

        if(typeof index === 'undefined') {
            index = this.#readIndex;
            this.#readIndex += (2 + this.readUShort(this.#readIndex));
        }

        if(typeof charset === 'undefined') {
            charset = 'latin1';
        }

        if(Number.isInteger(index) && Buffer.isEncoding(charset)) {
            let length = this.readUShort(index);
            index += 2;
            if(index < this.#packetInBytes.length + 1 - length) {
                return Buffer.from(this.#packetInBytes).toString(charset, index, index + length);
            }
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    readLongString(index, charset) {
        if(Buffer.isEncoding(index) && typeof(charset) === "undefined") {
            charset = index;
            index = undefined;
        }

        if(typeof index === 'undefined') {
            index = this.#readIndex;
            this.#readIndex += (4 + this.readUShort(this.#readIndex));
        }

        if(typeof charset === 'undefined') {
            charset = 'latin1';
        }

        if(Number.isInteger(index) && Buffer.isEncoding(charset)) {
            let length = this.readInteger(index);
            index += 4;
            if(index < this.#packetInBytes.length + 1 - length) {
                return Buffer.from(this.#packetInBytes).toString(charset, index, index + length);
            }
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    readBoolean(index) {
        if(typeof index === 'undefined') {
            index = this.#readIndex;
            this.#readIndex++;
        }

        if(Number.isInteger(index) && index < this.#packetInBytes.length) {
            return this.readByte(index) !== 0;
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    read(structure) {
        if(typeof structure !== 'string') {
            throw new Error("Invalid argument(s) passed");
        }

        let result = [];

        for(let c of structure) {
            switch(c) {
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

    replaceBoolean(index, b) {
        if(Number.isInteger(index) && index < this.#packetInBytes.length && typeof(b) === "boolean") {
            this.#isEdited = true;
            this.#packetInBytes[index] = b ? 1 : 0;
            return this;
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    replaceInt(index, i) {
        if(Number.isInteger(index) && index < this.#packetInBytes.length - 3 && Number.isInteger(i)) {
            this.#isEdited = true;
            let buffer = Buffer.from(this.#packetInBytes);
            buffer.writeInt32BE(i, index);
            this.#packetInBytes = new Uint8Array(buffer);
            return this;
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    replaceLong(index, l) {
        if(Number.isInteger(index) && index < this.#packetInBytes.length - 7 && Number.isInteger(l)) {
            this.#isEdited = true;
            let buffer = Buffer.from(this.#packetInBytes);
            buffer.writeBigInt64BE(BigInt(l), index);
            this.#packetInBytes = new Uint8Array(buffer);
            return this;
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    replaceDouble(index, d) {
        if(Number.isInteger(index) && index < this.#packetInBytes.length - 7 && typeof(d) === "number") {
            this.#isEdited = true;
            let buffer = Buffer.from(this.#packetInBytes);
            buffer.writeDoubleBE(d, index);
            this.#packetInBytes = new Uint8Array(buffer);
            return this;
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    replaceFloat(index, f) {
        if(Number.isInteger(index) && index < this.#packetInBytes.length - 3 && typeof(f) === "number") {
            this.#isEdited = true;
            let buffer = Buffer.from(this.#packetInBytes);
            buffer.writeFloatBE(f, index);
            this.#packetInBytes = new Uint8Array(buffer);
            return this;
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    replaceByte(index, b) {
        if(Number.isInteger(index) && index < this.#packetInBytes.length && typeof(b) === "number") {
            this.#isEdited = true;
            let buffer = Buffer.from(this.#packetInBytes);
            buffer.writeUInt8(b, index);
            this.#packetInBytes = new Uint8Array(buffer);
            return this;
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    replaceBytes(index, bytes) {
        if(bytes instanceof Uint8Array && Number.isInteger(index) && index < this.#packetInBytes.length + 1 - bytes.length) {
            this.#isEdited = true;
            for (let i = 0; index + i < this.#packetInBytes.length && i < bytes.length; i++) {
                this.replaceByte(index + i, bytes[i]);
            }
            return this;
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    replaceUShort(index, ushort) {
        if(Number.isInteger(index) && index < this.#packetInBytes.length - 1 && typeof(ushort) === "number") {
            this.#isEdited = true;
            let buffer = Buffer.from(this.#packetInBytes);
            buffer.writeUInt16BE(ushort, index);
            this.#packetInBytes = new Uint8Array(buffer);
            return this;
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    replaceShort(index, s) {
        if(Number.isInteger(index) && index < this.#packetInBytes.length - 1 && typeof(s) === "number") {
            this.#isEdited = true;
            let buffer = Buffer.from(this.#packetInBytes);
            buffer.writeInt16BE(s, index);
            this.#packetInBytes = new Uint8Array(buffer);
            return this;
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    replaceString(index, s, encoding = 'latin8') {
        if(Number.isInteger(index) && index < this.#packetInBytes.length - 1 && typeof(s) === "string" && Buffer.isEncoding(encoding)) {
            this.#isEdited = true;
            let stringBuffer = Buffer.from(s, encoding);
            let mover = stringBuffer.length - this.readUShort(index);
            if(mover !== 0) {
                let newPacket = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + mover));
                newPacket.set(this.#packetInBytes);

                if(mover > 0) {
                    let i = newPacket.length -1;
                    while(i > index + mover + 2) {
                        newPacket[i] = this.#packetInBytes[i - mover];
                        i--;
                    }
                } else {
                    let i = index + 2 + stringBuffer.length;
                    while(i < newPacket.length) {
                        newPacket[i] = this.#packetInBytes[i - mover];
                        i++;
                    }
                }
                this.#packetInBytes = newPacket;
                this.fixLength();
            }
            this.replaceUShort(index, stringBuffer.length);
            for(let i = 0; i < stringBuffer.length; i++) {
                this.#packetInBytes[index + 2 + i] = stringBuffer[i];
            }
            return this;
        }
    }

    canReadString(index) {
        if(Number.isInteger(index)) {
            if (index < this.#packetInBytes.length - 1) {
                let l = this.readUShort(index);
                if (index + 1 + l < this.#packetInBytes.length) {
                    return true;
                }
            }
            return false;
        }

        throw new Error("Invalid argument(s) passed or read index out of bounds");
    }

    replaceFirstString(oldS, newS) {
        if(typeof(oldS) === "string" && typeof(newS) === "string") {
            return this.replaceXStrings(oldS, newS, 1);
        }

        throw new Error("Invalid argument(s) passed");
    }

    replaceXStrings(oldS, newS, amount) {
        if(Number.isInteger(amount) && typeof(oldS) === "string" && typeof(newS) === "string") {
            if(amount === 0) return this;

            let i = 6;
            while(i < this.#packetInBytes.length - 1 - oldS.length) {
                if(this.readUShort(i) === oldS.length && this.readString(i) === oldS) {
                    this.replaceString(i, newS);
                    i += 1 + newS.length;
                    amount -= 1;
                    if(amount === 0) return this;
                }
                i++;
            }
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    replaceAllStrings(oldS, newS) {
        if(typeof(oldS) === "string" && typeof(newS) === "string") {
            return this.replaceXStrings(oldS, newS, -1);
        }

        throw new Error("Invalid argument(s) passed");
    }

    replaceFirstSubstring(oldS, newS) {
        if(typeof(oldS) === "string" && typeof(newS) === "string") {
            return this.replaceXSubstrings(oldS, newS, 1);
        }

        throw new Error("Invalid argument(s) passed");
    }

    replaceXSubstrings(oldS, newS, amount) {
        if(Number.isInteger(amount) && typeof(oldS) === "string" && typeof(newS) === "string") {
            if(amount === 0) return this;

            let max = this.#packetInBytes.length;
            let i = this.#packetInBytes.length - 2 - oldS.length;
            while( i >= 6) {
                if(this.canReadString(i)) {
                    let s = this.readString(i);
                    if(s.contains(oldS) && i + 2 + s.length <= max) {
                        let replacement = s.replaceAll(oldS, newS);

                        this.replaceString(i , replacement);
                        i -= (1 + oldS.length);
                        amount -= 1;
                        if(amount === 0) return this;

                        max = i;
                    }
                }
                i--;
            }
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    replaceAllSubstrings(oldS, newS) {
        if(typeof(oldS) === "string" && typeof(newS) === "string") {
            return this.replaceXSubstrings(oldS, newS, -1);
        }

        throw new Error("Invalid argument(s) passed");
    }

    replaceAllIntegers(val, replacement) {
        if(Number.isInteger(val) && Number.isInteger(replacement)) {
            let i = 6;
            while(i < this.#packetInBytes - 3) {
                if(this.readInteger(i) === val) {
                    this.replaceInt(i, replacement);
                    i += 3;
                }
                i++;
            }
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    appendInt(i) {
        if(Number.isInteger(i)) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 4));
            newPacketInBytes.set(this.#packetInBytes);
            this.#packetInBytes = newPacketInBytes;

            this.replaceInt(this.#packetInBytes.length - 4, i);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    appendLong(l) {
        if(Number.isInteger(l)) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 8));
            newPacketInBytes.set(this.#packetInBytes);
            this.#packetInBytes = newPacketInBytes;

            this.replaceLong(this.#packetInBytes.length - 8, l);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    appendDouble(d) {
        if(typeof(d) === "number") {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 8));
            newPacketInBytes.set(this.#packetInBytes);
            this.#packetInBytes = newPacketInBytes;

            this.replaceDouble(this.#packetInBytes.length - 8, d);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    appendFloat(f) {
        if(typeof(f) === "number") {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 4));
            newPacketInBytes.set(this.#packetInBytes);
            this.#packetInBytes = newPacketInBytes;

            this.replaceDouble(this.#packetInBytes.length - 4, f);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    appendByte(b) {
        if(Number.isInteger(b)) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 1));
            newPacketInBytes.set(this.#packetInBytes);
            this.#packetInBytes = newPacketInBytes;

            this.replaceByte(this.#packetInBytes.length - 1, b);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    appendBytes(bytes) {
        if(bytes instanceof Uint8Array) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + bytes.length));
            newPacketInBytes.set(this.#packetInBytes);
            this.#packetInBytes = newPacketInBytes;

            for(let i = 0; i < bytes.length; i++) {
                this.#packetInBytes[this.#packetInBytes.length - bytes.length + i] = bytes[i];
            }

            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    appendBoolean(b) {
        if(typeof(b) === "boolean") {
            this.#isEdited = true;
            this.appendByte(b ? 1 : 0);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    appendUShort(ushort) {
        if(Number.isInteger(ushort)) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 2));
            newPacketInBytes.set(this.#packetInBytes);
            this.#packetInBytes = newPacketInBytes;

            let uShortBuffer = new Buffer.alloc(4);
            uShortBuffer.writeUInt16BE(ushort, 2);
            let ushortArray = new Uint8Array(uShortBuffer);

            for (let i = 2; i < 4; i++) {
                this.#packetInBytes[this.#packetInBytes.length - 4 + i] = ushortArray[i];
            }

            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    appendShort(s) {
        if(Number.isInteger(s)) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 2));
            newPacketInBytes.set(this.#packetInBytes);
            this.#packetInBytes = newPacketInBytes;

            this.replaceShort(this.#packetInBytes.length - 2, s);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    appendString(s, encoding = 'latin1') {
        if(typeof(s) === "string" && Buffer.isEncoding(encoding)) {
            this.#isEdited = true;
            let stringArray = new Uint8Array(Buffer.from(s, encoding));
            this.appendUShort(stringArray.length);
            this.appendBytes(stringArray);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    appendLongString(s, encoding = 'latin1') {
        if(typeof(s) === "string" && Buffer.isEncoding(encoding)) {
            this.#isEdited = true;
            let stringArray = new Uint8Array(Buffer.from(s, encoding));
            this.appendInt(stringArray.length);
            this.appendBytes(stringArray);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    insertInt(index, i) {
        if(Number.isInteger(index) && Number.isInteger(i) && index < this.#packetInBytes.length && index >= 6) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 4));
            newPacketInBytes.set(this.#packetInBytes.slice(0, index));
            newPacketInBytes.set(this.#packetInBytes.slice(index), index + 4);
            this.#packetInBytes = newPacketInBytes;

            this.replaceInt(index, i);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    insertLong(index, l) {
        if(Number.isInteger(index) && Number.isInteger(l) && index < this.#packetInBytes.length && index >= 6) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 8));
            newPacketInBytes.set(this.#packetInBytes.slice(0, index));
            newPacketInBytes.set(this.#packetInBytes.slice(index), index + 8);
            this.#packetInBytes = newPacketInBytes;

            this.replaceLong(index, l);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    insertDouble(index, d) {
        if(Number.isInteger(index) && typeof d === 'number' && index < this.#packetInBytes.length && index >= 6) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 8));
            newPacketInBytes.set(this.#packetInBytes.slice(0, index));
            newPacketInBytes.set(this.#packetInBytes.slice(index), index + 8);
            this.#packetInBytes = newPacketInBytes;

            this.replaceDouble(index, d);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    insertFloat(index, f) {
        if(Number.isInteger(index) && typeof f === 'number' && index < this.#packetInBytes.length && index >= 6) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 4));
            newPacketInBytes.set(this.#packetInBytes.slice(0, index));
            newPacketInBytes.set(this.#packetInBytes.slice(index), index + 4);
            this.#packetInBytes = newPacketInBytes;

            this.replaceFloat(index, f);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    insertByte(index, b) {
        if(Number.isInteger(index) && Number.isInteger(b) && index < this.#packetInBytes.length && index >= 6) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 1));
            newPacketInBytes.set(this.#packetInBytes.slice(0, index));
            newPacketInBytes.set(this.#packetInBytes.slice(index), index + 1);
            this.#packetInBytes = newPacketInBytes;

            this.replaceByte(index, b);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    insertBytes(index, bytes) {
        if(Number.isInteger(index) && bytes instanceof Uint8Array && index < this.#packetInBytes.length && index >= 6) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + bytes.length));
            newPacketInBytes.set(this.#packetInBytes.slice(0, index));
            newPacketInBytes.set(this.#packetInBytes.slice(index), index + bytes.length);
            this.#packetInBytes = newPacketInBytes;

            this.replaceBytes(index, bytes);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    insertBoolean(index, b) {
        if(Number.isInteger(index) && (typeof b === 'boolean') < this.#packetInBytes.length && index >= 6) {
            this.#isEdited = true;

            this.insertByte(index, b ? 1 : 0);
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    insertUShort(index, ushort) {
        if(Number.isInteger(index) && Number.isInteger(ushort) && ushort >= 0 && index < this.#packetInBytes.length && index >= 6) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 2));
            newPacketInBytes.set(this.#packetInBytes.slice(0, index));
            newPacketInBytes.set(this.#packetInBytes.slice(index), index + 2);
            this.#packetInBytes = newPacketInBytes;

            this.replaceUShort(index, ushort);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    insertShort(index, s) {
        if(Number.isInteger(index) && Number.isInteger(s) && index < this.#packetInBytes.length && index >= 6) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 2));
            newPacketInBytes.set(this.#packetInBytes.slice(0, index));
            newPacketInBytes.set(this.#packetInBytes.slice(index), index + 2);
            this.#packetInBytes = newPacketInBytes;

            this.replaceShort(index, s);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    insertString(index, s, encoding = 'latin1') {
        if(typeof(s) === "string" && Buffer.isEncoding(encoding) && index < this.#packetInBytes.length && index >= 6) {
            this.#isEdited = true;

            let newPacketInBytes = new Uint8Array(new ArrayBuffer(this.#packetInBytes.length + 2));
            newPacketInBytes.set(this.#packetInBytes.slice(0, index));
            newPacketInBytes.set(this.#packetInBytes.slice(index), index + 2);
            this.#packetInBytes = newPacketInBytes;

            this.replaceString(index, s);
            this.fixLength();
            return this;
        }

        throw new Error("Invalid argument(s) passed");
    }

    isReplaced() {
        return this.#isEdited;
    }

    fixLength() {
        let remember = this.#isEdited;
        this.replaceInt(0, this.#packetInBytes.length - 4);
        this.#isEdited = remember;
    }

    overrideEditedField(edited) {
        if(typeof(edited) === "boolean") {
            this.#isEdited = edited;
            return;
        }

        throw new Error("Invalid argument(s) passed");
    }

    // TODO toExpression

    stringify() {
        return (this.#isEdited ? "1" : "0") + Buffer.from(this.#packetInBytes).toString("latin1");
    }

    constructFromString(str) {
        if(typeof(str) === "string") {
            this.#isEdited = str.charAt(0) === '1';
            let buffer = Buffer.from(str.substring(1), "latin1");
            this.#packetInBytes = new Uint8Array(buffer);
            return;
        }

        throw new Error("Invalid argument(s) passed");
    }

    equals(packet) {
        if(!(packet instanceof HPacket)) return false;

        return typedArraysAreEqual(this.#packetInBytes, packet.#packetInBytes) && (this.#isEdited === packet.#isEdited);
    }
}

// compare TypedArrays
function typedArraysAreEqual(a, b) {
    if (a.byteLength !== b.byteLength) return false;
    return a.every((val, i) => val === b[i]);
}

let replaceAll = (str, regex, replacer) => {
    [...str.matchAll(regex)].forEach(match => {
        str = str.replaceAll(match[0], replacer(match[1]));
    })

    return str;
}

let fromString = (packet) => {
    if(typeof(packet) !== "string") {
        throw new Error("Invalid arguments passed");
    }

    let fixLengthLater = false;
    if(packet.startsWith("{l}")) {
        fixLengthLater = true;
        packet = packet.substring(3);
    }

    packet = replaceAll(packet, RegExp('{i:(-?[0-9]+)}','g'),
        m => {
            let buffer = Buffer.alloc(4);
            buffer.writeInt32BE(m);
            return toString(new Uint8Array(buffer));
        }
    );

    packet = replaceAll(packet, RegExp('{l:(-?[0-9]+)}','g'),
        m => {
            m = BigInt(m);
            let buffer = Buffer.alloc(8);
            buffer.writeBigInt64BE(m);
            return toString(new Uint8Array(buffer));
        }
    );

    packet = replaceAll(packet, RegExp('{d:(-?[0-9]*\\.[0-9]*)}','g'),
        m => {
            let buffer = Buffer.alloc(8);
            buffer.writeDoubleBE(m);
            return toString(new Uint8Array(buffer));
        }
    );

    packet = replaceAll(packet, RegExp('{u:([0-9]+)}','g'),
        m => {
            let buffer = Buffer.alloc(2);
            buffer.writeUInt16BE(m);
            return toString(new Uint8Array(buffer));
        }
    );

    packet = replaceAll(packet, RegExp('{h:(-?[0-9]+)}','g'),
        m => {
            let buffer = Buffer.alloc(2);
            buffer.writeInt16BE(m);
            return toString(new Uint8Array(buffer));
        }
    );

    packet = replaceAll(packet, RegExp('{b:([Ff]alse|[Tt]rue)}','g'),
        m => m.toLowerCase() === "true" ? '[1]' : '[0]');

    packet = replaceAll(packet, RegExp('{b:([0-9]{1,3})}','g'),
        m => '[' + m + ']');

    while(packet.includes("{s:\"")) {
        let start = packet.indexOf("{s:\"");
        let end = -1;
        let valid;
        do {
            end = packet.indexOf("\"}", end + 1);

            valid = false;
            if(end !== -1) {
                let amountBackslashes = 0;
                let pos = end - 1;

                while(pos >= start + 4 && packet.charAt(pos) === '\\') {
                    amountBackslashes++;
                    pos--;
                }

                valid = amountBackslashes % 2 === 0;
            }
        } while (end !== -1 && !valid);

        if (end === -1) {
            throw new Error("PacketStringUtils: InvalidPacketException");
        }

        let match = packet.substring(start + 4, end);
        let actualString = "";

        while(match.includes("\\")) {
            let index = match.indexOf("\\");

            let c = match.charAt(index + 1);
            actualString += match.substring(0, index);

            switch(c) {
                case '"':
                    actualString += '"'
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
                    throw new Error("PacketStringUtils: InvalidPacketException");
            }
        }
        actualString += match;

        let latin = Buffer.from(actualString, "utf8").toString("latin1")
        let temp = new HPacket(0);
        temp.appendString(latin, "latin1");

        packet = packet.substring(0, start) +
            toString(temp.readBytes(latin.length + 2, 6)) +
            packet.substring(end + 2);
    }

    let identifier = [null];
    if(!fixLengthLater && packet.startsWith("{")) {
        packet = replaceAll(packet, RegExp('^{((in|out):[^:{}]*)}', 'g'), m => {
            identifier[0] = m;
            return "[255][255]";
        });
    }
    if(identifier[0] != null) fixLengthLater = true;

    if(packet.includes("{") || packet.includes("}")) {
        throw new Error("PacketStringUtils: InvalidPacketException");
    }

    let corrupted = [false];
    packet = replaceAll(packet, RegExp('\\[([0-9]{1,3})]', 'g'), m => {
        if(m < 0 || m >= 256) {
            corrupted[0] = true;
            return "";
        }
        return Buffer.from(new Uint8Array([m])).toString('latin1');
    });
    if(corrupted[0]) {
        throw new Error("PacketStringUtils: InvalidPacketException");
    }

    let packetInBytes = new Uint8Array(Buffer.from(packet, "latin1"));
    if(fixLengthLater) {
        let combined = new Uint8Array(Buffer.alloc(packetInBytes.length + 4));
        combined.set(packetInBytes, 4);
        packetInBytes = combined;
    }

    let hPacket = new HPacket(packetInBytes);
    if(fixLengthLater) {
        hPacket.fixLength();
    }

    if(identifier[0] != null) {
        let split = identifier[0].split(":");
        hPacket.setIdentifierDirection(split[0] === "in" ? HDirection.TOCLIENT : HDirection.TOSERVER);
        hPacket.setIdentifier(split[1]);
    }

    return hPacket;
}

let toString = (packet) => {
    if(!(packet instanceof Uint8Array)) {
        throw new Error("Invalid arguments passed");
    }

    let result = "";

    for(let i = 0; i < packet.length; i++) {
        let x = packet[i];
        if ((x < 32 && x >= 0) || x < -96 || x === 93 || x === 91 || x === 125 || x === 123 || x === 127 ) {
            result += "[" + ((x + 256) % 256) + "]";
        } else {
            result += Buffer.from(new Uint8Array([x])).toString("latin1");
        }
    }

    return result;
}

exports.HPacket = HPacket;

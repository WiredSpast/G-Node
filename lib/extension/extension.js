import { HPacket } from '../protocol/hpacket.js';
import EventEmitter from 'events';
import util from 'util';
import { Socket } from 'net';
import { PacketInfoManager } from '../services/packetinfo/packetinfomanager.js';
import { HClient } from '../protocol/hclient.js';
import { HostInfo } from '../misc/hostinfo.js';
import { HMessage } from '../protocol/hmessage.js';
import { HDirection } from '../protocol/hdirection.js';

const INCOMING_MESSAGE_IDS = {
  ONDOUBLECLICK: 1,
  INFOREQUEST: 2,
  PACKETINTERCEPT: 3,
  FLAGSCHECK: 4,
  CONNECTIONSTART: 5,
  CONNECTIONEND: 6,
  INIT: 7,
  UPDATEHOSTINFO: 10,
  PACKETTOSTRING_RESPONSE: 20,
  STRINGTOPACKET_RESPONSE: 21
};

const OUTGOING_MESSAGE_IDS = {
  EXTENSIONINFO: 1,
  MANIPULATEDPACKET: 2,
  REQUESTFLAGS: 3,
  SENDMESSAGE: 4,
  PACKETTOSTRING_REQUEST: 20,
  STRINGTOPACKET_REQUEST: 21,
  EXTENSIONCONSOLELOG: 98
};

const PORT_FLAG = ['--port', '-p'];
const FILE_FLAG = ['--filename', '-f'];
const COOKIE_FLAG = ['--auth-token', '-c'];

export class Extension extends EventEmitter {
  #gEarthExtensionServer;
  #incomingMessageListeners = new Map();
  #outgoingMessageListeners = new Map();
  #flagRequestCallback = null;

  #args;
  #isCorrupted = false;
  #extensionInfo;
  #packetInfoManager;
  #hostInfo;

  #delayed_init = false;

  constructor (extensionInfo) {
    super();
    if ('name' in extensionInfo && 'description' in extensionInfo && 'version' in extensionInfo && 'author' in extensionInfo) {
      this.#args = process.argv;
      this.#extensionInfo = extensionInfo;
      if (!this.#getArgument(PORT_FLAG)) {
        throw new Error('Run command arguments must include port, example: node extension.js -p 9092 OR node extension.js --port 9092');
      }
      return;
    }

    throw new Error('Extension.constructor: extensionInfo object requires name, description, version and author');
  }

  #getArgument = (flags) => {
    for (let i = 0; i < this.#args.length - 1; i++) {
      for (const flag of flags) {
        if (this.#args[i].toLowerCase() === flag.toLowerCase()) {
          return this.#args[i + 1];
        }
      }
    }
  };

  [util.inspect.custom] (depth) {
    const indent = '  '.repeat(depth > 2 ? depth - 2 : 0);
    return `${indent}Extension {\n` +
      `${indent}  name: ${util.inspect(this.#extensionInfo.name, { colors: true })}\n` +
      `${indent}  description: ${util.inspect(this.#extensionInfo.description, { colors: true })}\n` +
      `${indent}  version: ${util.inspect(this.#extensionInfo.version, { colors: true })}\n` +
      `${indent}  author: ${util.inspect(this.#extensionInfo.author, { colors: true })}\n` +
      `${indent}  extensionport: ${util.inspect(this.#getArgument(PORT_FLAG), { colors: true })}\n` +
      `${indent}}`;
  }

  run () {
    if (this.#isCorrupted) {
      return;
    }

    const port = this.#getArgument(PORT_FLAG);

    this.#gEarthExtensionServer = new Socket();

    this.#gEarthExtensionServer.setNoDelay(true);

    this.#gEarthExtensionServer.connect(port);

    this.#gEarthExtensionServer.on('connect', () => {
      console.log('Connected to G-Earth');
    });

    this.#gEarthExtensionServer.on('error', err => {
      switch (err.code) {
        case 'ECONNREFUSED':
          throw new Error('Connection to G-Earth refused, make sure G-Earth is active');
      }

      this.emit('socketdisconnect');
    });

    this.#gEarthExtensionServer.on('close', () => {
      console.log('G-Earth connection closed');
      this.emit('socketdisconnect');
    });

    let appendNext = false;
    let prev = null;

    this.#gEarthExtensionServer.on('data', rawData => {
      let data = Buffer.from(rawData);
      do {
        if (appendNext) {
          appendNext = false;

          const newData = Buffer.alloc(prev.length + data.length);
          newData.set(prev);
          newData.set(data, prev.length);
          data = newData;
        }

        const length = data.readInt32BE();
        if (data.length >= length + 4) {
          this.#onGPacket(new HPacket(data.slice(0, 4 + length)));
          data = data.slice(4 + length);
        } else {
          appendNext = true;
          prev = data;
        }
      } while (data.length > 0 && !appendNext);
    });
  }

  #onGPacket = (packet) => {
    switch (packet.headerId) {
      case INCOMING_MESSAGE_IDS.INFOREQUEST: {
        const file = this.#getArgument(FILE_FLAG);
        const cookie = this.#getArgument(COOKIE_FLAG);
        const response = new HPacket(OUTGOING_MESSAGE_IDS.EXTENSIONINFO)
          .appendString(this.#extensionInfo.name)
          .appendString(this.#extensionInfo.author)
          .appendString(this.#extensionInfo.version)
          .appendString(this.#extensionInfo.description)
          .appendBoolean(this.eventNames().includes('click'))
          .appendBoolean(file !== undefined) // IsInstalledExtension
          .appendString(file !== undefined ? file : '')
          .appendString(cookie !== undefined ? cookie : '')
          .appendBoolean(true) // leaveButtonVisible
          .appendBoolean(true); // DeleteButtonVisible
        this.#gEarthExtensionServer.write(response.bytes);
        break;
      }
      case INCOMING_MESSAGE_IDS.CONNECTIONSTART: {
        const [host, connectionPort, hotelVersion, clientIdentifier] = packet.read('SiSS');
        const client = packet.readString().toLowerCase() === 'flash' ? HClient.FLASH : HClient.UNITY;
        this.#packetInfoManager = PacketInfoManager.readFromPacket(packet);

        if (this.#delayed_init) {
          this.emit('init');
          this.#delayed_init = false;
        }

        this.emit('connect', host, connectionPort, hotelVersion, clientIdentifier, client);
        this.emit('start');
        break;
      }
      case INCOMING_MESSAGE_IDS.CONNECTIONEND: {
        this.emit('end');
        break;
      }
      case INCOMING_MESSAGE_IDS.FLAGSCHECK: {
        if (this.#flagRequestCallback !== null && this.#flagRequestCallback !== undefined) {
          const arraySize = packet.readInteger();
          let gEarthArgs = [];
          for (let i = 0; i < arraySize; i++) {
            gEarthArgs = packet.readString();
          }
          this.#flagRequestCallback(gEarthArgs);
        }
        this.#flagRequestCallback = null;
        break;
      }
      case INCOMING_MESSAGE_IDS.INIT: {
        this.#delayed_init = packet.readBoolean();
        this.#hostInfo = HostInfo.fromPacket(packet);
        this.emit('hostinfoupdate', this.#hostInfo);

        if (!this.#delayed_init) {
          this.emit('init');
        }

        this.#writeToConsole('Extension "' + this.#extensionInfo.name + '" successfully initialized', 'green', false);
        break;
      }
      case INCOMING_MESSAGE_IDS.ONDOUBLECLICK: {
        this.emit('click');
        break;
      }
      case INCOMING_MESSAGE_IDS.PACKETINTERCEPT: {
        const stringMessage = packet.readLongString();
        const hMessage = new HMessage(stringMessage);

        this.#modifyMessage(hMessage);

        const responsePacket = new HPacket(OUTGOING_MESSAGE_IDS.MANIPULATEDPACKET);
        responsePacket.appendLongString(hMessage.stringify());

        this.#gEarthExtensionServer.write(responsePacket.bytes);
        break;
      }
      case INCOMING_MESSAGE_IDS.UPDATEHOSTINFO: {
        this.#hostInfo = HostInfo.fromPacket(packet);
        this.emit('hostinfoupdate', this.#hostInfo);
        break;
      }
    }
  };

  #modifyMessage = (hMessage) => {
    const hPacket = hMessage.packet;

    const listeners = hMessage.getDestination() === HDirection.TOCLIENT ? this.#incomingMessageListeners : this.#outgoingMessageListeners;

    const correctListeners = [];

    if (listeners.has(-1)) {
      for (let i = listeners.get(-1).length - 1; i >= 0; i--) {
        correctListeners.push(listeners.get(-1)[i]);
      }
    }

    if (listeners.has(hPacket.headerId)) {
      for (let i = listeners.get(hPacket.headerId).length - 1; i >= 0; i--) {
        correctListeners.push(listeners.get(hPacket.headerId)[i]);
      }
    }

    if (this.#packetInfoManager) {
      const packetInfos = this.#packetInfoManager.getAllPacketInfoFromHeaderId(hMessage.getDestination(), hPacket.headerId);
      const packetNames = [...new Set(packetInfos.map(p => p.name))];
      const packetHashes = [...new Set(packetInfos.map(p => p.hash))];

      for (const name of packetNames) {
        if (listeners.has(name)) {
          for (let i = listeners.get(name).length - 1; i >= 0; i--) {
            correctListeners.push(listeners.get(name)[i]);
          }
        }
      }

      for (const hash of packetHashes) {
        if (listeners.has(hash)) {
          for (let i = listeners.get(hash).length - 1; i >= 0; i--) {
            correctListeners.push(listeners.get(hash)[i]);
          }
        }
      }
    }

    for (const i in correctListeners) {
      hMessage.packet.resetReadIndex();
      correctListeners[i](hMessage);
    }
    hMessage.packet.resetReadIndex();
  };

  sendToClient (packet) {
    if (packet instanceof HPacket) {
      return this.#send(packet, HDirection.TOCLIENT);
    }
    throw new Error('Extension.sendToClient: packet must be an instance of HPacket');
  }

  sendToServer (packet) {
    if (packet instanceof HPacket) {
      return this.#send(packet, HDirection.TOSERVER);
    }
    throw new Error('Extension.sendToServer: packet must be an instance of HPacket');
  }

  #send = (packet, direction) => {
    if (packet.isCorrupted()) return false;

    if (!packet.isPacketComplete()) packet.completePacket(this.#packetInfoManager);
    if (!packet.isPacketComplete()) return false;

    const sendingPacket = new HPacket(OUTGOING_MESSAGE_IDS.SENDMESSAGE)
      .appendByte(direction)
      .appendInt(packet.bytesLength)
      .appendBytes(packet.bytes);

    try {
      this.#gEarthExtensionServer.write(sendingPacket.bytes);
      return true;
    } catch {
      return false;
    }
  };

  requestFlags (flagRequestCallback) {
    if (this.#flagRequestCallback !== null) return false;
    this.#flagRequestCallback = flagRequestCallback;
    try {
      this.#gEarthExtensionServer.write(new HPacket(OUTGOING_MESSAGE_IDS.REQUESTFLAGS).bytes);
      return true;
    } catch {
      return false;
    }
  }

  writeToConsole (s, colorClass) {
    if (typeof colorClass === 'undefined') {
      colorClass = this.#hostInfo &&
      this.#hostInfo.attributes.has('theme') &&
      this.#hostInfo.attributes.get('theme').toLowerCase().includes('dark')
        ? 'white'
        : 'black';
    }

    if (typeof (colorClass) !== 'string' || typeof (s) !== 'string') {
      throw new Error('Extensions.writeToConsole: Both s and colorClass have to be strings');
    }

    this.#writeToConsole(s, colorClass, true);
  }

  #writeToConsole = (s, colorClass, mentionTitle) => {
    const text = '[' + colorClass + ']' + (mentionTitle ? this.#extensionInfo.name + ' --> ' : '') + s;

    const packet = new HPacket(OUTGOING_MESSAGE_IDS.EXTENSIONCONSOLELOG);
    packet.appendString(text);
    try {
      this.#gEarthExtensionServer.write(packet.bytes);
    } catch {
    }
  };

  interceptAll (direction, messageListener) {
    if (!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || typeof (messageListener) !== 'function') {
      throw new Error('Invalid arguments passed');
    }

    this.interceptByHeaderId(direction, -1, messageListener);
  }

  interceptByHeaderId (direction, headerId, messageListener) {
    if (!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || !Number.isInteger(headerId) || typeof (messageListener) !== 'function') {
      throw new Error('Invalid arguments passed');
    }

    const listeners = direction === HDirection.TOCLIENT ? this.#incomingMessageListeners : this.#outgoingMessageListeners;

    if (!listeners.has(headerId)) {
      listeners.set(headerId, []);
    }

    listeners.get(headerId).push(messageListener);
  }

  interceptByNameOrHash (direction, headerNameOrHash, messageListener) {
    if (!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || typeof (headerNameOrHash) !== 'string' || typeof (messageListener) !== 'function') {
      throw new Error('Invalid arguments passed');
    }

    const listeners = direction === HDirection.TOCLIENT ? this.#incomingMessageListeners : this.#outgoingMessageListeners;

    if (!listeners.has(headerNameOrHash)) {
      listeners.set(headerNameOrHash, []);
    }

    listeners.get(headerNameOrHash).push(messageListener);
  }

  getPacketInfoManager () {
    return this.#packetInfoManager;
  }

  getHostInfo () {
    return this.#hostInfo;
  }
}

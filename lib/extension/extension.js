const { HPacket } = require("../protocol/hpacket");

const net = require("net");
const {EventEmitter} = require("events");
const {HClient} = require("../protocol/hclient");
const {HDirection} = require("../protocol/hdirection");
const {PacketInfoManager} = require("../services/packetinfo/packetinfomanager");
const {HMessage} = require("../protocol/hmessage");

const OUTGOING_MESSAGE_IDS = {
    ONDOUBLECLICK: 1,
    INFOREQUEST: 2,
    PACKETINTERCEPT: 3,
    FLAGSCHECK: 4,
    CONNECTIONSTART: 5,
    CONNECTIONEND: 6,
    INIT: 7,
    PACKETTOSTRING_RESPONSE: 20,
    STRINGTOPACKET_RESPONSE: 21
}

const INCOMING_MESSAGE_IDS = {
    EXTENSIONINFO: 1,
    MANIPULATEDPACKET: 2,
    REQUESTFLAGS: 3,
    SENDMESSAGE: 4,
    PACKETTOSTRING_REQUEST: 20,
    STRINGTOPACKET_REQUEST: 21,
    EXTENSIONCONSOLELOG: 98
}

const PORT_FLAG = ["--port", "-p"];
const FILE_FLAG = ["--filename", "-f"];
const COOKIE_FLAG = ["--auth-token", "-c"];

exports.Extension = class Extension extends EventEmitter {
    #gEarthExtensionServer;
    #incomingMessageListeners = new Map();
    #outgoingMessageListeners = new Map();
    #flagRequestCallback = null;

    #args;
    #isCorrupted = false;
    #extensionInfo;
    #packetInfoManager;

    #getArgument(flags) {
        for(let i = 0; i < this.#args.length - 1; i++) {
            for(let j in flags) {
                if(this.#args[i].toLowerCase() === flags[j].toLowerCase()) {
                    return this.#args[i+1];
                }
            }
        }
    }

    constructor(extensionInfo) {
        super();
        if('name' in extensionInfo && 'description' in extensionInfo && 'version' in extensionInfo && 'author' in extensionInfo) {
            this.#args = process.argv;
            this.#extensionInfo = extensionInfo;
            if(!this.#getArgument(PORT_FLAG)) {
                throw new Error("Run command arguments must include port, example: node extension.js -p 9092 OR node extension.js --port 9092")
            }
            return;
        }

        throw new Error("Invalid constructor arguments, extensionInfo object requires name, description, version and author");
    }

    run() {
        if(this.#isCorrupted) {
            return;
        }

        let port = this.#getArgument(PORT_FLAG);

        this.#gEarthExtensionServer = new net.Socket();

        this.#gEarthExtensionServer.setNoDelay(true);

        this.#gEarthExtensionServer.connect(port);

        this.#gEarthExtensionServer.on('connect', () => {
            console.log("Connected to G-Earth");
        });

        this.#gEarthExtensionServer.on('error', err => {
            switch(err.code) {
                case "ECONNREFUSED":
                    throw new Error("Connection to G-Earth refused, make sure G-Earth is active");
            }

            throw new Error("Unknown connection error");
        });

        this.#gEarthExtensionServer.on('close', () => {
            console.log("G-Earth connection closed");
            process.kill(0);
        });

        let appendNext = false;
        let prev = null;

        this.#gEarthExtensionServer.on('data', data => {
            data = Buffer.from(data)
            do {
                if(appendNext) {
                    appendNext = false;

                    let newData = Buffer.alloc(prev.length + data.length);
                    newData.set(prev);
                    newData.set(data, prev.length);
                    data = newData;
                }

                let length = data.readInt32BE();
                if(data.length >= length + 4) {
                    this.#onGPacket(new HPacket(data.slice(0, 4 + length)));
                    data = data.slice(4 + length);
                } else {
                    appendNext = true;
                    prev = data;
                }
            } while(data.length > 0 && !appendNext);
        });
    }

    #onGPacket(packet) {
        switch(packet.headerId()) {
            case OUTGOING_MESSAGE_IDS.INFOREQUEST:
                let file = this.#getArgument(FILE_FLAG);
                let cookie = this.#getArgument(COOKIE_FLAG);
                let response = new HPacket(INCOMING_MESSAGE_IDS.EXTENSIONINFO)
                    .appendString(this.#extensionInfo.name)
                    .appendString(this.#extensionInfo.author)
                    .appendString(this.#extensionInfo.version)
                    .appendString(this.#extensionInfo.description)
                    .appendBoolean(this.eventNames().includes('click'))
                    .appendBoolean(file !== undefined) // IsInstalledExtension
                    .appendString(file !== undefined ? file : "")
                    .appendString(cookie !== undefined ? cookie : "")
                    .appendBoolean(true) // leaveButtonVisible
                    .appendBoolean(true); // DeleteButtonVisible
                this.#gEarthExtensionServer.write(response.toBytes());
                break;
            case OUTGOING_MESSAGE_IDS.CONNECTIONSTART:
                let host = packet.readString();
                let connectionPort = packet.readInteger();
                let hotelVersion = packet.readString();
                let clientIdentifier = packet.readString();
                let client = packet.readString().toLowerCase() === "flash" ? HClient.FLASH : HClient.UNITY;
                this.#packetInfoManager = PacketInfoManager.readFromPacket(packet);

                this.emit('connect', host, connectionPort, hotelVersion, clientIdentifier, client);
                this.emit('start');
                break;
            case OUTGOING_MESSAGE_IDS.CONNECTIONEND:
                this.emit('end');
                break;
            case OUTGOING_MESSAGE_IDS.FLAGSCHECK:
                if(this.#flagRequestCallback !== null && this.#flagRequestCallback !== undefined) {
                    let arraySize = packet.readInteger();
                    let gEarthArgs = new String[arraySize];
                    for(let i = 0; i < gEarthArgs.length; i++) {
                        gEarthArgs = packet.readString();
                    }
                    this.#flagRequestCallback(gEarthArgs);
                }
                this.#flagRequestCallback = null;
                break;
            case OUTGOING_MESSAGE_IDS.INIT:
                this.emit('init');
                this.#writeToConsole("Extension \"" + this.#extensionInfo.name + "\" successfully initialized", "green", false);
                break;
            case OUTGOING_MESSAGE_IDS.ONDOUBLECLICK:
                this.emit('click');
                break;
            case OUTGOING_MESSAGE_IDS.PACKETINTERCEPT:
                let stringMessage = packet.readLongString();
                let hMessage = new HMessage(stringMessage);

                this.#modifyMessage(hMessage);

                let responsePacket = new HPacket(INCOMING_MESSAGE_IDS.MANIPULATEDPACKET);
                responsePacket.appendLongString(stringMessage);

                this.#gEarthExtensionServer.write(responsePacket.toBytes());
                break;
        }
    }

    #modifyMessage(hMessage) {
        let hPacket = hMessage.getPacket();

        let listeners = hMessage.getDestination() === HDirection.TOCLIENT ? this.#incomingMessageListeners : this.#outgoingMessageListeners;

        let correctListeners = [];

        if(listeners.has(-1)) {
            for(let i = listeners.get(-1).length - 1; i >= 0; i--) {
                correctListeners.push(listeners.get(-1)[i]);
            }
        }

        if(listeners.has(hPacket.headerId())) {
            for(let i = listeners.get(hPacket.headerId()).length - 1; i >= 0; i--) {
                correctListeners.push(listeners.get(hPacket.headerId())[i]);
            }
        }

        for(let i in correctListeners) {
            hMessage.getPacket().resetReadIndex();
            correctListeners[i](hMessage);
        }
        hMessage.getPacket().resetReadIndex();
    }

    sendToClient(packet) {
        if(packet instanceof HPacket) {
            return this.#send(packet, HDirection.TOCLIENT);
        }
        throw new Error("Invalid arguments passed");
    }

    sendToServer(packet) {
        if(packet instanceof HPacket) {
            return this.#send(packet, HDirection.TOSERVER);
        }
        throw new Error("Invalid arguments passed");
    }

    #send(packet, direction) {
        if(packet.isCorrupted()) return false;

        if(!packet.isPacketComplete()) packet.completePacket(this.#packetInfoManager);
        if(!packet.isPacketComplete()) return false;

        let sendingPacket = new HPacket(INCOMING_MESSAGE_IDS.SENDMESSAGE);
        sendingPacket.appendByte(direction);
        sendingPacket.appendInt(packet.getBytesLength());
        sendingPacket.appendBytes(packet.toBytes());
        try {
            this.#gEarthExtensionServer.write(sendingPacket.toBytes());
            return true;
        } catch {
            return false;
        }
    }

    requestFlags(flagRequestCallback) {
        if(this.#flagRequestCallback !== null) return false;
        this.#flagRequestCallback = flagRequestCallback;
        try {
            this.#gEarthExtensionServer.write(new HPacket(INCOMING_MESSAGE_IDS.REQUESTFLAGS).toBytes());
            return true;
        } catch {
            return false;
        }
    }

    writeToConsole(s, colorClass) {
        if(typeof(s) === "undefined") {
            s = "black";
        }

        if(typeof(colorClass) !== "string" || typeof(s) !== "string") {
            throw new Error("Invalid arguments passed")
        }

        this.#writeToConsole(s, colorClass, true);
    }

    #writeToConsole(s, colorClass, mentionTitle) {
        let text = "[" + colorClass + "]" + (mentionTitle ? this.#extensionInfo.name + " --> " : "") + s;

        let packet = new HPacket(INCOMING_MESSAGE_IDS.EXTENSIONCONSOLELOG);
        packet.appendString(text);
        try {
            this.#gEarthExtensionServer.write(packet.toBytes());
        } catch {}
    }

    interceptAll(direction, messageListener) {
        if(!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || typeof(messageListener) !== "function") {
            throw new Error("Invalid arguments passed");
        }

        this.interceptByHeaderId(direction, -1, messageListener);
    }

    interceptByHeaderId(direction, headerId, messageListener) {
        if(!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || !Number.isInteger(headerId) || typeof(messageListener) !== "function") {
            throw new Error("Invalid arguments passed");
        }

        let listeners = direction === HDirection.TOCLIENT ? this.#incomingMessageListeners : this.#outgoingMessageListeners;

        if(!listeners.has(headerId)) {
            listeners.set(headerId, []);
        }

        listeners.get(headerId).push(messageListener);
    }

    interceptByNameOrHash(direction, headerNameOrHash, messageListener) {
        if(!(direction === HDirection.TOCLIENT || direction === HDirection.TOSERVER) || typeof(headerNameOrHash) !== "string" || typeof(messageListener) !== "function") {
            throw new Error("Invalid arguments passed");
        }

        let packetInfo = this.#packetInfoManager.getPacketInfoFromName(direction, headerNameOrHash);
        if(packetInfo === null) {
            packetInfo = this.#packetInfoManager.getPacketInfoFromHash(direction, headerNameOrHash);
        }

        if(packetInfo === null) {
            console.error("Could not find name or hash '" + headerNameOrHash + "' intercept ignored!");
            return;
        }

        this.interceptByHeaderId(direction, packetInfo.getHeaderId(), messageListener);
    }

    getPacketInfoManager() {
        return this.#packetInfoManager;
    }
}

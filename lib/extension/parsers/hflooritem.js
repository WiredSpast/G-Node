let { HPacket } = require("../../protocol/hpacket");
let { HPoint } = require("./hpoint");

exports.HFloorItem = class HFloorItem {
    #id;
    #typeId;
    #tile;
    #facing;

    #category;

    #secondsToExpiration;
    #usagePolicy;
    #ownerId;
    #ownerName;
    #stuff;

    #ignore1;
    #ignore2;
    #ignore3 = null;

    constructor(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("Invalid argument(s) passed");
        }

        this.#id = packet.readInteger();
        this.#typeId = packet.readInteger();

        let x = packet.readInteger();
        let y = packet.readInteger();
        this.#facing = packet.readInteger();

        this.#tile = new HPoint(x, y, Number.parseFloat(packet.readString()));

        this.#ignore1 = packet.readString();
        this.#ignore2 = packet.readInteger();

        this.#category = packet.readInteger();

        this.#stuff = HStuff.readData(packet, this.#category);

        this.#secondsToExpiration = packet.readInteger();
        this.#usagePolicy = packet.readInteger();

        this.#ownerId = packet.readInteger();

        if(this.#typeId < 0) {
            this.#ignore3 = packet.readString();
        }
    }

    appendToPacket(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("Invalid argument(s) passed");
        }

        packet.appendInt(this.#id);
        packet.appendInt(this.#typeId);
        packet.appendInt(this.#tile.getX());
        packet.appendInt(this.#tile.getY());
        packet.appendInt(this.#facing);
        packet.appendString("" + this.#tile.getZ());

        packet.appendString(this.#ignore1);
        packet.appendInt(this.#ignore2);

        packet.appendInt(this.#category);

        HStuff.appendData(packet, this.#category, this.#stuff);

        packet.appendInt(this.#secondsToExpiration);
        packet.appendInt(this.#usagePolicy);
        packet.appendInt(this.#ownerId);

        if(this.#typeId < 0) {
            packet.appendString(this.#ignore3);
        }
    }

    static parse(packet) {
        if(!(packet instanceof HPacket))  {
            throw new Error("Invalid argument(s) passed");
        }

        let ownersCount = packet.readInteger();
        let owners = new Map();

        for(let i = 0; i < ownersCount; i++) {
            owners.set(packet.readInteger(), packet.readString())
        }

        let furniture = [];
        let n = packet.readInteger();
        for(let i = 0; i < n; i++) {
            let furni = new HFloorItem(packet);
            furni.#ownerName = owners.get(furni.#ownerId);

            furniture.push(furni);
        }
        return furniture;
    }

    constructPacket(floorItems, headerId) {
        if(!(Array.isArray(floorItems) || !Number.isInteger(headerId)))  {
            throw new Error("Invalid argument(s) passed");
        }

        let owners = new Map();
        for(let floorItem of floorItems) {
            if(!(floorItem instanceof HFloorItem)) {
                throw new Error("Invalid argument(s) passed");
            }

            owners.put(floorItem.#ownerId, floorItem.#ownerName);
        }

        let packet = new HPacket(headerId);
        packet.appendInt(owners.size);
        for(let ownerId of Array.from(owners.keys())) {
            packet.appendInt(ownerId);
            packet.appendString(owners.get(ownerId));
        }

        packet.appendInt(floorItems.length);
        for(let floorItem of floorItems) {
            floorItem.appendToPacket(packet);
        }

        return packet;
    }

    getId() {
        return this.#id;
    }

    getTypeId() {
        return this.#typeId;
    }

    getUsagePolicy() {
        return this.#usagePolicy;
    }

    getOwnerId() {
        return this.#ownerId;
    }

    getOwnerName() {
        return this.#ownerName;
    }

    getSecondsToExpiration()  {
        return this.#secondsToExpiration;
    }

    getCategory() {
        return this.#category;
    }

    getFacing() {
        return this.#facing;
    }

    getTile() {
        return this.#tile;
    }

    getStuff() {
        return this.#stuff;
    }


    setOwnerName(ownerName) {
        if(typeof ownerName !== 'string') {
            throw new Error("Invalid argument(s) passed");
        }

        this.#ownerName = ownerName;
    }

    setId(id) {
        if(!Number.isInteger(id)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#id = id;
    }

    setTypeId(typeId) {
        if(!Number.isInteger(typeId)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#typeId = typeId;
    }

    setTile(tile) {
        if(!(tile instanceof HPoint)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#tile = tile;
    }

    setFacing(facing) {
        if(!(Number.isInteger(facing) && facing >= 0 && facing <= 7)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#facing = facing;
    }

    setCategory(category) {
        if(!Number.isInteger(category)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#category = category;
    }

    setSecondsToExpiration(secondsToExpiration) {
        if(!Number.isInteger(secondsToExpiration)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#secondsToExpiration = secondsToExpiration;
    }

    setUsagePolicy(usagePolicy) {
        if(!Number.isInteger(usagePolicy)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#usagePolicy = usagePolicy;
    }

    setOwnerId(ownerId) {
        if(!Number.isInteger(ownerId)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#ownerId = ownerId;
    }

    setStuff(stuff) {
        if(!Array.isArray(stuff)) {
            throw new Error("Invalid argument(s) passed");
        }

        this.#stuff = stuff;
    }
}

class HStuff {
    static readData(packet, category) {
        if(!(packet instanceof HPacket) || !Number.isInteger(category))  {
            throw new Error("Invalid argument(s) passed");
        }

        let values = [];
        switch(category & 0xFF) {
            case 0: /* LegacyStuffData */
                values.push(packet.readString());
                break;
            case 1: /* MapStuffData */
                let nMap = packet.readInteger();
                values.push(nMap);

                for(let i = 0; i < nMap; i++) {
                    values.push(packet.readString());
                    values.push(packet.readString());
                }
                break;
            case 2: /* StringArrayStuffData */
                let nString = packet.readInteger();
                values.push(nString);

                for(let i = 0; i < nString; i++) {
                    values.push(packet.readString());
                }
                break;
            case 3: /* VoteResultStuffData */
                values.push(packet.readString());
                values.push(packet.readInteger());
                break;
            case 5: /* IntArrayStuffData */
                let nInt = packet.readInteger();
                values.push(nInt);

                for(let i = 0; i < nInt; i++) {
                    values.push(packet.readInteger());
                }
                break;
            case 6: /* HighScoreStuffData */
                values.push(packet.readString());
                values.push(packet.readInteger());
                values.push(packet.readInteger());

                let nScore = packet.readInteger();
                values.push(nScore);

                for(let i = 0; i < nScore; i++) {
                    values.push(packet.readInteger());

                    let nWinner = packet.readInteger();
                    values.push(nWinner);

                    for(let j = 0; j < nWinner; j++) {
                        values.push(packet.readString());
                    }
                }
                break;
            case 7: /* CrackableStuffData */
                values.push(packet.readString());
                values.push(packet.readInteger());
                values.push(packet.readInteger());
        }

        if((category & 0xFF00 & 0x100) > 0) {
            values.push(packet.readInteger());
            values.push(packet.readInteger());
        }

        return values;
    }

    static appendData(packet, category, stuff) {
        if(!(packet instanceof HPacket) || !Number.isInteger(category) || Array.isArray(stuff))  {
            throw new Error("Invalid argument(s) passed");
        }

        switch(category & 0xFF) {
            case 0: /* LegacyStuffData */
                packet.appendString(stuff[0]);
                break;
            case 1: /* MapStuffData */
                let nMap = stuff[0];
                packet.appendInt(nMap);

                for(let i = 0; i < nMap; i++) {
                    packet.appendString(stuff[1 + i * 2]);
                    packet.appendString(stuff[2 + i * 2])
                }
                break;
            case 2: /* StringArrayStuffData */
                let nString = stuff[0];
                packet.appendInt(nString);

                for(let i = 0; i < nString; i++) {
                    packet.appendString(stuff[1 + i]);
                }
                break;
            case 3: /* VoteResultStuffData */
                packet.appendString(stuff[0]);
                packet.appendInt(stuff[1]);
                break;
            case 5: /* IntArrayStuffData */
                let nInt = stuff[0];
                packet.appendInt(nInt);

                for(let i = 0; i < nInt; i++) {
                    packet.appendInt(stuff[1 + i]);
                }
                break;
            case 6: /* HighScoreStuffData */
                packet.appendString(stuff[0]);
                packet.appendInt(stuff[1]);
                packet.appendInt(stuff[2]);

                let nScore = stuff[3];
                packet.appendInt(nScore);

                let index = 4;

                for(let i = 0; i < nScore; i++) {
                    packet.appendInt(stuff[index++]);

                    let nWinner = stuff[index++];
                    packet.appendInt(nWinner);

                    for(let j = 0; j < nWinner; j++) {
                        packet.appendString(stuff[index++]);
                    }
                }
                break;
            case 7: /* CrackableStuffData */
                packet.appendString(stuff[0]);
                packet.appendInt(stuff[1]);
                packet.appendInt(stuff[2]);
        }

        if((category & 0xFF00 & 0x100) > 0) {
            packet.appendInt(stuff[-2]);
            packet.appendInt(stuff[-1]);
        }
    }
}

exports.HStuff = HStuff;

const { HPacket } = require("../../protocol/hpacket");

exports.HStuff = class HStuff {
    static readData(packet, category) {
        if(!(packet instanceof HPacket))  {
            throw new Error("HStuff.readData: packet must be an instance of Packet");
        }

        if(!Number.isInteger(category)) {
            throw new Error("HStuff.readData: category must be an integer");
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
        if(!(packet instanceof HPacket))  {
            throw new Error("HStuff.appendData: packet must be an instance of Packet");
        }

        if(!Number.isInteger(category)) {
            throw new Error("HStuff.appendData: category must be an integer");
        }

        if(!Array.isArray(stuff)) {
            throw new Error("HStuff.appendData: stuff must be an array")
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
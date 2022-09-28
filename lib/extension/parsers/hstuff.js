import { HPacket } from '../../protocol/hpacket.js';

export class HStuff {
  static readData (packet, category) {
    if (!(packet instanceof HPacket)) {
      throw new Error('HStuff.readData: packet must be an instance of Packet');
    }

    if (!Number.isInteger(category)) {
      throw new Error('HStuff.readData: category must be an integer');
    }

    const values = [];
    switch (category & 0xFF) {
      case 0: { /* LegacyStuffData */
        values.push(packet.readString());
        break;
      }
      case 1: { /* MapStuffData */
        const nMap = packet.readInteger();
        values.push(nMap);

        for (let i = 0; i < nMap; i++) {
          values.push(...packet.read('SS'));
        }
        break;
      }
      case 2: { /* StringArrayStuffData */
        const nString = packet.readInteger();
        values.push(nString);

        for (let i = 0; i < nString; i++) {
          values.push(packet.readString());
        }
        break;
      }
      case 3: { /* VoteResultStuffData */
        values.push(...packet.read('Si'));
        break;
      }
      case 5: { /* IntArrayStuffData */
        const nInt = packet.readInteger();
        values.push(nInt);

        for (let i = 0; i < nInt; i++) {
          values.push(packet.readInteger());
        }
        break;
      }
      case 6: { /* HighScoreStuffData */
        values.push(...packet.read('Sii'));

        const nScore = packet.readInteger();
        values.push(nScore);

        for (let i = 0; i < nScore; i++) {
          values.push(packet.readInteger());

          const nWinner = packet.readInteger();
          values.push(nWinner);

          for (let j = 0; j < nWinner; j++) {
            values.push(packet.readString());
          }
        }
        break;
      }
      case 7: { /* CrackableStuffData */
        values.push(...packet.read('Sii'));
      }
    }

    if ((category & 0xFF00 & 0x100) > 0) {
      values.push(...packet.read('ii'));
    }

    return values;
  }

  static appendData (packet, category, stuff) {
    if (!(packet instanceof HPacket)) {
      throw new Error('HStuff.appendData: packet must be an instance of Packet');
    }

    if (!Number.isInteger(category)) {
      throw new Error('HStuff.appendData: category must be an integer');
    }

    if (!Array.isArray(stuff)) {
      throw new Error('HStuff.appendData: stuff must be an array');
    }

    switch (category & 0xFF) {
      case 0: { /* LegacyStuffData */
        packet.appendString(stuff[0]);
        break;
      }
      case 1: { /* MapStuffData */
        const nMap = stuff[0];
        packet.appendInt(nMap);

        for (let i = 0; i < nMap; i++) {
          packet.append('SS',
            stuff[1 + i * 2],
            stuff[2 + i * 2]);
        }
        break;
      }
      case 2: { /* StringArrayStuffData */
        const nString = stuff[0];
        packet.appendInt(nString);

        for (let i = 0; i < nString; i++) {
          packet.appendString(stuff[1 + i]);
        }
        break;
      }
      case 3: { /* VoteResultStuffData */
        packet.append('Si', ...stuff.slice(0, 2));
        break;
      }
      case 5: { /* IntArrayStuffData */
        const nInt = stuff[0];
        packet.appendInt(nInt);

        for (let i = 0; i < nInt; i++) {
          packet.appendInt(stuff[1 + i]);
        }
        break;
      }
      case 6: { /* HighScoreStuffData */
        packet.append('Sii', ...stuff.slice(0, 3));

        const nScore = stuff[3];
        packet.appendInt(nScore);

        let index = 4;

        for (let i = 0; i < nScore; i++) {
          packet.appendInt(stuff[index++]);

          const nWinner = stuff[index++];
          packet.appendInt(nWinner);

          for (let j = 0; j < nWinner; j++) {
            packet.appendString(stuff[index++]);
          }
        }
        break;
      }
      case 7: { /* CrackableStuffData */
        packet.append('Sii', ...stuff.slice(0, 3));
        break;
      }
    }

    if ((category & 0xFF00 & 0x100) > 0) {
      packet.append('ii', ...stuff.slice(-2, -1));
    }
  }
}

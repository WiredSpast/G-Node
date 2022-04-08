import { HPacket, HDirection } from '../../index.js';

let packet = new HPacket('FriendListUpdate', HDirection.TOCLIENT)
    .appendInt(4)
    .appendInt(351079)
    .appendString('A')
    .appendInt(354624)
    .appendString('B')
    .appendInt(354625)
    .appendString('C')
    .appendInt(356757)
    .appendString('D')
    .appendInt(0);

let n = packet.readInteger()
packet.replaceInt(6, n + 1);
for(let i = 0; i < n; i++) {
    packet.read('iS');
}

// Put category int and string name in between existing packet at index
packet.insertInt(packet.getReadIndex(), 400000);
console.log(packet.readInteger());
packet.insertString(packet.getReadIndex(), 'Group chats');
console.log(packet.readString());

console.log(packet.toExpression('iiSiSiSiSiSi'));
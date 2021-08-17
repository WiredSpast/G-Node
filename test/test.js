let { HPacket, HDirection } = require('../index');

let packet = new HPacket('FriendListUpdate', HDirection.TOCLIENT)
    .appendInt(4)
    .appendInt(351079)
    .appendString('Lennon')
    .appendInt(354624)
    .appendString('Real')
    .appendInt(354625)
    .appendString('Ik')
    .appendInt(356757)
    .appendString('No Spam')
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
packet.replaceString(packet.getReadIndex(), 'Group chats');
console.log(packet.readString());

console.log(packet.toExpression('iiSiSiSiSiSi'));

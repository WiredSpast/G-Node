let { HPacket } = require('../index');

let packet = new HPacket(0).appendInt(12344).appendInt(12346);
console.log(packet.toBytes());
console.log(packet.readInteger());
packet.insertString(packet.getReadIndex(), "Kutkinderen", "utf8");
console.log(packet.readString());
console.log(packet.readInteger());
console.log(packet.toBytes());

packet.resetReadIndex();
console.log(packet.read('iSi'));

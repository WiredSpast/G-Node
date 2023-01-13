import { HPacket } from '../../lib/protocol/hpacket.js';

QUnit.module('HPacket');

QUnit.test('Construct from byte array', assert => {
  let packet = new HPacket(new Uint8Array([0, 0, 0, 4, 0, 5, 0, 0, 1, 19]));
  
  let bytes = [0, 0, 0, 4, 0, 5, 0, 0, 1, 19];
  for (let i in bytes) {
    assert.equal(packet.bytes[i], bytes[i]);
  }
  
  assert.equal(packet.length, 4);
  assert.equal(packet.bytesLength, 10);
  
  assert.equal(packet.EOF, 0);
  
  assert.equal(packet.readInteger(), 256 + 19);
  
  assert.equal(packet.EOF, 1);
  
  assert.equal(packet.identifier, undefined);
  assert.equal(packet.identifierDirection, undefined);
});
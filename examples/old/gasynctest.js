import { AwaitingPacket, Extension, GAsync, HDirection, HEntityUpdate } from '../../index.js';
import { readFileSync } from 'fs';

const extensionInfo = JSON.parse(readFileSync('../../package.json', 'utf8'));

const ext = new Extension(extensionInfo);
const gAsync = new GAsync(ext);
ext.run();

ext.interceptByNameOrHash(HDirection.TOSERVER, "MoveAvatar", async hMessage => {
  let packet = hMessage.getPacket();
  let x = packet.readInteger();
  let y = packet.readInteger();
  
  let awaitedPacket = await gAsync
    .awaitPacket(new AwaitingPacket("UserUpdate", HDirection.TOCLIENT, 1000)
      .addCondition(hPacket => {
        let entityUpdates = HEntityUpdate.parse(hPacket);
        for (let entityUpdate of entityUpdates) {
          if (entityUpdate.tile.x === x && entityUpdate.tile.y === y) {
            return true;
          }
        }
        return false;
      })
    );
  
  console.log(awaitedPacket);
});

ext.interceptByNameOrHash(HDirection.TOSERVER, "Chat", async hMessage => {
  if (hMessage.getPacket().readString().toLowerCase().startsWith(":selecttile")) {
    hMessage.blocked = true;
    let awaitedPacket = await gAsync.awaitPacket(new AwaitingPacket("MoveAvatar", HDirection.TOSERVER, 30000, true));
    
    console.log(awaitedPacket);
  }
});
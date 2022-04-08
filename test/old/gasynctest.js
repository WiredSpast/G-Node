import { Extension, HDirection, HEntityUpdate, GAsync, AwaitingPacket } from '../../index.js';
import { readFile } from 'fs/promises';

const extensionInfo = JSON.parse(
    await readFile(
        new URL('../../package.json', import.meta.url)
    )
);

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
                    if(entityUpdate.tile.x === x && entityUpdate.tile.y === y) {
                        return true;
                    }
                }
                return false;
            })
        );

    console.log(awaitedPacket);
});
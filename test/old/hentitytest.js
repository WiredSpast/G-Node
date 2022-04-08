import { Extension, HDirection, HEntity } from '../../index.js';
import { readFile } from 'fs/promises';

const extensionInfo = JSON.parse(
    await readFile(
        new URL('../../package.json', import.meta.url)
    )
);

const ext = new Extension(extensionInfo);
ext.run();

ext.interceptByNameOrHash(HDirection.TOCLIENT, 'Users', onUsers);

function onUsers(hMessage) {
    let users = HEntity.parse(hMessage.getPacket());
    hMessage.blocked = true;

    for (let user of users) {
        user.figureId = "hr-828-49.hd-180-28.ch-3788-92.lg-3136-106.sh-290-92.ea-3803-92.ca-3187-92";
        user.name = 'WiredSpast';
    }

    let packet = HEntity.constructPacket(users, hMessage.getPacket().headerId());
    ext.sendToClient(packet);
}

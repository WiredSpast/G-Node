import { Extension, HDirection, HFloorItem, HWallItem} from '../index.js';
import { readFile } from 'fs/promises';

const extensionInfo = JSON.parse(
    await readFile(
        new URL('./package.json', import.meta.url)
    )
);

const ext = new Extension(extensionInfo);
ext.run();

ext.interceptByNameOrHash(HDirection.TOCLIENT, 'Items', hMessage => {
    console.log('abc');
    let items = HWallItem.parse(hMessage.getPacket());
    hMessage.blocked = true;
    console.log(items.length);
    let packet = HWallItem.constructPacket(items, hMessage.getPacket().headerId());
    ext.sendToClient(packet);
});

ext.on('hostinfoupdate', hostInfo => {
    console.log(hostInfo);
    ext.writeToConsole('abc');
});
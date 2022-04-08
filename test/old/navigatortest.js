import { Extension, HDirection, HNavigatorSearchResult } from '../../index.js';
import { readFile } from 'fs/promises';

const extensionInfo = JSON.parse(
    await readFile(
        new URL('../../package.json', import.meta.url)
    )
);

const ext = new Extension(extensionInfo);
ext.run();

ext.interceptByNameOrHash(HDirection.TOCLIENT, 'NavigatorSearchResultBlocks', onNavigatorSearchResultBlocks)

function onNavigatorSearchResultBlocks(message) {
    let result = new HNavigatorSearchResult(message.getPacket());
    console.log(result);
    for (let block of result.blocks) {
        console.log(block);
        for (let room of block.rooms) {
            console.log(room);
        }
    }
}
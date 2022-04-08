import { Extension, GHeightMap } from '../../index.js';
import { readFile } from 'fs/promises';

const extensionInfo = JSON.parse(
    await readFile(
        new URL('../../package.json', import.meta.url)
    )
);

const ext = new Extension(extensionInfo);
ext.run();

new GHeightMap(ext).changeListener = heightMap => {
    console.log(heightMap.tiles);
};

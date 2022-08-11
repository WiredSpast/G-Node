import { Extension, GInventory, HDirection } from '../index.js';
import { readFile } from 'fs/promises';

const extensionInfo = JSON.parse(
    await readFile(
        new URL('./package.json', import.meta.url)
    )
);

const ext = new Extension(extensionInfo);
ext.run();

//new GInventory(ext, (items) => console.log(items));

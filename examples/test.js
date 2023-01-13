import { Extension, HClient, HDirection, HEntity, HPacket } from '../index.js';
import { readFileSync } from 'fs';

const extensionInfo = JSON.parse(readFileSync('./package.json', 'utf8'));

let ext = new Extension(extensionInfo, ['-p', '9092']);
ext.run();
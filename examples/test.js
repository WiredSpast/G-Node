import { Extension } from '../index.js';
import { readFileSync } from 'fs';

const extensionInfo = JSON.parse(readFileSync('./package.json', 'utf8'));

const ext = new Extension(extensionInfo);
ext.run();

ext.on("connect", () => {
  console.log("abc");
});
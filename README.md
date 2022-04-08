# G-Node
Node.js [G-Earth](https://github.com/sirjonasxx/G-Earth) extension API <br>
Requires Node.js V15.0.0+

## How to install
Using npm:
```cmd
$ npm install gnode-api
```
Using yarn:
```cmd
$ yarn add gnode-api
```

## How to run selfmade extension
```cmd
$ node [filename] -p [port]
```
### Example
```cmd
$ node extension.js -p 9092
```

## Example
```js
import { Extension, HPacket, HDirection } from 'gnode-api';

// Use package.json as extensionInfo or create an object including 'name', 'description', 'version' and 'author'
import { readFile } from 'fs/promises';
const extensionInfo = JSON.parse(
    await readFile(
        new URL('./package.json', import.meta.url)
    )
);

// Create new extension with extensionInfo
let ext = new Extension(extensionInfo);

// Start connection to G-Earth
ext.run();
```
### Listeners
#### Do on connection to G-Earth
```js 
ext.on('init', () => {
  console.log("Connected to G-Earth");
});
```
#### Do on connection to hotel
```js
ext.on('start', () => {
  console.log("Connected to G-Earth");
});
```
#### Do on connection to hotel and get client info
```js
ext.on('connect', (host, connectionPort, hotelVersion, clientIdentifier, clientType) => {
  // do something with client info
});
```
#### Do on connection to hotel ended
```js
ext.on('end', () => {
  console.log("Connection to G-Earth ended");
});
```
#### Do on click on button in G-Earth Extensions tab
```js
ext.on('click', () => {
  console.log("G-Earth button clicked");
});
```
### Packet intercepting
#### Intercept all packets in one direction
```js
ext.interceptAll(HDirection.TOCLIENT, hMessage => {
  let hPacket = hMessage.getPacket();
  ...
});

ext.interceptAll(HDirection.TOSERVER, hMessage => {
  let hPacket = hMessage.getPacket();
  ...
});
```
#### Intercept all packets with a certain header id in one direction
```js
ext.interceptByHeaderId(HDirection.TOCLIENT, 969, hMessage => {
  let hPacket = hMessage.getPacket();
  ...
});

ext.interceptByHeaderId(HDirection.TOSERVER, 2443, hMessage => {
  let hPacket = hMessage.getPacket();
  ...
});
```
#### Intercept all packets by name or hash in one direction
```js
ext.interceptByNameOrHash(HDirection.TOCLIENT, 'Ping', hMessage => {
  let hPacket = hMessage.getPacket();
  ...
});

ext.interceptByNameOrHash(HDirection.TOSERVER, 'Pong', hMessage => {
  let hPacket = hMessage.getPacket();
  ...
});
```
### Reading a packet
#### Reading a var by var
```js
let hPacket = hMessage.getPacket(); // Example: {in:Chat}{i:1}{s:"Hello"}{i:0}{i:1}{i:0}{i:0}
let userIndex = hPacket.readInteger();
let message = hPacket.readString();
hPacket.readInteger();
let bubble = hPacket.readInteger();
```
#### Reading a structure into an array
```js
let hPacket = hMessage.getPacket(); // Example: {in:Chat}{i:1}{s:"Hello"}{i:0}{i:1}{i:0}{i:0}
let vars = hPacket.read('iSiiii');
let userIndex = vars[0];
let message = vars[1];
let bubble = vars[3];
```
### Creating a packet
#### Creating packet from identifier (name or hash) and direction
```js
let hPacket = new HPacket('Chat', HDirection.TOCLIENT); // Example: {in:Chat}
hPacket.appendInteger(1);       // {in:Chat}{i:1}
hPacket.appendString('Hello');  // {in:Chat}{i:1}{s:"Hello"}
hPacket.appendInteger(0);       // {in:Chat}{i:1}{s:"Hello"}{i:0}
hPacket.appendInteger(1);       // {in:Chat}{i:1}{s:"Hello"}{i:0}{i:1}
hPacket.appendInteger(0);       // {in:Chat}{i:1}{s:"Hello"}{i:0}{i:1}{i:0}
hPacket.appendInteger(0);       // {in:Chat}{i:1}{s:"Hello"}{i:0}{i:1}{i:0}{i:0}
```
#### Creating packet from header Id
```js
let hPacket = new HPacket(1918) // Example: {l}{h:1918}
    .appendInteger(1)       // {l}{h:1918}{i:1}
    .appendString('Hello')  // {l}{h:1918}{i:1}{s:"Hello"}
    .appendInteger(0)       // {l}{h:1918}{i:1}{s:"Hello"}{i:0}
    .appendInteger(1)       // {l}{h:1918}{i:1}{s:"Hello"}{i:0}{i:1}
    .appendInteger(0)       // {l}{h:1918}{i:1}{s:"Hello"}{i:0}{i:1}{i:0}
    .appendInteger(0);      // {l}{h:1918}{i:1}{s:"Hello"}{i:0}{i:1}{i:0}{i:0}
```
#### Creating packet from packet expression
```js
let hPacket = new HPacket('{in:Chat}{i:1}{s:"Hello"}{i:0}{i:1}{i:0}{i:0}');
```
OR
```js
let hPacket = new HPacket('{l}{h:1918}{i:1}{s:"Hello"}{i:0}{i:1}{i:0}{i:0}');
```
### Sending a packet
#### Send packet to client
```js
ext.sendToClient(hPacket);
```
#### Send packet to server
```js
ext.sendToServer(hPacket);
```
## More
For more examples and/or help read the [wiki](https://github.com/WiredSpast/G-Node/wiki)

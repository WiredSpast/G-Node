let { HPacket, HDirection, HMessage, Extension, HInventoryItem, HFloorItem, HWallItem, HUserProfile, HEntity} = require('../index');

let extensionInfo = require('./package.json');
/* Alternative:
let extensionInfo = {
    name: "G-Node Extension",
    description: "Extension made with G-Node",
    version: "0.0.1",
    author: "WiredSpast"
}
 */

let ext = new Extension(extensionInfo);
ext.run();

ext.interceptByNameOrHash(HDirection.TOCLIENT, 'Users', hMessage => {
    let users = HEntity.parse(hMessage.getPacket());
    for(let user of users) {
        console.log(user.getName());
    }
});

ext.interceptByNameOrHash(HDirection.TOCLIENT, 'Chat', hMessage => {
    console.log("chat");
});

ext.interceptByNameOrHash(HDirection.TOCLIENT, 'Objects', hMessage => {
    let objects = HFloorItem.parse(hMessage.getPacket());
    console.log("a");
    ext.writeToConsole(objects.length + " floor items found!");
    ext.sendToServer(new HPacket('Chat', HDirection.TOCLIENT)
        .appendInt(-1)
        .appendString(objects.length + " floor items found!")
        .appendInt(0)
        .appendInt(30)
        .appendInt(0)
        .appendInt(-1));
});

ext.interceptByNameOrHash(HDirection.TOCLIENT, 'Items', hMessage => {
    let items = HWallItem.parse(hMessage.getPacket());
    ext.writeToConsole(items.length + " wall items found!");
    ext.sendToServer(new HPacket('Chat', HDirection.TOCLIENT)
        .appendInt(-1)
        .appendString(items.length + " wall items found!")
        .appendInt(0)
        .appendInt(30)
        .appendInt(0)
        .appendInt(-1));
});

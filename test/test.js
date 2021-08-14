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

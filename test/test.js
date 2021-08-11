let { HPacket, HDirection, HMessage, Extension} = require('../index');

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

ext.on('start', () => {
    ext.interceptByNameOrHash(HDirection.TOCLIENT, 'Chat', hMessage => {
        let inPacket = hMessage.getPacket();

        /* Alternative
        let userIndex = inPacket.readInteger();
        let msg = inPacket.readString();
        inPacket.readInteger();
        let bubble = inPacket.readInteger();
        */
        let inVars = inPacket.read('iSiiii');
        let userIndex = inVars[0];
        let msg = inVars[1];
        let bubble = inVars[3];

        let outPacket = new HPacket('Whisper', HDirection.TOCLIENT)
            .appendInt(userIndex)
            .appendString(msg)
            .appendInt(0)
            .appendInt(bubble)
            .appendInt(0)
            .appendInt(0);
        /* Alternative
        let outPacket = new HPacket('{in:Whisper}{i:' + userIndex + '}{s:"' + msg + '"}{i:0}{i:' + bubble + '}{i:0}{i:0}')
         */
        ext.sendToClient(outPacket);
    });
});

ext.interceptAll(HDirection.TOSERVER, hMessage => console.log("out " + hMessage.getPacket().toString()));
ext.interceptAll(HDirection.TOCLIENT, hMessage => console.log("in  " + hMessage.getPacket().toString()));

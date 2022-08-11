import { Extension, HDirection } from '../index.js';
import { readFile } from 'fs/promises';

const extensionInfo = JSON.parse(
    await readFile(
        new URL('./package.json', import.meta.url)
    )
);

const ext = new Extension(extensionInfo);
ext.run();

ext.interceptByNameOrHash(HDirection.TOCLIENT, 'GuildMembers', hMessage => {
    let packet = hMessage.getPacket();

    let group = {};
    let count;
    [ group.groupId, group.groupName, group.baseRoomId, group.badgeCode, group.totalEntries, count ]
        = packet.read('iSiSii');

    group.members = [];

    for (let i = 0; i < count; i++) {
        let member = {};
        [ member.status, member.userId, member.userName, member.figure, member.memberSince ]
            = packet.read('iiSSS');
        group.members.push(member);
    }

    [ group.allowedToManage, group.pageSize, group.pageIndex, group.searchType, group.userNameFilter ]
        = packet.read('BiiiS');

    console.log(group);

});

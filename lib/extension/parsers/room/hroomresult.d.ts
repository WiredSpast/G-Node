import { HPacket } from "../../../protocol/hpacket";
import { HNavigatorRoom } from "../navigator/hnavigatorroom";
import { HRoomModSettings } from "./hroommodsettings";
import { HRoomChatSettings } from "./hroomchatsettings";

export class HRoomResult {
  constructor(packet: HPacket);

  /**
   * Construct packet with header id containing the room result
   * @param headerId Header id of packet
   */
  constructPacket(headerId: number): HPacket;

  /**
   * Append the room result to an existing packet
   * @param packet Packet to append to
   */
  appendToPacket(packet: HPacket): void;

  /**
   * Whether you would be entering the room
   */
  get isEnterRoom(): boolean;
  set isEnterRoom(val: boolean);

  /**
   * The room data
   */
  get data(): HNavigatorRoom;
  set data(val: HNavigatorRoom);

  /**
   * Whether you come from another room (using a teleport)
   */
  get isRoomForward(): boolean;
  set isRoomForward(val: boolean);

  /**
   * Whether the room is a staff pick
   */
  get isStaffPick(): boolean;
  set isStaffPick(val: boolean);

  /**
   * Whether you are a member of the room's group
   */
  get isGroupMember(): boolean;
  set isGroupMember(val: boolean);

  /**
   * Whether room mute is enable in the room
   */
  get allInRoomMuted(): boolean;
  set allInRoomMuted(val: boolean);

  /**
   * Who can mute, kick and/or ban
   */
  get moderationSettings(): HRoomModSettings;
  set moderationSettings(val: HRoomModSettings);

  /**
   * Whether you can mute other people
   */
  get youCanMute(): boolean;
  set youCanMute(val: boolean);

  /**
   * The chat settings
   */
  get chatSettings(): HRoomChatSettings;
  set chatSettings(val: HRoomChatSettings);
}
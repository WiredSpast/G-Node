import { HPacket } from "../../../protocol/hpacket";

export class HRoomModSettings {
  constructor(packet: HPacket);

  /**
   * Append the room moderation settings to an existing packet
   * @param packet Packet to append to
   */
  appendToPacket(packet: HPacket): void;

  /**
   * Which moderation level do you need to mute people
   */
  get whoCanMute(): number;
  set whoCanMute(val: number);

  /**
   * Which moderation level do you need to kick people
   */
  get whoCanKick(): number;
  set whoCanKick(val: number);

  /**
   * Which moderation level do you need to ban people
   */
  get whoCanBan(): number;
  set whoCanBan(val: number);
}
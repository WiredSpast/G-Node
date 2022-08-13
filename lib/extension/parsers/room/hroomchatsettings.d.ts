import { HPacket } from "../../../protocol/hpacket";

export class HRoomChatSettings {
  constructor(packet: HPacket);

  /**
   * Append the room chat settings to an existing packet
   * @param packet Packet to append to
   */
  appendToPacket(packet: HPacket): void;

  /**
   * What chat mode does the room use
   */
  get mode(): number;
  set mode(val: number);

  /**
   * How wide are the bubbles
   */
  get bubbleWidth(): number;
  set bubbleWidth(val: number);

  /**
   * What is the scrollspeed
   */
  get scrollSpeed(): number;
  set scrollSpeed(val: number);

  /**
   * What is the hear range
   */
  get fullHearRange(): number;
  set fullHearRange(val: number);

  /**
   * What is the flood sensitivity level
   */
  get floodSensitivity(): number;
  set floodSensitivity(val: number);
}
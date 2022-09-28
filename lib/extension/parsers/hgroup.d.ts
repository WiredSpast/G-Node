import { HPacket } from "../../protocol/hpacket";

export class HGroup {
  constructor(packet: HPacket);
  
  /**
   * Construct packet with group
   * @param headerId Header id of packet to construct
   */
  constructPacket(headerId: number): HPacket;
  
  /**
   * Append group to packet
   * @param packet Packet to append group to
   */
  appendToPacket(packet: HPacket): void;
  
  /**
   * Get group id
   */
  get id(): number;
  
  /**
   * Set group id
   */
  set id(val: number);
  
  /**
   * Get group name
   */
  get name(): string;
  
  /**
   * Set group name
   */
  set name(val: string);
  
  /**
   * Get group badge code
   */
  get badgeCode(): string;
  
  /**
   * Set group badge code
   */
  set badgeCode(val: string);
  
  /**
   * Get primary color
   */
  get primaryColor(): string;
  
  /**
   * Set primary color
   */
  set primaryColor(val: string);
  
  /**
   * Get secondary color
   */
  get secondaryColor(): string;
  
  /**
   * Set secondary color
   */
  set secondaryColor(val: string);
  
  /**
   * Is favorite group
   */
  get isFavorite(): string;
  
  /**
   * Set is favorite group
   */
  set isFavorite(val: string);
  
  /**
   * Get id of group owner
   */
  get ownerId(): number;
  
  /**
   * Set id of group owner
   */
  set ownerId(val: number);
  
  /**
   * Check if group has a forum
   */
  get hasForum(): boolean;
  
  /**
   * Set whether group has a forum
   */
  set hasForum(val: boolean);
}

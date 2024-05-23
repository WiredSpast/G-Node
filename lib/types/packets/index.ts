import { HDirection } from '../../protocol/hdirection';
import { type IncomingPacket } from './incoming'
import { type OutgoingPacket } from './outgoing'

type Packet = IncomingPacket | OutgoingPacket

type PacketDirectionType<T> = T extends HDirection.TOSERVER ? OutgoingPacket : IncomingPacket;

export { Packet, IncomingPacket, OutgoingPacket, PacketDirectionType }
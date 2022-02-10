import { HDirection } from "../../../protocol/hdirection";
import { HPacket } from "../../../protocol/hpacket";

export class AwaitingPacket {
    constructor(headerName: string, direction: HDirection, maxWaitingTimeMillis: number);

    /**
     * Set minimum waiting time (wait this time even if the packet was already intercepted)
     * @param millis minimum waiting time
     */
    setMinWaitingTime(millis: number): AwaitingPacket;

    /**
     * Add a condition to the awaiting packet
     * @param condition Predicate with HPacket parameter return true or false
     */
    addCondition(condition: (hPacket: HPacket) => boolean): AwaitingPacket;

    /**
     * Get header name of awaiting packet
     */
    get headerName(): string;

    /**
     * Get direction of awaiting packet
     */
    get direction(): HDirection;
}
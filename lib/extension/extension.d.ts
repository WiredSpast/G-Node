import {HPacket} from "../protocol/hpacket";
import {HDirection} from "../protocol/hdirection";
import {HMessage} from "../protocol/hmessage";
import {ExtensionInfo} from "./extensioninfo";
import {HClient} from "../protocol/hclient";
import {PacketInfoManager} from "../services/packetinfo/packetinfomanager";
import { HostInfo } from "../misc/hostinfo";

export class Extension {
    constructor(extensionInfo: ExtensionInfo);

    /**
     * Start connection with G-Earth
     */
    run(): void;

    /**
     * Send a message to the client
     * @param packet packet to be sent
     * @return success or failure
     */
    sendToClient(packet: HPacket): boolean;

    /**
     * Send a message to the server
     * @param packet packet to be sent
     * @return success or failure
     */
    sendToServer(packet: HPacket): boolean;

    /**
     * Register a listener on a specific packet type by name or hash
     * @param direction ToClient or ToServer
     * @param headerNameOrHash The packet name or hash
     * @param messageListener The callback
     */
    interceptByNameOrHash(direction: HDirection, headerNameOrHash: string | String, messageListener: (hMessage: HMessage) => void): void;

    /**
     * Register a listener on a specific packet type by header ID
     * @param direction ToClient or ToServer
     * @param headerId The packet header ID
     * @param messageListener The callback
     */
    interceptByHeaderId(direction: HDirection, headerId: number, messageListener: (hMessage: HMessage) => void): void;

    /**
     * Register a listener on a all packet types
     * @param direction ToClient or ToServer
     * @param messageListener The callback
     */
    interceptAll(direction: HDirection, messageListener: (hMessage: HMessage) => void): void;

    /**
     * Requests the flags which have been given to G-Earth when it got executed
     * For example, you might want this extension to do a specific thing if the flag "-e" was given
     * @param flagRequestCallback callback
     * @return if the request was successful, will return false if another flag request is busy
     */
    requestFlags(flagRequestCallback: Function): boolean;

    /**
     * Write to the console in G-Earth
     * @param s The text to be written
     * @param colorClass Optional color of the text to be written (default: "black")
     */
    writeToConsole(s: string | String, colorClass?: string): void;

    /**
     * Listen for an event
     * @param event Valid events: init, click, start, end, connect
     * @param listener Do on event
     */
    on(event: string, listener: (...args: any[]) => void): this;

    /**
     * Listen for extension initialization
     * @param event Extension initialized
     * @param listener Do on initialization
     */
    on(event: 'init', listener: () => void): this;

    /**
     * Listen for click on button in G-Earth Extensions tab
     * @param event G-Earth button clicked
     * @param listener Do on click
     */
    on(event: 'click', listener: () => void): this;

    /**
     * Listen for the connection to start
     * @param event Connection started
     * @param listener Do on connection start
     */
    on(event: 'start', listener: () => void): this;

    /**
     * Listen for the connection to end
     * @param event Connection ended
     * @param listener Do on connection end
     */
    on(event: 'end', listener: () => void): this;

    /**
     * Listen for a connection
     * @param event Connection made
     * @param listener Do on connection made (passes parameters host, connectionPort, hotelVersion, clientIdentifier, clientType)
     */
    on(event: 'connect', listener: (host: string, connectionPort: number, hotelVersion: string, clientIdentifier: string, clientType: HClient) => void): this;

    /**
     * Listen for the socket connection to drop
     * @param event Socket connection ended
     * @param listener Do on socket connection end
     */
    on(event: 'socketdisconnect', listener: () => void): this;

    /**
     * Listen for updates on host info
     * @param event Host info updated
     * @param listener Do on host info update
     */
    on(event: 'hostinfoupdate', listener: (hostInfo: HostInfo) => void): this;

    /**
     * Get the packet info manager
     */
    getPacketInfoManager(): PacketInfoManager | undefined;

    /**
     * Get the CURRENT host info (use the hostinfoupdate listener to always have the host info up to date)
     */
    getHostInfo(): HostInfo | undefined;

}

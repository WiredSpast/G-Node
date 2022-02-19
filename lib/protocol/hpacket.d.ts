import { HDirection } from "./hdirection";
import { PacketInfoManager } from "../services/packetinfo/packetinfomanager";

export class HPacket {
    constructor(bytes: Uint8Array);
    constructor(packet: HPacket);
    constructor(packet: String | string);
    constructor(headerId: number);
    constructor(headerId: number, bytes: Uint8Array);
    constructor(identifier: String | string, direction: HDirection);

    /**
     * Get the packet as a string
     */
    toString(): string;

    /**
     * Check if the packet's structure matches
     * @param structure String structure to be compared to structure of packet
     */
    //TODO structureEquals(structure: String | string): boolean;

    /**
     * isEOF
     */
    isEOF(): number;
    /**
     * Change the private parameter #identifier
     * @param val String identifier
     */
    set identifier(val: string);
    /**
     * Change the private parameter #direction
     * @param val HDirection (TOSERVER or TOCLIENT)
     */
    set identifierDirection(val: HDirection);
    /**
     * Get private parameter #identifier
     */
    get identifier(): string;
    /**
     * Get private parameter #identifierDirection
     */
    get identifierDirection(): HDirection;

    completePacket(packetInfoManager: PacketInfoManager): void;
    /**
     * Checks whether packet can be send to client
     */
    canSendToClient(): boolean;
    /**
     * Checks whether packet can be send to server
     */
    canSendToServer(): boolean;

    canComplete(packetInfoManager: PacketInfoManager): boolean;
    /**
     * Checks whether packet is complete
     */
    isPacketComplete(): boolean;
    /**
     * Return the private parameter #packetInBytes
     */
    toBytes(): Uint8Array;
    /**
     * Return the private parameter #readIndex
     */
    get readIndex(): number;
    /**
     * Change the private parameter #readIndex
     * @param val Read index
     */
    set readIndex(val: number);
    /**
     * Reset the private parameter #readIndex to it's starting value (6)
     */
    resetReadIndex(): void;
    /**
     * Check if packet is corrupted
     */
    isCorrupted(): boolean;
    /**
     * Read the headerId from packet
     */
    headerId(): number;
    /**
     * Read the length from packet
     */
    length(): number;
    /**
     * Get entire length of packet
     */
    getBytesLength(): number;

    /**
     * Read byte/UInt8 from packet
     * @param index Optional read index
     */
    readByte(index?: number): number;
    /**
     * Read short/Int16 from packet
     * @param index Optional read index
     */
    readShort(index?: number): number;
    /**
     * Read unsigned short/UInt16 from packet
     * @param index Optional read index
     */
    readUShort(index?: number): number;
    /**
     * Read integer/Int32 from packet
     * @param index Optional read index
     */
    readInteger(index?: number): number;
    /**
     * Read float/Float32 from packet
     * @param index Optional read index
     */
    readFloat(index?: number): number;
    /**
     * Read double/Float64 from packet
     * @param index Optional read index
     */
    readDouble(index?: number): number;
    /**
     * Read byte[]/UInt8Array from packet
     * @param length Length to read
     * @param index Optional read index
     */
    readBytes(length: number, index?: number): Uint8Array;
    /**
     * Read long/Int64 from packet
     * @param index Optional read index
     */
    readLong(index?: number): bigint;
    /**
     * Read string from packet
     * @param index Optional read index
     * @param charset Optional encoding charset (default: "latin1")
     */
    readString(index?: number, charset?: BufferEncoding): string;
    /**
     * Read long string from packet
     * @param index Optional read index
     * @param charset Optional encoding charset (default: "latin1")
     */
    readLongString(index?: number, charset?: BufferEncoding): string;
    /**
     * Read boolean from packet
     * @param index Optional read index
     */
    readBoolean(index?: number): boolean;
    /**
     * Read from packet in given structure: <br>
     * b: byte / UInt8 <br>
     * i: int / Int32 <br>
     * s: short / Int16 <br>
     * u: ushort / UInt16 <br>
     * l: long / Int64 <br>
     * d: double / Float64 <br>
     * f: float / Float32 <br>
     * B: boolean <br>
     * S: string
     * @param structure Structure string to read
     */
    read(structure: string): any[];

    /**
     * Replace boolean by value
     * @param index Replacing index
     * @param b Boolean value to place
     */
    replaceBoolean(index: number, b: boolean): this;
    /**
     * Replace int/Int32 by value
     * @param index Replacing index
     * @param i int/Int32 value to place
     */
    replaceInt(index: number, i: number): this;
    /**
     * Replace long/Int64 by value
     * @param index Replacing index
     * @param l long/Int64 value to place
     */
    replaceLong(index: number, l: number): this;
    /**
     * Replace double/Float64 by value
     * @param index Replacing index
     * @param d double/Float64 value to place
     */
    replaceDouble(index: number, d: number): this;
    /**
     * Replace float/Float32 by value
     * @param index Replacing index
     * @param f float/Float32 value to place
     */
    replaceFloat(index: number, f: number): this;
    /**
     * Replace byte/UInt8 by value
     * @param index Replacing index
     * @param b byte/UInt8 value to place
     */
    replaceByte(index: number, b: number): this;
    /**
     * Replace byte[]/UInt8Array by value
     * @param index Replacing index
     * @param bytes byte[]/UInt8Array value to place
     */
    replaceBytes(index: number, bytes: Uint8Array): this;
    /**
     * Replace unsigned short/UInt16 by value
     * @param index Replacing index
     * @param ushort unsigned short/UInt16 value to place
     */
    replaceUShort(index: number, ushort: number): this;
    /**
     * Replace short/Int16 by value
     * @param index Replacing index
     * @param s short/Int16 value to place
     */
    replaceShort(index: number, s: number): this
    /**
     * Replace string by value
     * @param index Replacing index
     * @param s string value to place
     * @param charset Optional encoding charset (default: "latin1")
     */
    replaceString(index: number, s: String | string, charset?: BufferEncoding): this;
    /**
     * Replace first found string by value
     * @param oldS string value to be replaced
     * @param newS string value to place
     */
    replaceFirstString(oldS: String | string, newS: String | string): this;
    /**
     * Replace x found strings by value
     * @param oldS string value to be replaced
     * @param newS string value to place
     * @param amount amount of strings to be replaced (-1 = all)
     */
    replaceXStrings(oldS: String | string, newS: String | string, amount: number): this;

    /**
     * Replace all found strings by value
     * @param oldS string value to be replaced
     * @param newS string value to place
     */
    replaceAllStrings(oldS: String | string, newS: String | string): this;

    /**
     * Replace first found substring by value
     * @param oldS string value to be replaced
     * @param newS string value to place
     */
    replaceFirstSubstring(oldS: String | string, newS: String | string): this;

    /**
     * Replace x found substrings by value
     * @param oldS string value to be replaced
     * @param newS string value to place
     * @param amount amount of strings to be replaced (-1 = all)
     */
    replaceXSubstrings(oldS: String | string, newS: String | string, amount: number): this;

    /**
     * Replace all found substrings by value
     * @param oldS string value to be replaced
     * @param newS string value to place
     */
    replaceAllSubstrings(oldS: String | string, newS: String | string): this;

    /**
     * Replace all found integers of val by value
     * @param val int/Int32 value to be replaced
     * @param replacement int/Int32 value to place
     */
    replaceAllIntegers(val: number, replacement: number);

    /**
     * Check if string can be read at index
     * @param index
     */
    canReadString(index: number): boolean;


    /**
     * Append int/Int32 at end of packet
     * @param i int/Int32 value to append
     */
    appendInt(i: number): this;

    /**
     * Append long/Int64 at end of packet
     * @param l long/Int64 value to append
     */
    appendLong(l: number): this;

    /**
     * Append double/Float64 at end of packet
     * @param d double/Float64 value to append
     */
    appendDouble(d: number): this;

    /**
     * Append float/Float32 at end of packet
     * @param f float/Float32 value to append
     */
    appendFloat(f: number): this;

    /**
     * Append byte/UInt8 at end of packet
     * @param b byte/UInt8 value to append
     */
    appendByte(b: number): this;

    /**
     * Append byte[]/UInt8Array at end of packet
     * @param bytes byte[]/UInt8Array value to append
     */
    appendBytes(bytes: Uint8Array): this;

    /**
     * Append boolean at end of packet
     * @param b boolean value to append
     */
    appendBoolean(b: boolean): this;

    /**
     * Append unsigned short/UInt16 at end of packet
     * @param ushort unsigned short/UInt16 value to append
     */
    appendUShort(ushort: number): this;

    /**
     * Append short/Int16 at end of packet
     * @param s short/Int16 value to append
     */
    appendShort(s: number): this;

    /**
     * Append string at end of packet
     * @param s string value to append
     * @param charset Optional encoding charset (default: "latin1")
     */
    appendString(s: String | string, charset?: BufferEncoding): this;

    /**
     * Append long string at end of packet
     * @param s long string value to append
     * @param charset Optional encoding charset (default: "latin1")
     */
    appendLongString(s: String | string, charset?: BufferEncoding): this;

    /**
     * Append objects to packet in given structure <br>
     * b: byte / UInt8 <br>
     * i: int / Int32 <br>
     * s: short / Int16 <br>
     * u: ushort / UInt16 <br>
     * l: long / Int64 <br>
     * d: double / Float64 <br>
     * f: float / Float32 <br>
     * B: boolean <br>
     * S: string
     * @param objects Array of objects to append
     * @param structure String of objects structure
     */
    append(structure: string, ...objects: any[]): this;



    /**
     * Insert int/Int32 at index
     * @param index Index to insert at
     * @param i int/Int32 value to insert
     */
    insertInt(index: number, i: number): this;

    /**
     * Insert long/Int64 at index
     * @param index Index to insert at
     * @param l long/Int64 value to insert
     */
    insertLong(index: number, l: number): this;

    /**
     * Insert double/Float64 at index
     * @param index Index to insert at
     * @param d double/Float64 value to insert
     */
    insertDouble(index: number, d: number): this;

    /**
     * Insert float/Float32 at index
     * @param index Index to insert at
     * @param f float/Float32 value to insert
     */
    insertFloat(index: number, f: number): this;

    /**
     * Insert byte/UInt8 at index
     * @param index Index to insert at
     * @param b byte/UInt8 value to insert
     */
    insertByte(index: number, b: number): this;

    /**
     * Insert byte[]/UInt8Array at index
     * @param index Index to insert at
     * @param bytes byte[]/UInt8Array value to insert
     */
    insertBytes(index: number, bytes: Uint8Array): this;

    /**
     * Insert boolean at index
     * @param index Index to insert at
     * @param b boolean value to insert
     */
    insertBoolean(index: number, b: boolean): this;

    /**
     * Insert unsigned short/UInt16 at index
     * @param index Index to insert at
     * @param ushort unsigned short/UInt16 value to insert
     */
    insertUShort(index: number, ushort: number): this;

    /**
     * Insert short/Int16 at index
     * @param index Index to insert at
     * @param s short/Int16 value to insert
     */
    insertShort(index: number, s: number): this;

    /**
     * Insert string at index
     * @param index Index to insert at
     * @param s string value to insert
     * @param charset Optional encoding charset (default: "latin1")
     */
    insertString(index: number, s: String | string, charset?: BufferEncoding): this;

    /**
     * Insert objects to packet in given structure at index <br>
     * b: byte / UInt8 <br>
     * i: int / Int32 <br>
     * s: short / Int16 <br>
     * u: ushort / UInt16 <br>
     * l: long / Int64 <br>
     * d: double / Float64 <br>
     * f: float / Float32 <br>
     * B: boolean <br>
     * S: string
     * @param index Index to insert at
     * @param objects Array of objects to insert
     * @param structure String of objects structure
     */
    insert(index:number, structure: string, ...objects: any[]): this;


    /**
     * Check if packet has been edited
     */
    isReplaced(): boolean;

    /**
     * Fix packet length bytes
     */
    fixLength(): void;

    /**
     * Change private parameter #isEdited to value
     * @param edited boolean value to set
     */
    overrideEditedField(edited: boolean): void;

    /**
     * Get the expression of the packet with given structure
     * @param structure Structure of packet
     */
    toExpression(structure: string): string;

    /**
     * Convert the packet to a string
     */
    stringify(): string;

    /**
     * Read packet arguments from a string
     * @param str packet string
     */
    constructFromString(str: String | string): void;

    /**
     * Compare other hPacket to hPacket (compares private parameter #packetInBytes and private parameter #isEdited)
     * @param packet hPacket to compare with current hPacket
     */
    equals(packet: HPacket): boolean;
}

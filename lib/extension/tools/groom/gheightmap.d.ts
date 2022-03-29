import { Extension } from "../../extension";
import { GHeightMapTile } from "./gheightmaptile";

export class GHeightMap {
    constructor(ext: Extension);

    getTileIndex(x: number, y: number): number;

    getCoords(index: number): [ number, number ];

    getTileValue(x: number, y: number): number;

    getTileHeight(x: number, y: number): number;

    isRoomTile(x: number, y: number): boolean;

    isStackingBlocked(x: number, y: number): boolean;

    getTile(x: number, y: number): GHeightMapTile;

    get tiles(): GHeightMapTile[];

    get width(): number;

    get height(): number;

    set changeListener(listener: (heightMap: GHeightMap) => void);
}
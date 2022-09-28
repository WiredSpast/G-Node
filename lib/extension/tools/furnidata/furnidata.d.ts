import { Hotel } from "./hotel";

export type FurniData = {
  roomitemtypes: {
    furnitype: FloorItemData[]
  },
  wallitemtypes: {
    furnitype: WallItemData[]
  },
  getFloorItemByTypeId(id: number): FloorItemData,
  getWallItemByTypeId(id: number): WallItemData,
  getFloorItemByClassName(classname: string): FloorItemData,
  getWallItemByClassName(classname: string): WallItemData
};

export namespace FurniDataUtils {
  export function fetch(hotel: Hotel): Promise<FurniData>;
}

export type WallItemData = {
  id: number;
  classname: string;
  revision: number;
  category: string;
  name: string;
  description: string;
  adurl: string;
  specialtype: number;
  furniline: string;
  environment: string;
  rare: boolean;
  offerid: number;
  buyout: boolean;
  rentofferid: number;
  rentbuyout: boolean;
  bc: boolean;
  excludeddynamic: boolean;
}

export type FloorItemData = WallItemData & {
  defaultdir: number;
  xdim: number;
  ydim: number;
  partcolors: {
    color: string[];
  };
  customparams: string;
  canstandon: boolean;
  cansiton: boolean;
  canlayon: boolean;
}
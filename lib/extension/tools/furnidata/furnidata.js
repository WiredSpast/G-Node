import fetch from 'node-fetch';
import { Hotel } from './hotel.js';

const FurniDataUtils = Object.freeze({
  async fetch (hotel) {
    if (!Hotel.identify(hotel)) { throw new Error('FurniData.fetch: hotel must be a value of Hotel'); }

    const furniData = await (await fetch(`${hotel}gamedata/furnidata_json/1`)).json();

    furniData.getFloorItemByTypeId = getFloorItemByTypeId;
    furniData.getWallItemByTypeId = getWallItemByTypeId;
    furniData.getFloorItemByClassName = getFloorItemByClassName;
    furniData.getWallItemByClassName = getWallItemByClassName;

    return freeze(furniData);
  }
});

function freeze (furniData) {
  furniData.roomitemtypes.furnitype = furniData.roomitemtypes.furnitype.map(item => Object.freeze(item));
  furniData.wallitemtypes.furnitype = furniData.wallitemtypes.furnitype.map(item => Object.freeze(item));
  furniData.roomitemtypes.furnitype = Object.freeze(furniData.roomitemtypes.furnitype);
  furniData.wallitemtypes.furnitype = Object.freeze(furniData.wallitemtypes.furnitype);
  furniData.roomitemtypes = Object.freeze(furniData.roomitemtypes);
  furniData.wallitemtypes = Object.freeze(furniData.wallitemtypes);
  return Object.freeze(furniData);
}

function getFloorItemByTypeId (id) {
  return this.roomitemtypes.furnitype.find(item => item.id === id);
}

function getWallItemByTypeId (id) {
  return this.wallitemtypes.furnitype.find(item => item.id === id);
}

function getFloorItemByClassName (classname) {
  return this.roomitemtypes.furnitype.find(item => item.classname === classname);
}

function getWallItemByClassName (classname) {
  return this.wallitemtypes.furnitype.find(item => item.classname === classname);
}

export { FurniDataUtils };

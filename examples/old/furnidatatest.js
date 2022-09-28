import { FurniDataUtils, Hotel } from "../../index.js";

const furniData = (await FurniDataUtils.fetch(Hotel.NL));

console.log(furniData.getFloorItemByTypeId(20));
console.log(furniData.getWallItemByTypeId(4582));

console.log(furniData.getFloorItemByClassName("easter11_mushroom2"));
console.log(furniData.getWallItemByClassName("nft_h22_sharkaquarium"));

console.log('Flooritem count:', furniData.roomitemtypes.furnitype.length);
console.log('Wallitem count:', furniData.wallitemtypes.furnitype.length);
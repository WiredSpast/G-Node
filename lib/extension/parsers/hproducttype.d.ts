export enum HProductType {
  WallItem = 'I',
  FloorItem = 'S',
  Effect = 'E',
  Badge = 'B'
}

export namespace HProductType {
  export function identify(object: any): HProductType | undefined;
}
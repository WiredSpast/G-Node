export enum HFacing {
  North,
  NorthEast,
  East,
  SouthEast,
  South,
  SouthWest,
  West,
  NorthWest
}

export namespace HFacing {
  export function identify(object: any): HFacing | undefined;
}

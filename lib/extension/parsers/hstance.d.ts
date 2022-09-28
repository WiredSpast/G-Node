export enum HStance {
  Stand,
  Sit,
  Lay
}

export namespace HStance {
  export function identify(object: any): HStance | undefined;
}
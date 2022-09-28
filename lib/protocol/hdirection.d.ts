export enum HDirection {
  TOCLIENT,
  TOSERVER
}

export namespace HDirection {
  export function identify(object: any): HDirection | undefined;
}
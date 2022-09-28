export enum HClient {
  UNITY,
  FLASH,
  NITRO
}

export namespace HClient {
  export function identify(object: any): HClient | undefined;
}

export enum HEntityType {
  HABBO = 1,
  PET,
  OLD_BOT,
  BOT
}

export namespace HEntityType {
  export function identify(object: any): HEntityType | undefined;
}
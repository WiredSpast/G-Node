export enum HAction {
  None,
  Move,
  Sit,
  Lay,
  Sign
}

export namespace HAction {
  export function HAction(object: any): HAction | undefined;
}
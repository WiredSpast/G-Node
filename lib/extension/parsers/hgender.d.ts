export enum HGender {
  Unisex = 'U',
  Male = 'M',
  Female = 'F'
}

export namespace HGender {
  export function identify(object: any): HGender | undefined;
}
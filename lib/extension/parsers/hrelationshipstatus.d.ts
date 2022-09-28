export enum HRelationshipStatus {
  None,
  Heart,
  Smiley,
  Skull
}

export namespace HRelationshipStatus {
  export function identify(object: any): HRelationshipStatus | undefined;
}
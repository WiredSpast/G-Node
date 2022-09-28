export enum HSign {
  Zero,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Heart,
  Skull,
  Exclamation,
  Soccerball,
  Smiley,
  Redcard,
  Yellowcard,
  Invisible
}

export namespace HSign {
  export function identify(object: any): HSign | undefined;
}
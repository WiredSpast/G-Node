export enum Hotel {
  NL =      'https://www.habbo.nl/',
  ES =      'https://www.habbo.es/',
  DE =      'https://www.habbo.de/',
  FR =      'https://www.habbo.fr/',
  IT =      'https://www.habbo.it/',
  FI =      'https://www.habbo.fi/',
  COM =     'https://www.habbo.com/',
  COMTR =   'https://www.habbo.com.tr/',
  COMBR =   'https://www.habbo.com.br/',
  SANDBOX = 'https://sandbox.habbo.com/'
}

export namespace Hotel {
  export function fromHost(host: string): Hotel | null;
}
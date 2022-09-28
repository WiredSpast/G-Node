const Hotel = Object.freeze({
  NL: 'https://www.habbo.nl/',
  ES: 'https://www.habbo.es/',
  DE: 'https://www.habbo.de/',
  FR: 'https://www.habbo.fr/',
  IT: 'https://www.habbo.it/',
  FI: 'https://www.habbo.fi/',
  COM: 'https://www.habbo.com/',
  COMTR: 'https://www.habbo.com.tr/',
  COMBR: 'https://www.habbo.com.br/',
  SANDBOX: 'https://sandbox.habbo.com/',

  fromHost (host) {
    switch (host) {
      case 'game-nl.habbo.com':
        return Hotel.NL;
      case 'game-es.habbo.com':
        return Hotel.ES;
      case 'game-de.habbo.com':
        return Hotel.DE;
      case 'game-fr.habbo.com':
        return Hotel.FR;
      case 'game-it.habbo.com':
        return Hotel.IT;
      case 'game-fi.habbo.com':
        return Hotel.FI;
      case 'game-us.habbo.com':
        return Hotel.COM;
      case 'game-br.habbo.com':
        return Hotel.COMBR;
      case 'game-tr.habbo.com':
        return Hotel.COMTR;
      case 'game-s2.habbo.com':
        return Hotel.SANDBOX;
    }

    return null;
  },

  identify (hotel) {
    for (const key in this) {
      if (this[key] === hotel) { return key; }
    }
  }
});

export { Hotel };

/**
 * Client type
 * @readonly
 * @enum {number}
 */
const HClient = Object.freeze({
  UNITY: 0,
  FLASH: 1,
  NITRO: 2,

  identify (val) {
    for (const key in this) {
      if (this[key] === val) { return key; }
    }
  }
});

export { HClient };

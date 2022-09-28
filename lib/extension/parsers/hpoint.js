import util from 'util';

export class HPoint {
  #x;
  #y;
  #z;

  [util.inspect.custom] (depth) {
    const indent = '  '.repeat(depth > 2 ? depth - 2 : 0);
    return 'HPoint {\n' +
      `${indent}  x: ${util.inspect(this.#x, { colors: true })}\n` +
      `${indent}  y: ${util.inspect(this.#y, { colors: true })}\n` +
      `${indent}  z: ${util.inspect(this.#z, { colors: true })}\n` +
      `${indent}}`;
  }

  constructor (x, y, z = 0) {
    if (!Number.isInteger(x)) {
      throw new Error('HPoint.constructor: x must be an integer');
    }
    if (!Number.isInteger(y)) {
      throw new Error('HPoint.constructor: y must be an integer');
    }
    if (Number.isNaN(z) || typeof z !== 'number') {
      throw new Error('HPoint.constructor: z must be a double');
    }

    this.#x = x;
    this.#y = y;
    this.#z = z;
  }

  get x () {
    return this.#x;
  }

  set x (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HPoint.x: must be an integer');
    }

    this.#x = val;
  }

  get y () {
    return this.#y;
  }

  set y (val) {
    if (!Number.isInteger(val)) {
      throw new Error('HPoint.y: must be an integer');
    }

    this.#y = val;
  }

  get z () {
    return this.#z;
  }

  set z (val) {
    if (Number.isNaN(val) || typeof val !== 'number') {
      throw new Error('HPoint.z: must be a double');
    }

    this.#z = val;
  }

  equals (point) {
    if (!(point instanceof HPoint)) {
      throw new Error('HPoint.equals: point must be an instance of HPoint');
    }

    return this.#x === point.#x && this.#y === point.#y && this.#z === point.#z;
  }

  toString () {
    return `(${this.#x}, ${this.#y}, ${this.#z})`;
  }
}

/**
 * Logger's color classes
 * @readonly
 * @enum {string}
 */
const LoggerColorClass = Object.freeze({
  GREY: 'grey',
  LIGHT_GREY: 'lightgrey',
  YELLOW: 'yellow',
  ORANGE: 'orange',
  WHITE: 'white',
  PURPLE: 'purple',
  BROWN: 'brown',
  PINK: 'pink',
  RED: 'red',
  BLACK: 'black',
  BLUE: 'blue',
  CYAN: 'cyan',
  GREEN: 'green',
  DARKER_GREEN: 'darkergreen',
  DARK: 'dark',
  CARET: 'cyan',
  
  identify (val) {
    for (const key in this)
      if (key !== 'identify' && this[key] === val)
        return key;
    
    return undefined;
  }
});

export { LoggerColorClass };
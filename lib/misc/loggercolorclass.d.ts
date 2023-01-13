export enum LoggerColorClass {
  GREY = 'grey',
  LIGHT_GREY = 'lightgrey',
  YELLOW = 'yellow',
  ORANGE = 'orange',
  WHITE = 'white',
  PURPLE = 'purple',
  BROWN = 'brown',
  PINK = 'pink',
  RED = 'red',
  BLACK = 'black',
  BLUE = 'blue',
  CYAN = 'cyan',
  GREEN = 'green',
  DARKER_GREEN = 'darkergreen',
  DARK = 'dark',
  CARET = 'cyan'
}

export namespace LoggerColorClass {
  export function identify(object: any): LoggerColorClass | undefined;
}
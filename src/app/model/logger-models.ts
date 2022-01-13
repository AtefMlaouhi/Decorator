export interface TechLoggerOptions {
  action: string;
  message: string;
}

export interface BusLoggerOptions {
  action: string;
  messageOK: string;
  messageKO: string;
}

// Prototype pour la callback de logs
export type LoggerCB = () => string;
// Niveau des messages de logs
export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  ALWAYS,
  BUSINESS,
  BUSINESSERROR,
}

export enum LogColorConsole {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",

  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",

  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m",
}

// Format des options de configuration
export interface Options {
  [name: string]: string | number | undefined;
}

// Format de base des messages de log
export interface BasicMsg {
  env: string;
  traceId: string | undefined;
  spanId: string | undefined;
  parentSpanId: string | undefined;
  level: string;
  when: string | undefined;
  serviceID: string;
  serviceVersion: string;
  function: string;
  action: string;
  message: string;
  duration: number;
}

// Format des messages technique
export interface TechnicalMsg extends BasicMsg {
  params: {
    url: string;
    method: string;
  };
  result: {
    code: number;
  };
}
// Format des messages métier
export interface BusinessMsg extends BasicMsg {
  input: string;
  output: string;
}
// Format des erreurs métier
export interface BusinessErrorMsg extends BasicMsg {
  description: string;
}
// Format des messages d'exception
export interface ExceptionMsg extends BasicMsg {
  description: string;
  stack: string | undefined;
}

/**
 * This is equivalent to:
 * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG'
 */
export type LogLevelStrings = keyof typeof LogLevel;

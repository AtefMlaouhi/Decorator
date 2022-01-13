import { Injectable } from "@angular/core";
import {
  LogLevel,
  Options,
  BasicMsg,
  LogColorConsole,
  LoggerCB,
  TechnicalMsg,
  ExceptionMsg,
  BusinessMsg,
} from "../model/logger-models";

/**
 * Service de logs : singleton mono instance by injector Angular
 */
@Injectable({
  providedIn: "root",
})
export class LoggerSrv {
  // niveau de verbosité minimum
  private minLevel: LogLevel;
  // hordatage message pour debug
  private topTime: number;
  // Context de la requête
  private context: Options[] = [];

  //
  private debug(msg: string): void {
    // this.logDebug(() => 'LoggerSrv : ' + msg)
  }

  /**
   * Initialisation de la classe; lecture de la config
   */
  constructor() {
    this.debug("LoggerSrv.constructor : enter");
    this.topTime = 0;
    this.minLevel = LogLevel.WARN;
    this.ResetContext();
    // Read Platform level -> Parameter Store
    // Read Stack level -> Parameter Store
    // Read Lambda level -> process.env
    this.minLevel = LogLevel.INFO;
  }
  /**
   *
   * @param verbosity
   * @returns
   */
  private static normalizeLogLevel(verbosity: string | undefined): LogLevel {
    try {
      switch (verbosity) {
        case "ALWAYS":
          return LogLevel.ALWAYS;
        case "ERROR":
          return LogLevel.ERROR;
        case "INFO":
          return LogLevel.INFO;
        default:
        case "DEBUG":
          return LogLevel.DEBUG;
        case "WARN":
          return LogLevel.WARN;
      }
    } catch (error) {
      console.error(error);
      return LogLevel.WARN;
    } finally {
    }
  }

  /**
   * Reset du context de log
   * @returns le nouveau context
   */
  private ResetContext(): Options {
    try {
      // Context initial issue des paramètres d'appel
      this.context = [
        {
          traceId: "00000000-0000-0000-0000-000000000000",
          spanId: "1",
          parentSpanId: "",
          startTime: 1,
          //'startTime': (new Date()).toISOString().replace(/\.\d{3}Z$/, 'Z'),
        },
      ];
    } catch (error) {
      console.error("LoggerSrv.ResetContext : " + error);
    } finally {
    }
    return this.context[this.context.length - 1];
  }
  /**
   *
   */
  public GetCurrentContext(): Options {
    if (!this.context) this.ResetContext();
    return this.context[this.context.length - 1];
  }
  /**
   *
   */
  public DelCurrentContext(): Options | undefined {
    return this.context.pop();
  }
  /**
   * Initialiser un nouveau context de log
   * @param Headers
   */
  public SetNewContext(Options: Options): Options {
    Options = Options || {};
    let context: Options = {};
    try {
      //this.debug('LoggerSrv.SetContext : enter : ' + JSON.stringify(Options))
      if (!this.context) this.ResetContext();

      // Recopier les infos de Options dans context
      Object.keys(Options).forEach((key) => {
        context[key] = Options[key];
      });
      context.startTime = this.topTime;
      this.topTime++;
      this.context.push(context);
    } catch (error) {
      console.error("LoggerSrv.SetContext : " + error);
    } finally {
      this.debug("LoggerSrv.SetContext : leave");
    }
    return context;
  }
  /**
   * Normalisation des messages et compléter avec le context initialisé
   * @param message
   * @returns
   */
  private FormatMsg(currLevel: LogLevel, message: BasicMsg): string {
    message.level = LogLevel[currLevel];
    if (!this.context) this.ResetContext();

    // Recopier les infos de context dans le message
    let context = this.context[this.context.length - 1];
    message.traceId = context.traceId as string;
    message.spanId = context.spanId as string;
    message.parentSpanId = context.parentSpanId as string;

    //message.when = (new Date()).toISOString().replace(/\.\d{3}Z$/, 'Z')
    message.when = this.topTime.toString();
    message.duration = this.topTime - (context.startTime as number);
    return JSON.stringify(message);
  }

  /**
   * Traiter le message en fonction du niveau de verbosité
   * @param currLevel
   * @param message
   */
  private logMessage(currLevel: LogLevel, message: BasicMsg): void {
    // Les logs qui ne sont jamais filtré
    switch (currLevel) {
      case LogLevel.ALWAYS:
      case LogLevel.BUSINESS:
        console.log(
          LogColorConsole.FgYellow,
          this.FormatMsg(currLevel, message),
          LogColorConsole.Reset
        );
        return;
      case LogLevel.ERROR:
      case LogLevel.BUSINESSERROR:
        console.error(
          LogColorConsole.FgRed,
          this.FormatMsg(currLevel, message),
          LogColorConsole.Reset
        );
        return;
    }
    // Les logs soumis à filtrage
    if (currLevel >= this.minLevel) {
      try {
        switch (currLevel) {
          case LogLevel.INFO:
            console.info(
              LogColorConsole.FgBlue,
              this.FormatMsg(currLevel, message),
              LogColorConsole.Reset
            );
            return;
          case LogLevel.DEBUG:
            console.debug(
              LogColorConsole.FgWhite,
              this.FormatMsg(currLevel, message),
              LogColorConsole.Reset
            );
            return;
          default:
          case LogLevel.WARN:
            console.warn(
              LogColorConsole.FgCyan,
              this.FormatMsg(currLevel, message),
              LogColorConsole.Reset
            );
            return;
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.warn("message perdu ...");
    }
  }

  /**
   * Ajouter un message de debug
   * @param CallBack callback de mise en forme du message
   */
  logDebug(CallBack: LoggerCB): void {
    if (LogLevel.DEBUG <= this.minLevel) {
      try {
        const info = {} as TechnicalMsg;
        info.message = CallBack();
        this.logMessage(LogLevel.DEBUG, info);
      } catch (error) {
        console.error(LogColorConsole.BgRed, error);
      }
    }
  }
  /**
   * Ajouter un message de info
   * @param CallBack callback de mise en forme du message
   */
  logInfo(CallBack: LoggerCB): void {
    if (LogLevel.INFO <= this.minLevel) {
      try {
        const info = {} as TechnicalMsg;
        info.message = CallBack();
        this.logMessage(LogLevel.INFO, info);
      } catch (error) {
        console.error(LogColorConsole.BgRed, error);
      }
    }
  }
  /**
   * Ajouter un message de warning
   * @param CallBack callback de mise en forme du message
   */
  logWarning(CallBack: LoggerCB): void {
    if (LogLevel.WARN <= this.minLevel) {
      try {
        const info = {} as TechnicalMsg;
        info.message = CallBack();
        this.logMessage(LogLevel.WARN, info);
      } catch (error) {
        console.error(LogColorConsole.BgRed, error);
      }
    }
  }
  /**
   * Ajouter un message de erreur
   * @param CallBack callback de mise en forme du message
   */
  logError(CallBack: LoggerCB): void {
    try {
      const info = {} as TechnicalMsg;
      info.message = CallBack();
      this.logMessage(LogLevel.ERROR, info);
    } catch (error) {
      console.error(LogColorConsole.BgRed, error);
    }
  }

  /**
   * Pour les exceptions uniquement
   * @param ex
   */
  logException(ex: Error): void {
    try {
      const info = {} as ExceptionMsg;
      info.message = ex.message;
      info.stack = ex.stack;
      this.logMessage(LogLevel.ERROR, info);
    } catch (error) {
      console.error(LogColorConsole.BgRed, error);
    }
  }
  /**
   * Pour les messages Business uniquement
   * @param message
   */
  logBusiness(action: string, message: string): void {
    try {
      const info = {} as BusinessMsg;
      info.action = action;
      info.message = message;
      this.logMessage(LogLevel.BUSINESS, info);
    } catch (error) {
      console.error(LogColorConsole.BgRed, error);
    }
  }
  /**
   * Pour les messages Business uniquement
   * @param message
   */
  logBusinessError(action: string, message: string): void {
    try {
      const info = {} as BusinessMsg;
      info.action = action;
      info.message = message;
      this.logMessage(LogLevel.BUSINESSERROR, info);
    } catch (error) {
      console.error(LogColorConsole.BgRed, error);
    }
  }
  /**
   * Technical messages
   */
  /**
   * Pour les messages Technique uniquement
   * @param message
   */
  logTechnical(action: string, message: string, CallBack: LoggerCB): void {
    try {
      const info = {} as BusinessMsg;
      info.action = action;
      info.message = CallBack();
      this.logMessage(LogLevel.INFO, info);
    } catch (error) {
      console.error(LogColorConsole.BgRed, error);
    }
  }

  logTechnicalError(action: string, message: string, CallBack: LoggerCB): void {
    try {
      const info = {} as BusinessMsg;
      info.action = action;
      info.message = CallBack();
      this.logMessage(LogLevel.ERROR, info);
    } catch (error) {
      console.error(LogColorConsole.BgRed, error);
    }
  }
}

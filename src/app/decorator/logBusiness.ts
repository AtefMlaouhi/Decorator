import { LoggerModule } from "../logger-module";
import { BusLoggerOptions } from "../model/logger-models";
import { LoggerSrv } from "../services/logger";

export function logBusiness(Options: BusLoggerOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // keep a reference to the original function
    const originalFunction = descriptor.value;

    // Replace the original function with a wrapper
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
      const logger = LoggerModule.injector.get<LoggerSrv>(LoggerSrv);
      try {
        // Call the original function
        var result = originalFunction.apply(this, args);
        logger.logBusiness(Options.action, Options.messageOK);
        return descriptor;
      } catch (error) {
        logger.logBusinessError(Options.action, Options.messageKO);
      }
    };
  };
}

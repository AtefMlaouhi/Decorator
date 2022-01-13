import { LoggerModule } from "../logger-module";
import { TechLoggerOptions } from "../model/logger-models";
import { LoggerSrv } from "../services/logger";

/**
 * Decorator : annotation des méthodes
 * @param value
 * @returns
 */
export function logTechnical(Options: TechLoggerOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // keep a reference to the original function
    const originalFunction = descriptor.value;

    // Replace the original function with a wrapper
    descriptor.value = function (...args: any[]) {
      const logger = LoggerModule.injector.get<LoggerSrv>(LoggerSrv);

      let context = logger.GetCurrentContext();
      context = logger.SetNewContext({
        traceId: context.traceId,
        parentSpanId: context.spanId,
        spanId: context.spanId + "1",
      });

      let result: any;
      try {
        logger.logTechnical(
          Options.action,
          Options.message,
          () => `${propertyKey} : enter : (${args.join(", ")})`
        );
        // Call the original function
        result = originalFunction.apply(this, args);
        // Check if method is asynchronous
        if (result && result instanceof Promise) {
          // Return promise
          return result
            .then(() => {
              logger.logTechnical(
                Options.action,
                "",
                () => `${propertyKey} : leave : ${JSON.stringify(result)}`
              );
              logger.DelCurrentContext();
            })
            .catch(() => {
              logger.logTechnicalError(
                Options.action,
                "",
                () => `${propertyKey} : error : ${JSON.stringify(result)}`
              );
              logger.DelCurrentContext();
            });
        } else {
          logger.logTechnical(
            Options.action,
            "",
            () => `${propertyKey} : leave : ${JSON.stringify(result)}`
          );
          logger.DelCurrentContext();
        }
      } catch (error) {
        logger.logTechnicalError(
          Options.action,
          "",
          () => `${propertyKey} : error : ${JSON.stringify(error)}`
        );
        logger.DelCurrentContext();
      }
      return descriptor;
    };
  };
}

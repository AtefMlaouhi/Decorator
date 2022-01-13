import { NgModule, Injector } from "@angular/core";
import { LoggerSrv } from "./services/logger";

@NgModule({
  declarations: [],
  imports: [],
  providers: [LoggerSrv],
})
export class LoggerModule {
  static injector: Injector;

  constructor(injector: Injector) {
    LoggerModule.injector = injector;
  }
}

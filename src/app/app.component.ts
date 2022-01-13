import { Component } from "@angular/core";
import { Delay } from "./decorator/delay";
import { Ninja, StrongNinja } from "./model/ninja";
import { IntervallValue } from "./decorator/IntervallValue";
import { LoggerSrv } from "./services/logger";
import { logBusiness } from "./decorator/logBusiness";
import { NinjaService } from "./services/ninja.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "decorator-example";
  increment = 0;

  im_ninja: Ninja;

  @IntervallValue(25, 32)
  currentValue: number;

  constructor(private ninjaService: NinjaService) {
    this.incrementByOne();
    this.decreaseByOne();
    this.im_ninja = new Ninja();
    this.im_ninja.lastName = "Mlaouhi";
    console.log(this.im_ninja);
    this.im_ninja = new StrongNinja();
    this.im_ninja.lastName = "Mlaouhi";
    console.log(this.im_ninja);
    this.currentValue = 40;
    this.getInformationNinjaOk();
    this.getInformationNinjaKO();
  }

  @Delay(2000)
  incrementByOne() {
    this.increment++;
  }

  @Delay(4500)
  decreaseByOne() {
    this.increment--;
  }

  @logBusiness({
    action: "Get Ninja Infomation",
    messageOK: "Get Ninja Infomation Ok",
    messageKO: "Get Ninja Infomation KO",
  })
  getInformationNinjaOk() {
    this.ninjaService.getNinjaInformation().subscribe();
  }

  @logBusiness({
    action: "Get Ninja Infomation",
    messageOK: "Get Ninja Infomation Ok",
    messageKO: "Get Ninja Infomation KO",
  })
  getInformationNinjaKO() {
    throw "some error";
  }
}

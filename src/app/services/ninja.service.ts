import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { logTechnical } from "../decorator/logTechnical";

@Injectable({
  providedIn: "root",
})
export class NinjaService {
  constructor() {}

  @logTechnical(
    {
      action: 'http request get ninja information',
      message: 'i m ninja'
    }
  )
  getNinjaInformation(): Observable<any> {
    return of({
      lastName: "Mlaouhi",
      firstName: "Atef",
    });
  }
}

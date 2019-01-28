import { Component } from '@angular/core';
import { Delay } from './decorator/delay';
import { Ninja, StrongNinja } from './model/ninja';
import { IntervallValue } from './decorator/IntervallValue';
import { LogDecorator } from './decorator/log-decorator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'decorator-example';
  increment = 0;

  im_ninja: Ninja;

  @IntervallValue(25, 32)
  currentValue: number;

  constructor() {
    this.incrementByOne();
    this.decreaseByOne();
    this.im_ninja = new Ninja();
    this.im_ninja.lastName = 'Mlaouhi';
    console.log(this.im_ninja);
    this.im_ninja = new StrongNinja();
    this.im_ninja.lastName = 'Mlaouhi';
    console.log(this.im_ninja);
    this.currentValue = 40;
  }

  @Delay(2000)
  incrementByOne() {
    this.increment++;
  }

  @Delay(4500)
  decreaseByOne() {
    this.increment--;
  }
}

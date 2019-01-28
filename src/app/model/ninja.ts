import { DecoratorClassAddSkills } from '../decorator/class';
import { ReadOnly } from '../decorator/readOnly';
import { LogDecorator } from '../decorator/log-decorator';

export class Ninja {
    @ReadOnly
    firstName: string;
    lastName: string;

    constructor() {
    }

    @LogDecorator
    public functionLog() {
    }
}

@DecoratorClassAddSkills
export class StrongNinja extends Ninja {}

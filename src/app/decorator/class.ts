export function DecoratorClassAddSkills<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        Skills_one = 'Angular 7.0';
        Skills_tow = 'Craft';
    };
}

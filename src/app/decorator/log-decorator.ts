import "reflect-metadata";

export function LogDecorator(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  console.log('I"m a ninja');
}

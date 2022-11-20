/* eslint-disable @typescript-eslint/no-explicit-any */

export function idempotent() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const targetMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return targetMethod.apply(this, args);
    };

    return descriptor;
  };
}

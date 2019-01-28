export function IntervallValue(min: number = 0, max?: number) {
    let value: number;
    return (target: any, propertyKey: string | symbol) => {
        const update = Reflect.defineProperty(
            target,
            propertyKey,
            {
                configurable: true,
                enumerable: true,
                get: () => {
                    return value;
                },
                set: (newValue: number) => {
                    value = (
                        newValue >= min
                            ? newValue
                            : min
                    );
                    if (max) {
                        if (max > min) {
                            value = (newValue >= max
                                ? max
                                : newValue);
                        }
                    }
                }
            },
        );
        if (!update) {
            throw new Error('Unable to update property');
        }
    };
}

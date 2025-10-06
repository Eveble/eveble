import { types } from '../types';
export declare const EjsonableTrait: import("@traits-ts/core").Trait<(base: {
    new (): {
        [x: string]: any;
        getTypeName(): string;
        toString(): string;
        toJSONValue(): Record<string, any>;
    };
    [x: string]: any;
    toString(): string;
    getTypeName(): string;
}) => {
    new (): {
        [x: string]: any;
        typeName(): types.TypeName;
        getTypeName(): string;
        toString(): string;
        toJSONValue(): Record<string, any>;
    };
    typeName(): types.TypeName;
    toString(): string;
    getTypeName(): string;
}, [import("@traits-ts/core").Trait<(base: any) => {
    new (): {
        [x: string]: any;
        getTypeName(): string;
        toString(): string;
        toJSONValue(): Record<string, any>;
    };
    [x: string]: any;
    toString(): string;
    getTypeName(): string;
}, undefined>]>;

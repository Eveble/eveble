import { types } from '../types';
export declare const SerializableTrait: import("@traits-ts/core").Trait<(base: any) => {
    new (): {
        [x: string]: any;
        getTypeName(): types.TypeName;
        toString(): types.TypeName;
        toJSONValue(): Record<string, any>;
    };
    [x: string]: any;
    toString(): types.TypeName;
    getTypeName(): types.TypeName;
}, undefined>;

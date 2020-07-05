import { types } from '../types';
export declare class SerializableMixin {
    getTypeName(): types.TypeName;
    toString(): types.TypeName;
    static toString(): types.TypeName;
    static getTypeName(): types.TypeName;
    toJSONValue(): Record<string, any>;
}

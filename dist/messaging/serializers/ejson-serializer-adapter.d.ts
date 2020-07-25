import { types } from '../../types';
export declare class EJSONSerializerAdapter implements types.Serializer {
    protected ejson: any;
    protected readonly typeKey: string;
    constructor(typeKey?: string);
    registerType(typeName: types.TypeName, type: types.Type, shouldOverride?: boolean): void;
    protected createFactory(type: types.Type): Function;
    getFactory(typeName: types.TypeName): Function & {
        type: types.Type;
    };
    overrideType(typeName: types.TypeName, type: types.Type): void;
    hasType(typeName: types.TypeName): boolean;
    getTypes(): Map<types.TypeName, types.Type>;
    getType(typeName: types.TypeName): types.Type | undefined;
    getTypeOrThrow(typeName: types.TypeName): types.Type;
    getTypesNames(): types.TypeName[];
    removeType(typeName: types.TypeName): void;
    removeTypes(): void;
    isTypeInstance(typeInstance: types.Serializable): boolean;
    getTypeKey(): string;
    toJSONValue(value: any): any;
    fromJSONValue(value: Record<string, any>): Record<string, any> | types.Serializable;
    stringify(value: any, options?: {
        indent: boolean | number;
        canonical: boolean;
    }): string;
    parse(str: string): any;
    clone<T>(value: T): T;
    equals(a: any, b: any, options?: {
        keyOrderSensitive: boolean;
    }): boolean;
    toData(serializable: types.Serializable): Record<string, any>;
    protected processNestedObjToData(obj: Record<string, any>): Record<string, any>;
    fromData<T extends types.Serializable>(data: Record<string, any>): T;
    protected processNestedObjFromData(data: Record<string, any>): Record<string, any>;
}

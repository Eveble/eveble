import { NON_ENUMERABLE_VALUE_KEY } from '../../constants/literal-keys';
import { types } from '../../types';
declare const ValueNumber_base: (new (value?: any) => {
    [x: string]: any;
    registerHook(action: string, id: string, hook: types.AnyFunction, shouldOverride?: boolean): void;
    overrideHook(action: string, id: string, hook: types.AnyFunction): void;
    getHook(action: string, id: string): types.AnyFunction | undefined;
    getHookOrThrow(action: string, id: string): types.AnyFunction;
    getHooks(action: string): types.hooks.Mappings;
    getActions(): types.hooks.Actions;
    hasHook(action: string, id: string): boolean;
    hasAction(action: string): boolean;
    removeHook(action: string, id: string): void;
} & Number) & {
    [x: string]: any;
    prototype: {
        [x: string]: any;
        registerHook(action: string, id: string, hook: types.AnyFunction, shouldOverride?: boolean): void;
        overrideHook(action: string, id: string, hook: types.AnyFunction): void;
        getHook(action: string, id: string): types.AnyFunction | undefined;
        getHookOrThrow(action: string, id: string): types.AnyFunction;
        getHooks(action: string): types.hooks.Mappings;
        getActions(): types.hooks.Actions;
        hasHook(action: string, id: string): boolean;
        hasAction(action: string): boolean;
        removeHook(action: string, id: string): void;
    };
} & {
    readonly prototype: Number;
    readonly MAX_VALUE: number;
    readonly MIN_VALUE: number;
    readonly NaN: number;
    readonly NEGATIVE_INFINITY: number;
    readonly POSITIVE_INFINITY: number;
    readonly EPSILON: number;
    isFinite: (number: unknown) => boolean;
    isInteger: (number: unknown) => boolean;
    isNaN: (number: unknown) => boolean;
    isSafeInteger: (number: unknown) => boolean;
    readonly MAX_SAFE_INTEGER: number;
    readonly MIN_SAFE_INTEGER: number;
    parseFloat: (string: string) => number;
    parseInt: (string: string, radix?: number | undefined) => number;
};
export declare class ValueNumber extends ValueNumber_base {
    protected [NON_ENUMERABLE_VALUE_KEY]: number;
    constructor(value: number);
    toString(): string;
    valueOf(): number;
    toPlainObject(): number;
    equals(other: any): boolean;
    typeName(): types.TypeName;
    static typeName(): types.TypeName;
    getTypeName(): types.TypeName;
    static toString(): types.TypeName;
    static getTypeName(): types.TypeName;
    toJSONValue(): Record<string, any>;
    static from(value: number): any;
    static transformer: () => {
        to: (instance: any) => any;
        from: (value: number | number[]) => any;
    };
    protected onValidation(value: number, isStrict?: boolean): boolean;
    static setValidator(validator: (...args: any[]) => boolean): void;
    static getValidator(): () => boolean;
    static removeValidator(): void;
    static hasValidator(): boolean;
}
export {};

import { NON_ENUMERABLE_VALUE_KEY } from '../../constants/literal-keys';
import { types } from '../../types';
declare const ValueString_base: (new (value?: any) => {
    [x: string]: any;
    typeName(): string;
    getTypeName(): string;
    toString(): string;
    toJSONValue(): Record<string, any>;
} & {
    [x: string]: any;
    getTypeName(): string;
    toString(): string;
    toJSONValue(): Record<string, any>;
} & {
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
} & {
    [x: string]: any;
} & String) & {
    prototype: {
        [x: string]: any;
        typeName(): string;
        getTypeName(): string;
        toString(): string;
        toJSONValue(): Record<string, any>;
    };
    typeName: () => string;
    toString: () => string;
    getTypeName: () => string;
} & {
    [x: string]: any;
    prototype: {
        [x: string]: any;
        getTypeName(): string;
        toString(): string;
        toJSONValue(): Record<string, any>;
    };
    toString: () => string;
    getTypeName: () => string;
} & {
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
    [x: string]: any;
    prototype: {
        [x: string]: any;
    };
    setValidator: (validator: (...args: any[]) => boolean) => void;
    getValidator: () => () => boolean;
    removeValidator: () => void;
    hasValidator: () => boolean;
} & {
    readonly prototype: String;
    fromCharCode: (...codes: number[]) => string;
    fromCodePoint: (...codePoints: number[]) => string;
    raw: (template: {
        raw: readonly string[] | ArrayLike<string>;
    }, ...substitutions: any[]) => string;
};
export declare class ValueString extends ValueString_base {
    protected [NON_ENUMERABLE_VALUE_KEY]: string;
    constructor(value: string);
    equals(other: any): boolean;
    toString(): string;
    valueOf(): string;
    toPlainObject(): string;
    anchor(): string;
    big(): string;
    blink(): string;
    bold(): string;
    fixed(): string;
    fontcolor(color: string): string;
    fontsize(size: number | string): string;
    italics(): string;
    link(url: string): string;
    small(): string;
    strike(): string;
    sub(): string;
    sup(): string;
    protected onValidation(value: string, isStrict?: boolean): boolean;
    static from(value: string): any;
    static transformer: () => {
        to: (instance: any) => any;
        from: (value: string | string[]) => any;
    };
}
export {};

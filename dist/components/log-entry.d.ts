import { types } from '../types';
import { ExtendableError } from './extendable-error';
export declare class UndefinedLoggableTargetError extends ExtendableError {
    constructor();
}
export declare class LogMetadata implements types.LogMetadata {
    readonly description: string;
    readonly value?: any;
    readonly keys?: string[];
    constructor(description: string, value?: any, keys?: string[]);
}
export declare class Log implements types.LogEntry, types.Stringifiable {
    readonly message: string;
    readonly metadata: Map<string, types.LogMetadata>;
    readonly options: types.LogFormatting;
    level: types.LogLevel;
    private target?;
    method?: () => types.AnyFunction;
    methodName?: string;
    typeName?: types.TypeName | undefined;
    constructor(messageOrProps: string | Record<keyof any, any>);
    toString(): string;
    on(target: any): this;
    in(methodOrName: types.AnyFunction | string): this;
    with(description: string, value?: any, keys?: string[]): this;
    format(options: types.LogFormatting): this;
    getTarget(): any;
    isStaticMethod(): boolean;
    getMetadata(description: string): types.LogMetadata | undefined;
    hasMetadata(description: string): boolean;
    setLevel(level: types.LogLevel): this;
}

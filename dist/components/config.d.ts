import { types } from '../types';
import { Serializable } from './serializable';
export declare const CONFIG_INCLUDED_KEY: unique symbol;
export declare const CONFIG_MERGED_KEY: unique symbol;
export declare class Config extends Serializable implements types.Configurable {
    [CONFIG_INCLUDED_KEY]?: Record<string, types.Configurable>;
    [CONFIG_MERGED_KEY]?: Record<string, types.Configurable>;
    constructor();
    isConfigurable(path: string): boolean;
    getPropTypes(): types.Props;
    has(path: string): boolean;
    get<T>(path: string, runtimeDefaultValue?: T): T | any;
    getExact<T>(path: string): T | any;
    getDefault<T>(path: string): T | any;
    hasDefault(path: string): boolean;
    set<T>(path: string, value: T): void;
    assign(props: types.Props): void;
    include(config: types.Configurable): void;
    static from<T>(props: Record<string, any>): T;
    merge(config: types.Configurable): void;
    protected findDiffAndUpdate(target: Record<string, any>, left: Record<string, any>, right: Record<string, any>): void;
}

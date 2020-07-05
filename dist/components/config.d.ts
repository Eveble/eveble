import { Struct } from './struct';
import { types } from '../types';
export declare class Config extends Struct implements types.Configurable {
    included?: Record<string, types.Configurable>;
    merged?: Record<string, types.Configurable>;
    constructor();
    isConfigurable(path: string): boolean;
    getPropTypes(): types.Props;
    has(path: string): boolean;
    get<T extends any>(path: string, runtimeDefaultValue?: T): T | any;
    getExact<T extends any>(path: string): T | any;
    getDefault<T extends any>(path: string): T | any;
    hasDefault(path: string): boolean;
    set<T extends any>(path: string, value: T): void;
    assign(props: types.Props): void;
    include(config: types.Configurable): void;
    static from<T>(props: Record<string, any>): T;
    merge(config: types.Configurable): void;
}

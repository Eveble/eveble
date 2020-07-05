import { VersionableMixin } from '../mixins/versionable-mixin';
import { Struct } from './struct';
import { types } from '../types';
import { EjsonableMixin } from '../mixins/ejsonable-mixin';
declare const Serializable_base: import("polytype").Polytype.ClusteredConstructor<[typeof Struct, typeof EjsonableMixin, typeof VersionableMixin]>;
export declare class Serializable extends Serializable_base implements types.Ejsonable {
    schemaVersion?: number;
    constructor(props?: types.Props);
    processSerializableList(props?: types.Props): types.Props;
    in<T>(listName: string): types.List<T>;
    static from(...sources: Record<string, any>[]): any;
    static enableSerializableLists(): void;
    static disableSerializableLists(): void;
}
export {};

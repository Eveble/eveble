import { DefinableMixin } from '../mixins/definable-mixin';
import { ExtendableError } from './extendable-error';
import { types } from '../types';
import { VersionableMixin } from '../mixins/versionable-mixin';
import { HookableMixin } from '../mixins/hookable-mixin';
import { EjsonableMixin } from '../mixins/ejsonable-mixin';
declare const SerializableError_base: import("polytype").Polytype.ClusteredConstructor<[typeof ExtendableError, typeof DefinableMixin, typeof HookableMixin, typeof EjsonableMixin, typeof VersionableMixin]>;
export declare abstract class SerializableError extends SerializableError_base implements types.Versionable, types.Ejsonable {
    name: string;
    message: string;
    stack?: string;
    code?: number;
    schemaVersion?: number;
    constructor(propsOrMessage?: types.Props | string);
    protected processProps(props?: types.Props): types.Props;
    protected onConstruction(props: types.Props): types.Props;
    protected onValidation(props: types.Props): boolean;
}
export {};

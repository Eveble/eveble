import { DefinableMixin } from '../mixins/definable-mixin';
import { HookableMixin } from '../mixins/hookable-mixin';
import { types } from '../types';
declare const Struct_base: import("polytype").Polytype.ClusteredConstructor<[typeof DefinableMixin, typeof HookableMixin]>;
export declare class Struct extends Struct_base {
    constructor(props?: types.Props);
    protected construct(props?: types.Props): void;
    protected processProps(props?: types.Props): types.Props;
    protected onConstruction(props: types.Props): types.Props;
    protected onValidation(props: types.Props): boolean;
}
export {};

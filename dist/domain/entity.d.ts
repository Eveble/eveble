import { StatefulMixin } from '../mixins/stateful-mixin';
import { Serializable } from '../components/serializable';
import { Guid } from './value-objects/guid';
import { types } from '../types';
import { StatusfulMixin } from '../mixins/statusful-mixin';
import { SAVE_STATE_METHOD_KEY, ROLLBACK_STATE_METHOD_KEY, ENABLE_ACTION_VALIDATION_METHOD_KEY, DISABLE_ACTION_VALIDATION_METHOD_KEY, IS_ACTION_VALIDATED_METHOD_KEY } from '../constants/literal-keys';
declare const Entity_base: import("polytype").Polytype.ClusteredConstructor<[typeof Serializable, typeof StatefulMixin, typeof StatusfulMixin]>;
export declare class Entity extends Entity_base implements types.Entity {
    protected static asserter: types.Asserter;
    id: string | Guid;
    state: types.State;
    status: types.Status;
    schemaVersion?: number;
    constructor(props: types.Props);
    getId(): string | Guid;
    equals(otherEntity: Entity): boolean;
    protected assign(...sources: Record<string, any>[]): this;
    protected pickProps(...sources: Record<string, any>[]): Partial<this>;
    on(action: string | types.Stringifiable): this;
    get ensure(): this & {
        [key: string]: any;
    };
    get ableTo(): this;
    get is(): this & {
        [key: string]: any;
    };
    get can(): any;
    [SAVE_STATE_METHOD_KEY](): void;
    [ENABLE_ACTION_VALIDATION_METHOD_KEY](): void;
    [DISABLE_ACTION_VALIDATION_METHOD_KEY](): void;
    [IS_ACTION_VALIDATED_METHOD_KEY](): boolean;
    [ROLLBACK_STATE_METHOD_KEY](): void;
    isStateSaved(): boolean;
}
export {};

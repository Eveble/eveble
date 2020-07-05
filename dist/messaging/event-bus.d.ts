import { types } from '../types';
import { OneToManyHandlingMixin } from '../mixins/one-to-many-handling-mixin';
import { HookableMixin } from '../mixins/hookable-mixin';
declare const EventBus_base: import("polytype").Polytype.ClusteredConstructor<[typeof HookableMixin, typeof OneToManyHandlingMixin]>;
export declare class EventBus extends EventBus_base implements types.EventBus {
    constructor();
    registerHandler(eventType: types.MessageType<types.Event>, handler: types.Handler, shouldOverride?: boolean): void;
    subscribeTo(eventType: types.MessageType<types.Event>, handler: types.Handler): void;
    onPublish(id: string, hook: types.Hook, shouldOverride?: boolean): void;
    handle(event: types.Event): Promise<void>;
    publish(event: types.Event): Promise<void>;
}
export {};

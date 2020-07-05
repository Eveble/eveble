import { types } from '../types';
import { OneToOneHandlingMixin } from '../mixins/one-to-one-handling-mixin';
import { HookableMixin } from '../mixins/hookable-mixin';
declare const CommandBus_base: import("polytype").Polytype.ClusteredConstructor<[typeof HookableMixin, typeof OneToOneHandlingMixin]>;
export declare class CommandBus extends CommandBus_base implements types.CommandBus {
    constructor();
    registerHandler(commandType: types.MessageType<types.Command>, handler: types.Handler, shouldOverride?: boolean): void;
    onSend(id: string, hook: types.Hook, shouldOverride?: boolean): void;
    handle(command: types.Command): Promise<any>;
    send(command: types.Command): Promise<any>;
}
export {};

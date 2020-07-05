import { CommandHandlingMixin } from '../mixins/command-handling-mixin';
import { EventHandlingMixin } from '../mixins/event-handling-mixin';
import { types } from '../types';
declare const Service_base: import("polytype").Polytype.ClusteredConstructor<[typeof CommandHandlingMixin, typeof EventHandlingMixin]>;
export declare class Service extends Service_base {
    commandBus: types.CommandBus;
    eventBus: types.EventBus;
    initialize(): void;
}
export {};

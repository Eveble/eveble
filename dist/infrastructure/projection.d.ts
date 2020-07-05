import { EventHandlingMixin } from '../mixins/event-handling-mixin';
import { StatefulMixin } from '../mixins/stateful-mixin';
import { types } from '../types';
declare const Projection_base: import("polytype").Polytype.ClusteredConstructor<[typeof EventHandlingMixin, typeof StatefulMixin]>;
export declare class Projection extends Projection_base implements types.Projection {
    eventBus: types.EventBus;
    protected log: types.Logger;
    static STATES: {
        projecting: string;
        rebuilding: string;
    };
    protected queuedEvents: types.Event[];
    constructor();
    initialize(): void;
    on(event: types.Event, isRebuildEvent?: boolean): Promise<void>;
    enterRebuildMode(): Promise<void>;
    exitRebuildMode(): Promise<void>;
    invokeAction(actionName: string): Promise<void>;
    getProjectionName(): string;
}
export {};

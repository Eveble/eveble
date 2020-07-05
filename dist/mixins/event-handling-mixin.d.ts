import { OneToManyHandlingMixin } from './one-to-many-handling-mixin';
import { types } from '../types';
export declare class EventHandlingMixin extends OneToManyHandlingMixin implements types.Publisher {
    eventBus: types.EventBus;
    initialize(): void;
    registerEventHandler(eventType: types.MessageType<types.Event>, handler: types.Handler, shouldOverride?: boolean): void;
    subscribeTo(eventType: types.MessageType<types.Event>, handler: types.Handler, shouldOverride?: boolean): void;
    getSubscribedEvents(): types.MessageType<types.Event>[];
    on(event: types.Event): Promise<void>;
    publish(event: types.Event): Promise<void>;
}

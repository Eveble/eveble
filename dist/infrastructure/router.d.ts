import { types } from '../types';
import { Guid } from '../domain/value-objects/guid';
export declare class Router implements types.Router {
    injector: types.Injector;
    protected log: types.Logger;
    protected commandBus: types.CommandBus;
    protected eventBus: types.EventBus;
    protected repository: types.EventSourceableRepository;
    EventSourceableType: types.EventSourceableType;
    InitializingMessageType: types.MessageType<types.Command | types.Event>;
    routedCommands: types.MessageType<types.Command>[];
    routedEvents: types.MessageType<types.Event>[];
    constructor(EventSourceableType?: types.EventSourceableType, InitializingMessageType?: types.MessageType<types.Command | types.Event>, routedCommands?: types.MessageType<types.Command>[], routedEvents?: types.MessageType<types.Event>[]);
    initialize(): void;
    protected setupInitializingMessageHandler(handler: (message: types.Command | types.Event) => void): void;
    initializingMessageHandler(message: types.Command | types.Event): Promise<void>;
    isInitializable(eventSourceableId: string | Guid): Promise<boolean>;
    protected getIdForEventSourceableFromMessage(message: types.Command | types.Event): string | Guid | undefined;
    protected handleOrThrowDomainError(fn: () => Promise<types.EventSourceable>, message: types.Command | types.Event): Promise<types.EventSourceable>;
    messageHandler(message: types.Command | types.Event): Promise<void>;
    protected saveEventSourceable(eventSourceable: types.EventSourceable): Promise<void>;
    protected resolveInitializingMessage(): types.MessageType<types.Command | types.Event>;
    protected resolveRoutedCommands(): types.MessageType<types.Command>[];
    protected resolveRoutedEvents(): types.MessageType<types.Event>[];
    setupCommandHandler(CommandType: types.MessageType<types.Command>): void;
    setupEventHandler(EventType: types.MessageType<types.Event>): void;
    handleSaveErrors(error: Error, message: types.Command | types.Event, eventSourceableId: string | Guid): Promise<void>;
}

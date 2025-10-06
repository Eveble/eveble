import { types } from '../types';
declare const CommandBus_base: (new () => {
    [x: string]: any;
    registerHook(action: string, id: string, hook: types.AnyFunction, shouldOverride?: boolean): void;
    overrideHook(action: string, id: string, hook: types.AnyFunction): void;
    getHook(action: string, id: string): types.AnyFunction | undefined;
    getHookOrThrow(action: string, id: string): types.AnyFunction;
    getHooks(action: string): types.hooks.Mappings;
    getActions(): types.hooks.Actions;
    hasHook(action: string, id: string): boolean;
    hasAction(action: string): boolean;
    removeHook(action: string, id: string): void;
} & {
    [x: string]: any;
    initialize(): void;
    registerHandler(messageType: types.MessageType<types.Message>, handler: types.Handler, shouldOverride?: boolean): void;
    getHandler(messageType: types.MessageType<types.Message>): types.Handler | undefined;
    getHandlerOrThrow(messageType: types.MessageType<types.Message>): types.Handler;
    getTypeByHandler(handlerReference: types.Handler): any;
    handle(message: types.Message): Promise<any>;
    "eveble:handlers": Map<types.MessageType<types.Message>, types.Handler>;
    setupHandlers(props: {
        handlers: Map<types.MessageType<types.Message>, types.Handler>;
        registrator?: Function | undefined;
        isBoundable?: boolean | undefined;
        handleableTypes?: types.MessageType<types.Message>[] | undefined;
    }): void;
    handles(): Map<types.MessageType<types.Command>, types.Handler>;
    subscribes(): Map<types.MessageType<types.Event>, types.Handler>;
    overrideHandler(messageType: types.MessageType<types.Message>, handler: types.Handler): void;
    hasHandler(messageType: types.MessageType<types.Message>): boolean;
    removeHandler(messageType: types.MessageType<types.Message>): void;
    getHandlers(): Map<types.MessageType<types.Message>, types.Handler | types.Handler[]>;
    setHandleableTypes(handleableTypes: types.MessageType<types.Message> | types.MessageType<types.Message>[]): void;
    getHandleableTypes(): types.MessageType<types.Message>[];
    ensureHandleability(messageType: types.MessageType<types.Message>, handleableTypes?: types.MessageType<types.Message> | types.MessageType<types.Message>[]): boolean;
    isHandleabe(messageType: types.MessageType<types.Message>, handleableTypes?: types.MessageType<types.Message> | types.MessageType<types.Message>[]): boolean;
    getHandledTypes(): types.MessageType<types.Message>[];
    getHandled(messageType: types.MessageType<types.Message>): types.MessageType<types.Message>[];
    getHandledMessages(): types.MessageType<types.Message>[];
    getHandledCommands(): types.MessageType<types.Command>[];
    getHandledEvents(): types.MessageType<types.Event>[];
    getHandledTypesNames(): string[];
    "eveble:handleable-types": types.MessageType<types.Message>[];
} & {
    [x: string]: any;
    setupHandlers(props: {
        handlers: Map<types.MessageType<types.Message>, types.Handler>;
        registrator?: Function | undefined;
        isBoundable?: boolean | undefined;
        handleableTypes?: types.MessageType<types.Message>[] | undefined;
    }): void;
    handles(): Map<types.MessageType<types.Command>, types.Handler>;
    subscribes(): Map<types.MessageType<types.Event>, types.Handler>;
    registerHandler(_messageType: types.MessageType<types.Message>, _handler: types.Handler, _shouldOverride?: boolean): void;
    overrideHandler(messageType: types.MessageType<types.Message>, handler: types.Handler): void;
    hasHandler(messageType: types.MessageType<types.Message>): boolean;
    removeHandler(messageType: types.MessageType<types.Message>): void;
    getHandlers(): Map<types.MessageType<types.Message>, types.Handler | types.Handler[]>;
    setHandleableTypes(handleableTypes: types.MessageType<types.Message> | types.MessageType<types.Message>[]): void;
    getHandleableTypes(): types.MessageType<types.Message>[];
    ensureHandleability(messageType: types.MessageType<types.Message>, handleableTypes?: types.MessageType<types.Message> | types.MessageType<types.Message>[]): boolean;
    isHandleabe(messageType: types.MessageType<types.Message>, handleableTypes?: types.MessageType<types.Message> | types.MessageType<types.Message>[]): boolean;
    getHandledTypes(): types.MessageType<types.Message>[];
    getHandled(messageType: types.MessageType<types.Message>): types.MessageType<types.Message>[];
    getHandledMessages(): types.MessageType<types.Message>[];
    getHandledCommands(): types.MessageType<types.Command>[];
    getHandledEvents(): types.MessageType<types.Event>[];
    getHandledTypesNames(): string[];
    "eveble:handlers": Map<types.MessageType<types.Message>, types.Handler | types.Handler[]>;
    "eveble:handleable-types": types.MessageType<types.Message>[];
}) & {
    [x: string]: any;
    prototype: {
        [x: string]: any;
        registerHook(action: string, id: string, hook: types.AnyFunction, shouldOverride?: boolean): void;
        overrideHook(action: string, id: string, hook: types.AnyFunction): void;
        getHook(action: string, id: string): types.AnyFunction | undefined;
        getHookOrThrow(action: string, id: string): types.AnyFunction;
        getHooks(action: string): types.hooks.Mappings;
        getActions(): types.hooks.Actions;
        hasHook(action: string, id: string): boolean;
        hasAction(action: string): boolean;
        removeHook(action: string, id: string): void;
    };
} & {
    prototype: {
        [x: string]: any;
        initialize(): void;
        registerHandler(messageType: types.MessageType<types.Message>, handler: types.Handler, shouldOverride?: boolean): void;
        getHandler(messageType: types.MessageType<types.Message>): types.Handler | undefined;
        getHandlerOrThrow(messageType: types.MessageType<types.Message>): types.Handler;
        getTypeByHandler(handlerReference: types.Handler): any;
        handle(message: types.Message): Promise<any>;
        "eveble:handlers": Map<types.MessageType<types.Message>, types.Handler>;
        setupHandlers(props: {
            handlers: Map<types.MessageType<types.Message>, types.Handler>;
            registrator?: Function | undefined;
            isBoundable?: boolean | undefined;
            handleableTypes?: types.MessageType<types.Message>[] | undefined;
        }): void;
        handles(): Map<types.MessageType<types.Command>, types.Handler>;
        subscribes(): Map<types.MessageType<types.Event>, types.Handler>;
        overrideHandler(messageType: types.MessageType<types.Message>, handler: types.Handler): void;
        hasHandler(messageType: types.MessageType<types.Message>): boolean;
        removeHandler(messageType: types.MessageType<types.Message>): void;
        getHandlers(): Map<types.MessageType<types.Message>, types.Handler | types.Handler[]>;
        setHandleableTypes(handleableTypes: types.MessageType<types.Message> | types.MessageType<types.Message>[]): void;
        getHandleableTypes(): types.MessageType<types.Message>[];
        ensureHandleability(messageType: types.MessageType<types.Message>, handleableTypes?: types.MessageType<types.Message> | types.MessageType<types.Message>[]): boolean;
        isHandleabe(messageType: types.MessageType<types.Message>, handleableTypes?: types.MessageType<types.Message> | types.MessageType<types.Message>[]): boolean;
        getHandledTypes(): types.MessageType<types.Message>[];
        getHandled(messageType: types.MessageType<types.Message>): types.MessageType<types.Message>[];
        getHandledMessages(): types.MessageType<types.Message>[];
        getHandledCommands(): types.MessageType<types.Command>[];
        getHandledEvents(): types.MessageType<types.Event>[];
        getHandledTypesNames(): string[];
        "eveble:handleable-types": types.MessageType<types.Message>[];
    };
} & {
    [x: string]: any;
    prototype: {
        [x: string]: any;
        setupHandlers(props: {
            handlers: Map<types.MessageType<types.Message>, types.Handler>;
            registrator?: Function | undefined;
            isBoundable?: boolean | undefined;
            handleableTypes?: types.MessageType<types.Message>[] | undefined;
        }): void;
        handles(): Map<types.MessageType<types.Command>, types.Handler>;
        subscribes(): Map<types.MessageType<types.Event>, types.Handler>;
        registerHandler(_messageType: types.MessageType<types.Message>, _handler: types.Handler, _shouldOverride?: boolean): void;
        overrideHandler(messageType: types.MessageType<types.Message>, handler: types.Handler): void;
        hasHandler(messageType: types.MessageType<types.Message>): boolean;
        removeHandler(messageType: types.MessageType<types.Message>): void;
        getHandlers(): Map<types.MessageType<types.Message>, types.Handler | types.Handler[]>;
        setHandleableTypes(handleableTypes: types.MessageType<types.Message> | types.MessageType<types.Message>[]): void;
        getHandleableTypes(): types.MessageType<types.Message>[];
        ensureHandleability(messageType: types.MessageType<types.Message>, handleableTypes?: types.MessageType<types.Message> | types.MessageType<types.Message>[]): boolean;
        isHandleabe(messageType: types.MessageType<types.Message>, handleableTypes?: types.MessageType<types.Message> | types.MessageType<types.Message>[]): boolean;
        getHandledTypes(): types.MessageType<types.Message>[];
        getHandled(messageType: types.MessageType<types.Message>): types.MessageType<types.Message>[];
        getHandledMessages(): types.MessageType<types.Message>[];
        getHandledCommands(): types.MessageType<types.Command>[];
        getHandledEvents(): types.MessageType<types.Event>[];
        getHandledTypesNames(): string[];
        "eveble:handlers": Map<types.MessageType<types.Message>, types.Handler | types.Handler[]>;
        "eveble:handleable-types": types.MessageType<types.Message>[];
    };
};
export declare class CommandBus extends CommandBus_base implements types.CommandBus {
    constructor();
    registerHandler(commandType: types.MessageType<types.Command>, handler: types.Handler, shouldOverride?: boolean): void;
    onSend(id: string, hook: types.Hook, shouldOverride?: boolean): void;
    handle(command: types.Command): Promise<any>;
    send(command: types.Command): Promise<any>;
}
export {};

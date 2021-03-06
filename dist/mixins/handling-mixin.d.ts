import { types } from '../types';
import { HANDLERS, HANDLEABLE_TYPES } from '../constants/literal-keys';
export declare abstract class HandlingMixin {
    protected [HANDLERS]: Map<types.MessageType<types.Message>, types.Handler | types.Handler[]>;
    protected [HANDLEABLE_TYPES]: types.MessageType<types.Message>[];
    constructor();
    protected setupHandlers(props: {
        handlers: Map<types.MessageType<types.Message>, types.Handler>;
        registrator?: Function;
        isBoundable?: boolean;
        handleableTypes?: types.MessageType<types.Message>[];
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
    getHandledTypesNames(): types.TypeName[];
}

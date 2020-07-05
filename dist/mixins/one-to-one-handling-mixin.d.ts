import { HandlingMixin } from './handling-mixin';
import { types } from '../types';
import { HANDLERS } from '../constants/literal-keys';
export declare class OneToOneHandlingMixin extends HandlingMixin implements types.Controller {
    protected [HANDLERS]: Map<types.MessageType<types.Message>, types.Handler>;
    initialize(): void;
    registerHandler(messageType: types.MessageType<types.Message>, handler: types.Handler, shouldOverride?: boolean): void;
    getHandler(messageType: types.MessageType<types.Message>): types.Handler | undefined;
    getHandlerOrThrow(messageType: types.MessageType<types.Message>): types.Handler;
    getTypeByHandler(handlerReference: types.Handler): any | undefined;
    handle(message: types.Message): Promise<any>;
}

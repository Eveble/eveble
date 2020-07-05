import { OneToOneHandlingMixin } from './one-to-one-handling-mixin';
import { types } from '../types';
export declare class CommandHandlingMixin extends OneToOneHandlingMixin implements types.Sender {
    commandBus: types.CommandBus;
    initialize(): void;
    registerCommandHandler(commandType: types.MessageType<types.Command>, handler: types.Handler, shouldOverride?: boolean): void;
    send(command: types.Command): Promise<any>;
}

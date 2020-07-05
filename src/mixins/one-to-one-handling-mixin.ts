import { getTypeName } from '@eveble/helpers';
import { isFunction } from 'lodash';
import { postConstruct, injectable } from '@parisholley/inversify-async';
import { HandlingMixin } from './handling-mixin';
import { kernel } from '../core/kernel';
import {
  UnhandleableTypeError,
  InvalidHandlerError,
  HandlerExistError,
  HandlerNotFoundError,
  InvalidMessageableType,
} from '../messaging/messaging-errors';
import { types } from '../types';
import { Command } from '../components/command';
import { Event } from '../components/event';
import { HANDLERS } from '../constants/literal-keys';
import { Message } from '../components/message';

@injectable()
export class OneToOneHandlingMixin extends HandlingMixin
  implements types.Controller {
  protected [HANDLERS]: Map<types.MessageType<types.Message>, types.Handler>;

  /**
   * Initializes OneToOneHandlingMixin.
   * @remarks
   * By defining handler mappings on metadata with annotations: `@handle`,
   * `@subscribe` and resolving those mapping with `handles`, `subscribes` method -
   * it ensures, that there is no leakage in between inheriting classes.
   */
  @postConstruct()
  public initialize(): void {
    this.setupHandlers({
      handlers: this.handles(),
      handleableTypes: [Command],
      isBoundable: true,
    });
    this.setupHandlers({
      handlers: this.subscribes(),
      handleableTypes: [Event],
      isBoundable: true,
    });
  }

  /**
   * Registers handler for message type.
   * @param messageType - Type implementing `MessageableType` interface.
   * @param handler - Handler function that will executed upon handling message type.
   * @param shouldOverride - Flag indicating that handler should be overridden if exist.
   * @throws {UnhandleableTypeError}
   * Thrown if the type argument is not one of handleable types.
   * @throws {InvalidHandlerError}
   * Thrown if the handler argument is not a function.
   * @throws {HandlerExistError}
   * Thrown if handler would overridden without explicit call.
   * @example
   *```ts
   * @define('MyCommand')
   * class MyCommand extends Command {
   *   key: string;
   * }
   * define('MyOtherCommand')
   * class MyOtherCommand extends Command {
   *   key: string;
   * }
   *
   * class MyClass extends OneToOneHandlingMixin {
   *   MyCommand(command: MyCommand): void {
   *     // ...
   *   }
   *
   *   @handles()
   *   MyOtherCommand(command: MyOtherCommand): void {
   *     // ...
   *   }
   * }
   * const myClass = new MyClass();
   * // Defined externally or during construction
   * myClass.registerHandler(MyCommand, myClass.MyCommand);
   * ```
   */
  public registerHandler(
    messageType: types.MessageType<types.Message>,
    handler: types.Handler,
    shouldOverride = false
  ): void {
    if (!this.isHandleabe(messageType)) {
      throw new UnhandleableTypeError(
        getTypeName(this.constructor) as types.TypeName,
        kernel.describer.describe(this.getHandleableTypes()),
        kernel.describer.describe(messageType)
      );
    }

    if (!isFunction(handler)) {
      throw new InvalidHandlerError(
        getTypeName(this.constructor) as types.TypeName,
        messageType.getTypeName(),
        kernel.describer.describe(handler)
      );
    }

    if (this.hasHandler(messageType) && !shouldOverride) {
      throw new HandlerExistError(
        getTypeName(this.constructor) as types.TypeName,
        messageType.getTypeName()
      );
    }

    this[HANDLERS].set(messageType, handler);
  }

  /**
   * Returns handler for message type.
   * @param messageType - Type implementing `MessageableType` interface.
   * @returns Handler as a function if found, else `undefined`.
   * @throws {InvalidMessageableType}
   * Thrown if the message type argument is not implementing `Messageable` interface.
   */
  public getHandler(
    messageType: types.MessageType<types.Message>
  ): types.Handler | undefined {
    if (!(messageType.prototype instanceof Message)) {
      throw new InvalidMessageableType(kernel.describer.describe(messageType));
    }
    return this.hasHandler(messageType)
      ? this[HANDLERS].get(messageType)
      : undefined;
  }

  /**
   * Return handler for message type or throws error if not found.
   * @param messageType - Type implementing `MessageableType` interface.
   * @returns Handler as a function if found, else throws.
   * @throws {HandlerNotFoundError}
   * Thrown if handler for message type is not found.
   */
  public getHandlerOrThrow(
    messageType: types.MessageType<types.Message>
  ): types.Handler {
    const handler = this.getHandler(messageType);

    if (handler === undefined) {
      throw new HandlerNotFoundError(
        getTypeName(this.constructor) as types.TypeName,
        messageType.getTypeName()
      );
    }
    return handler;
  }

  /**
   * Resolves message type by handler reference.
   * @param handlerReference - Reference to handler function.
   * @returns Message type if handler is matching one of handlers on class, else `undefined`.
   */
  public getTypeByHandler(handlerReference: types.Handler): any | undefined {
    for (const [messageType, handler] of this[HANDLERS].entries()) {
      const unboundHandler = (handler as any).original;
      // Compare original function and bound ones as a fallback
      if (handlerReference === unboundHandler || handlerReference === handler) {
        return messageType;
      }
    }
    return undefined;
  }

  /**
   * Handles message type instance.
   * @async
   * @param message - Type implementing `Messageable` interface.
   * @returns Any value returned by successful or unsuccessful handling.
   * @throws {HandlerNotFoundError}
   * Thrown if handler for type is not found.
   */
  public async handle(message: types.Message): Promise<any> {
    const handler = this.getHandlerOrThrow(
      message.constructor as types.MessageType<types.Message>
    );
    const result = await handler(message);
    return result;
  }
}

import { getTypeName } from '@eveble/helpers';
import { isFunction } from 'lodash';
import { postConstruct, injectable } from '@parisholley/inversify-async';
import { HandlingMixin } from './handling-mixin';
import { types } from '../types';
import {
  UnhandleableTypeError,
  InvalidHandlerError,
  HandlerNotFoundError,
  UnsupportedExecutionTypeError,
  InvalidMessageableType,
} from '../messaging/messaging-errors';
import { kernel } from '../core/kernel';
import { Event } from '../components/event';
import { HANDLERS } from '../constants/literal-keys';
import { Message } from '../components/message';

@injectable()
export class OneToManyHandlingMixin extends HandlingMixin
  implements types.Controller {
  protected [HANDLERS]: Map<types.MessageType<types.Message>, types.Handler[]>;

  /**
   * Initializes OneToManyHandlingMixin.
   * @remarks
   * By defining handler mappings on metadata with annotations: `@handle`,
   * `@subscribe` and resolving those mapping with `handles`, `subscribes` method -
   * it ensures, that there is no leakage in between inheriting classes.
   */
  @postConstruct()
  public initialize(): void {
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
   * @example
   *```ts
   * @define('MyEvent')
   * class MyEvent extends Event {
   *   key: string;
   * }
   * @define('MyOtherEvent')
   * class MyOtherEvent extends Event {
   *   key: string;
   * }
   *
   * class MyClass extends OneToManyHandlingMixin {
   *   MyEvent(event: MyEvent): void {
   *     // ...
   *   }
   *
   *   @handles()
   *   MyOtherEvent(event: MyOtherEvent): void {
   *     // ...
   *   }
   * }
   * const myClass = new MyClass();
   * myClass.registerHandler(MyEvent, myClass.MyEvent);
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

    if (!this.hasHandler(messageType) || shouldOverride) {
      this[HANDLERS].set(messageType, [handler]);
    } else {
      (this[HANDLERS].get(messageType) as Function[]).push(handler);
    }
  }

  /**
   * Returns handlers for message type.
   * @param messageType - Type implementing `MessageableType` interface.
   * @returns List with handlers as a functions if found, else `undefined`.
   * @throws {InvalidMessageableType}
   * Thrown if the message type argument is not implementing `Messageable` interface.
   */
  public getHandler(
    messageType: types.MessageType<types.Message>
  ): types.Handler[] | undefined {
    if (!(messageType.prototype instanceof Message)) {
      throw new InvalidMessageableType(kernel.describer.describe(messageType));
    }
    return this.hasHandler(messageType)
      ? this[HANDLERS].get(messageType)
      : undefined;
  }

  /**
   * Return handlers for message type or throws error if not found.
   * @param messageType - Type implementing `MessageableType` interface.
   * @returns List with handlers as a functions if found, else throws.
   * @throws {HandlerNotFoundError}
   * Thrown if handler for message type is not found.
   */
  public getHandlerOrThrow(
    messageType: types.MessageType<types.Message>
  ): types.Handler[] {
    const handlers = this.getHandler(messageType);

    if (handlers === undefined) {
      throw new HandlerNotFoundError(
        getTypeName(this.constructor) as types.TypeName,
        getTypeName(messageType) as types.TypeName
      );
    }
    return handlers;
  }

  /**
   * Resolves message type by handler reference.
   * @param handlerReference - Reference to handler function.
   * @returns Message type if handler is matching one of handlers on class, else `undefined`.
   */
  public getTypeByHandler(handlerReference: types.Handler): any | undefined {
    for (const [messageType, handlers] of this[HANDLERS].entries()) {
      const unboundHandlers = handlers.map((handler) => {
        return (handler as any).original || handler;
      });
      // Compare original function and bound ones as a fallback
      if (
        unboundHandlers.includes(handlerReference) ||
        handlers.includes(handlerReference)
      ) {
        return messageType;
      }
    }
    return undefined;
  }

  /**
   * Handles message type instance sequentially.
   * @async
   * @param message - Type implementing `Messageable` interface.
   */
  public async handle(
    message: types.Message,
    execution: types.Execution = 'sequential'
  ): Promise<void> {
    switch (execution) {
      case 'sequential':
        await this.handleSequential(message);
        break;
      case 'concurrent':
        await this.handleConcurrent(message);
        break;
      default:
        throw new UnsupportedExecutionTypeError(
          getTypeName(this.constructor) as types.TypeName,
          execution
        );
    }
  }

  /**
   * Handles type instance sequentially.
   * @async
   * @param message - Type implementing `Messageable` interface.
   */
  protected async handleSequential(message: types.Message): Promise<void> {
    const handlers =
      this.getHandler(
        message.constructor as types.MessageType<types.Message>
      ) || [];
    for (const handler of handlers) {
      await handler(message);
    }
  }

  /**
   * Handles type instance concurrently.
   * @async
   * @param message - Type implementing `Messageable` interface.
   */
  protected async handleConcurrent(message: types.Message): Promise<any> {
    const handlers =
      this.getHandler(
        message.constructor as types.MessageType<types.Message>
      ) || [];
    const promises = handlers.map((handler) => {
      return handler(message);
    });
    return Promise.all(promises);
  }
}

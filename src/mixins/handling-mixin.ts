import { isEmpty } from 'lodash';
import { getTypeName } from '@eveble/helpers';
import { injectable } from '@parisholley/inversify-async';
import { kernel } from '../core/kernel';
import { types } from '../types';
import { Message } from '../components/message';
import { Command } from '../components/command';
import { Event } from '../components/event';
import { UnhandleableTypeError } from '../messaging/messaging-errors';
import { HANDLERS, HANDLEABLE_TYPES } from '../constants/literal-keys';
import {
  COMMAND_HANDLERS_CONTAINER_KEY,
  EVENT_HANDLERS_CONTAINER_KEY,
} from '../constants/metadata-keys';

@injectable()
export abstract class HandlingMixin {
  protected [HANDLERS]: Map<
    types.MessageableType,
    types.Handler | types.Handler[]
  >;

  protected [HANDLEABLE_TYPES]: types.MessageableType[];

  /**
   * Creates an instance of HandlingMixin.
   */
  constructor() {
    Object.defineProperty(this, HANDLERS, {
      value: new Map(),
      enumerable: false,
      writable: true,
    });
    Object.defineProperty(this, HANDLEABLE_TYPES, {
      value: [],
      enumerable: false,
      writable: true,
    });
  }

  /**
   * Setups all handlers for messages.
   * @props - Properties specifying setup of initialized handlers.
   * @example
   *```ts
   * class MyController extends HandlingMixin {
   *   myHandlers(): Map<types.MessageableType, types.Handler> {
   *     return new Map([
   *       [MyCommand, sinon.stub()],
   *       [MyEvent, sinon.stub()],
   *     ])
   *   }
   *
   *   initialize(): void {
   *     this.setupHandlers({
   *       handlers: this.myHandlers(),
   *     });
   *   }
   * }
   *
   * const controller = new MyController();
   * controller.initialize();
   * ```
   */
  protected setupHandlers(props: {
    handlers: Map<types.MessageableType, types.Handler>;
    registrator?: Function;
    isBoundable?: boolean;
    handleableTypes?: types.MessageableType[];
  }): void {
    const { handlers, registrator, isBoundable, handleableTypes } = {
      isBoundable: false,
      handleableTypes: this.getHandleableTypes(),
      ...props,
    };

    for (const [type, handler] of handlers) {
      if (handleableTypes) {
        this.ensureHandleability(type, handleableTypes);
      }

      let processedHandler = handler;
      if (isBoundable) {
        processedHandler = handler.bind(this);
        (processedHandler as any).original = handler;
      }

      if (registrator) {
        registrator(type, handler);
      } else if (this.hasHandler(type)) {
        this.overrideHandler(type, processedHandler);
      } else {
        this.registerHandler(type, processedHandler);
      }
    }
  }

  /**
   * Returns all handled `Command` mappings.
   * @returns Returns all handled `Command`(s) defined with `@handle` annotation
   * or allows developer to define manually handlers.
   * @example
   *```ts
   * class MyController extends HandlingMixin {
   *   initialize(): void {
   *     this.setupHandlers({
   *       handlers: this.handles(),
   *     });
   *   }
   *   // ...
   *   @handle()
   *   MyCommandHandlerMethod(command: MyCommand): boolean {
   *     return command.key === 'my-string';
   *   }
   * }
   * const controller = new MyController();
   * controller.registerHandler = sinon.stub();
   * controller.initialize();
   *
   * expect(controller.registerHandler).to.be.calledOnce;
   * expect(controller.registerHandler).to.be.calledWithExactly(
   *   MyCommand,
   *   controller.MyCommandHandlerMethod
   * );
   * ```
   */
  handles(): Map<types.MessageableType, types.Handler> {
    return (
      Reflect.getOwnMetadata(
        COMMAND_HANDLERS_CONTAINER_KEY,
        this.constructor.prototype
      ) || new Map()
    );
  }

  /**
   * Returns all handled `Event` mappings.
   * @returns Returns all handled `Events`(s) defined with `@subscribe` annotation
   * or allows developer to define manually handlers.
   * @example
   *```ts
   * class MyController extends HandlingMixin {
   *   initialize(): void {
   *     this.setupHandlers({
   *       handlers: this.subscribes(),
   *     });
   *   }
   *   // ...
   *   @subscribe()
   *   MyEventHandlerMethod(command: MyEvent): boolean {
   *     return command.key === 'my-string';
   *   }
   * }
   * const controller = new MyController();
   * controller.registerHandler = sinon.stub();
   * controller.initialize();
   *
   * expect(controller.registerHandler).to.be.calledOnce;
   * expect(controller.registerHandler).to.be.calledWithExactly(
   *   MyEvent,
   *   controller.MyEventHandlerMethod
   * );
   * ```
   */
  subscribes(): Map<types.MessageableType, types.Handler> {
    return (
      Reflect.getOwnMetadata(
        EVENT_HANDLERS_CONTAINER_KEY,
        this.constructor.prototype
      ) || new Map()
    );
  }

  /**
   * [!] Placeholder for registering handler for message type.
   * @param messageType - Type implementing `MessageableType` interface.
   * @param handler - Handler function that will executed upon handling message.
   * @param shouldOverride - Flag indicating that handler should be overridden if exist.
   */
  public registerHandler(
    messageType: types.MessageableType,
    handler: types.Handler,
    shouldOverride = false
  ): void {
    // Placeholder for concrete implementation
  }

  /**
   * Overrides already existing handler for message type.
   * @param messageType - Type implementing `MessageableType` interface.
   * @param handler - Handler function that will executed upon handling message type.
   */
  public overrideHandler(
    messageType: types.MessageableType,
    handler: types.Handler
  ): void {
    this.registerHandler(messageType, handler, true);
  }

  /**
   * Evaluates if handler for message type is registered.
   * @param messageType - Type implementing `MessageableType` interface.
   * @returns Returns `true` if handler for message type is registered, else `false`.
   */
  public hasHandler(messageType: types.MessageableType): boolean {
    return this[HANDLERS].has(messageType);
  }

  /**
   * Removes handler by type.
   * @param messageType - Type implementing `MessageableType` interface.
   */
  public removeHandler(messageType: types.MessageableType): void {
    this[HANDLERS].delete(messageType);
  }

  /**
   * Returns all available handler mappings.
   * @returns Returns mappings of all available handlers by message type: handler(s) relation.
   */
  public getHandlers(): Map<
    types.MessageableType,
    types.Handler | types.Handler[]
  > {
    return this[HANDLERS];
  }

  /**
   * Sets the only allowed handleable message types.
   * @param handleableTypes - List of allowed types for handling.
   */
  public setHandleableTypes(
    handleableTypes: types.MessageableType | types.MessageableType[]
  ): void {
    const normalizedTypes = Array.isArray(handleableTypes)
      ? handleableTypes
      : [handleableTypes];
    if (this[HANDLEABLE_TYPES] === undefined) {
      Object.defineProperty(this, 'handleableTypes', {
        value: [],
        enumerable: false,
      });
    }
    this[HANDLEABLE_TYPES].push(...normalizedTypes);
  }

  /**
   * Returns handleable message types.
   * @returns Returns handleable message types as a list with message types.
   */
  public getHandleableTypes(): types.MessageableType[] {
    return isEmpty(this[HANDLEABLE_TYPES]) ? [Message] : this[HANDLEABLE_TYPES];
  }

  /**
   * Ensures that provided type can be handled by verifying it against handleable types.
   * @param messageType - Type implementing `MessageableType` interface.
   * @param handleableTypes - Optional handleable types to be verified against on runtime.
   * @returns Returns true if `type` is handleable, else `false`.
   * @throws {UnhandleableTypeError}
   * Thrown if message type is not one of handleable types.
   */
  public ensureHandleability(
    messageType: types.MessageableType,
    handleableTypes:
      | types.MessageableType
      | types.MessageableType[] = this.getHandleableTypes()
  ): boolean {
    if (!this.isHandleabe(messageType, handleableTypes)) {
      throw new UnhandleableTypeError(
        getTypeName(this.constructor) as types.TypeName,
        kernel.describer.describe(handleableTypes),
        kernel.describer.describe(messageType)
      );
    }

    return true;
  }

  /**
   * Evaluates if type can be handled.
   * @param messageType - Type implementing `MessageableType` interface.
   * @param handleableTypes - Optional handleable types to be verified against on runtime.
   * @returns Returns `true` if message type can be handled, else `false`.
   */
  public isHandleabe(
    messageType: types.MessageableType,
    handleableTypes:
      | types.MessageableType
      | types.MessageableType[] = this.getHandleableTypes()
  ): boolean {
    const normalizedHandleableTypes = Array.isArray(handleableTypes)
      ? handleableTypes
      : [handleableTypes];

    let isHandleabe = false;
    for (const handleableType of normalizedHandleableTypes) {
      if (
        messageType.prototype instanceof handleableType ||
        messageType === handleableType
      ) {
        isHandleabe = true;
      }
    }
    return isHandleabe;
  }

  /**
   * Returns all handled message types.
   * @returns List of all handled message types.
   */
  public getHandledTypes(): types.MessageableType[] {
    const handledTypes: any[] = [];
    for (const type of this[HANDLERS].keys()) {
      handledTypes.push(type);
    }
    return handledTypes;
  }

  /**
   * Returns all message types that matches evaluated one by equal constructor or subclassing.
   * @param messageType - Type implementing `MessageableType` interface.
   * @returns List of all handled types matching evaluated one.
   */
  public getHandled(
    messageType: types.MessageableType
  ): types.MessageableType[] {
    const handledTypes: types.MessageableType[] = [];

    for (const handledType of this[HANDLERS].keys()) {
      if (kernel.validator.isValid(handledType.prototype, messageType)) {
        handledTypes.push(handledType);
      }
    }
    return handledTypes;
  }

  /**
   * Returns all messages that can be handled.
   * @returns List of all handled types matching `Message`.
   */
  public getHandledMessages(): Message[] {
    return this.getHandled(Message) as Message[];
  }

  /**
   * Returns all commands that can be handled.
   * @returns List of all handled types matching `Command`.
   */
  public getHandledCommands(): Command[] {
    return this.getHandled(Command) as Command[];
  }

  /**
   * Returns all commands that can be handled.
   * @returns List of all handled types matching `Event`.
   */
  public getHandledEvents(): Event[] {
    return this.getHandled(Event) as Event[];
  }

  /**
   * Returns all type names that can be handled.
   * @returns List of all handled type names
   */
  public getHandledTypesNames(): types.TypeName[] {
    const handlers = this.getHandlers();

    const typeNames: types.TypeName[] = [];
    for (const type of handlers.keys()) {
      typeNames.push(type.getTypeName());
    }
    return typeNames;
  }
}

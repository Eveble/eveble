import { instanceOf } from 'typend';
import { getTypeName } from '@eveble/helpers';
import { kernel } from '@eveble/core';
import {
  InvalidControllerError,
  UnhandleableTypeError,
  InitializingMessageAlreadyExistsError,
} from '../messaging/messaging-errors';
import { types } from '../types';
import 'reflect-metadata';
import { Command } from '../components/command';
import { Event } from '../components/event';
import { INITIALIZING_MESSAGE_KEY } from '../constants/metadata-keys';
import { handle } from './handle';
import { subscribe } from './subscribe';

/**
 * Annotates method parameter as a handler for initial `Command` or `Event` type(or other) - type that is
 * used as first method parameter.
 * @param target - Target which method parameter is being decorated.
 * @param methodName - Method name which parameter is being decorated.
 * @param index - Index number of the parameter that is being decorated.
 * @remarks
 * Since decorator is **executed before class instance is ever created**, we need to
 * solve the issue of registered handlers **leaking** in between multiple classes
 * when inheritance is involved.
 *
 * To solve that - we create a container on metadata that holds all registered
 * types and handlers. Then, whenever a class is instantiated - we resolve that
 * container through `Reflect.getOwnMetadata` to ensure that only metadata assigned
 * to class is resolved and then - iterate through that container on construction
 * and register all the assigned types and handlers.
 *
 * Implementation of this can be seen on `OneToOneHandlingMixin` or `OneToManyHandlingMixin` constructors.
 * @example
 *```ts
 * @Type('MyCommand')
 * class MyCommand extends Command<MyCommand> {
 *  key: string;
 * }
 *
 * class MyClass extends OneToOneHandlingMixin {
 *  MyInitialCommand(@initial command: MyCommand) {
 *    return true;
 *  }
 * }
 *
 * expect(MyClass.resolveInitializingMessage()).to.be.equal(
 *  MyCommand
 * );
 *```
 * @example
 *```ts
 * @Type('MyEvent')
 * class MyEvent extends Event<MyEvent> {
 *  key: string;
 * }
 *
 * class MyClass extends OneToOneHandlingMixin {
 *  MyInitialEvent(@initial event: MyEvent) {
 *    return true;
 *  }
 * }
 *
 * expect(MyClass.resolveInitializingMessage()).to.be.equal(
 *  MyEvent
 * );
 *```
 */
export function initial(
  target: Record<string, any>,
  methodName: string,
  index: number
): void {
  if (!instanceOf<types.Controller>(target)) {
    throw new InvalidControllerError(
      getTypeName(target.constructor) as types.TypeName
    );
  }

  const params = Reflect.getMetadata('design:paramtypes', target, methodName);
  const message = params[index];

  if (
    !(message?.prototype instanceof Command) &&
    !(message?.prototype instanceof Event)
  ) {
    throw new UnhandleableTypeError(
      getTypeName(target.constructor) as types.TypeName,
      kernel.describer.describe([Command]),
      kernel.describer.describe(message)
    );
  }

  const initializingMessage = Reflect.getOwnMetadata(
    INITIALIZING_MESSAGE_KEY,
    target.constructor.prototype
  );

  if (initializingMessage === undefined) {
    Reflect.defineMetadata(
      INITIALIZING_MESSAGE_KEY,
      message,
      target.constructor.prototype
    );
  } else {
    throw new InitializingMessageAlreadyExistsError(
      target.getTypeName(),
      initializingMessage.getTypeName(),
      message.getTypeName()
    );
  }

  if (message.prototype instanceof Command) {
    handle(target, methodName, index);
  } else {
    subscribe(target, methodName, index);
  }
}

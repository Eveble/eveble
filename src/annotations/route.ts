import { instanceOf } from 'typend';
import { getTypeName } from '@eveble/helpers';
import {
  InvalidControllerError,
  UnhandleableTypeError,
} from '../messaging/messaging-errors';
import { types } from '../types';
import 'reflect-metadata';
import { kernel } from '../core/kernel';
import { Command } from '../components/command';
import {
  ROUTED_COMMANDS_CONTAINER_KEY,
  ROUTED_EVENTS_CONTAINER_KEY,
} from '../constants/metadata-keys';
import { Event } from '../components/event';
import { handle } from './handle';
import { subscribe } from './subscribe';

/**
 * Annotates method parameter as a handler for routed `Command` or `Event` type(or other) - type that is
 * used as first method paramter.
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
 * @define('MyCommand')
 * class MyCommand extends Command {
 *  key: string;
 * }
 *
 * class MyClass extends OneToOneHandlingMixin {
 *  MyCommand(@route command: MyCommand) {
 *    return true;
 *  }
 * }
 * const instance = new MyClass();
 * expect(instance.resolveRoutedCommands()).to.be.eql([MyCommand]);
 *```
 * @example
 *```ts
 * @define('MyEvent')
 * class MyEvent extends Event {
 *  key: string;
 * }
 *
 * class MyClass extends OneToOneHandlingMixin {
 *  MyEvent(@route command: MyEvent) {
 *    return true;
 *  }
 * }
 * const instance = new MyClass();
 * expect(instance.resolveRoutedEvents()).to.be.eql([MyEvent]);
 *```
 */
export function route(
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

  const containerKey =
    message.prototype instanceof Command
      ? ROUTED_COMMANDS_CONTAINER_KEY
      : ROUTED_EVENTS_CONTAINER_KEY;

  const hasRoutedMessage = Reflect.getMetadata(
    containerKey,
    target.constructor.prototype
  );

  if (!hasRoutedMessage) {
    Reflect.defineMetadata(containerKey, [], target.constructor.prototype);
  }
  const routedMessage = Reflect.getMetadata(
    containerKey,
    target.constructor.prototype
  );
  routedMessage.push(message);

  if (message.prototype instanceof Command) {
    handle(target, methodName, index);
  } else {
    subscribe(target, methodName, index);
  }
}

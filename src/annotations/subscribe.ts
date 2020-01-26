import { instanceOf } from 'typend';
import { getTypeName } from '@eveble/helpers';
import {
  InvalidControllerError,
  UnhandleableTypeError,
} from '../messaging/messaging-errors';
import { types } from '../types';
import 'reflect-metadata';
import { kernel } from '../core/kernel';
import { Event } from '../components/event';
import {
  SUBSCRIBER_KEY,
  SUBSCRIBING_HANDLERS_CONTAINER_KEY,
} from '../constants/metadata-keys';

/**
 * Annotates method as a handler for type(`Event` or other)- type that is used as first method paramter(i.e. for example below `MyEvent`).
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
 * @define('MyEvent')
 * class MyEvent extends Event {
 *  key: string;
 * }
 *
 * class MyClass extends OneToOneHandlingMixin {
 *  @subscribe()
 *  MyEventHandlingMethod(command: MyEvent) {
 *    return true;
 *  }
 * }
 * const instance = new MyClass();
 * expect(instance.getHandlers()).to.be.eql(
 * new Map([['MyEvent', instance.MyEventHandlingMethod]])
 * );
 *```
 */
export function subscribe(): any {
  return function(target: any, key: string) {
    if (!instanceOf<types.Controller>(target)) {
      throw new InvalidControllerError(
        getTypeName(target.constructor) as types.TypeName
      );
    }

    const params = Reflect.getMetadata('design:paramtypes', target, key);
    const type = params[0];

    if (!(type?.prototype instanceof Event)) {
      throw new UnhandleableTypeError(
        getTypeName(target.constructor) as types.TypeName,
        kernel.describer.describe([Event]),
        kernel.describer.describe(type)
      );
    }

    const typeName = getTypeName(target.constructor);
    // Ensure that container is only assigned per class and there is no
    // reference leakage.
    const isSubscribing: boolean =
      Reflect.getMetadata(SUBSCRIBER_KEY, target.constructor) === typeName;
    if (!isSubscribing) {
      Reflect.defineMetadata(
        SUBSCRIBING_HANDLERS_CONTAINER_KEY,
        new Map(),
        target.constructor.prototype
      );
      // Flag that target is versionable for further reference
      Reflect.defineMetadata(SUBSCRIBER_KEY, typeName, target.constructor);
    }

    const handlers = Reflect.getOwnMetadata(
      SUBSCRIBING_HANDLERS_CONTAINER_KEY,
      target.constructor.prototype
    );
    handlers.set(type, target[key]);
  };
}

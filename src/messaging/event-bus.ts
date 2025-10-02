import { classes } from 'polytype';
import { injectable } from 'inversify';
import { types } from '../types';
import { Event } from '../components/event';
import { OneToManyHandlingMixin } from '../mixins/one-to-many-handling-mixin';
import { HookableTrait } from '../trait/hookable.trait';

@injectable()
export class EventBus
  extends classes(HookableTrait, OneToManyHandlingMixin)
  implements types.EventBus
{
  /**
   * Creates an instance of CommandBus.
   */
  constructor() {
    super();
    this.setHandleableTypes([Event]);
  }

  /**
   * Registers handler for event.
   * @param eventType - A subclass of `Event` type.
   * @param handler - Handler function that will executed upon handling type.
   * @param shouldOverride - Flag indicating that handler should be overridden if exist.
   * @throws {UnhandleableTypeError}
   * Thrown if the type argument is not subclass of `Event` type.
   * @throws {InvalidHandlerError}
   * Thrown if the handler argument is not a function.
   */
  registerHandler(
    eventType: types.MessageType<types.Event>,
    handler: types.Handler,
    shouldOverride = false
  ): void {
    super.registerHandler(eventType, handler, shouldOverride);
  }

  /**
   * Subscribes to event with handler.
   * @alias registerHandler
   */
  subscribeTo(
    eventType: types.MessageType<types.Event>,
    handler: types.Handler
  ): void {
    this.registerHandler(eventType, handler);
  }

  /**
   * Registers `onPublish` callback hook.
   * @param id - Identifier under which `onPublish` hook will be defined.
   * @param hook - Function that will be executed upon publishing `Event`.
   * @param shouldOverride - Flag indicating that hook should be overridden if exist.
   */
  onPublish(id: string, hook: types.Hook, shouldOverride = false): void {
    this.registerHook('onPublish', id, hook, shouldOverride);
  }

  /**
   * Handles event instance concurrently.
   * @async
   * @param event - An instance of `Event` type.
   */
  async handle(event: types.Event): Promise<void> {
    // onPublish hooks always must run even in case when handler is not registered(for BDD testing api on Eveble)
    const hooks = this.getHooks('onPublish');
    for (const [, hook] of Object.entries(hooks)) {
      await hook(event);
    }

    return super.handle(event, 'concurrent');
  }

  /**
   * @alias handle
   * @async
   */
  async publish(event: types.Event): Promise<void> {
    const result = await this.handle(event);
    return result;
  }
}

/*
Fix for Inversify getClassPropsAsTargets function that can't resolve parent class constructor
from mixed prototype.
*/
Object.getPrototypeOf(EventBus.prototype).constructor = Object;

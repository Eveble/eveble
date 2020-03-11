import { classes } from 'polytype';
import { injectable } from '@parisholley/inversify-async';
import { types } from '../types';
import { Event } from '../components/event';
import { OneToManyHandlingMixin } from '../mixins/one-to-many-handling-mixin';
import { HookableMixin } from '../mixins/hookable-mixin';

@injectable()
export class EventBus extends classes(HookableMixin, OneToManyHandlingMixin)
  implements types.EventBus {
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
    eventType: types.MessageableType,
    handler: types.Handler,
    shouldOverride = false
  ): void {
    super.registerHandler(eventType, handler, shouldOverride);
  }

  /**
   * Subscribes to event with handler.
   * @alias registerHandler
   */
  subscribeTo(eventType: types.MessageableType, handler: types.Handler): void {
    this.registerHandler(eventType, handler);
  }

  /**
   * Registers `onPublish` callback hook.
   * @param id - Identifier under which `onPublish` hook will be defined.
   * @param hook - Function that will be executed upon publishing `Event`.
   */
  onPublish(id: string, hook: types.Hook): void {
    this.registerHook('onPublish', id, hook);
  }

  /**
   * Handles event instance concurrently.
   * @async
   * @param eventInstance - An instance of `Event` type.
   */
  async handle(eventInstance: Event): Promise<void> {
    // onPublish hooks always must run even in case when handler is not registered(for BDD testing api on Eveble)
    const hooks = this.getHooks('onPublish');
    for (const [, hook] of Object.entries(hooks)) {
      await hook(eventInstance);
    }

    return super.handle(eventInstance, 'concurrent');
  }

  /**
   * @alias handle
   * @async
   */
  async publish(eventInstance: Event): Promise<void> {
    const result = await this.handle(eventInstance);
    return result;
  }
}

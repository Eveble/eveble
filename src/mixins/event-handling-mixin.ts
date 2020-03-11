import {
  postConstruct,
  inject,
  injectable,
} from '@parisholley/inversify-async';
import { OneToManyHandlingMixin } from './one-to-many-handling-mixin';
import { BINDINGS } from '../constants/bindings';
import { types } from '../types';
import { Event } from '../components/event';

@injectable()
export class EventHandlingMixin extends OneToManyHandlingMixin
  implements types.Publisher {
  @inject(BINDINGS.EventBus)
  public eventBus: types.Publisher;

  /**
   * Initializes EventHandlingMixin.
   * @remarks
   * By defining handler mappings on metadata with annotations: `@subscribe`
   * and resolving those mapping with `subscribes` method - it ensures, that there
   * is no leakage in between inheriting classes.
   */
  @postConstruct()
  public initialize(): void {
    this.setupHandlers({
      handlers: this.subscribes(),
      registrator: this.registerEventHandler.bind(this),
      handleableTypes: [Event],
    });
  }

  /**
   * Registers event handler and subscribes to that event on event bus.
   * @param eventType - A `Event` type for which handler mapping will be created.
   * @param handler - Handler function that will executed upon handling type.
   * @param shouldOverride - Flag indicating that handler should be overridden if  exist.
   * @throws {UnhandleableTypeError}
   * Thrown if the type argument is not one of handleable types.
   * @throws {InvalidHandlerError}
   * Thrown if the handler argument is not a function.
   */
  public registerEventHandler(
    eventType: types.MessageableType,
    handler: types.Handler,
    shouldOverride = false
  ): void {
    this.ensureHandleability(eventType, [Event]);

    const boundHandler = handler.bind(this);
    boundHandler.original = handler;
    this.eventBus.subscribeTo(eventType, boundHandler, shouldOverride);
    this.registerHandler(eventType, boundHandler, shouldOverride);
  }

  /**
   * Subscribes to event(registers handler).
   * @alias registerEventHandler
   */
  public subscribeTo(
    event: any,
    handler: types.Handler,
    shouldOverride?: boolean
  ): void {
    this.registerEventHandler(event, handler, shouldOverride);
  }

  /**
   * @alias getHandledEvents
   */
  public getSubscribedEvents(): any[] {
    return this.getHandledEvents();
  }

  /**
   * @alias handle
   * @async
   */
  public async on(eventInstance: Event): Promise<void> {
    await this.handle(eventInstance);
  }

  /**
   * Publishes(handles) event instance on event bus.
   * @async
   * @param {Event} eventInstance
   */
  public async publish(eventInstance: Event): Promise<void> {
    await this.eventBus.publish(eventInstance);
  }
}

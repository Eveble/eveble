import { postConstruct, inject } from 'inversify';
import { trait } from '@traits-ts/core';
import { OneToManyHandlingTrait } from './one-to-many-handling.trait';
import { BINDINGS } from '../constants/bindings';
import { types } from '../types';
import { Event } from '../components/event';

export const EventHandlingTrait = trait([OneToManyHandlingTrait], (base) => {
  const klass = class extends base implements types.Publisher {
    public eventBus: types.EventBus;

    /**
     * Initializes EventHandlingTrait.
     * @remarks
     * By defining handler mappings on metadata with annotations: `@subscribe`
     * and resolving those mapping with `subscribes` method - it ensures, that there
     * is no leakage in between inheriting classes.
     */
    public initialize(): void {
      this.setupEventHandlers();
    }

    /**
     * Setup event handlers.
     */
    protected setupEventHandlers(): void {
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
      eventType: types.MessageType<types.Event>,
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
      eventType: types.MessageType<types.Event>,
      handler: types.Handler,
      shouldOverride?: boolean
    ): void {
      this.registerEventHandler(eventType, handler, shouldOverride);
    }

    /**
     * @alias getHandledEvents
     */
    public getSubscribedEvents(): types.MessageType<types.Event>[] {
      return this.getHandledEvents();
    }

    /**
     * @alias handle
     * @async
     * @param event - Instance implementing `Event` interface.
     */
    public async on(event: types.Event): Promise<void> {
      await this.handle(event);
    }

    /**
     * Publishes(handles) event instance on event bus.
     * @async
     * @param event - Instance implementing `Event` interface.
     */
    public async publish(event: types.Event): Promise<void> {
      await this.eventBus.publish(event);
    }
  };
  const descriptor = Object.getOwnPropertyDescriptor(
    trait.prototype,
    'initialize'
  );
  // Manually apply @inject decorator for eventBus property
  inject(BINDINGS.EventBus)(klass.prototype, 'eventBus');

  // Call postConstruct decorator factory, then apply it with all three arguments
  postConstruct()(klass.prototype, 'initialize', descriptor as any);
  return klass;
});

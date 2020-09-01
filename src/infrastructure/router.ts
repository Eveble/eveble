import { postConstruct, inject } from '@parisholley/inversify-async';
import { kernel } from '@eveble/core';
import { types } from '../types';
import {
  CommitConcurrencyError,
  MissingEventSourceableError,
  MissingInitializingMessageError,
  CannotRouteMessageError,
  UnresolvableIdentifierFromMessageError,
  InitializingIdentifierAlreadyExistsError,
} from './infrastructure-errors';
import { BINDINGS } from '../constants/bindings';
import { Log } from '../components/log-entry';
import { Command } from '../components/command';
import { Event } from '../components/event';
import { InvalidInitializingMessageError } from '../domain/domain-errors';
import { Guid } from '../domain/value-objects/guid';
import { DomainError } from '../domain/domain-error';
import { DomainException } from '../domain/domain-exception';

export class Router implements types.Router {
  @inject(BINDINGS.Injector)
  public injector: types.Injector;

  @inject(BINDINGS.log)
  protected log: types.Logger;

  @inject(BINDINGS.CommandBus)
  protected commandBus: types.CommandBus;

  @inject(BINDINGS.EventBus)
  protected eventBus: types.EventBus;

  @inject(BINDINGS.EventSourceableRepository)
  protected repository: types.EventSourceableRepository;

  public EventSourceableType: types.EventSourceableType;

  public InitializingMessageType: types.MessageType<
    types.Command | types.Event
  >;

  public routedCommands: types.MessageType<types.Command>[];

  public routedEvents: types.MessageType<types.Event>[];

  /**
   * Creates an instance of Router.
   * @param EventSourceableType - `EventSourceable` type(constructor) for routing.
   * @param InitializingMessageType - Initializing message of event sourceable.
   * @param routedCommands - Optional routed commands.
   * @param routedEvents - Optional routed events.
   */
  constructor(
    EventSourceableType?: types.EventSourceableType,
    InitializingMessageType?: types.MessageType<types.Command | types.Event>,
    routedCommands?: types.MessageType<types.Command>[],
    routedEvents?: types.MessageType<types.Event>[]
  ) {
    if (EventSourceableType) this.EventSourceableType = EventSourceableType;
    if (InitializingMessageType)
      this.InitializingMessageType = InitializingMessageType;
    this.routedCommands = routedCommands || [];
    this.routedEvents = routedEvents || [];
  }

  /**
   * Initializes Router.
   * @throws {MissingEventSourceableError}
   * Thrown if events sourceable is not set on router.
   * @throws {MissingInitializingMessageError}
   * Thrown if initializing message is not set on router and can't be resolved from
   * event sourceable.
   */
  @postConstruct()
  public initialize(): void {
    if (this.EventSourceableType === undefined) {
      throw new MissingEventSourceableError(this.constructor.name);
    }

    this.InitializingMessageType = this.resolveInitializingMessage();
    if (this.InitializingMessageType === undefined) {
      throw new MissingInitializingMessageError(this.constructor.name);
    }

    this.log.debug(
      new Log(
        `defined initializing message '${this.InitializingMessageType.getTypeName()}'`
      )
        .on(this)
        .in(this.initialize)
    );

    if (this.routedCommands.length === 0)
      this.routedCommands = this.resolveRoutedCommands();

    this.log.debug(
      new Log(`defined routed commands`)
        .on(this)
        .in(this.initialize)
        .with('routed commands', this.routedCommands)
    );

    if (this.routedEvents.length === 0)
      this.routedEvents = this.resolveRoutedEvents();

    this.log.debug(
      new Log(`defined routed events`)
        .on(this)
        .in(this.initialize)
        .with('routed events', this.routedEvents)
    );

    this.setupInitializingMessageHandler(this.initializingMessageHandler);

    this.log.debug(
      new Log(
        `set up initializing message handler for '${this.InitializingMessageType.getTypeName()}'`
      )
        .on(this)
        .in(this.initialize)
    );

    for (const EventType of this.routedEvents) {
      this.setupEventHandler(EventType);
    }
    for (const CommandType of this.routedCommands) {
      this.setupCommandHandler(CommandType);
    }
  }

  /**
   * Registers initializing handler for initializing message with appropriate bus
   * for message type: `Command` -> `CommandBus`, `Event` -> `EventBus`.
   * @param handler - Initializing message handler function.
   * @throws {InvalidInitializingMessageError}
   * Thrown if provided initializing message is not instance of `Command` or `Event`
   */
  protected setupInitializingMessageHandler(
    handler: (message: types.Command | types.Event) => void
  ): void {
    const boundHandler = handler.bind(this);
    boundHandler.original = handler;

    const MessageType: types.MessageType<types.Command | types.Event> = this
      .InitializingMessageType;
    if (this.InitializingMessageType.prototype instanceof Event) {
      this.eventBus.subscribeTo(MessageType, boundHandler);
    } else if (this.InitializingMessageType.prototype instanceof Command) {
      this.commandBus.registerHandler(MessageType, boundHandler);
    } else {
      throw new InvalidInitializingMessageError(
        this.EventSourceableType.getTypeName(),
        kernel.describer.describe([Command, Event]),
        kernel.describer.describe(MessageType)
      );
    }
  }

  /**
   * Initializing message handler.
   * @async
   * @param message - Instance of `Command` or `Event`.
   * @throws {Error}
   * Thrown if non-DomainError or CommitConcurrencyError is thrown on event
   * sourceable message handler.
   */
  public async initializingMessageHandler(
    message: types.Command | types.Event
  ): Promise<void> {
    const eventSourceableId = this.getIdForEventSourceableFromMessage(
      message
    ) as string | Guid;

    // Does not apply for processes that initializes with Event
    if (eventSourceableId !== undefined) {
      const isInitializable = await this.isInitializable(eventSourceableId);
      if (isInitializable === false) {
        const error = new InitializingIdentifierAlreadyExistsError(
          this.EventSourceableType.getTypeName(),
          message.getId().toString()
        );
        this.log.error(
          new Log(
            `failed handling message '${message.getTypeName()}' do to error: ${error}`
          )
            .on(this)
            .in(this.initializingMessageHandler)
            .with('message', message)
        );
        throw error;
      }
    }

    this.log.debug(
      new Log(
        `creating '${this.EventSourceableType.getTypeName()}' with message '${message.getTypeName()}'`
      )
        .on(this)
        .in(this.initializingMessageHandler)
        .with('message', message)
    );

    const fn = async (): Promise<types.EventSourceable> => {
      // Since Injector can't inject dependencies before construction of EventSourceable,
      // passed message to EventSourceable's constructor will be used as source for
      // assigning only id.

      // EventSourceable(Aggregate, PRocess) contains 3 flows of construction.
      // Here the second flow is used for construction
      const instance = new this.EventSourceableType(message);
      // Inject dependencies into eventSourceable
      await this.injector.injectIntoAsync(instance);
      // Handle the initializing message properly on already initialized Event Sourceable with injected dependencies
      await instance.handle(message);
      // Manually validate state of event sourceable since on construction validation
      // is disabled on `EventSourceable` for performance reasons
      instance.validateProps(instance, instance.getPropTypes());

      return instance;
    };
    const handledEventSourceable = await this.handleOrThrowDomainError(
      fn,
      message
    );
    this.log.debug(
      new Log(
        `created '${this.EventSourceableType.getTypeName()}' with id '${handledEventSourceable
          .getId()
          .toString()}'`
      )
        .on(this)
        .in(this.initializingMessageHandler)
        .with('message', message)
    );

    if (handledEventSourceable !== undefined) {
      try {
        await this.saveEventSourceable(handledEventSourceable);
      } catch (error) {
        await this.handleSaveErrors(error, message, eventSourceableId);
      }
    }
  }

  /**
   * Evaluates whether identifier already exists.
   * @async
   * @param eventSourceableId - Identifier as string or `Guid` instance.
   * @returns Returns `true` if identifier is initializable(does not exists), else `false`.
   */
  async isInitializable(eventSourceableId: string | Guid): Promise<boolean> {
    return (await this.repository.hasBySourceId(eventSourceableId)) === false;
  }

  /**
   * Returns identifier for event sourceable from message.
   * @param  message - Instance of `Command` or `Event`
   * @returns Identifier as string or instance of `Guid`, else `undefined`.
   * @throws {UnresolvableIdentifierFromMessageError}
   * Thrown if initializing message has unresolvable identifier(is invalid as event without set
   * correlation metadata).
   */
  protected getIdForEventSourceableFromMessage(
    message: types.Command | types.Event
  ): string | Guid | undefined {
    if (message instanceof Command) {
      return message.getId();
    }

    const esTypeName = this.EventSourceableType.getTypeName();
    if (message instanceof Event) {
      if (message.hasCorrelationId(esTypeName)) {
        //  Only route events if the correlation id exists
        return message.getCorrelationId(esTypeName) as string;
      }
      return undefined;
    }
    throw new UnresolvableIdentifierFromMessageError(
      this.constructor.name,
      this.EventSourceableType.getTypeName(),
      message.getTypeName()
    );
  }

  /**
   * Handles message or handles thrown error by publishing `DomainException`.
   * @async
   * @param fn - Function that handles initializing event sourceable.
   * @param  message - Message that can't be handled by the handler.
   * @throws {DomainException}
   * Thrown upon `DomainError` as property of `DomainException` with additional
   * property 'thrower'.
   * @throws {Error}
   * Thrown if catched error is not an instance of `DomainError`.
   */
  protected async handleOrThrowDomainError(
    fn: () => Promise<types.EventSourceable>,
    message: types.Command | types.Event
  ): Promise<types.EventSourceable> {
    try {
      return await fn.call(this);
    } catch (error) {
      this.log.error(
        new Log(
          `failed handling '${message.getTypeName()}' do to error: ${error}`
        )
          .on(this)
          .in(this.handleOrThrowDomainError)
          .with('message', message)
      );

      if (error instanceof DomainError) {
        const props = {
          sourceId: message.getId() as string | Guid,
          thrower: this.EventSourceableType.getTypeName(),
          error,
          metadata: {},
        };
        if (message.hasMetadata()) {
          props.metadata = { ...message.getMetadata() };
        }
        const exception = new DomainException(props);
        await this.eventBus.publish(exception);
      }
      throw error;
    }
  }

  /**
   * Default message handler.
   * @async
   * @param message - Instance of `Command` or `Event`.
   * @throws {Error} Will throw an error if error is thrown on event sourceable message handler and is not a DomainError or
   * CommitConcurrencyError error type.
   */
  public async messageHandler(
    message: types.Command | types.Event
  ): Promise<void> {
    const eventSourceableId = this.getIdForEventSourceableFromMessage(message);
    if (eventSourceableId === undefined) {
      return;
    }

    this.log.debug(
      new Log(
        `handling message '${message.getTypeName()}' for '${
          this.EventSourceableType.name
        }@${eventSourceableId}'`
      )
        .on(this)
        .in(this.messageHandler)
        .with('message', message)
    );

    // Dependencies are injected into Event Sourceable on repository level so initialization(@postConstruct) can be done while using 3d party dependencies
    const foundEventSourceable = await this.repository.find(
      this.EventSourceableType,
      eventSourceableId
    );
    if (foundEventSourceable === undefined) {
      this.log.error(
        new Log(
          `not found '${this.EventSourceableType.name}' with id '${eventSourceableId}'`
        )
          .on(this)
          .in(this.messageHandler)
      );

      throw new CannotRouteMessageError(
        this.constructor.name,
        message.getTypeName()
      );
    }

    const fn = async (): Promise<types.EventSourceable> => {
      const handledEventSourceable = await foundEventSourceable.handle(message);
      // Manually validate event sourceable state
      handledEventSourceable.validateProps(
        handledEventSourceable,
        handledEventSourceable.getPropTypes()
      );
      return handledEventSourceable;
    };

    const handledEventSourceable = await this.handleOrThrowDomainError(
      fn,
      message
    );
    this.log.debug(
      new Log(
        `handled message '${message.getTypeName()}' for '${
          this.EventSourceableType.name
        }@${eventSourceableId}'`
      )
        .on(this)
        .in(this.messageHandler)
        .with('message', message)
    );

    if (handledEventSourceable !== undefined) {
      try {
        await this.saveEventSourceable(handledEventSourceable);
      } catch (error) {
        await this.handleSaveErrors(error, message, eventSourceableId);
      }
    }
  }

  /**
   * Saves `EventSourceable` with changed state.
   * @async
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   */
  protected async saveEventSourceable(
    eventSourceable: types.EventSourceable
  ): Promise<void> {
    await this.repository.save(eventSourceable);
  }

  /**
   * Resolves initializing message by allowing to define initializing message on Router construction or on EventSourceable itself
   * @returns Instance of `Command` or `Event`
   */
  protected resolveInitializingMessage(): types.MessageType<
    types.Command | types.Event
  > {
    return (
      this.InitializingMessageType ||
      this.EventSourceableType.resolveInitializingMessage()
    );
  }

  /**
   * Resolves routed commands array.
   * @returns List of routed `Command` instances.
   */
  protected resolveRoutedCommands(): types.MessageType<types.Command>[] {
    return this.EventSourceableType.resolveRoutedCommands();
  }

  /**
   * Resolves routed events array.
   * @returns List of routed `Event` instances.
   */
  protected resolveRoutedEvents(): types.MessageType<types.Event>[] {
    return this.EventSourceableType.resolveRoutedEvents();
  }

  /**
   * Registers default message handler for routed command on command bus.
   * @param CommandType - `Command` type constructor.
   */
  public setupCommandHandler(
    CommandType: types.MessageType<types.Command>
  ): void {
    const boundHandler = this.messageHandler.bind(this);
    boundHandler.original = this.messageHandler;

    this.commandBus.registerHandler(CommandType, boundHandler);
  }

  /**
   * Registers default message handler for routed event on event bus.
   * @param EventType - `Event` type constructor.
   */
  public setupEventHandler(EventType: types.MessageType<types.Event>): void {
    const boundHandler = this.messageHandler.bind(this);
    boundHandler.original = this.messageHandler;

    this.eventBus.subscribeTo(EventType, boundHandler);
  }

  /**
   * Handles errors related to persisting event sourceable.
   * @async
   * @param error - Instance of `Error` not related to domain.
   * @param message - Instance of `Command` or `Event`.
   * @param  eventSourceableId - Event sourceable identifier as string or instance of `Guid`
   * @throws {Error}
   * Thrown if the error is not a instance of `CommitConcurrencyError`.
   */
  async handleSaveErrors(
    error: Error,
    message: types.Command | types.Event,
    eventSourceableId: string | Guid
  ): Promise<void> {
    if (error instanceof CommitConcurrencyError) {
      this.log.warning(
        new Log(
          `concurrency exception, re-handling message '${message.getTypeName()}' for '${this.EventSourceableType.getTypeName()}@${eventSourceableId}'`
        )
          .on(this)
          .in(this.handleSaveErrors)
          .with('message', message)
      );

      /*
      Concurrency exceptions can often be resolved by simply re-handling the message.
      This should be safe from endless loops, because if the aggregate's state has since  changed, and the message is rejected: a DomainError will be thrown, which is an application concern.
      */
      return this.messageHandler(message);
    }
    this.log.error(
      new Log(
        `failed saving '${this.EventSourceableType.getTypeName()}@${eventSourceableId}' with '${message.getTypeName()}' do to error: ${error}`
      )
        .on(this)
        .in(this.handleSaveErrors)
        .with('message', message)
    );
    throw error;
  }
}

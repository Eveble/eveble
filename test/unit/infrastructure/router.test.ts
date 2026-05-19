import { mock } from 'vitest-mock-extended';
import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
} from 'vitest';

import { PropTypes, ValidationError } from 'typend';
import { Type } from '@eveble/core';
import { InvalidInitializingMessageError } from '../../../src/domain/domain-errors';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { types } from '../../../src/types';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { Router } from '../../../src/infrastructure/router';
import {
  MissingEventSourceableError,
  MissingInitializingMessageError,
  UnresolvableIdentifierFromMessageError,
  CannotRouteMessageError,
  CommitConcurrencyError,
  InitializingIdentifierAlreadyExistsError,
} from '../../../src/infrastructure/infrastructure-errors';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import { Log } from '../../../src/components/log-entry';
import { Message } from '../../../src/components/message';
import { COMMANDS_KEY, EVENTS_KEY } from '../../../src/constants/literal-keys';
import { Guid } from '../../../src/domain/value-objects/guid';
import { DomainError } from '../../../src/domain/domain-error';
import { DomainException } from '../../../src/domain/domain-exception';
import { SerializableError } from '../../../src/components/serializable-error';

describe(`Router`, () => {
  let now: any;
  let clock: any;
  let injector: Injector;
  let log: any;
  let commandBus: any;
  let eventBus: any;
  let repository: any;

  beforeAll(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = vi.useFakeTimers({ now });

    injector = new Injector();
    log = mock<types.Logger>();
    commandBus = mock<types.CommandBus>();
    eventBus = mock<types.EventBus>();
    repository = mock<types.EventSourceableRepository>();

    repository.hasBySourceId.mockReturnValue(false);

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    injector
      .bind<types.EventSourceableRepository>(BINDINGS.EventSourceableRepository)
      .toConstantValue(repository);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  @Type('InvalidMessage', { isRegistrable: false })
  class InvalidMessage extends Message {}

  @Type('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    name: string;
  }
  @Type('MyOtherCommand', { isRegistrable: false })
  class MyOtherCommand extends Command<MyOtherCommand> {
    name: string;
  }

  @Type('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    name: string;
  }

  @Type('MyOtherEvent', { isRegistrable: false })
  class MyOtherEvent extends Event<MyOtherEvent> {
    name: string;
  }

  @Type('MyCorrelatingEvent', { isRegistrable: false })
  class MyCorrelatingEvent extends Event<MyCorrelatingEvent> {
    name: string;
  }

  describe(`construction`, () => {
    @Type('MyEventSourceable', { isRegistrable: false })
    class MyEventSourceable extends EventSourceable {}

    it(`throws MissingEventSourceableError if event sourceable is not set`, () => {
      const router = new Router(undefined as any, undefined as any);
      expect(() => router.initialize()).toThrow(
        MissingEventSourceableError,
        'Router: please specify property Router.prototype.EventSourceableType as EventSourceable class to be managed by the router'
      );
    });

    it(`throws MissingInitializingMessageError if initializing message is not set`, () => {
      const router = new Router(MyEventSourceable, undefined as any);
      expect(() => router.initialize()).toThrow(
        MissingInitializingMessageError,
        `Router: please specify property Router.prototype.InitializingMessageType(as command or event class) that will be used to create new instances of the managed EventSourceable`
      );
    });

    it('takes EventSourceableType as EventSourceable type constructor for construction and assigns it', () => {
      const router = new Router(MyEventSourceable, undefined as any);
      expect(router.EventSourceableType).toBe(MyEventSourceable);
    });

    it('takes InitializingMessage as Message type constructor for construction and assigns it', () => {
      const router = new Router(MyEventSourceable, MyCommand);
      expect(router.InitializingMessageType).toBe(MyCommand);
    });

    it('takes routed commands as list of Commands for construction and assigns it', () => {
      const routedCommands = [MyCommand, MyOtherCommand];
      const router = new Router(MyEventSourceable, MyCommand, routedCommands);
      expect(router.routedCommands).toBe(routedCommands);
    });

    it('takes routed events as list of Commands for construction and assigns it', () => {
      const routedEvents = [MyEvent, MyOtherEvent];
      const router = new Router(MyEventSourceable, MyEvent, [], routedEvents);
      expect(router.routedEvents).toBe(routedEvents);
    });

    it(`initializes with empty routed commands as array if they are not provided on construction`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyCommand;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(router.routedCommands).toBeInstanceOf(Array);
      expect(router.routedCommands).toHaveLength(0);
    });

    it(`initializes with empty routed events as array if they are not set as class property`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyCommand;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(router.routedEvents).toBeInstanceOf(Array);
      expect(router.routedEvents).toHaveLength(0);
    });
  });

  describe(`initializing message handler`, () => {
    class MyEventSourceable extends EventSourceable {}

    it(`throws UnresolvableIdentifierFromMessageError if provided message to initializing handler is invalid `, async () => {
      @Type('MyMessage', { isRegistrable: false })
      class MyMessage extends Message {
        key: string;
      }
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyEvent;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      await expect(
        router.initializingMessageHandler(
          new MyMessage({ key: 'my-value' }) as any
        )
      ).rejects.toThrow(
        UnresolvableIdentifierFromMessageError,
        `MyRouter: message 'MyEventSourceable' is not a valid initializing or handleable message for 'MyMessage'`
      );

      expect(repository.find).not.toHaveBeenCalled();
    });

    it(`logs defining initializing message`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyEvent;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(log.debug).toHaveBeenCalledWith(
        expect.objectContaining(
          new Log(`defined initializing message 'MyEvent'`)
            .on(router)
            .in(router.initialize)
        )
      );
    });

    it(`registers initializing handler on command bus for initializing command`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyCommand;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(commandBus.registerHandler).toHaveBeenCalledTimes(1);
      expect(commandBus.registerHandler.mock.calls[0][0]).toBe(MyCommand);
      expect(commandBus.registerHandler.mock.calls[0][1].original).toBe(
        router.initializingMessageHandler
      ); // Compare bound function
      expect(eventBus.subscribeTo).not.toHaveBeenCalled();
    });

    it(`registers initializing handler on event bus for initializing event`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyEvent;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(eventBus.subscribeTo).toHaveBeenCalledTimes(1);
      expect(eventBus.subscribeTo.mock.calls[0][0]).toBe(MyEvent);
      expect(eventBus.subscribeTo.mock.calls[0][1].original).toBe(
        router.initializingMessageHandler
      ); // Compare bound function
      expect(commandBus.registerHandler).not.toHaveBeenCalled();
    });

    it(`logs after setup of initializing message handler`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyEvent;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(log.debug).toHaveBeenCalledWith(
        expect.objectContaining(
          new Log(`set up initializing message handler for 'MyEvent'`)
            .on(router)
            .in(router.initialize)
        )
      );
    });

    it('throws InvalidInitializingMessageError if provided message is not a supported type', async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = InvalidMessage as any;
      }

      const router = new MyRouter();
      await expect(injector.injectIntoAsync(router)).rejects.toThrow(
        InvalidInitializingMessageError,
        `MyEventSourceable: the given initializing message is not one of allowed types. Expected [Command, Event], got InvalidMessage`
      );
    });
  });

  describe(`routes messages`, () => {
    class MyEventSourceable extends EventSourceable {}

    it(`registers routed commands with command bus`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyEvent;

        routedCommands = [MyCommand];
      }
      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(commandBus.registerHandler).toHaveBeenCalledTimes(1);
      expect(commandBus.registerHandler.mock.calls[0][0]).toBe(MyCommand);
      expect(commandBus.registerHandler.mock.calls[0][1].original).toBe(
        router.messageHandler
      ); // Compare bound function
    });

    it(`logs defining routed commands`, async () => {
      const routedCommands = [MyCommand];
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyEvent;

        routedCommands = routedCommands;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(log.debug).toHaveBeenCalledWith(
        expect.objectContaining(
          new Log(`defined routed commands`)
            .on(router)
            .in(router.initialize)
            .with('routed commands', routedCommands)
        )
      );
    });

    it(`registers routed events with with event bus`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyCommand;

        routedEvents = [MyEvent];
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(eventBus.subscribeTo).toHaveBeenCalledTimes(1);
      expect(eventBus.subscribeTo.mock.calls[0][0]).toBe(MyEvent);
      expect(eventBus.subscribeTo.mock.calls[0][1].original).toBe(
        router.messageHandler
      ); // Compare bound function
    });

    it(`logs defining routed events`, async () => {
      const routedEvents = [MyEvent];
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyEvent;

        routedEvents = routedEvents;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(log.debug).toHaveBeenCalledWith(
        expect.objectContaining(
          new Log(`defined routed events`)
            .on(router)
            .in(router.initialize)
            .with('routed events', routedEvents)
        )
      );
    });
  });

  describe(`message handlers`, () => {
    @Type('MyEventSourceable', { isRegistrable: false })
    class MyEventSourceable extends EventSourceable {
      name: string;

      protected processProps(props: types.Props = {}): types.Props {
        return super.processProps(this.pickProps(props));
      }
    }

    class MyRouter extends Router {
      EventSourceableType = MyEventSourceable;

      InitializingMessageType = MyCommand;
    }

    let router: Router;
    let commands: Record<string, Command<{}>> = {};
    let events: Record<string, Event<{}>> = {};
    const props: Record<string, any> = {};
    let eventSourceable: EventSourceable;

    beforeEach(async () => {
      router = new MyRouter();
      await injector.injectIntoAsync(router);

      // Data
      props.id = 'my-event-sourceable-id';
      eventSourceable = new MyEventSourceable({
        id: props.id,
      });

      // Messages
      commands = {
        MyCommand: new MyCommand({
          targetId: props.id,
          name: 'foo',
          timestamp: now,
        }),
      };
      events = {
        MyEvent: new MyEvent({
          sourceId: props.id,
          name: 'foo',
          timestamp: now,
        }),
        CorrelationEvent: new MyCorrelatingEvent({
          sourceId: props.id,
          name: 'foo',
          timestamp: now,
        }),
      };
      events.CorrelationEvent.setCorrelationId(
        'MyEventSourceable',
        'my-correlation-id'
      );
    });

    describe(`initializing message handler`, () => {
      let handler: any;
      beforeEach(() => {
        // Setup
        handler = vi.fn();
        MyEventSourceable.prototype.handle = function (
          message: types.Command | types.Event
        ): Promise<any> {
          handler(message);
          // Simplify handling message instead of going for full blown Command->Event recording
          this.id = message.getId();
          this.name = (message as any).name;
          return this;
        };
      });

      it(`throws InitializingIdentifierAlreadyExistsError for initializing Command if provided identifier is already in use`, async () => {
        repository.hasBySourceId.mockReturnValue(true);

        await expect(
          router.initializingMessageHandler(commands.MyCommand)
        ).rejects.toThrow(
          InitializingIdentifierAlreadyExistsError,
          `MyEventSourceable: provided identifier my-event-sourceable-id is already in use`
        );

        expect(handler).not.toHaveBeenCalled();
      });

      it(`ensures that InitializingIdentifierAlreadyExistsError is not thrown upon initializing Event`, async () => {
        repository.hasBySourceId.mockReturnValue(true);

        await router.initializingMessageHandler(events.MyEvent);
      });

      it(`logs thrown InitializingIdentifierAlreadyExistsError`, async () => {
        repository.hasBySourceId.mockReturnValue(true);

        await expect(
          router.initializingMessageHandler(commands.MyCommand)
        ).rejects.toThrow(InitializingIdentifierAlreadyExistsError);

        expect(log.error).toHaveBeenCalledTimes(1);
        expect(log.error).toHaveBeenCalledWith(
          new Log(
            `failed handling message 'MyCommand' do to error: InitializingIdentifierAlreadyExistsError: MyEventSourceable: provided identifier my-event-sourceable-id is already in use`
          )
            .on(router)
            .in('initializingMessageHandler')
            .with('message', commands.MyCommand)
        );
      });

      it(`logs handled message for debugging`, async () => {
        await router.initializingMessageHandler(commands.MyCommand);

        expect(log.debug).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log(`creating 'MyEventSourceable' with message 'MyCommand'`)
              .on(router)
              .in(router.initializingMessageHandler)
              .with('message', commands.MyCommand)
          )
        );
        expect(log.debug).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log(`created 'MyEventSourceable' with id '${props.id}'`)
              .on(router)
              .in(router.initializingMessageHandler)
              .with('message', commands.MyCommand)
          )
        );
      });

      it(`injects dependencies in to new instance of event sourceable`, async () => {
        router.injector = mock<types.Injector>();
        await router.initializingMessageHandler(commands.MyCommand);
        expect(router.injector.injectIntoAsync).toHaveBeenCalledTimes(1);
      });

      it(`handles message as command`, async () => {
        await router.initializingMessageHandler(commands.MyCommand);

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(commands.MyCommand);
      });

      it(`handles message as event`, async () => {
        await router.initializingMessageHandler(events.CorrelationEvent);

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(events.CorrelationEvent);
      });

      it(`validates event sourceable after handling initializing message`, async () => {
        const original = MyEventSourceable.prototype.validateProps;
        MyEventSourceable.prototype.validateProps = vi.fn();

        await router.initializingMessageHandler(commands.MyCommand);
        expect(MyEventSourceable.prototype.validateProps).toHaveBeenCalledTimes(
          1
        );
        expect(
          MyEventSourceable.prototype.validateProps.mock.calls[0][0]
        ).toMatchObject({
          id: props.id,
          name: 'foo',
          version: 0,
        });
        expect(
          MyEventSourceable.prototype.validateProps.mock.calls[0][1]
        ).toMatchObject({
          id: PropTypes.oneOf([
            PropTypes.instanceOf(String),
            PropTypes.instanceOf(Guid),
          ]),
          state: PropTypes.oneOf([
            undefined,
            PropTypes.instanceOf(String),
            PropTypes.instanceOf(Number),
          ]),
          status: PropTypes.oneOf([
            undefined,
            PropTypes.instanceOf(String),
            PropTypes.instanceOf(Number),
          ]),
          version: PropTypes.instanceOf(Number),
          schemaVersion: PropTypes.instanceOf(Number).isOptional,
          metadata: PropTypes.object.isOptional,
          name: PropTypes.instanceOf(String),
        });
        MyEventSourceable.prototype.validateProps = original;
      });

      it(`throws ValidationError if event sourceable is in invalid state after handling initializing message`, async () => {
        // Since EventSourceable does not resolve id from message on construction like Aggregate and Process,
        // replacing the overridden handler from beforeEach hook will cause instance of MyEventSourceable to be in
        // invalid state with missing id.
        MyEventSourceable.prototype.handle = async function (
          _message
        ): Promise<EventSourceable> {
          return this;
        };

        const original = MyEventSourceable.prototype.validateProps;
        MyEventSourceable.prototype.validateProps = vi.fn(() => {
          throw new ValidationError(
            `MyEventSourceable: (Key 'id': Expected undefined to be one of: [[String], [Guid]] in MyEventSourceable({"version":0,"metadata":{},"name":"foo"}))`
          );
        });

        await expect(
          router.initializingMessageHandler(commands.MyCommand)
        ).rejects.toThrow(
          ValidationError,
          `MyEventSourceable: (Key 'id': Expected undefined to be one of: [[String], [Guid]] in MyEventSourceable({"version":0,"metadata":{},"name":"foo"}))`
        );

        expect(MyEventSourceable.prototype.validateProps).toHaveBeenCalledTimes(
          1
        );
        MyEventSourceable.prototype.validateProps = original;
      });

      it(`saves handled event sourceable to repository`, async () => {
        await router.initializingMessageHandler(commands.MyCommand);
        expect(repository.save).toHaveBeenCalledTimes(1);
        expect(repository.save.mock.calls[0][0]).toBeInstanceOf(
          MyEventSourceable
        );
        expect(repository.save.mock.calls[0][0]).toMatchObject({
          id: props.id,
          name: 'foo',
          metadata: {},
        });
      });

      describe(`handles errors`, () => {
        class MyDomainError extends DomainError {}

        it(`logs thrown error`, async () => {
          const error = new MyDomainError('my-error');
          handler.mockImplementation(() => {
            throw error;
          });
          await expect(
            router.initializingMessageHandler(commands.MyCommand)
          ).rejects.toThrow(error);

          expect(log.error).toHaveBeenCalledTimes(1);
          expect(log.error).toHaveBeenCalledWith(
            new Log(
              `failed handling 'MyCommand' do to error: MyDomainError: my-error`
            )
              .on(router)
              .in('handleOrThrowDomainError')
              .with('message', commands.MyCommand)
          );
        });

        it(`publishes DomainException as subclass of Event with DomainError through event bus`, async () => {
          const error = new MyDomainError('my-error');
          handler.mockImplementation(() => {
            throw error;
          });
          await expect(
            router.initializingMessageHandler(commands.MyCommand)
          ).rejects.toThrow(error);

          const publishedDomainException = new DomainException({
            sourceId: props.id,
            thrower: 'MyEventSourceable',
            error,
            timestamp: now,
          });
          expect(eventBus.publish).toHaveBeenCalledTimes(1);
          expect(eventBus.publish).toHaveBeenCalledWith(
            publishedDomainException
          );
        });

        it(`publishes DomainException with metadata copied from message through event bus`, async () => {
          const error = new MyDomainError('my-error');
          handler.mockImplementation(() => {
            throw error;
          });
          await expect(
            router.initializingMessageHandler(events.CorrelationEvent)
          ).rejects.toThrow(error);

          const publishedDomainException = new DomainException({
            sourceId: props.id,
            thrower: 'MyEventSourceable',
            error,
            timestamp: now,
            metadata: events.CorrelationEvent.metadata,
          });
          expect(eventBus.publish).toHaveBeenCalledTimes(1);
          expect(eventBus.publish).toHaveBeenCalledWith(
            publishedDomainException
          );
        });

        it(`re-throws error if its not an instance of MyDomainError`, async () => {
          class MySerializableError extends SerializableError {}
          const error = new MySerializableError('my-not-domain-error');
          handler.mockImplementation(() => {
            throw error;
          });

          await expect(
            router.initializingMessageHandler(commands.MyCommand)
          ).rejects.toThrow(error);
          expect(eventBus.publish).not.toHaveBeenCalled();
        });
      });
    });

    describe(`message handler`, () => {
      let handler: any;
      beforeEach(() => {
        handler = vi.fn();
        MyEventSourceable.prototype.handle = function (
          message: types.Command | types.Event
        ): Promise<any> {
          handler(message);
          this.id = message.getId();
          this.name = (message as any).name;
          return this;
        };
        repository.find.mockReturnValue(eventSourceable);
      });

      it(`throws UnresolvableIdentifierFromMessageError if provided message to handler is invalid `, async () => {
        @Type('MyMessage', { isRegistrable: false })
        class MyMessage extends Message {
          key: string;
        }

        await expect(
          router.messageHandler(new MyMessage({ key: 'my-value' }) as any)
        ).rejects.toThrow(
          UnresolvableIdentifierFromMessageError,
          `MyRouter: message 'MyEventSourceable' is not a valid initializing or handleable message for 'MyMessage'`
        );

        expect(repository.find).not.toHaveBeenCalled();
      });

      describe(`handles message`, () => {
        it(`as command`, async () => {
          await router.messageHandler(commands.MyCommand);
          expect(handler).toHaveBeenCalledTimes(1);
          expect(handler).toHaveBeenCalledWith(commands.MyCommand);
        });

        it(`as event with correlation id`, async () => {
          await router.messageHandler(events.CorrelationEvent);
          expect(handler).toHaveBeenCalledTimes(1);
          expect(handler).toHaveBeenCalledWith(events.CorrelationEvent);
        });

        it(`ignores handling event that does not contain event correlation id`, async () => {
          await router.messageHandler(events.MyEvent);
          expect(repository.find).not.toHaveBeenCalled();
        });

        it(`validates event sourceable after handling initializing message`, async () => {
          const original = MyEventSourceable.prototype.validateProps;
          MyEventSourceable.prototype.validateProps = vi.fn();

          await router.messageHandler(commands.MyCommand);
          expect(
            MyEventSourceable.prototype.validateProps
          ).toHaveBeenCalledTimes(1);
          expect(
            MyEventSourceable.prototype.validateProps.mock.calls[0][0]
          ).toMatchObject({
            id: props.id,
            name: 'foo',
            version: 0,
          });
          expect(
            MyEventSourceable.prototype.validateProps.mock.calls[0][1]
          ).toMatchObject({
            id: PropTypes.oneOf([
              PropTypes.instanceOf(String),
              PropTypes.instanceOf(Guid),
            ]),
            state: PropTypes.oneOf([
              undefined,
              PropTypes.instanceOf(String),
              PropTypes.instanceOf(Number),
            ]),
            status: PropTypes.oneOf([
              undefined,
              PropTypes.instanceOf(String),
              PropTypes.instanceOf(Number),
            ]),
            version: PropTypes.instanceOf(Number),
            schemaVersion: PropTypes.instanceOf(Number).isOptional,
            metadata: PropTypes.object.isOptional,
            name: PropTypes.instanceOf(String),
          });
          MyEventSourceable.prototype.validateProps = original;
        });

        it(`throws ValidationError if event sourceable is in invalid state after handling initializing message`, async () => {
          // Since EventSourceable does not resolve id from message on construction like Aggregate and Process,
          // replacing the overridden handler from beforeEach hook will cause instance of MyEventSourceable to be in
          // invalid state with missing id.
          eventSourceable.name = undefined;

          MyEventSourceable.prototype.handle = async function (
            _message
          ): Promise<EventSourceable> {
            return this;
          };

          const original = MyEventSourceable.prototype.validateProps;
          MyEventSourceable.prototype.validateProps = vi.fn(() => {
            throw new ValidationError(
              `MyEventSourceable: (Key 'name': Expected undefined to be a String in MyEventSourceable({"version":0,"id":"my-event-sourceable-id"}))`
            );
          });

          await expect(
            router.messageHandler(commands.MyCommand)
          ).rejects.toThrow(
            ValidationError,
            `MyEventSourceable: (Key 'name': Expected undefined to be a String in MyEventSourceable({"version":0,"id":"my-event-sourceable-id"}))`
          );

          expect(
            MyEventSourceable.prototype.validateProps
          ).toHaveBeenCalledTimes(1);
          MyEventSourceable.prototype.validateProps = original;
        });
      });

      describe(`logs handled message`, () => {
        it(`as command for debugging`, async () => {
          await router.messageHandler(commands.MyCommand);
          expect(log.debug).toHaveBeenCalledWith(
            new Log(
              `handling message 'MyCommand' for 'MyEventSourceable@my-event-sourceable-id'`
            )
              .on(router)
              .in(router.messageHandler)
              .with('message', commands.MyCommand)
          );
          expect(log.debug).toHaveBeenCalledWith(
            new Log(
              `handled message 'MyCommand' for 'MyEventSourceable@my-event-sourceable-id'`
            )
              .on(router)
              .in(router.messageHandler)
              .with('message', commands.MyCommand)
          );
        });

        it(`as event with correlation id for debugging`, async () => {
          await router.messageHandler(events.CorrelationEvent);
          expect(log.debug).toHaveBeenCalledWith(
            new Log(
              `handling message 'MyCorrelatingEvent' for 'MyEventSourceable@my-correlation-id'`
            )
              .on(router)
              .in(router.messageHandler)
              .with('message', events.CorrelationEvent)
          );
          expect(log.debug).toHaveBeenCalledWith(
            new Log(
              `handled message 'MyCorrelatingEvent' for 'MyEventSourceable@my-correlation-id'`
            )
              .on(router)
              .in(router.messageHandler)
              .with('message', events.CorrelationEvent)
          );
        });

        it(`ignores logging event that does not contain event correlation id`, async () => {
          await router.messageHandler(events.MyEvent);
          expect(log.debug).not.toHaveBeenCalledWith(
            new Log(
              `handled message 'MyEvent' for 'MyEventSourceable@my-correlation-id'`
            )
              .on(router)
              .in(router.messageHandler)
              .with('message', events.CorrelationEvent)
          );
        });
      });

      it(`logs error when event sourceable can't be found on repository`, async () => {
        repository.find.mockReturnValue(undefined);
        await expect(router.messageHandler(commands.MyCommand)).rejects.toThrow(
          CannotRouteMessageError,
          `MyRouter: no event sourceable found to handle 'MyCommand'`
        );
        expect(log.error).toHaveBeenCalledWith(
          new Log(`not found 'MyEventSourceable' with id '${props.id}'`)
            .on(router)
            .in(router.messageHandler)
        );
      });

      it(`throws CannotHandleMessageError when event sourceable can't be found on repository`, async () => {
        repository.find.mockReturnValue(undefined);
        await expect(router.messageHandler(commands.MyCommand)).rejects.toThrow(
          CannotRouteMessageError,
          `MyRouter: no event sourceable found to handle 'MyCommand'`
        );
      });

      it(`does not inject dependencies for event sourceable on message handling(leave it up to repository)`, async () => {
        repository.find.mockReturnValue(eventSourceable);
        injector.injectIntoAsync = vi.fn();
        await router.messageHandler(events.MyEvent);
        expect(injector.injectIntoAsync).not.toHaveBeenCalled();
      });

      describe(`handles errors`, () => {
        class MyDomainError extends DomainError {}

        it(`logs thrown error`, async () => {
          const error = new MyDomainError('my-error');
          handler.mockImplementation(() => {
            throw error;
          });
          await expect(
            router.messageHandler(commands.MyCommand)
          ).rejects.toThrow(error);
          expect(log.error).toHaveBeenCalledTimes(1);
          expect(log.error).toHaveBeenCalledWith(
            new Log(
              `failed handling 'MyCommand' do to error: MyDomainError: my-error`
            )
              .on(router)
              .in('handleOrThrowDomainError')
              .with('message', commands.MyCommand)
          );
        });

        it(`publishes DomainException as subclass of event with DomainError through event bus`, async () => {
          const error = new MyDomainError('my-error');
          handler.mockImplementation(() => {
            throw error;
          });
          await expect(
            router.messageHandler(commands.MyCommand)
          ).rejects.toThrow(error);

          const publishedDomainException = new DomainException({
            sourceId: props.id,
            thrower: 'MyEventSourceable',
            error,
            timestamp: now,
          });
          expect(eventBus.publish).toHaveBeenCalledTimes(1);
          expect(eventBus.publish).toHaveBeenCalledWith(
            publishedDomainException
          );
        });

        it(`publishes DomainException with metadata copied from message through event bus`, async () => {
          const error = new MyDomainError('my-error');
          handler.mockImplementation(() => {
            throw error;
          });
          await expect(
            router.messageHandler(events.CorrelationEvent)
          ).rejects.toThrow(error);

          const publishedDomainException = new DomainException({
            sourceId: props.id,
            thrower: 'MyEventSourceable',
            error,
            timestamp: now,
            metadata: events.CorrelationEvent.metadata,
          });
          expect(eventBus.publish).toHaveBeenCalledTimes(1);
          expect(eventBus.publish).toHaveBeenCalledWith(
            publishedDomainException
          );
        });

        it(`re-throws error if its not an instance of DomainError or CommitConcurrencyError`, async () => {
          class MySerializableError extends SerializableError {}
          const error = new MySerializableError('my-not-domain-error');
          handler.mockImplementation(() => {
            throw error;
          });

          await expect(
            router.messageHandler(commands.MyCommand)
          ).rejects.toThrow(error);
          expect(eventBus.publish).not.toHaveBeenCalled();
        });

        describe(`CommitConcurrencyError`, () => {
          it(`re-handles message again if there's a concurrency exception when saving to the repository`, async () => {
            repository.save.mockImplementationOnce(() => {
              throw new CommitConcurrencyError(
                'MyEventSourceable',
                'my-id',
                '2',
                '1'
              );
            });
            const messageHandler = vi.spyOn(router, 'messageHandler');
            await router.messageHandler(commands.MyCommand);
            expect(messageHandler).toHaveBeenCalledTimes(2);
            expect(messageHandler.mock.calls[0][0]).toBe(commands.MyCommand);
            expect(messageHandler.mock.calls[1][0]).toBe(commands.MyCommand);
          });

          it(`logs re-handling message as warning`, async () => {
            repository.save.mockImplementationOnce(() => {
              throw new CommitConcurrencyError(
                'MyEventSourceable',
                'my-id',
                '2',
                '1'
              );
            });
            await router.messageHandler(commands.MyCommand);
            expect(log.warning).toHaveBeenCalledTimes(1);
            expect(log.warning).toHaveBeenCalledWith(
              expect.objectContaining(
                new Log(
                  `concurrency exception, re-handling message 'MyCommand' for 'MyEventSourceable@my-event-sourceable-id'`
                )
                  .on(router)
                  .in('handleSaveErrors')
                  .with('message', commands.MyCommand)
              )
            );
          });
        });
      });

      describe(`saves handled event sourceable to repository`, () => {
        it(`for handled command`, async () => {
          await router.messageHandler(commands.MyCommand);

          expect(repository.save).toHaveBeenCalledTimes(1);
          expect(repository.save).toHaveBeenCalledWith(eventSourceable);
        });

        it(`for handled event with event correlation id`, async () => {
          await router.messageHandler(events.CorrelationEvent);

          expect(repository.save).toHaveBeenCalledTimes(1);
          expect(repository.save).toHaveBeenCalledWith(eventSourceable);
        });
      });
    });
  });
});

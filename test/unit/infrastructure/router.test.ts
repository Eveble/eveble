import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import { PropTypes, ValidationError } from 'typend';
import { InvalidInitializingMessageError } from '../../../src/domain/domain-errors';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { define } from '../../../src/decorators/define';
import { types } from '../../../src/types';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { Router } from '../../../src/infrastructure/router';
import {
  MissingEventSourceableError,
  MissingInitializingMessageError,
  UnresolvableIdentifierFromMessageError,
  CannotRouteMessageError,
  CommitConcurrencyError,
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

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`Router`, function () {
  let now: any;
  let clock: any;
  let injector: Injector;
  let log: any;
  let commandBus: any;
  let eventBus: any;
  let repository: any;

  before(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime());

    injector = new Injector();
    log = stubInterface<types.Logger>();
    commandBus = stubInterface<types.CommandBus>();
    eventBus = stubInterface<types.EventBus>();
    repository = stubInterface<types.EventSourceableRepository>();

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
    clock.restore();
  });

  @define('InvalidMessage', { isRegistrable: false })
  class InvalidMessage extends Message {}

  @define('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    name: string;
  }
  @define('MyOtherCommand', { isRegistrable: false })
  class MyOtherCommand extends Command<MyOtherCommand> {
    name: string;
  }

  @define('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    name: string;
  }

  @define('MyOtherEvent', { isRegistrable: false })
  class MyOtherEvent extends Event<MyOtherEvent> {
    name: string;
  }

  @define('MyCorrelatingEvent', { isRegistrable: false })
  class MyCorrelatingEvent extends Event<MyCorrelatingEvent> {
    name: string;
  }

  describe(`construction`, () => {
    @define('MyEventSourceable', { isRegistrable: false })
    class MyEventSourceable extends EventSourceable {}

    it(`throws MissingEventSourceableError if event sourceable is not set`, () => {
      const router = new Router(undefined as any, undefined as any);
      expect(() => router.initialize()).to.throw(
        MissingEventSourceableError,
        'Router: please specify property Router.prototype.EventSourceableType as EventSourceable class to be managed by the router'
      );
    });

    it(`throws MissingInitializingMessageError if initializing message is not set`, () => {
      const router = new Router(MyEventSourceable, undefined as any);
      expect(() => router.initialize()).to.throw(
        MissingInitializingMessageError,
        `Router: please specify property Router.prototype.InitializingMessageType(as command or event class) that will be used to create new instances of the managed EventSourceable`
      );
    });

    it('takes EventSourceableType as EventSourceable type constructor for construction and assigns it', () => {
      const router = new Router(MyEventSourceable, undefined as any);
      expect(router.EventSourceableType).to.be.equal(MyEventSourceable);
    });

    it('takes InitializingMessage as Message type constructor for construction and assigns it', () => {
      const router = new Router(MyEventSourceable, MyCommand);
      expect(router.InitializingMessageType).to.be.equal(MyCommand);
    });

    it('takes routed commands as list of Commands for construction and assigns it', () => {
      const routedCommands = [MyCommand, MyOtherCommand];
      const router = new Router(MyEventSourceable, MyCommand, routedCommands);
      expect(router.routedCommands).to.be.equal(routedCommands);
    });

    it('takes routed events as list of Commands for construction and assigns it', () => {
      const routedEvents = [MyEvent, MyOtherEvent];
      const router = new Router(MyEventSourceable, MyEvent, [], routedEvents);
      expect(router.routedEvents).to.be.equal(routedEvents);
    });

    it(`initializes with empty routed commands as array if they are not provided on construction`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyCommand;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(router.routedCommands).to.be.instanceOf(Array);
      expect(router.routedCommands).to.be.empty;
    });

    it(`initializes with empty routed events as array if they are not set as class property`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyCommand;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(router.routedEvents).to.be.instanceOf(Array);
      expect(router.routedEvents).to.be.empty;
    });
  });

  describe(`initializing message handler`, () => {
    class MyEventSourceable extends EventSourceable {}

    it(`throws UnresolvableIdentifierFromMessageError if provided message to initializing handler is invalid `, async () => {
      @define('MyMessage', { isRegistrable: false })
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
      ).to.eventually.be.rejectedWith(
        UnresolvableIdentifierFromMessageError,
        `MyRouter: message 'MyEventSourceable' is not a valid initializing or handleable message for 'MyMessage'`
      );

      expect(repository.find).to.be.not.called;
    });

    it(`logs defining initializing message`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyEvent;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(log.debug).to.be.calledWithMatch(
        new Log(`defined initializing message 'MyEvent'`)
          .on(router)
          .in(router.initialize)
      );
    });

    it(`registers initializing handler on command bus for initializing command`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyCommand;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(commandBus.registerHandler).to.be.calledOnce;
      expect(commandBus.registerHandler.getCall(0).args[0]).to.be.equal(
        MyCommand
      );
      expect(commandBus.registerHandler.args[0][1].original).to.be.equal(
        router.initializingMessageHandler
      ); // Compare bound function
      expect(eventBus.subscribeTo).to.be.not.called;
    });

    it(`registers initializing handler on event bus for initializing event`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyEvent;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(eventBus.subscribeTo).to.be.calledOnce;
      expect(eventBus.subscribeTo.getCall(0).args[0]).to.be.equal(MyEvent);
      expect(eventBus.subscribeTo.args[0][1].original).to.be.equal(
        router.initializingMessageHandler
      ); // Compare bound function
      expect(commandBus.registerHandler).to.be.not.called;
    });

    it(`logs after setup of initializing message handler`, async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = MyEvent;
      }

      const router = new MyRouter();
      await injector.injectIntoAsync(router);

      expect(log.debug).to.be.calledWithMatch(
        new Log(`set up initializing message handler for 'MyEvent'`)
          .on(router)
          .in(router.initialize)
      );
    });

    it('throws InvalidInitializingMessageError if provided message is not a supported type', async () => {
      class MyRouter extends Router {
        EventSourceableType = MyEventSourceable;

        InitializingMessageType = InvalidMessage as any;
      }

      const router = new MyRouter();
      expect(injector.injectIntoAsync(router)).to.eventually.be.rejectedWith(
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

      expect(commandBus.registerHandler).to.be.calledOnce;
      expect(commandBus.registerHandler.getCall(0).args[0]).to.be.equal(
        MyCommand
      );
      expect(commandBus.registerHandler.args[0][1].original).to.be.equal(
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

      expect(log.debug).to.be.calledWithMatch(
        new Log(`defined routed commands`)
          .on(router)
          .in(router.initialize)
          .with('routed commands', routedCommands)
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

      expect(eventBus.subscribeTo).to.be.calledOnce;
      expect(eventBus.subscribeTo.getCall(0).args[0]).to.be.equal(MyEvent);
      expect(eventBus.subscribeTo.args[0][1].original).to.be.equal(
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

      expect(log.debug).to.be.calledWithMatch(
        new Log(`defined routed events`)
          .on(router)
          .in(router.initialize)
          .with('routed events', routedEvents)
      );
    });
  });

  describe(`message handlers`, () => {
    @define('MyEventSourceable', { isRegistrable: false })
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
        handler = sinon.stub();
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

      it(`logs handled message for debugging`, async () => {
        await router.initializingMessageHandler(commands.MyCommand);

        expect(log.debug).to.be.calledWithMatch(
          new Log(`creating 'MyEventSourceable' with message 'MyCommand'`)
            .on(router)
            .in(router.initializingMessageHandler)
            .with('message', commands.MyCommand)
        );
        expect(log.debug).to.be.calledWithMatch(
          new Log(`created 'MyEventSourceable' with id '${props.id}'`)
            .on(router)
            .in(router.initializingMessageHandler)
            .with('message', commands.MyCommand)
        );
      });

      it(`injects dependencies in to new instance of event sourceable`, async () => {
        router.injector = stubInterface<types.Injector>();
        await router.initializingMessageHandler(commands.MyCommand);
        expect(router.injector.injectIntoAsync).to.be.calledOnce;
      });

      it(`handles message as command`, async () => {
        await router.initializingMessageHandler(commands.MyCommand);

        expect(handler).to.be.calledOnce;
        expect(handler).to.be.calledWithExactly(commands.MyCommand);
      });

      it(`handles message as event`, async () => {
        await router.initializingMessageHandler(events.CorrelationEvent);

        expect(handler).to.be.calledOnce;
        expect(handler).to.be.calledWithExactly(events.CorrelationEvent);
      });

      it(`validates event sourceable after handling initializing message`, async () => {
        const original = MyEventSourceable.prototype.validateProps;
        MyEventSourceable.prototype.validateProps = sinon.stub();

        await router.initializingMessageHandler(commands.MyCommand);
        expect(MyEventSourceable.prototype.validateProps).to.be.calledOnce;
        const expectedProps = {
          id: props.id,
          name: 'foo',
          state: undefined,
          version: 0,
        };
        const expectedPropTypes = {
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
          [COMMANDS_KEY]: PropTypes.arrayOf(PropTypes.instanceOf(Command)),
          [EVENTS_KEY]: PropTypes.arrayOf(PropTypes.instanceOf(Event)),
        };
        expect(MyEventSourceable.prototype.validateProps).to.be.calledWithMatch(
          expectedProps,
          expectedPropTypes
        );
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

        await expect(
          router.initializingMessageHandler(commands.MyCommand)
        ).to.be.eventually.rejectedWith(
          ValidationError,
          `MyEventSourceable: (Key 'id': Expected undefined to be one of: [[String], [Guid]] in MyEventSourceable({"version":0,"metadata":{},"name":"foo"}))`
        );
      });

      it(`saves handled event sourceable to repository`, async () => {
        await router.initializingMessageHandler(commands.MyCommand);
        expect(repository.save).to.be.calledOnce;
        expect(repository.save.getCall(0).args[0]).to.be.instanceof(
          MyEventSourceable
        );
        expect(repository.save.getCall(0).args[0]).to.be.eql(
          new MyEventSourceable({
            id: props.id,
            name: 'foo',
            metadata: {},
          })
        );
      });

      describe(`handles errors`, () => {
        class MyDomainError extends DomainError {}

        it(`logs thrown error`, async () => {
          const error = new MyDomainError('my-error');
          handler.throws(error);
          await expect(
            router.initializingMessageHandler(commands.MyCommand)
          ).to.eventually.be.rejectedWith(error);

          expect(log.error).to.be.calledOnce;
          expect(log.error).to.be.calledWith(
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
          handler.throws(error);
          await expect(
            router.initializingMessageHandler(commands.MyCommand)
          ).to.eventually.be.rejectedWith(error);

          const publishedDomainException = new DomainException({
            sourceId: props.id,
            thrower: 'MyEventSourceable',
            error,
            timestamp: now,
          });
          expect(eventBus.publish).to.be.calledOnce;
          expect(eventBus.publish).to.be.calledWith(publishedDomainException);
        });

        it(`publishes DomainException with metadata copied from message through event bus`, async () => {
          const error = new MyDomainError('my-error');
          handler.throws(error);
          await expect(
            router.initializingMessageHandler(events.CorrelationEvent)
          ).to.eventually.be.rejectedWith(error);

          const publishedDomainException = new DomainException({
            sourceId: props.id,
            thrower: 'MyEventSourceable',
            error,
            timestamp: now,
            metadata: events.CorrelationEvent.metadata,
          });
          expect(eventBus.publish).to.be.calledOnce;
          expect(eventBus.publish).to.be.calledWith(publishedDomainException);
        });

        it(`re-throws error if its not an instance of MyDomainError`, async () => {
          class MySerializableError extends SerializableError {}
          const error = new MySerializableError('my-not-domain-error');
          handler.throws(error);

          expect(
            router.initializingMessageHandler(commands.MyCommand)
          ).to.eventually.be.rejectedWith(error);
          expect(eventBus.publish).to.not.be.called;
        });
      });
    });

    describe(`message handler`, () => {
      let handler: any;
      beforeEach(() => {
        // Setup
        handler = sinon.stub();
        MyEventSourceable.prototype.handle = function (
          message: types.Command | types.Event
        ): Promise<any> {
          handler(message);
          // Simplify handling message instead of going for full blown Command->Event recording
          this.id = message.getId();
          this.name = (message as any).name;
          return this;
        };

        repository.find.returns(eventSourceable);
      });

      it(`throws UnresolvableIdentifierFromMessageError if provided message to handler is invalid `, async () => {
        @define('MyMessage', { isRegistrable: false })
        class MyMessage extends Message {
          key: string;
        }

        await expect(
          router.messageHandler(new MyMessage({ key: 'my-value' }) as any)
        ).to.eventually.be.rejectedWith(
          UnresolvableIdentifierFromMessageError,
          `MyRouter: message 'MyEventSourceable' is not a valid initializing or handleable message for 'MyMessage'`
        );

        expect(repository.find).to.be.not.called;
      });

      describe(`handles message`, () => {
        it(`as command`, async () => {
          await router.messageHandler(commands.MyCommand);
          expect(handler).to.be.calledOnce;
          expect(handler).to.be.calledWithExactly(commands.MyCommand);
        });

        it(`as event with correlation id`, async () => {
          await router.messageHandler(events.CorrelationEvent);
          expect(handler).to.be.calledOnce;
          expect(handler).to.be.calledWithExactly(events.CorrelationEvent);
        });

        it(`ignores handling event that does not contain event correlation id`, async () => {
          await router.messageHandler(events.MyEvent);
          expect(repository.find).to.be.not.called;
        });

        it(`validates event sourceable after handling initializing message`, async () => {
          const original = MyEventSourceable.prototype.validateProps;
          MyEventSourceable.prototype.validateProps = sinon.stub();

          await router.messageHandler(commands.MyCommand);
          expect(MyEventSourceable.prototype.validateProps).to.be.calledOnce;
          const expectedProps = {
            id: props.id,
            name: 'foo',
            state: undefined,
            version: 0,
          };
          const expectedPropTypes = {
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
            [COMMANDS_KEY]: PropTypes.arrayOf(PropTypes.instanceOf(Command)),
            [EVENTS_KEY]: PropTypes.arrayOf(PropTypes.instanceOf(Event)),
          };
          expect(
            MyEventSourceable.prototype.validateProps
          ).to.be.calledWithMatch(expectedProps, expectedPropTypes);
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

          await expect(
            router.messageHandler(commands.MyCommand)
          ).to.be.eventually.rejectedWith(
            ValidationError,
            `MyEventSourceable: (Key 'name': Expected undefined to be a String in MyEventSourceable({"id":"my-event-sourceable-id","version":0}))`
          );
        });
      });

      describe(`logs handled message`, () => {
        it(`as command for debugging`, async () => {
          await router.messageHandler(commands.MyCommand);
          expect(log.debug).to.be.calledWithExactly(
            new Log(
              `handling message 'MyCommand' for 'MyEventSourceable@my-event-sourceable-id'`
            )
              .on(router)
              .in(router.messageHandler)
              .with('message', commands.MyCommand)
          );
          expect(log.debug).to.be.calledWithExactly(
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
          expect(log.debug).to.be.calledWithExactly(
            new Log(
              `handling message 'MyCorrelatingEvent' for 'MyEventSourceable@my-correlation-id'`
            )
              .on(router)
              .in(router.messageHandler)
              .with('message', events.CorrelationEvent)
          );
          expect(log.debug).to.be.calledWithExactly(
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
          expect(log.debug).to.be.not.calledWith(
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
        repository.find.returns(undefined);
        await expect(
          router.messageHandler(commands.MyCommand)
        ).to.eventually.be.rejectedWith(
          CannotRouteMessageError,
          `MyRouter: no event sourceable found to handle 'MyCommand'`
        );
        expect(log.error).to.be.calledWith(
          new Log(`not found 'MyEventSourceable' with id '${props.id}'`)
            .on(router)
            .in(router.messageHandler)
        );
      });

      it(`throws CannotHandleMessageError when event sourceable can't be found on repository`, async () => {
        repository.find.returns(undefined);
        await expect(
          router.messageHandler(commands.MyCommand)
        ).to.eventually.be.rejectedWith(
          CannotRouteMessageError,
          `MyRouter: no event sourceable found to handle 'MyCommand'`
        );
      });

      describe(`injects dependencies in to event sourceable`, () => {
        it(`for handled command`, async () => {
          repository.find.returns(eventSourceable);
          injector.injectIntoAsync = sinon.stub();
          await router.messageHandler(commands.MyCommand);
          expect(injector.injectIntoAsync).to.be.calledOnce;
          expect(injector.injectIntoAsync).to.be.calledWithExactly(
            eventSourceable
          );
        });

        it(`for handled event with correlation id`, async () => {
          repository.find.returns(eventSourceable);
          injector.injectIntoAsync = sinon.stub();
          await router.messageHandler(events.CorrelationEvent);
          expect(injector.injectIntoAsync).to.be.calledOnce;
          expect(injector.injectIntoAsync).to.be.calledWithExactly(
            eventSourceable
          );
        });

        it(`does not inject dependencies for events without correlation id`, async () => {
          repository.find.returns(eventSourceable);
          injector.injectIntoAsync = sinon.stub();
          await router.messageHandler(events.MyEvent);
          expect(injector.injectIntoAsync).to.be.not.called;
        });
      });

      describe(`handles errors`, () => {
        class MyDomainError extends DomainError {}

        it(`logs thrown error`, async () => {
          const error = new MyDomainError('my-error');
          handler.throws(error);
          await expect(
            router.messageHandler(commands.MyCommand)
          ).to.eventually.be.rejectedWith(error);
          expect(log.error).to.be.calledOnce;
          expect(log.error).to.be.calledWith(
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
          handler.throws(error);
          await expect(
            router.messageHandler(commands.MyCommand)
          ).to.eventually.be.rejectedWith(error);

          const publishedDomainException = new DomainException({
            sourceId: props.id,
            thrower: 'MyEventSourceable',
            error,
            timestamp: now,
          });
          expect(eventBus.publish).to.be.calledOnce;
          expect(eventBus.publish).to.be.calledWith(publishedDomainException);
        });

        it(`publishes DomainException with metadata copied from message through event bus`, async () => {
          const error = new MyDomainError('my-error');
          handler.throws(error);
          await expect(
            router.messageHandler(events.CorrelationEvent)
          ).to.eventually.be.rejectedWith(error);

          const publishedDomainException = new DomainException({
            sourceId: props.id,
            thrower: 'MyEventSourceable',
            error,
            timestamp: now,
            metadata: events.CorrelationEvent.metadata,
          });
          expect(eventBus.publish).to.be.calledOnce;
          expect(eventBus.publish).to.be.calledWith(publishedDomainException);
        });

        it(`re-throws error if its not an instance of DomainError or CommitConcurrencyError`, async () => {
          class MySerializableError extends SerializableError {}
          const error = new MySerializableError('my-not-domain-error');
          handler.throws(error);

          expect(
            router.messageHandler(commands.MyCommand)
          ).to.eventually.be.rejectedWith(error);
          expect(eventBus.publish).to.not.be.called;
        });

        describe(`CommitConcurrencyError`, () => {
          it(`re-handles message again if there's a concurrency exception when saving to the repository`, async () => {
            repository.save
              .onCall(0)
              .throws(
                new CommitConcurrencyError(
                  'MyEventSourceable',
                  'my-id',
                  '2',
                  '1'
                )
              );
            const messageHandler = sinon.spy(router, 'messageHandler');
            await router.messageHandler(commands.MyCommand);
            expect(messageHandler).to.be.calledTwice;
            expect(messageHandler.getCall(0).args[0]).to.be.equal(
              commands.MyCommand
            );
            expect(messageHandler.getCall(1).args[0]).to.be.equal(
              commands.MyCommand
            );
          });

          it(`logs re-handling message as warning`, async () => {
            repository.save
              .onCall(0)
              .throws(
                new CommitConcurrencyError(
                  'MyEventSourceable',
                  'my-id',
                  '2',
                  '1'
                )
              );
            await router.messageHandler(commands.MyCommand);
            expect(log.warning).to.be.calledOnce;
            expect(log.warning).to.be.calledWithMatch(
              new Log(
                `concurrency exception, re-handling message 'MyCommand' for 'MyEventSourceable@my-event-sourceable-id'`
              )
                .on(router)
                .in('handleSaveErrors')
                .with('message', commands.MyCommand)
            );
          });
        });
      });

      describe(`saves handled event sourceable to repository`, () => {
        it(`for handled command`, async () => {
          await router.messageHandler(commands.MyCommand);

          expect(repository.save).to.be.calledOnce;
          expect(repository.save).to.be.calledWith(eventSourceable);
        });

        it(`for handled event with event correlation id`, async () => {
          await router.messageHandler(events.CorrelationEvent);

          expect(repository.save).to.be.calledOnce;
          expect(repository.save).to.be.calledWith(eventSourceable);
        });
      });
    });
  });
});

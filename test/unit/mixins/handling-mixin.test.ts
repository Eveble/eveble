import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { define } from '@eveble/core';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { HandlingMixin } from '../../../src/mixins/handling-mixin';
import { Message } from '../../../src/components/message';
import { UnhandleableTypeError } from '../../../src/messaging/messaging-errors';
import { handle } from '../../../src/annotations/handle';
import { subscribe } from '../../../src/annotations/subscribe';
import { HANDLERS } from '../../../src/constants/literal-keys';

chai.use(sinonChai);

describe('HandlingMixing', function () {
  @define('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    key: string;
  }

  @define('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    key: string;
  }

  describe('handlers setup', () => {
    it('registers handlers as a instance of a Map', () => {
      const commandHandler = sinon.stub();
      const eventHandler = sinon.stub();
      const handlers = new Map();
      handlers.set(MyCommand, commandHandler);
      handlers.set(MyEvent, eventHandler);

      class MyController extends HandlingMixin {
        initialize(): void {
          this.setupHandlers({
            handlers,
          });
        }
      }

      const controller = new MyController();
      controller.registerHandler = sinon.stub();
      controller.initialize();

      expect(controller.registerHandler).to.be.calledTwice;
      expect(controller.registerHandler).to.be.calledWithExactly(
        MyCommand,
        commandHandler
      );
      expect(controller.registerHandler).to.be.calledWithExactly(
        MyEvent,
        eventHandler
      );
    });

    it('registers handlers with custom registrator', () => {
      const commandHandler = sinon.stub();
      const eventHandler = sinon.stub();
      const handlers = new Map();
      handlers.set(MyCommand, commandHandler);
      handlers.set(MyEvent, eventHandler);

      const registrator = sinon.stub();
      class MyController extends HandlingMixin {
        initialize(): void {
          this.setupHandlers({
            handlers,
            registrator,
          });
        }
      }

      const controller = new MyController();
      controller.registerHandler = sinon.stub();
      controller.initialize();

      expect(registrator).to.be.calledTwice;
      expect(registrator).to.be.calledWithExactly(MyCommand, commandHandler);
      expect(registrator).to.be.calledWithExactly(MyEvent, eventHandler);
    });

    it('binds on setup each handler to instance of a controller before its registration', () => {
      const commandHandler = sinon.stub();
      const eventHandler = sinon.stub();
      const handlers = new Map();
      handlers.set(MyCommand, commandHandler);
      handlers.set(MyEvent, eventHandler);

      const registrator = sinon.stub();
      class MyController extends HandlingMixin {
        initialize(): void {
          this.setupHandlers({
            handlers,
            registrator,
          });
        }
      }

      const controller = new MyController();
      controller.registerHandler = sinon.stub();
      controller.initialize();

      expect(registrator).to.be.calledTwice;
      // MyCommand
      expect(registrator.args[0][0]).to.be.equal(MyCommand);
      expect(
        Object.create(commandHandler.prototype) instanceof
          registrator.args[0][1]
      ).to.be.true;
      // MyEvent
      expect(registrator.args[1][0]).to.be.equal(MyEvent);
      expect(
        Object.create(eventHandler.prototype) instanceof registrator.args[1][1]
      ).to.be.true;
      expect(controller.registerHandler).to.not.be.called;
    });

    it('ensures that unhandleable message types passed in handler mappings are throwing UnhnandleableTypeError', () => {
      const handlers = new Map();
      handlers.set(MyEvent, sinon.stub());

      class MyController extends HandlingMixin {
        initialize(): void {
          this.setupHandlers({
            handlers,
          });
        }
      }
      const controller = new MyController();
      controller.setHandleableTypes([Command]);

      expect(() => controller.initialize()).to.throw(
        UnhandleableTypeError,
        `MyController: type must be one of: [Command]; got MyEvent`
      );
    });

    it('ensures that valid message types passed in handler mappings are handleable', () => {
      const handlers = new Map();
      handlers.set(MyEvent, sinon.stub());

      class MyController extends HandlingMixin {
        initialize(): void {
          this.setupHandlers({
            handlers,
          });
        }
      }
      const controller = new MyController();
      controller.setHandleableTypes([Event]);

      expect(() => controller.initialize()).to.not.throw(UnhandleableTypeError);
    });

    it('ensures that message types passed in handler mappings are handleable on runtime', () => {
      const handlers = new Map();
      handlers.set(MyEvent, sinon.stub());

      class MyController extends HandlingMixin {
        initialize(): void {
          this.setupHandlers({
            handlers,
            handleableTypes: [Command],
          });
        }
      }
      const controller = new MyController();
      expect(() => controller.initialize()).to.throw(
        UnhandleableTypeError,
        `MyController: type must be one of: [Command]; got MyEvent`
      );
    });

    it('overrides pre-existing handlers for message type set prior to the initialization', () => {
      const originalHandler = sinon.stub();
      const originalHandlers = new Map();
      originalHandlers.set(MyCommand, originalHandler);

      const overridingHandler = sinon.stub();
      const overridingHandlers = new Map();
      overridingHandlers.set(MyCommand, overridingHandler);

      class MyController extends HandlingMixin {
        constructor() {
          super();
          this[HANDLERS] = originalHandlers;
        }

        initialize(): void {
          this.setupHandlers({
            handlers: overridingHandlers,
          });
        }
      }

      const controller = new MyController();
      controller.overrideHandler = sinon.stub();
      controller.initialize();

      expect(controller.overrideHandler).to.be.calledOnce;
      expect(controller.overrideHandler).to.be.calledWithExactly(
        MyCommand,
        overridingHandler
      );
    });
  });

  describe('annotations', () => {
    it('returns all annotated command handlers', () => {
      class MyController extends HandlingMixin {
        initialize(): void {
          this.setupHandlers({
            handlers: this.handles(),
          });
        }

        // Stub methods required by Controller interface
        getHandler(): void {
          return undefined;
        }

        getHandlerOrThrow(): void {
          return undefined;
        }

        handle(): void {
          return undefined;
        }

        MyCommandHandlerMethod(@handle command: MyCommand): boolean {
          return command.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.registerHandler = sinon.stub();
      controller.initialize();
      expect(controller.registerHandler).to.be.calledOnce;
      expect(controller.registerHandler).to.be.calledWithExactly(
        MyCommand,
        controller.MyCommandHandlerMethod
      );
    });

    it('returns all annotated event subscribers', () => {
      class MyController extends HandlingMixin {
        initialize(): void {
          this.setupHandlers({
            handlers: this.subscribes(),
          });
        }

        // Stub methods required by Controller interface
        getHandler(): void {
          return undefined;
        }

        getHandlerOrThrow(): void {
          return undefined;
        }

        handle(): void {
          return undefined;
        }

        MyEventHandlerMethod(@subscribe command: MyEvent): boolean {
          return command.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.registerHandler = sinon.stub();
      controller.initialize();
      expect(controller.registerHandler).to.be.calledOnce;
      expect(controller.registerHandler).to.be.calledWithExactly(
        MyEvent,
        controller.MyEventHandlerMethod
      );
    });
  });

  describe('handlers', () => {
    describe('evaluating handlers', () => {
      it('returns true if message type has a registered handler', () => {
        const handlers = new Map();
        handlers.set(MyCommand, sinon.stub());
        class MyController extends HandlingMixin {
          constructor() {
            super();
            this[HANDLERS] = handlers;
          }
        }
        const controller = new MyController();
        expect(controller.hasHandler(MyCommand)).to.be.true;
      });
      it('returns false if message type has no registered handler', () => {
        class MyController extends HandlingMixin {}
        const controller = new MyController();
        expect(controller.hasHandler(MyCommand)).to.be.false;
      });
    });

    describe('manipulation', () => {
      it('removes handler for message type', () => {
        const handlers = new Map();
        handlers.set(MyCommand, sinon.stub());
        class MyController extends HandlingMixin {
          constructor() {
            super();
            this[HANDLERS] = handlers;
          }
        }
        const controller = new MyController();
        expect(controller.hasHandler(MyCommand)).to.be.true;
        controller.removeHandler(MyCommand);
        expect(controller.hasHandler(MyCommand)).to.be.false;
      });
    });
  });

  describe('handleable types', () => {
    it('ensures that handleabe types array is created before assigning types', () => {
      class MyController extends HandlingMixin {}

      const controller = new MyController();
      controller.setHandleableTypes(Command);
      expect(controller.getHandleableTypes()).to.be.an('array');
      expect(controller.getHandleableTypes()).to.have.length(1);
      expect(controller.getHandleableTypes()).to.be.eql([Command]);
    });

    it('sets handleabe types to a single message type', () => {
      class MyController extends HandlingMixin {}

      const controller = new MyController();
      controller.setHandleableTypes(Command);
      expect(controller.getHandleableTypes()).to.be.an('array');
      expect(controller.getHandleableTypes()).to.have.length(1);
      expect(controller.getHandleableTypes()).to.be.eql([Command]);
    });

    it('sets handleabe types to a multiple message types', () => {
      class MyController extends HandlingMixin {}

      const controller = new MyController();
      controller.setHandleableTypes([Command, Event]);
      expect(controller.getHandleableTypes()).to.be.an('array');
      expect(controller.getHandleableTypes()).to.have.length(2);
      expect(controller.getHandleableTypes()).to.be.eql([Command, Event]);
    });

    it('returns Message type as default handleabe type', () => {
      class MyController extends HandlingMixin {}

      const controller = new MyController();
      expect(controller.getHandleableTypes()).to.be.an('array');
      expect(controller.getHandleableTypes()).to.have.length(1);
      expect(controller.getHandleableTypes()).to.be.eql([Message]);
    });

    describe('evaluation', () => {
      it('returns true if handleable types are not defined for any message type', () => {
        class MyController extends HandlingMixin {}

        const controller = new MyController();
        expect(controller.isHandleabe(Command)).to.be.true;
      });

      it('returns true if handleable types are empty array for any message type', () => {
        class MyController extends HandlingMixin {}
        const controller = new MyController();
        expect(controller.isHandleabe(Command)).to.be.true;
      });

      it('returns true if message type is handleable', () => {
        class MyController extends HandlingMixin {}
        const controller = new MyController();
        controller.setHandleableTypes(MyCommand);
        expect(controller.getHandleableTypes()).to.be.eql([MyCommand]);
        expect(controller.isHandleabe(MyCommand)).to.be.true;
      });

      it('returns true if message type is handleable by inheritance relation(subclass)', () => {
        class MyController extends HandlingMixin {}
        const controller = new MyController();
        controller.setHandleableTypes(Command);
        expect(controller.getHandleableTypes()).to.be.eql([Command]);
        expect(controller.isHandleabe(MyCommand)).to.be.true;
      });

      it('returns false if message type is not handleable', () => {
        class MyController extends HandlingMixin {}
        const controller = new MyController();
        controller.setHandleableTypes(Event);
        expect(controller.getHandleableTypes()).to.be.eql([Event]);
        expect(controller.isHandleabe(MyCommand)).to.be.false;
      });

      context('runtime', () => {
        it('returns true if message type is handleable on runtime evaluation', () => {
          class MyController extends HandlingMixin {}
          const controller = new MyController();
          expect(controller.isHandleabe(MyCommand, Command)).to.be.true;
        });

        it('returns false if message  type is not handleable on runtime evaluation', () => {
          class MyController extends HandlingMixin {}
          const controller = new MyController();
          expect(controller.isHandleabe(MyCommand, Event)).to.be.false;
        });
      });
    });
  });

  describe('handlers', () => {
    it('returns all registered handlers', () => {
      const handlers = new Map([[MyCommand, sinon.stub()]]);
      class MyController extends HandlingMixin {
        constructor() {
          super();
          this[HANDLERS] = handlers;
        }
      }
      const controller = new MyController();
      expect(controller.getHandlers()).to.be.equal(handlers);
    });

    it('returns all handled message types', () => {
      const handlers = new Map();
      handlers.set(MyCommand, sinon.stub());
      handlers.set(MyEvent, sinon.stub());

      class MyController extends HandlingMixin {
        constructor() {
          super();
          this[HANDLERS] = handlers;
        }
      }

      const controller = new MyController();
      expect(controller.getHandledTypes()).to.be.eql([MyCommand, MyEvent]);
    });

    it('returns all handled message types - type names', () => {
      const handlers = new Map();
      handlers.set(MyCommand, sinon.stub());
      handlers.set(MyEvent, sinon.stub());

      class MyController extends HandlingMixin {
        constructor() {
          super();
          this[HANDLERS] = handlers;
        }
      }

      const controller = new MyController();
      expect(controller.getHandledTypesNames()).to.be.eql([
        'MyCommand',
        'MyEvent',
      ]);
    });

    describe('resolving handled message types by subclass matching', () => {
      it('returns all handled types by matching subclassing of Command', () => {
        const handlers = new Map();
        handlers.set(MyCommand, sinon.stub());
        handlers.set(MyEvent, sinon.stub());

        class MyController extends HandlingMixin {
          constructor() {
            super();
            this[HANDLERS] = handlers;
          }
        }

        const controller = new MyController();
        expect(controller.getHandled(Command)).to.be.eql([MyCommand]);
        expect(controller.getHandledCommands()).to.be.eql([MyCommand]);
      });

      it('returns all handled types by matching subclassing of Event', () => {
        const handlers = new Map();
        handlers.set(MyCommand, sinon.stub());
        handlers.set(MyEvent, sinon.stub());

        class MyController extends HandlingMixin {
          constructor() {
            super();
            this[HANDLERS] = handlers;
          }
        }

        const controller = new MyController();
        expect(controller.getHandled(Event)).to.be.eql([MyEvent]);
        expect(controller.getHandledEvents()).to.be.eql([MyEvent]);
      });

      it('returns all handled types by matching subclassing of Message', () => {
        const handlers = new Map();
        handlers.set(MyCommand, sinon.stub());
        handlers.set(MyEvent, sinon.stub());

        class MyController extends HandlingMixin {
          constructor() {
            super();
            this[HANDLERS] = handlers;
          }
        }

        const controller = new MyController();
        expect(controller.getHandled(Message)).to.be.eql([MyCommand, MyEvent]);
        expect(controller.getHandledMessages()).to.be.eql([MyCommand, MyEvent]);
      });
    });
  });

  describe(`validation`, () => {
    it(`returns true for message type that can be handled`, () => {
      class MyController extends HandlingMixin {}
      const controller = new MyController();
      controller.setHandleableTypes(Command);
      expect(controller.ensureHandleability(MyCommand)).to.be.true;
    });

    it(`returns true for message type that can be handled by inheritance relation`, () => {
      class MyController extends HandlingMixin {}
      const controller = new MyController();
      controller.setHandleableTypes(Command);
      expect(controller.ensureHandleability(MyCommand)).to.be.true;
    });

    it(`throws ValidationError if message type is not one of the handleable types`, () => {
      class MyController extends HandlingMixin {}
      const controller = new MyController();
      controller.setHandleableTypes(Command);
      expect(() => controller.ensureHandleability(MyEvent)).to.throw(
        UnhandleableTypeError,
        'MyController: type must be one of: [Command]; got MyEvent'
      );
    });

    it(`allows to pass handleable types as second argument for custom validation`, () => {
      class MyController extends HandlingMixin {}
      const controller = new MyController();
      expect(() => controller.ensureHandleability(MyCommand, [Event])).to.throw(
        UnhandleableTypeError,
        'MyController: type must be one of: [Event]; got MyCommand'
      );
    });
  });
});

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { EventHandlingMixin } from '../../../src/mixins/event-handling-mixin';
import { define } from '../../../src/decorators/define';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { subscribe } from '../../../src/annotations/subscribe';
import { types } from '../../../src/types';
import { Container } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { handle } from '../../../src/annotations/handle';
import { UnhandleableTypeError } from '../../../src/messaging/messaging-errors';

chai.use(sinonChai);

describe(`EventHandlingMixin`, function() {
  let container: types.Injector;
  let eventBus: any;

  beforeEach(() => {
    eventBus = stubInterface<types.EventBus>();
    container = new Container();
    container.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
  });

  @define('MyEvent', { isRegistrable: false })
  class MyEvent extends Event {
    key: string;
  }

  @define('MyOtherEvent', { isRegistrable: false })
  class MyOtherEvent extends Event {
    key: string;
  }

  @define('MyCommand', { isRegistrable: false })
  class MyCommand extends Command {
    key: string;
  }

  describe('construction', () => {
    it(`initializes with empty handled events`, () => {
      class MyController extends EventHandlingMixin {}

      const controller = new MyController();
      expect(controller.getHandledEvents()).to.be.eql([]);
    });
  });

  describe('getters', () => {
    it('aliases getHandledEvents with getSubscribedEvents for expressive api', () => {
      class MyController extends EventHandlingMixin {}

      const controller = new MyController();
      controller.getHandledEvents = sinon.stub();
      (controller.getHandledEvents as any).returns([MyEvent]);

      expect(controller.getSubscribedEvents()).to.be.eql([MyEvent]);
      expect(controller.getHandledEvents).to.be.calledOnce;
    });
  });

  describe('initialization', () => {
    it('sets handler for events with dedicated registration method on initialization', () => {
      class MyController extends EventHandlingMixin {
        @subscribe()
        MyEvent(event: MyEvent): boolean {
          return event.key === 'my-string';
        }

        @subscribe()
        MyOtherEvent(event: MyOtherEvent): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.registerEventHandler = sinon.stub();
      container.injectInto(controller);

      expect(controller.registerEventHandler).to.be.calledTwice;
      expect(controller.registerEventHandler).to.be.calledWithExactly(
        MyEvent,
        controller.MyEvent
      );
      expect(controller.registerEventHandler).to.be.calledWithExactly(
        MyOtherEvent,
        controller.MyOtherEvent
      );
    });

    it('overrides initialize method from OneToOneHandlingMixin thus not initializing command handlers mappings', () => {
      class MyController extends EventHandlingMixin {
        @handle()
        MyCommand(event: MyCommand): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.registerHandler = sinon.stub();
      controller.initialize();
      expect(controller.registerHandler).to.not.be.called;
    });

    it(`throws UnhandleableTypeError upon types not subclassing from Command defined as handlers`, () => {
      class MyController extends EventHandlingMixin {
        subscribes(): Map<types.MessageableType, types.Handler> {
          return new Map([[MyCommand, sinon.stub()]]);
        }
      }
      const controller = new MyController();
      expect(() => controller.initialize()).to.throw(
        UnhandleableTypeError,
        `MyController: type must be one of: [Event]; got MyCommand`
      );
    });
  });

  describe('registration', () => {
    it('throws UnhandleableTypeError upon registering non event type', () => {
      class MyController extends EventHandlingMixin {}
      const controller = new MyController();
      expect(() => {
        controller.registerEventHandler(MyCommand, sinon.stub());
      }).to.throw(
        UnhandleableTypeError,
        'MyController: type must be one of: [Event]; got MyCommand'
      );
    });

    it(`registers event handler`, () => {
      const handler = sinon.spy();
      class MyController extends EventHandlingMixin {}
      const controller = new MyController();
      container.injectInto(controller);
      controller.registerHandler = sinon.stub();

      controller.registerEventHandler(MyEvent, handler);
      expect(controller.registerHandler).to.be.calledOnce;
    });

    it(`registers handler on instance with bound handler`, () => {
      const handler = sinon.stub();
      class MyController extends EventHandlingMixin {}
      const controller = new MyController();
      const registerHandler = sinon.stub(controller, 'registerHandler');
      container.injectInto(controller);

      controller.registerEventHandler(MyEvent, handler);
      expect(registerHandler).to.be.calledOnce;
      expect(registerHandler.args[0][0]).to.be.equal(MyEvent);
      expect(
        Object.create(handler.prototype) instanceof registerHandler.args[0][1]
      ).to.be.true; // Compare bound function to handler function example
      expect(registerHandler.args[0][2]).to.be.false; // Flag shouldOverride set by default to false
    });

    it(`registers handler on EventBus with bound handler`, () => {
      const handler = sinon.stub();
      class MyController extends EventHandlingMixin {}
      const controller = new MyController();
      container.injectInto(controller);

      controller.registerEventHandler(MyEvent, handler);
      expect(eventBus.subscribeTo).to.be.calledOnce;
      expect(eventBus.subscribeTo.args[0][0]).to.be.equal(MyEvent);
      expect(
        Object.create(handler.prototype) instanceof
          eventBus.subscribeTo.args[0][1]
      ).to.be.true; // Compare bound function to handler function example
      expect(eventBus.subscribeTo.args[0][2]).to.be.false; // Flag shouldOverride set by default to false
    });

    it(`ensures that context of registered handler on EventBus is bound to instance`, () => {
      eventBus.handlers = new Map();
      eventBus.subscribeTo = function(event, handler): void {
        this.handlers.set(event, handler);
      };

      class MyController extends EventHandlingMixin {
        dependency: any;

        MyEvent(event: MyEvent): void {
          return this.dependency(event);
        }
      }
      const controller = new MyController();
      controller.dependency = sinon.stub();
      controller.eventBus = eventBus;

      controller.registerEventHandler(MyEvent, controller.MyEvent);
      const eventInstance = new MyEvent({
        sourceId: 'my-source-id',
        key: 'my-key',
      });
      eventBus.handlers.get(MyEvent)(eventInstance);
      expect(controller.dependency).to.be.calledOnce;
      expect(controller.dependency).to.be.calledWithExactly(eventInstance);
    });
    describe('subscribeTo', () => {
      it('aliases registerEventHandler with expressive subscribeTo', () => {
        class MyController extends EventHandlingMixin {}
        const controller = new MyController();
        controller.registerEventHandler = sinon.stub();

        const handler = sinon.stub();
        controller.subscribeTo(MyEvent, handler, true);
        expect(controller.registerEventHandler).to.be.calledOnce;
        expect(controller.registerEventHandler).to.be.calledWithExactly(
          MyEvent,
          handler,
          true
        );
      });
    });
  });

  describe('event handling', () => {
    describe('on', () => {
      it(`aliases handle with expressive 'on' api`, () => {
        class MyController extends EventHandlingMixin {}
        const controller = new MyController();
        controller.handle = sinon.stub();

        const eventInstance = new MyEvent({
          sourceId: 'my-source-id',
          key: 'my-key',
        });
        controller.on(eventInstance);
        expect(controller.handle).to.be.calledOnce;
        expect(controller.handle).to.be.calledWithExactly(eventInstance);
      });
    });
  });

  describe('event publishing', () => {
    it(`allows to publish event through event bus`, async () => {
      class MyController extends EventHandlingMixin {}
      const controller = new MyController();
      container.injectInto(controller);

      const eventInstance = new MyEvent({
        sourceId: 'my-source-id',
        key: 'my-key',
      });
      await controller.publish(eventInstance);
      expect(eventBus.publish).to.be.calledOnce;
      expect(eventBus.publish).to.be.calledWithExactly(eventInstance);
    });
  });
});
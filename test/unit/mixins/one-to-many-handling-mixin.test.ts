import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import delay from 'delay';
import { Event } from '../../../src/components/event';
import { types } from '../../../src/types';
import { OneToManyHandlingMixin } from '../../../src/mixins/one-to-many-handling-mixin';
import { subscribe } from '../../../src/annotations/subscribe';
import { Message } from '../../../src/components/message';
import {
  UnhandleableTypeError,
  HandlerExistError,
  InvalidHandlerError,
  HandlerNotFoundError,
  InvalidMessageableType,
} from '../../../src/messaging/messaging-errors';
import { define } from '../../../src/decorators/define';
import { hasPostConstruct } from '../../../src/utils/helpers';
import { HandlingMixin } from '../../../src/mixins/handling-mixin';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('OneToManyHandlingMixin', function() {
  @define('MyEvent', { isRegistrable: false })
  class MyEvent extends Event {
    key: string;
  }

  @define('Namespaced.Event', { isRegistrable: false })
  class NamespacedEvent extends Event {
    key: string;
  }

  it('extends HandlingMixin', () => {
    expect(OneToManyHandlingMixin.prototype).to.be.instanceof(HandlingMixin);
  });

  describe('construction', () => {
    it('ensures that controller can be initialized without handlers', () => {
      class MyController extends OneToManyHandlingMixin {}
      expect(() => new MyController()).to.not.throw(Error);
    });

    it('initializes with empty handlers as instance of map', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();
      expect(controller.getHandlers()).to.be.instanceof(Map);
      expect(controller.getHandlers()).to.be.empty;
    });

    it('initializes with empty handleable types as instance of array', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();
      expect(controller.getHandleableTypes()).to.be.instanceof(Array);
      expect(controller.getHandleableTypes()).to.be.eql([Message]);
    });
  });

  describe('initialization', () => {
    it('setups all handlers from subscribes mapping method on initialization', () => {
      class MyController extends OneToManyHandlingMixin {
        @subscribe()
        MyEventHandlerMethod(event: MyEvent): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.initialize();
      expect(controller.getHandlers()).to.be.instanceof(Map);
      expect(controller.getHandlers()).to.be.eql(
        new Map([[MyEvent, [controller.MyEventHandlerMethod]]])
      );
    });

    it('annotates initializes as post construction method for Inversify', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();
      expect(hasPostConstruct(controller)).to.be.true;
    });
  });

  describe('handler registration', () => {
    it('throws UnhandleableTypeError if provided message type is not handleabe', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();

      class InvalidType {}
      expect(() =>
        controller.registerHandler(InvalidType, sinon.stub())
      ).to.throw(
        UnhandleableTypeError,
        'MyController: type must be one of: [Message]; got InvalidType'
      );
    });

    it('throws InvalidHandlerError if provided handler is not a function', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();

      expect(() =>
        controller.registerHandler(MyEvent, (undefined as any) as types.Handler)
      ).to.throw(
        InvalidHandlerError,
        `MyController: provided handler for 'MyEvent' must be a function, got undefined`
      );
    });

    it('registers one to many relational handler for a message type', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();

      const handler = sinon.stub();
      controller.registerHandler(MyEvent, handler);
      expect(controller.getHandler(MyEvent)).to.be.eql([handler]);
    });

    it('registers one to many relational handler for a namespaced message type', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();

      const handler = sinon.stub();
      controller.registerHandler(NamespacedEvent, handler);
      expect(controller.getHandler(NamespacedEvent)).to.be.eql([handler]);
    });

    it('allows for registering multiple one to many relational handlers for same message type', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();

      const firstHandler = sinon.stub();
      const secondHandler = sinon.stub();
      controller.registerHandler(MyEvent, firstHandler);
      expect(() =>
        controller.registerHandler(MyEvent, secondHandler)
      ).to.not.throw(HandlerExistError);

      expect(controller.getHandler(MyEvent)).to.be.eql([
        firstHandler,
        secondHandler,
      ]);
    });
  });

  describe('handler overriding', () => {
    it('allows to override already registered one to many relational handler(s) for a message type', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();

      const handler = sinon.stub();
      const otherHandler = sinon.stub();
      controller.registerHandler(MyEvent, handler);
      expect(() =>
        controller.overrideHandler(MyEvent, otherHandler)
      ).to.not.throw(HandlerExistError);
      expect(controller.getHandler(MyEvent)).to.be.eql([otherHandler]);
    });
  });

  describe('evaluating handler(s)', () => {
    it('returns true if message type has registered handler(s)', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();

      controller.registerHandler(NamespacedEvent, sinon.stub());
      expect(controller.hasHandler(NamespacedEvent)).to.be.true;
    });

    it('returns false if message type has no registered handler(s)', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();
      expect(controller.hasHandler(NamespacedEvent)).to.be.false;
    });
  });

  describe('resolving handler(s)', () => {
    describe('getHandler', () => {
      it('throws InvalidMessageableType if provided value is not implementing Messageable interface', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        class InvalidType {}
        expect(() => controller.getHandler(InvalidType)).to.throw(
          InvalidMessageableType,
          `Type 'InvalidType' must implement Messageable interface`
        );
      });

      it('returns registered single handler for message type as an array with function', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(MyEvent, handler);
        expect(controller.getHandler(MyEvent)).to.be.eql([handler]);
      });

      it('returns registered single handler for namespaced message type as an array with function', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(NamespacedEvent, handler);
        expect(controller.getHandler(NamespacedEvent)).to.be.eql([handler]);
      });

      it('returns multiple handlers for message type as an array with functions', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const firstHandler = sinon.stub();
        const secondHandler = sinon.stub();
        controller.registerHandler(MyEvent, firstHandler);
        controller.registerHandler(MyEvent, secondHandler);
        expect(controller.getHandler(MyEvent)).to.be.eql([
          firstHandler,
          secondHandler,
        ]);
      });

      it('returns undefined for message type that does not have registered handler', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        expect(controller.getHandler(MyEvent)).to.be.equal(undefined);
      });
    });

    describe('getHandlerOrThrow', () => {
      it('throws InvalidMessageableType if provided value is not implementing Messageable interface', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        class InvalidType {}
        expect(() => controller.getHandlerOrThrow(InvalidType)).to.throw(
          InvalidMessageableType,
          `Type 'InvalidType' must implement Messageable interface`
        );
      });

      it('throws HandlerNotFoundError if there is no handler registered for provided message type', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        expect(() => controller.getHandlerOrThrow(MyEvent)).to.throw(
          HandlerNotFoundError,
          `MyController: handler for type 'MyEvent' can't be found`
        );
      });

      it('returns single handler for message type as an array with function', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(MyEvent, handler);
        expect(controller.getHandlerOrThrow(MyEvent)).to.be.eql([handler]);
      });

      it('returns multiple handlers for message type as an array with functions', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const firstHandler = sinon.stub();
        const secondHandler = sinon.stub();
        controller.registerHandler(MyEvent, firstHandler);
        controller.registerHandler(MyEvent, secondHandler);
        expect(controller.getHandlerOrThrow(MyEvent)).to.be.eql([
          firstHandler,
          secondHandler,
        ]);
      });

      it('returns single handler for namespaced message type as an array with function', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(NamespacedEvent, handler);
        expect(controller.getHandlerOrThrow(NamespacedEvent)).to.be.eql([
          handler,
        ]);
      });
    });

    describe('getTypeByHandler', () => {
      it('resolves message type by handler reference', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(MyEvent, sinon.stub());
        controller.registerHandler(MyEvent, handler);
        expect(controller.getTypeByHandler(handler)).to.be.equal(MyEvent);
      });

      it('resolves message type for bound handler reference', () => {
        class MyController extends OneToManyHandlingMixin {
          registerEventHandler(
            event: any,
            fn: Function,
            shouldOverride = false
          ): void {
            const handler = fn.bind(this);
            handler.original = fn;
            this.registerHandler(event, handler, shouldOverride);
          }
        }
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerEventHandler(NamespacedEvent, sinon.stub());
        controller.registerEventHandler(MyEvent, handler);
        expect(controller.getTypeByHandler(handler)).to.be.equal(MyEvent);
      });

      it('returns undefined for unregistered handler reference', () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        expect(controller.getTypeByHandler(handler)).to.be.undefined;
      });
    });
  });

  describe('manipulation', () => {
    it('removes handler for message type', () => {
      class MyController extends OneToManyHandlingMixin {}
      const controller = new MyController();

      controller.registerHandler(MyEvent, sinon.stub());
      expect(controller.hasHandler(MyEvent)).to.be.true;
      controller.removeHandler(MyEvent);
      expect(controller.hasHandler(MyEvent)).to.be.false;
    });
  });

  describe('handling', () => {
    describe('sequential', () => {
      it(`does not throws HandlerNotFoundError if handler for message type can't be found`, async () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        expect(
          controller.handle(event, 'sequential')
        ).to.eventually.not.be.rejectedWith(HandlerNotFoundError);
      });

      it('handles message type instance with single handler with implicit sequentially execution(default)', async () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(MyEvent, handler);

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await controller.handle(event);
        expect(handler).to.be.calledOnce;
        expect(handler).to.be.calledWithExactly(event);
      });

      it('handles message type instance with single handler with explicit sequential execution', async () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(MyEvent, handler);

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await controller.handle(event, 'sequential');
        expect(handler).to.be.calledOnce;
        expect(handler).to.be.calledWithExactly(event);
      });

      it('handles message type instance with multiple handlers sequentially', async () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const firstSpy = sinon.spy();
        const secondSpy = sinon.spy();
        const thirdSpy = sinon.spy();
        const firstHandler = async function(typeInstance): Promise<void> {
          await firstSpy(typeInstance);
        };
        const secondHandler = async function(typeInstance): Promise<void> {
          await secondSpy(typeInstance);
        };
        const thirdHandler = async function(typeInstance): Promise<void> {
          await thirdSpy(typeInstance);
        };

        controller.registerHandler(MyEvent, firstHandler);
        controller.registerHandler(MyEvent, secondHandler);
        controller.registerHandler(MyEvent, thirdHandler);

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await controller.handle(event, 'sequential');
        expect(firstSpy).to.be.calledOnce;
        expect(firstSpy).to.be.calledWithExactly(event);
        expect(secondSpy).to.be.calledOnce;
        expect(secondSpy).to.be.calledWithExactly(event);
        expect(thirdSpy).to.be.calledOnce;
        expect(thirdSpy).to.be.calledWithExactly(event);
        expect(firstSpy).to.be.calledBefore(secondSpy);
        expect(secondSpy).to.be.calledBefore(thirdSpy);
      });
    });

    describe('concurrent', () => {
      it(`does not throws HandlerNotFoundError if handler for message type can't be found`, async () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        expect(
          controller.handle(event, 'concurrent')
        ).to.eventually.not.be.rejectedWith(HandlerNotFoundError);
      });

      it('handles message type instance concurrently', async () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const firstSpy = sinon.spy();
        const secondSpy = sinon.spy();
        const delayedFirstHandler = async function(
          typeInstance
        ): Promise<void> {
          await delay(5);
          await firstSpy(typeInstance);
        };
        const secondHandler = async function(typeInstance): Promise<void> {
          await secondSpy(typeInstance);
        };

        controller.registerHandler(MyEvent, delayedFirstHandler);
        controller.registerHandler(MyEvent, secondHandler);

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await controller.handle(event, 'concurrent');

        expect(firstSpy).to.be.calledOnce;
        expect(firstSpy).to.be.calledWith(event);

        expect(secondSpy).to.be.calledOnce;
        expect(secondSpy).to.be.calledWith(event);
        expect(secondSpy).to.be.calledBefore(firstSpy);
      });

      it(`handles message type with concurrent handler execution in settled mode(multiple requests can be completed, regardless of their success or failure)`, async () => {
        class MyController extends OneToManyHandlingMixin {}
        const controller = new MyController();

        const error = new Error('my-error');

        const firstSpy = sinon.spy();
        const secondSpy = sinon.spy();
        const errorThrowingHandler = async function(
          typeInstance
        ): Promise<void> {
          if (typeInstance instanceof MyEvent) {
            throw error;
          }
          await firstSpy(typeInstance);
        };
        const secondHandler = async function(typeInstance): Promise<void> {
          await secondSpy(typeInstance);
        };

        controller.registerHandler(MyEvent, errorThrowingHandler);
        controller.registerHandler(MyEvent, secondHandler);

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await expect(controller.handle(event, 'concurrent')).to.be.rejectedWith(
          error
        );

        expect(firstSpy).to.not.be.calledOnce;

        expect(secondSpy).to.be.calledOnce;
        expect(secondSpy).to.be.calledWith(event);
        expect(secondSpy).to.be.calledBefore(firstSpy);
      });
    });
  });
});

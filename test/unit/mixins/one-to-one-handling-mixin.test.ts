import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { types } from '../../../src/types';
import { OneToOneHandlingMixin } from '../../../src/mixins/one-to-one-handling-mixin';
import { handle } from '../../../src/annotations/handle';
import { Message } from '../../../src/components/message';
import {
  UnhandleableTypeError,
  HandlerNotFoundError,
  HandlerExistError,
  InvalidHandlerError,
  InvalidMessageableType,
} from '../../../src/messaging/messaging-errors';
import { define } from '../../../src/decorators/define';
import { hasPostConstruct } from '../../../src/utils/helpers';
import { subscribe } from '../../../src/annotations/subscribe';
import { HandlingMixin } from '../../../src/mixins/handling-mixin';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('OneToOneHandlingMixin', function () {
  @define('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    key: string;
  }

  @define('Namespaced.Command', { isRegistrable: false })
  class NamespacedCommand extends Command<NamespacedCommand> {
    key: string;
  }

  @define('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    key: string;
  }

  it('extends HandlingMixin', () => {
    expect(OneToOneHandlingMixin.prototype).to.be.instanceof(HandlingMixin);
  });

  describe('construction', () => {
    it('ensures that controller can be initialized without handlers', () => {
      class MyController extends OneToOneHandlingMixin {}
      expect(() => new MyController()).to.not.throw(Error);
    });

    it('initializes with empty handlers as instance of map', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();
      expect(controller.getHandlers()).to.be.instanceof(Map);
      expect(controller.getHandlers()).to.be.empty;
    });

    it('initializes with empty handleable types as instance of array', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();
      expect(controller.getHandleableTypes()).to.be.instanceof(Array);
      expect(controller.getHandleableTypes()).to.be.eql([Message]);
    });
  });

  describe('initialization', () => {
    it('setups all handlers from handlers mapping method on initialization', () => {
      class MyController extends OneToOneHandlingMixin {
        MyCommandHandlerMethod(@handle command: MyCommand): boolean {
          return command.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.initialize();
      expect(controller.getHandlers()).to.be.instanceof(Map);
      const boundHandler = controller.getHandlers().get(MyCommand);
      expect(boundHandler).to.be.a('function');
    });

    it('ensure that handlers from handlers mapping are bound to the instance', () => {
      class MyController extends OneToOneHandlingMixin {
        MyCommandHandlerMethod(@handle command: MyCommand): boolean {
          return command.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.initialize();
      expect(controller.getHandlers()).to.be.instanceof(Map);
      const boundHandler = controller.getHandlers().get(MyCommand);
      expect(
        controller.MyCommandHandlerMethod === (boundHandler as any).original
      ).to.be.true; // Compare bound function to handler function
    });

    it('setups all handlers from subscribes mapping method on initialization', () => {
      class MyController extends OneToOneHandlingMixin {
        MyEventHandlerMethod(@subscribe event: MyEvent): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.initialize();
      expect(controller.getHandlers()).to.be.instanceof(Map);
      const boundHandler = controller.getHandlers().get(MyEvent);
      expect(boundHandler).to.be.a('function');
    });

    it('ensure that handlers from subscribes mapping are bound to the instance', () => {
      class MyController extends OneToOneHandlingMixin {
        MyEventHandlerMethod(@subscribe event: MyEvent): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.initialize();
      expect(controller.getHandlers()).to.be.instanceof(Map);
      const boundHandler = controller.getHandlers().get(MyEvent);
      expect(controller.MyEventHandlerMethod === (boundHandler as any).original)
        .to.be.true; // Compare bound function to handler function
    });

    it('annotates initializes as post construction method for Inversify', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();
      expect(hasPostConstruct(controller)).to.be.true;
    });
  });

  describe('handler registration', () => {
    it('throws UnhandleableTypeError if provided message type is not handleabe', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();

      class InvalidType {}
      expect(() =>
        controller.registerHandler(InvalidType as any, sinon.stub())
      ).to.throw(
        UnhandleableTypeError,
        'MyController: type must be one of: [Message]; got InvalidType'
      );
    });

    it('throws InvalidHandlerError if provided handler is not a function', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();

      expect(() =>
        controller.registerHandler(
          MyCommand,
          (undefined as any) as types.Handler
        )
      ).to.throw(
        InvalidHandlerError,
        `MyController: provided handler for 'MyCommand' must be a function, got undefined`
      );
    });

    it('throws HandlerExistsError if handler for a message type is already registered', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();

      controller.registerHandler(MyCommand, sinon.stub());
      expect(() =>
        controller.registerHandler(MyCommand, sinon.stub())
      ).to.throw(
        HandlerExistError,
        `MyController: handler for 'MyCommand' already exists`
      );
    });

    it('registers one to one relational handler for a message type', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();

      const handler = sinon.stub();
      controller.registerHandler(MyCommand, handler);
      expect(controller.getHandler(MyCommand)).to.be.equal(handler);
    });

    it('registers one to one relational handler for a namespaced type', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();

      const handler = sinon.stub();
      controller.registerHandler(NamespacedCommand, handler);
      expect(controller.getHandler(NamespacedCommand)).to.be.equal(handler);
    });
  });

  describe('override', () => {
    it('allows to override already registered one to one handler for a message type', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();

      const handler = sinon.stub();
      const otherHandler = sinon.stub();
      controller.registerHandler(MyCommand, handler);
      expect(() =>
        controller.overrideHandler(MyCommand, otherHandler)
      ).to.not.throw(HandlerExistError);
      expect(controller.getHandler(MyCommand)).to.be.equal(otherHandler);
    });
  });

  describe('evaluating handlers', () => {
    it('returns true if message type has a registered handler', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();

      controller.registerHandler(NamespacedCommand, sinon.stub());
      expect(controller.hasHandler(NamespacedCommand)).to.be.true;
    });

    it('returns false if message type has no registered handler', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();
      expect(controller.hasHandler(NamespacedCommand)).to.be.false;
    });
  });

  describe('resolving handler', () => {
    describe('getHandler', () => {
      it('throws InvalidMessageableType if provided value is not implementing Messageable interface', () => {
        class MyController extends OneToOneHandlingMixin {}
        const controller = new MyController();

        class InvalidType {}
        expect(() => controller.getHandler(InvalidType as any)).to.throw(
          InvalidMessageableType,
          `Type 'InvalidType' must implement Messageable interface`
        );
      });

      it('returns handler for message type as a function', () => {
        class MyController extends OneToOneHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(MyCommand, handler);
        expect(controller.getHandler(MyCommand)).to.be.equal(handler);
      });

      it('returns handler for namespaced message type as a function', () => {
        class MyController extends OneToOneHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(NamespacedCommand, handler);
        expect(controller.getHandler(NamespacedCommand)).to.be.equal(handler);
      });

      it('returns undefined for message type that does not have registered handler', () => {
        class MyController extends OneToOneHandlingMixin {}
        const controller = new MyController();

        expect(controller.getHandler(MyCommand)).to.be.equal(undefined);
      });
    });

    describe('getHandlerOrThrow', () => {
      it('throws InvalidMessageableType if provided value is not implementing Messageable interface', () => {
        class MyController extends OneToOneHandlingMixin {}
        const controller = new MyController();

        class InvalidType {}
        expect(() => controller.getHandlerOrThrow(InvalidType as any)).to.throw(
          InvalidMessageableType,
          `Type 'InvalidType' must implement Messageable interface`
        );
      });

      it('throws HandlerNotFoundError if there is no handler registered for provided message type', () => {
        class MyController extends OneToOneHandlingMixin {}
        const controller = new MyController();

        expect(() => controller.getHandlerOrThrow(MyCommand)).to.throw(
          HandlerNotFoundError,
          `MyController: handler for type 'MyCommand' can't be found`
        );
      });

      it('returns handler for message type as a function', () => {
        class MyController extends OneToOneHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(MyCommand, handler);
        expect(controller.getHandlerOrThrow(MyCommand)).to.be.equal(handler);
      });

      it('returns handler for namespaced message type as a function', () => {
        class MyController extends OneToOneHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(NamespacedCommand, handler);
        expect(controller.getHandlerOrThrow(NamespacedCommand)).to.be.equal(
          handler
        );
      });
    });

    describe('getTypeByHandler', () => {
      it('resolves message type by handler reference', () => {
        class MyController extends OneToOneHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerHandler(MyEvent, sinon.stub());
        controller.registerHandler(MyCommand, handler);
        expect(controller.getTypeByHandler(handler)).to.be.equal(MyCommand);
      });

      it('resolves message type for bound handler reference', () => {
        class MyController extends OneToOneHandlingMixin {
          registerCommandHandler(
            command: any,
            fn: Function,
            shouldOverride = false
          ): void {
            const handler = fn.bind(this);
            handler.original = fn;
            this.registerHandler(command, handler, shouldOverride);
          }
        }
        const controller = new MyController();

        const handler = sinon.stub();
        controller.registerCommandHandler(NamespacedCommand, sinon.stub());
        controller.registerCommandHandler(MyCommand, handler);
        expect(controller.getTypeByHandler(handler)).to.be.equal(MyCommand);
      });

      it('returns undefined for unregistered handler reference', () => {
        class MyController extends OneToOneHandlingMixin {}
        const controller = new MyController();

        const handler = sinon.stub();
        expect(controller.getTypeByHandler(handler)).to.be.undefined;
      });
    });
  });

  describe('manipulation', () => {
    it('removes handler for message type', () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();

      controller.registerHandler(MyCommand, sinon.stub());
      expect(controller.hasHandler(MyCommand)).to.be.true;
      controller.removeHandler(MyCommand);
      expect(controller.hasHandler(MyCommand)).to.be.false;
    });
  });

  describe('handling', () => {
    it(`throws HandlerNotFoundError if handler for message type can't be found`, async () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();

      const command = new MyCommand({ targetId: 'my-id', key: 'my-string' });
      expect(controller.handle(command)).to.eventually.be.rejectedWith(
        HandlerNotFoundError,
        `MyController: handler for type 'MyCommand' can't be found`
      );
    });

    it('handles message type instance with one to one relational handler', async () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();

      const handler = sinon.stub();
      controller.registerHandler(MyCommand, handler);

      const command = new MyCommand({ targetId: 'my-id', key: 'my-string' });
      await controller.handle(command);
      expect(handler).to.be.calledOnce;
      expect(handler).to.be.calledWithExactly(command);
    });

    it('ensures that result of handling one to one relational handler is returned back', async () => {
      class MyController extends OneToOneHandlingMixin {}
      const controller = new MyController();

      const handler = sinon.stub();
      const result = 'my-result';
      handler.returns(result);
      controller.registerHandler(MyCommand, handler);

      const command = new MyCommand({ targetId: 'my-id', key: 'my-string' });
      expect(await controller.handle(command)).to.be.equal(result);
    });
  });
});

import { expect, describe, it, vi } from 'vitest';

import { Type } from '@eveble/core';
import { derive, derived } from '@traits-ts/core';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { types } from '../../../src/types';
import { OneToOneHandlingTrait } from '../../../src/traits/one-to-one-handling.trait';
import { handle } from '../../../src/annotations/handle';
import { Message } from '../../../src/components/message';
import {
  UnhandleableTypeError,
  HandlerNotFoundError,
  HandlerExistError,
  InvalidHandlerError,
  InvalidMessageableType,
} from '../../../src/messaging/messaging-errors';
import { subscribe } from '../../../src/annotations/subscribe';
// import { HandlingTrait } from '../../../src/traits/handling.trait';
import { hasPostConstruct } from '../../../src/utils/inversify';
import { HandlingTrait } from '../../../src/traits/handling.trait';

describe('OneToOneHandlingTrait', () => {
  @Type('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    key: string;
  }

  @Type('Namespaced.Command', { isRegistrable: false })
  class NamespacedCommand extends Command<NamespacedCommand> {
    key: string;
  }

  @Type('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    key: string;
  }

  it(`has HandlingTrait in composition chain`, () => {
    class TestClass extends derive(OneToOneHandlingTrait) {}

    expect(derived(TestClass.prototype, HandlingTrait)).toBe(true);
  });

  describe('construction', () => {
    it('ensures that controller can be initialized without handlers', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      expect(() => new MyController()).not.toThrow(Error);
    });

    it('initializes with empty handlers as instance of map', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();
      expect(controller.getHandlers()).toBeInstanceOf(Map);
      expect(controller.getHandlers()).toHaveLength(0);
    });

    it('initializes with empty handleable types as instance of array', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();
      expect(controller.getHandleableTypes()).toBeInstanceOf(Array);
      expect(controller.getHandleableTypes()).toEqual([Message]);
    });
  });

  describe('initialization', () => {
    it('setups all handlers from handlers mapping method on initialization', () => {
      class MyController extends derive(OneToOneHandlingTrait) {
        MyCommandHandlerMethod(@handle command: MyCommand): boolean {
          return command.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.initialize();
      expect(controller.getHandlers()).toBeInstanceOf(Map);
      const boundHandler = controller.getHandlers().get(MyCommand);
      expect(boundHandler).toBeTypeOf('function');
    });

    it('ensure that handlers from handlers mapping are bound to the instance', () => {
      class MyController extends derive(OneToOneHandlingTrait) {
        MyCommandHandlerMethod(@handle command: MyCommand): boolean {
          return command.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.initialize();
      expect(controller.getHandlers()).toBeInstanceOf(Map);
      const boundHandler = controller.getHandlers().get(MyCommand);
      expect(
        controller.MyCommandHandlerMethod === (boundHandler as any).original
      ).toBe(true); // Compare bound function to handler function
    });

    it('setups all handlers from subscribes mapping method on initialization', () => {
      class MyController extends derive(OneToOneHandlingTrait) {
        MyEventHandlerMethod(@subscribe event: MyEvent): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.initialize();
      expect(controller.getHandlers()).toBeInstanceOf(Map);
      const boundHandler = controller.getHandlers().get(MyEvent);
      expect(boundHandler).toBeTypeOf('function');
    });

    it('ensure that handlers from subscribes mapping are bound to the instance', () => {
      class MyController extends derive(OneToOneHandlingTrait) {
        MyEventHandlerMethod(@subscribe event: MyEvent): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.initialize();
      expect(controller.getHandlers()).toBeInstanceOf(Map);
      const boundHandler = controller.getHandlers().get(MyEvent);
      expect(
        controller.MyEventHandlerMethod === (boundHandler as any).original
      ).toBe(true); // Compare bound function to handler function
    });

    it('annotates initializes as post construction method for Inversify', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      // const controller = new MyController();
      expect(hasPostConstruct(MyController)).toBe(true);
    });
  });

  describe('handler registration', () => {
    it('throws UnhandleableTypeError if provided message type is not handleabe', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();

      class InvalidType {}
      expect(() =>
        controller.registerHandler(InvalidType as any, vi.fn())
      ).toThrow(
        UnhandleableTypeError,
        'MyController: type must be one of: [Message]; got InvalidType'
      );
    });

    it('throws InvalidHandlerError if provided handler is not a function', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();

      expect(() =>
        controller.registerHandler(MyCommand, undefined as any as types.Handler)
      ).toThrow(
        InvalidHandlerError,
        `MyController: provided handler for 'MyCommand' must be a function, got undefined`
      );
    });

    it('throws HandlerExistsError if handler for a message type is already registered', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();

      controller.registerHandler(MyCommand, vi.fn());
      expect(() => controller.registerHandler(MyCommand, vi.fn())).toThrow(
        HandlerExistError,
        `MyController: handler for 'MyCommand' already exists`
      );
    });

    it('registers one to one relational handler for a message type', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();

      const handler = vi.fn();
      controller.registerHandler(MyCommand, handler);
      expect(controller.getHandler(MyCommand)).toBe(handler);
    });

    it('registers one to one relational handler for a namespaced type', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();

      const handler = vi.fn();
      controller.registerHandler(NamespacedCommand, handler);
      expect(controller.getHandler(NamespacedCommand)).toBe(handler);
    });
  });

  describe('override', () => {
    it('allows to override already registered one to one handler for a message type', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();

      const handler = vi.fn();
      const otherHandler = vi.fn();
      controller.registerHandler(MyCommand, handler);
      expect(() =>
        controller.overrideHandler(MyCommand, otherHandler)
      ).not.toThrow(HandlerExistError);
      expect(controller.getHandler(MyCommand)).toBe(otherHandler);
    });
  });

  describe('evaluating handlers', () => {
    it('returns true if message type has a registered handler', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();

      controller.registerHandler(NamespacedCommand, vi.fn());
      expect(controller.hasHandler(NamespacedCommand)).toBe(true);
    });

    it('returns false if message type has no registered handler', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();
      expect(controller.hasHandler(NamespacedCommand)).toBe(false);
    });
  });

  describe('resolving handler', () => {
    describe('getHandler', () => {
      it('throws InvalidMessageableType if provided value is not implementing Messageable interface', () => {
        class MyController extends derive(OneToOneHandlingTrait) {}
        const controller = new MyController();

        class InvalidType {}
        expect(() => controller.getHandler(InvalidType as any)).toThrow(
          InvalidMessageableType,
          `Type 'InvalidType' must implement Messageable interface`
        );
      });

      it('returns handler for message type as a function', () => {
        class MyController extends derive(OneToOneHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(MyCommand, handler);
        expect(controller.getHandler(MyCommand)).toBe(handler);
      });

      it('returns handler for namespaced message type as a function', () => {
        class MyController extends derive(OneToOneHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(NamespacedCommand, handler);
        expect(controller.getHandler(NamespacedCommand)).toBe(handler);
      });

      it('returns undefined for message type that does not have registered handler', () => {
        class MyController extends derive(OneToOneHandlingTrait) {}
        const controller = new MyController();

        expect(controller.getHandler(MyCommand)).toBe(undefined);
      });
    });

    describe('getHandlerOrThrow', () => {
      it('throws InvalidMessageableType if provided value is not implementing Messageable interface', () => {
        class MyController extends derive(OneToOneHandlingTrait) {}
        const controller = new MyController();

        class InvalidType {}
        expect(() => controller.getHandlerOrThrow(InvalidType as any)).toThrow(
          InvalidMessageableType,
          `Type 'InvalidType' must implement Messageable interface`
        );
      });

      it('throws HandlerNotFoundError if there is no handler registered for provided message type', () => {
        class MyController extends derive(OneToOneHandlingTrait) {}
        const controller = new MyController();

        expect(() => controller.getHandlerOrThrow(MyCommand)).toThrow(
          HandlerNotFoundError,
          `MyController: handler for type 'MyCommand' can't be found`
        );
      });

      it('returns handler for message type as a function', () => {
        class MyController extends derive(OneToOneHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(MyCommand, handler);
        expect(controller.getHandlerOrThrow(MyCommand)).toBe(handler);
      });

      it('returns handler for namespaced message type as a function', () => {
        class MyController extends derive(OneToOneHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(NamespacedCommand, handler);
        expect(controller.getHandlerOrThrow(NamespacedCommand)).toBe(handler);
      });
    });

    describe('getTypeByHandler', () => {
      it('resolves message type by handler reference', () => {
        class MyController extends derive(OneToOneHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(MyEvent, vi.fn());
        controller.registerHandler(MyCommand, handler);
        expect(controller.getTypeByHandler(handler)).toBe(MyCommand);
      });

      it('resolves message type for bound handler reference', () => {
        class MyController extends derive(OneToOneHandlingTrait) {
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

        const handler = vi.fn();
        controller.registerCommandHandler(NamespacedCommand, vi.fn());
        controller.registerCommandHandler(MyCommand, handler);
        expect(controller.getTypeByHandler(handler)).toBe(MyCommand);
      });

      it('returns undefined for unregistered handler reference', () => {
        class MyController extends derive(OneToOneHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        expect(controller.getTypeByHandler(handler)).toBeUndefined();
      });
    });
  });

  describe('manipulation', () => {
    it('removes handler for message type', () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();

      controller.registerHandler(MyCommand, vi.fn());
      expect(controller.hasHandler(MyCommand)).toBe(true);
      controller.removeHandler(MyCommand);
      expect(controller.hasHandler(MyCommand)).toBe(false);
    });
  });

  describe('handling', () => {
    it(`throws HandlerNotFoundError if handler for message type can't be found`, async () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();

      const command = new MyCommand({ targetId: 'my-id', key: 'my-string' });
      expect(controller.handle(command)).rejects.toThrow(
        HandlerNotFoundError,
        `MyController: handler for type 'MyCommand' can't be found`
      );
    });

    it('handles message type instance with one to one relational handler', async () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();

      const handler = vi.fn();
      controller.registerHandler(MyCommand, handler);

      const command = new MyCommand({ targetId: 'my-id', key: 'my-string' });
      await controller.handle(command);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(command);
    });

    it('ensures that result of handling one to one relational handler is returned back', async () => {
      class MyController extends derive(OneToOneHandlingTrait) {}
      const controller = new MyController();

      const handler = vi.fn();
      const result = 'my-result';
      handler.mockReturnValue(result);
      controller.registerHandler(MyCommand, handler);

      const command = new MyCommand({ targetId: 'my-id', key: 'my-string' });
      expect(await controller.handle(command)).toBe(result);
    });
  });
});

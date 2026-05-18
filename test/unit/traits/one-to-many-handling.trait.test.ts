import { expect, describe, it, vi } from 'vitest';

import delay from 'delay';
import { Type } from '@eveble/core';
import { derive, derived } from '@traits-ts/core';
import { Event } from '../../../src/components/event';
import { types } from '../../../src/types';
import { OneToManyHandlingTrait } from '../../../src/traits/one-to-many-handling.trait';
import { subscribe } from '../../../src/annotations/subscribe';
import { Message } from '../../../src/components/message';
import {
  UnhandleableTypeError,
  HandlerExistError,
  InvalidHandlerError,
  HandlerNotFoundError,
  InvalidMessageableType,
} from '../../../src/messaging/messaging-errors';
import { HandlingTrait } from '../../../src/traits/handling.trait';
import { hasPostConstruct } from '../../../src/utils/inversify';

describe('OneToManyHandlingTrait', () => {
  @Type('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    key: string;
  }

  @Type('Namespaced.Event', { isRegistrable: false })
  class NamespacedEvent extends Event<NamespacedEvent> {
    key: string;
  }

  it(`has HandlingTrait in composition chain`, () => {
    class TestClass extends derive(OneToManyHandlingTrait) {}

    expect(derived(TestClass.prototype, HandlingTrait)).toBe(true);
  });

  describe('construction', () => {
    it('ensures that controller can be initialized without handlers', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
      expect(() => new MyController()).not.toThrow(Error);
    });

    it('initializes with empty handlers as instance of map', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
      const controller = new MyController();
      expect(controller.getHandlers()).toBeInstanceOf(Map);
      expect(controller.getHandlers()).toHaveLength(0);
    });

    it('initializes with empty handleable types as instance of array', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
      const controller = new MyController();
      expect(controller.getHandleableTypes()).toBeInstanceOf(Array);
      expect(controller.getHandleableTypes()).toEqual([Message]);
    });
  });

  describe('initialization', () => {
    it('setups all handlers from subscribes mapping method on initialization', () => {
      class MyController extends derive(OneToManyHandlingTrait) {
        MyEventHandlerMethod(@subscribe event: MyEvent): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.initialize();
      expect(controller.getHandlers()).toBeInstanceOf(Map);
      const boundHandlers = controller.getHandlers().get(MyEvent) as Function[];
      expect(boundHandlers).toBeInstanceOf(Array);
      expect(boundHandlers).toHaveLength(1);
      expect(boundHandlers[0]).toBeInstanceOf(Function);
    });

    it('ensure that handlers from subscribes mapping are bound to the instance', () => {
      class MyController extends derive(OneToManyHandlingTrait) {
        MyEventHandlerMethod(@subscribe event: MyEvent): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.initialize();
      expect(controller.getHandlers()).toBeInstanceOf(Map);
      const boundHandlers = controller.getHandlers().get(MyEvent) as Function[];
      expect(
        controller.MyEventHandlerMethod === (boundHandlers[0] as any).original
      ).toBe(true); // Compare bound function to handler function
    });

    it('annotates initializes as post construction method for Inversify', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
      expect(hasPostConstruct(MyController)).toBe(true);
    });
  });

  describe('handler registration', () => {
    it('throws UnhandleableTypeError if provided message type is not handleabe', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
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
      class MyController extends derive(OneToManyHandlingTrait) {}
      const controller = new MyController();

      expect(() =>
        controller.registerHandler(MyEvent, undefined as any as types.Handler)
      ).toThrow(
        InvalidHandlerError,
        `MyController: provided handler for 'MyEvent' must be a function, got undefined`
      );
    });

    it('registers one to many relational handler for a message type', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
      const controller = new MyController();

      const handler = vi.fn();
      controller.registerHandler(MyEvent, handler);
      expect(controller.getHandler(MyEvent)).toEqual([handler]);
    });

    it('registers one to many relational handler for a namespaced message type', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
      const controller = new MyController();

      const handler = vi.fn();
      controller.registerHandler(NamespacedEvent, handler);
      expect(controller.getHandler(NamespacedEvent)).toEqual([handler]);
    });

    it('allows for registering multiple one to many relational handlers for same message type', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
      const controller = new MyController();

      const firstHandler = vi.fn();
      const secondHandler = vi.fn();
      controller.registerHandler(MyEvent, firstHandler);
      expect(() =>
        controller.registerHandler(MyEvent, secondHandler)
      ).not.toThrow(HandlerExistError);

      expect(controller.getHandler(MyEvent)).toEqual([
        firstHandler,
        secondHandler,
      ]);
    });
  });

  describe('handler overriding', () => {
    it('allows to override already registered one to many relational handler(s) for a message type', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
      const controller = new MyController();

      const handler = vi.fn();
      const otherHandler = vi.fn();
      controller.registerHandler(MyEvent, handler);
      expect(() =>
        controller.overrideHandler(MyEvent, otherHandler)
      ).not.toThrow(HandlerExistError);
      expect(controller.getHandler(MyEvent)).toEqual([otherHandler]);
    });
  });

  describe('evaluating handler(s)', () => {
    it('returns true if message type has registered handler(s)', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
      const controller = new MyController();

      controller.registerHandler(NamespacedEvent, vi.fn());
      expect(controller.hasHandler(NamespacedEvent)).toBe(true);
    });

    it('returns false if message type has no registered handler(s)', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
      const controller = new MyController();
      expect(controller.hasHandler(NamespacedEvent)).toBe(false);
    });
  });

  describe('resolving handler(s)', () => {
    describe('getHandler', () => {
      it('throws InvalidMessageableType if provided value is not implementing Messageable interface', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        class InvalidType {}
        expect(() => controller.getHandler(InvalidType as any)).toThrow(
          InvalidMessageableType,
          `Type 'InvalidType' must implement Messageable interface`
        );
      });

      it('returns registered single handler for message type as an array with function', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(MyEvent, handler);
        expect(controller.getHandler(MyEvent)).toEqual([handler]);
      });

      it('returns registered single handler for namespaced message type as an array with function', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(NamespacedEvent, handler);
        expect(controller.getHandler(NamespacedEvent)).toEqual([handler]);
      });

      it('returns multiple handlers for message type as an array with functions', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const firstHandler = vi.fn();
        const secondHandler = vi.fn();
        controller.registerHandler(MyEvent, firstHandler);
        controller.registerHandler(MyEvent, secondHandler);
        expect(controller.getHandler(MyEvent)).toEqual([
          firstHandler,
          secondHandler,
        ]);
      });

      it('returns undefined for message type that does not have registered handler', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        expect(controller.getHandler(MyEvent)).toBe(undefined);
      });
    });

    describe('getHandlerOrThrow', () => {
      it('throws InvalidMessageableType if provided value is not implementing Messageable interface', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        class InvalidType {}
        expect(() => controller.getHandlerOrThrow(InvalidType as any)).toThrow(
          InvalidMessageableType,
          `Type 'InvalidType' must implement Messageable interface`
        );
      });

      it('throws HandlerNotFoundError if there is no handler registered for provided message type', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        expect(() => controller.getHandlerOrThrow(MyEvent)).toThrow(
          HandlerNotFoundError,
          `MyController: handler for type 'MyEvent' can't be found`
        );
      });

      it('returns single handler for message type as an array with function', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(MyEvent, handler);
        expect(controller.getHandlerOrThrow(MyEvent)).toEqual([handler]);
      });

      it('returns multiple handlers for message type as an array with functions', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const firstHandler = vi.fn();
        const secondHandler = vi.fn();
        controller.registerHandler(MyEvent, firstHandler);
        controller.registerHandler(MyEvent, secondHandler);
        expect(controller.getHandlerOrThrow(MyEvent)).toEqual([
          firstHandler,
          secondHandler,
        ]);
      });

      it('returns single handler for namespaced message type as an array with function', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(NamespacedEvent, handler);
        expect(controller.getHandlerOrThrow(NamespacedEvent)).toEqual([
          handler,
        ]);
      });
    });

    describe('getTypeByHandler', () => {
      it('resolves message type by handler reference', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(MyEvent, vi.fn());
        controller.registerHandler(MyEvent, handler);
        expect(controller.getTypeByHandler(handler)).toBe(MyEvent);
      });

      it('resolves message type for bound handler reference', () => {
        class MyController extends derive(OneToManyHandlingTrait) {
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

        const handler = vi.fn();
        controller.registerEventHandler(NamespacedEvent, vi.fn());
        controller.registerEventHandler(MyEvent, handler);
        expect(controller.getTypeByHandler(handler)).toBe(MyEvent);
      });

      it('returns undefined for unregistered handler reference', () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        expect(controller.getTypeByHandler(handler)).toBeUndefined();
      });
    });
  });

  describe('manipulation', () => {
    it('removes handler for message type', () => {
      class MyController extends derive(OneToManyHandlingTrait) {}
      const controller = new MyController();

      controller.registerHandler(MyEvent, vi.fn());
      expect(controller.hasHandler(MyEvent)).toBe(true);
      controller.removeHandler(MyEvent);
      expect(controller.hasHandler(MyEvent)).toBe(false);
    });
  });

  describe('handling', () => {
    describe('sequential', () => {
      it(`does not throws HandlerNotFoundError if handler for message type can't be found`, async () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await expect(
          controller.handle(event, 'sequential')
        ).resolves.toBeUndefined();
      });

      it('handles message type instance with single handler with implicit sequentially execution(default)', async () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(MyEvent, handler);

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await controller.handle(event);
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(event);
      });

      it('handles message type instance with single handler with explicit sequential execution', async () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const handler = vi.fn();
        controller.registerHandler(MyEvent, handler);

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await controller.handle(event, 'sequential');
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(event);
      });

      it('handles message type instance with multiple handlers sequentially', async () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const firstSpy = vi.fn();
        const secondSpy = vi.fn();
        const thirdSpy = vi.fn();
        const firstHandler = async function (typeInstance): Promise<void> {
          await firstSpy(typeInstance);
        };
        const secondHandler = async function (typeInstance): Promise<void> {
          await secondSpy(typeInstance);
        };
        const thirdHandler = async function (typeInstance): Promise<void> {
          await thirdSpy(typeInstance);
        };

        controller.registerHandler(MyEvent, firstHandler);
        controller.registerHandler(MyEvent, secondHandler);
        controller.registerHandler(MyEvent, thirdHandler);

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await controller.handle(event, 'sequential');
        expect(firstSpy).toHaveBeenCalledTimes(1);
        expect(firstSpy).toHaveBeenCalledWith(event);
        expect(secondSpy).toHaveBeenCalledTimes(1);
        expect(secondSpy).toHaveBeenCalledWith(event);
        expect(thirdSpy).toHaveBeenCalledTimes(1);
        expect(thirdSpy).toHaveBeenCalledWith(event);
        expect(firstSpy).toHaveBeenCalled(); expect(secondSpy).toHaveBeenCalled(); /* TODO: verify call order */;
        expect(secondSpy).toHaveBeenCalled(); expect(thirdSpy).toHaveBeenCalled(); /* TODO: verify call order */;
      });
    });

    describe('concurrent', () => {
      it(`does not throws HandlerNotFoundError if handler for message type can't be found`, async () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await expect(
          controller.handle(event, 'concurrent')
        ).resolves.toBeUndefined();
      });

      it('handles message type instance concurrently', async () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const firstSpy = vi.fn();
        const secondSpy = vi.fn();
        const delayedFirstHandler = async function (
          typeInstance
        ): Promise<void> {
          await delay(5);
          await firstSpy(typeInstance);
        };
        const secondHandler = async function (typeInstance): Promise<void> {
          await secondSpy(typeInstance);
        };

        controller.registerHandler(MyEvent, delayedFirstHandler);
        controller.registerHandler(MyEvent, secondHandler);

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await controller.handle(event, 'concurrent');

        expect(firstSpy).toHaveBeenCalledTimes(1);
        expect(firstSpy).toHaveBeenCalledWith(event);

        expect(secondSpy).toHaveBeenCalledTimes(1);
        expect(secondSpy).toHaveBeenCalledWith(event);
        expect(secondSpy).toHaveBeenCalled(); expect(firstSpy).toHaveBeenCalled(); /* TODO: verify call order */;
      });

      it(`handles message type with concurrent handler execution in settled mode(multiple requests can be completed, regardless of their success or failure)`, async () => {
        class MyController extends derive(OneToManyHandlingTrait) {}
        const controller = new MyController();

        const error = new Error('my-error');

        const firstSpy = vi.fn();
        const secondSpy = vi.fn();
        const errorThrowingHandler = async function (
          typeInstance
        ): Promise<void> {
          if (typeInstance instanceof MyEvent) {
            throw error;
          }
          await firstSpy(typeInstance);
        };
        const secondHandler = async function (typeInstance): Promise<void> {
          await secondSpy(typeInstance);
        };

        controller.registerHandler(MyEvent, errorThrowingHandler);
        controller.registerHandler(MyEvent, secondHandler);

        const event = new MyEvent({ sourceId: 'my-id', key: 'my-string' });
        await expect(controller.handle(event, 'concurrent')).rejects.toThrow(
          error
        );

        expect(firstSpy).not.toHaveBeenCalled();

        expect(secondSpy).toHaveBeenCalledTimes(1);
        expect(secondSpy).toHaveBeenCalledWith(event);
        expect(secondSpy).toHaveBeenCalled(); /* TODO: verify call order */;
      });
    });
  });
});


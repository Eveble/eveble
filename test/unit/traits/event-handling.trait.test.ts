import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi } from 'vitest';

import { Type } from '@eveble/core';
import { derive, derived } from '@traits-ts/core';
import { EventHandlingTrait } from '../../../src/traits/event-handling.trait';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { subscribe } from '../../../src/annotations/subscribe';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { handle } from '../../../src/annotations/handle';
import { UnhandleableTypeError } from '../../../src/messaging/messaging-errors';
import { OneToManyHandlingTrait } from '../../../src/traits/one-to-many-handling.trait';

describe(`EventHandlingTrait`, () => {
  let injector: types.Injector;
  let eventBus: any;

  beforeEach(() => {
    eventBus = mock<types.EventBus>();
    injector = new Injector();
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
  });

  @Type('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    key: string;
  }

  @Type('MyOtherEvent', { isRegistrable: false })
  class MyOtherEvent extends Event<MyOtherEvent> {
    key: string;
  }

  @Type('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    key: string;
  }
  it(`has OneToManyHandlingTrait in composition chain`, () => {
    class TestClass extends derive(EventHandlingTrait) {}

    expect(derived(TestClass.prototype, OneToManyHandlingTrait)).toBe(true);
  });

  it(`has OneToManyHandlingTrait in composition chain`, () => {
    class TestClass extends derive(EventHandlingTrait) {}

    expect(derived(TestClass.prototype, OneToManyHandlingTrait)).toBe(true);
  });

  describe('construction', () => {
    it(`initializes with empty handled events`, () => {
      class MyController extends derive(EventHandlingTrait) {}

      const controller = new MyController();
      expect(controller.getHandledEvents()).toEqual([]);
    });
  });

  describe('getters', () => {
    it('aliases getHandledEvents with getSubscribedEvents for expressive api', () => {
      class MyController extends derive(EventHandlingTrait) {}

      const controller = new MyController();
      controller.getHandledEvents = vi.fn();
      (controller.getHandledEvents as any).mockReturnValue([MyEvent]);

      expect(controller.getSubscribedEvents()).toEqual([MyEvent]);
      expect(controller.getHandledEvents).toHaveBeenCalledTimes(1);
    });
  });

  describe('initialization', () => {
    it('sets handler for events with dedicated registration method on initialization', () => {
      class MyController extends derive(EventHandlingTrait) {
        MyEvent(@subscribe event: MyEvent): boolean {
          return event.key === 'my-string';
        }

        MyOtherEvent(@subscribe event: MyOtherEvent): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.registerEventHandler = vi.fn();
      injector.injectInto(controller);

      expect(controller.registerEventHandler).toHaveBeenCalledTimes(2);
      expect(controller.registerEventHandler).toHaveBeenCalledWith(
        MyEvent,
        controller.MyEvent
      );
      expect(controller.registerEventHandler).toHaveBeenCalledWith(
        MyOtherEvent,
        controller.MyOtherEvent
      );
    });

    it('overrides initialize method from OneToOneHandlingTrait thus not initializing command handlers mappings', () => {
      class MyController extends derive(EventHandlingTrait) {
        MyCommand(@handle event: MyCommand): boolean {
          return event.key === 'my-string';
        }
      }
      const controller = new MyController();
      controller.registerHandler = vi.fn();
      controller.initialize();
      expect(controller.registerHandler).not.toHaveBeenCalled;
    });

    it(`throws UnhandleableTypeError upon types not subclassing from Command defined as handlers`, () => {
      class MyController extends derive(EventHandlingTrait) {
        subscribes(): Map<types.MessageType<any>, types.Handler> {
          return new Map([[MyCommand, vi.fn()]]);
        }
      }
      const controller = new MyController();
      expect(() => controller.initialize()).toThrow(
        UnhandleableTypeError,
        `MyController: type must be one of: [Event]; got MyCommand`
      );
    });
  });

  describe('registration', () => {
    it('throws UnhandleableTypeError upon registering non event type', () => {
      class MyController extends derive(EventHandlingTrait) {}
      const controller = new MyController();
      expect(() => {
        controller.registerEventHandler(MyCommand as any, vi.fn());
      }).toThrow(
        UnhandleableTypeError,
        'MyController: type must be one of: [Event]; got MyCommand'
      );
    });

    it(`registers event handler`, () => {
      const handler = vi.fn();
      class MyController extends derive(EventHandlingTrait) {}
      const controller = new MyController();
      injector.injectInto(controller);
      controller.registerHandler = vi.fn();

      controller.registerEventHandler(MyEvent, handler);
      expect(controller.registerHandler).toHaveBeenCalledTimes(1);
    });

    it(`registers handler on instance with bound handler`, () => {
      const handler = vi.fn();
      class MyController extends derive(EventHandlingTrait) {}
      const controller = new MyController();
      const registerHandler = vi.spyOn(controller, 'registerHandler');
      injector.injectInto(controller);

      controller.registerEventHandler(MyEvent, handler);
      expect(registerHandler).toHaveBeenCalledTimes(1);
      expect(registerHandler.mock.calls[0][0]).toBe(MyEvent);
      expect(
        Object.create(handler.prototype) instanceof
          registerHandler.mock.calls[0][1]
      ).toBe(true); // Compare bound function to handler function example
      expect(registerHandler.mock.calls[0][2]).toBe(false); // Flag shouldOverride set by default to false
    });

    it(`registers handler on EventBus with bound handler`, () => {
      const handler = vi.fn();
      class MyController extends derive(EventHandlingTrait) {}
      const controller = new MyController();
      injector.injectInto(controller);

      controller.registerEventHandler(MyEvent, handler);
      expect(eventBus.subscribeTo).toHaveBeenCalledTimes(1);
      expect(eventBus.subscribeTo.mock.calls[0][0]).toBe(MyEvent);
      expect(
        Object.create(handler.prototype) instanceof
          eventBus.subscribeTo.mock.calls[0][1]
      ).toBe(true); // Compare bound function to handler function example
      expect(eventBus.subscribeTo.mock.calls[0][2]).toBe(false); // Flag shouldOverride set by default to false
    });

    it(`ensures that context of registered handler on EventBus is bound to instance`, () => {
      eventBus.handlers = new Map();
      eventBus.subscribeTo = function (event, handler): void {
        this.handlers.set(event, handler);
      };

      class MyController extends derive(EventHandlingTrait) {
        dependency: any;

        MyEvent(event: MyEvent): void {
          return this.dependency(event);
        }
      }
      const controller = new MyController();
      controller.dependency = vi.fn();
      controller.eventBus = eventBus;

      controller.registerEventHandler(MyEvent, controller.MyEvent);
      const eventInstance = new MyEvent({
        sourceId: 'my-source-id',
        key: 'my-key',
      });
      eventBus.handlers.get(MyEvent)(eventInstance);
      expect(controller.dependency).toHaveBeenCalledTimes(1);
      expect(controller.dependency).toHaveBeenCalledWith(eventInstance);
    });
    describe('subscribeTo', () => {
      it('aliases registerEventHandler with expressive subscribeTo', () => {
        class MyController extends derive(EventHandlingTrait) {}
        const controller = new MyController();
        controller.registerEventHandler = vi.fn();

        const handler = vi.fn();
        controller.subscribeTo(MyEvent, handler, true);
        expect(controller.registerEventHandler).toHaveBeenCalledTimes(1);
        expect(controller.registerEventHandler).toHaveBeenCalledWith(
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
        class MyController extends derive(EventHandlingTrait) {}
        const controller = new MyController();
        controller.handle = vi.fn();

        const eventInstance = new MyEvent({
          sourceId: 'my-source-id',
          key: 'my-key',
        });
        controller.on(eventInstance);
        expect(controller.handle).toHaveBeenCalledTimes(1);
        expect(controller.handle).toHaveBeenCalledWith(eventInstance);
      });
    });
  });

  describe('event publishing', () => {
    it(`allows to publish event through event bus`, async () => {
      class MyController extends derive(EventHandlingTrait) {}
      const controller = new MyController();
      injector.injectInto(controller);

      const eventInstance = new MyEvent({
        sourceId: 'my-source-id',
        key: 'my-key',
      });
      await controller.publish(eventInstance);
      expect(eventBus.publish).toHaveBeenCalledTimes(1);
      expect(eventBus.publish).toHaveBeenCalledWith(eventInstance);
    });
  });
});

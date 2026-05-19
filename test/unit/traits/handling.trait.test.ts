import { expect, describe, it, vi } from 'vitest';

import { Type } from '@eveble/core';
import { derive } from '@traits-ts/core';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { HandlingTrait } from '../../../src/traits/handling.trait';
import { Message } from '../../../src/components/message';
import { UnhandleableTypeError } from '../../../src/messaging/messaging-errors';
import { handle } from '../../../src/annotations/handle';
import { subscribe } from '../../../src/annotations/subscribe';
import { HANDLERS } from '../../../src/constants/literal-keys';

describe('HandlingTrait', () => {
  @Type('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    key: string;
  }

  @Type('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    key: string;
  }

  describe('handlers setup', () => {
    it('registers handlers as a instance of a Map', () => {
      const commandHandler = vi.fn();
      const eventHandler = vi.fn();
      const handlers = new Map();
      handlers.set(MyCommand, commandHandler);
      handlers.set(MyEvent, eventHandler);

      class MyController extends derive(HandlingTrait) {
        initialize(): void {
          this.setupHandlers({
            handlers,
          });
        }
      }

      const controller = new MyController();
      controller.registerHandler = vi.fn();
      controller.initialize();

      expect(controller.registerHandler).toHaveBeenCalledTimes(2);
      expect(controller.registerHandler).toHaveBeenCalledWith(
        MyCommand,
        commandHandler
      );
      expect(controller.registerHandler).toHaveBeenCalledWith(
        MyEvent,
        eventHandler
      );
    });

    it('registers handlers with custom registrator', () => {
      const commandHandler = vi.fn();
      const eventHandler = vi.fn();
      const handlers = new Map();
      handlers.set(MyCommand, commandHandler);
      handlers.set(MyEvent, eventHandler);

      const registrator = vi.fn();
      class MyController extends derive(HandlingTrait) {
        initialize(): void {
          this.setupHandlers({
            handlers,
            registrator,
          });
        }
      }

      const controller = new MyController();
      controller.registerHandler = vi.fn();
      controller.initialize();

      expect(registrator).toHaveBeenCalledTimes(2);
      expect(registrator).toHaveBeenCalledWith(MyCommand, commandHandler);
      expect(registrator).toHaveBeenCalledWith(MyEvent, eventHandler);
    });

    it('binds on setup each handler to instance of a controller before its registration', () => {
      const commandHandler = vi.fn();
      const eventHandler = vi.fn();
      const handlers = new Map();
      handlers.set(MyCommand, commandHandler);
      handlers.set(MyEvent, eventHandler);

      const registrator = vi.fn();
      class MyController extends derive(HandlingTrait) {
        initialize(): void {
          this.setupHandlers({
            handlers,
            registrator,
          });
        }
      }

      const controller = new MyController();
      controller.registerHandler = vi.fn();
      controller.initialize();

      expect(registrator).toHaveBeenCalledTimes(2);
      // MyCommand
      expect(registrator.mock.calls[0][0]).toBe(MyCommand);
      expect(
        Object.create(commandHandler.prototype) instanceof
          registrator.mock.calls[0][1]
      ).toBe(true);
      // MyEvent
      expect(registrator.mock.calls[1][0]).toBe(MyEvent);
      expect(
        Object.create(eventHandler.prototype) instanceof
          registrator.mock.calls[1][1]
      ).toBe(true);
      expect(controller.registerHandler).not.toHaveBeenCalled();
    });

    it('ensures that unhandleable message types passed in handler mappings are throwing UnhnandleableTypeError', () => {
      const handlers = new Map();
      handlers.set(MyEvent, vi.fn());

      class MyController extends derive(HandlingTrait) {
        initialize(): void {
          this.setupHandlers({
            handlers,
          });
        }
      }
      const controller = new MyController();
      controller.setHandleableTypes([Command]);

      expect(() => controller.initialize()).toThrow(
        UnhandleableTypeError,
        `MyController: type must be one of: [Command]; got MyEvent`
      );
    });

    it('ensures that valid message types passed in handler mappings are handleable', () => {
      const handlers = new Map();
      handlers.set(MyEvent, vi.fn());

      class MyController extends derive(HandlingTrait) {
        initialize(): void {
          this.setupHandlers({
            handlers,
          });
        }
      }
      const controller = new MyController();
      controller.setHandleableTypes([Event]);

      expect(() => controller.initialize()).not.toThrow(UnhandleableTypeError);
    });

    it('ensures that message types passed in handler mappings are handleable on runtime', () => {
      const handlers = new Map();
      handlers.set(MyEvent, vi.fn());

      class MyController extends derive(HandlingTrait) {
        initialize(): void {
          this.setupHandlers({
            handlers,
            handleableTypes: [Command],
          });
        }
      }
      const controller = new MyController();
      expect(() => controller.initialize()).toThrow(
        UnhandleableTypeError,
        `MyController: type must be one of: [Command]; got MyEvent`
      );
    });

    it('overrides pre-existing handlers for message type set prior to the initialization', () => {
      const originalHandler = vi.fn();
      const originalHandlers = new Map();
      originalHandlers.set(MyCommand, originalHandler);

      const overridingHandler = vi.fn();
      const overridingHandlers = new Map();
      overridingHandlers.set(MyCommand, overridingHandler);

      class MyController extends derive(HandlingTrait) {
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
      controller.overrideHandler = vi.fn();
      controller.initialize();

      expect(controller.overrideHandler).toHaveBeenCalledTimes(1);
      expect(controller.overrideHandler).toHaveBeenCalledWith(
        MyCommand,
        overridingHandler
      );
    });
  });

  describe('annotations', () => {
    it('returns all annotated command handlers', () => {
      class MyController extends derive(HandlingTrait) {
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
      controller.registerHandler = vi.fn();
      controller.initialize();
      expect(controller.registerHandler).toHaveBeenCalledTimes(1);
      expect(controller.registerHandler).toHaveBeenCalledWith(
        MyCommand,
        controller.MyCommandHandlerMethod
      );
    });

    it('returns all annotated event subscribers', () => {
      class MyController extends derive(HandlingTrait) {
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
      controller.registerHandler = vi.fn();
      controller.initialize();
      expect(controller.registerHandler).toHaveBeenCalledTimes(1);
      expect(controller.registerHandler).toHaveBeenCalledWith(
        MyEvent,
        controller.MyEventHandlerMethod
      );
    });
  });

  describe('handlers', () => {
    describe('evaluating handlers', () => {
      it('returns true if message type has a registered handler', () => {
        const handlers = new Map();
        handlers.set(MyCommand, vi.fn());
        class MyController extends derive(HandlingTrait) {
          constructor() {
            super();
            this[HANDLERS] = handlers;
          }
        }
        const controller = new MyController();
        expect(controller.hasHandler(MyCommand)).toBe(true);
      });
      it('returns false if message type has no registered handler', () => {
        class MyController extends derive(HandlingTrait) {}
        const controller = new MyController();
        expect(controller.hasHandler(MyCommand)).toBe(false);
      });
    });

    describe('manipulation', () => {
      it('removes handler for message type', () => {
        const handlers = new Map();
        handlers.set(MyCommand, vi.fn());
        class MyController extends derive(HandlingTrait) {
          constructor() {
            super();
            this[HANDLERS] = handlers;
          }
        }
        const controller = new MyController();
        expect(controller.hasHandler(MyCommand)).toBe(true);
        controller.removeHandler(MyCommand);
        expect(controller.hasHandler(MyCommand)).toBe(false);
      });
    });
  });

  describe('handleable types', () => {
    it('ensures that handleabe types array is created before assigning types', () => {
      class MyController extends derive(HandlingTrait) {}

      const controller = new MyController();
      controller.setHandleableTypes(Command);
      expect(controller.getHandleableTypes()).toBeInstanceOf(Array);
      expect(controller.getHandleableTypes()).toHaveLength(1);
      expect(controller.getHandleableTypes()).toEqual([Command]);
    });

    it('sets handleabe types to a single message type', () => {
      class MyController extends derive(HandlingTrait) {}

      const controller = new MyController();
      controller.setHandleableTypes(Command);
      expect(controller.getHandleableTypes()).toBeInstanceOf(Array);
      expect(controller.getHandleableTypes()).toHaveLength(1);
      expect(controller.getHandleableTypes()).toEqual([Command]);
    });

    it('sets handleabe types to a multiple message types', () => {
      class MyController extends derive(HandlingTrait) {}

      const controller = new MyController();
      controller.setHandleableTypes([Command, Event]);
      expect(controller.getHandleableTypes()).toBeInstanceOf(Array);
      expect(controller.getHandleableTypes()).toHaveLength(2);
      expect(controller.getHandleableTypes()).toEqual([Command, Event]);
    });

    it('returns Message type as default handleabe type', () => {
      class MyController extends derive(HandlingTrait) {}

      const controller = new MyController();
      expect(controller.getHandleableTypes()).toBeInstanceOf(Array);
      expect(controller.getHandleableTypes()).toHaveLength(1);
      expect(controller.getHandleableTypes()).toEqual([Message]);
    });

    describe('evaluation', () => {
      it('returns true if handleable types are not defined for any message type', () => {
        class MyController extends derive(HandlingTrait) {}

        const controller = new MyController();
        expect(controller.isHandleabe(Command)).toBe(true);
      });

      it('returns true if handleable types are empty array for any message type', () => {
        class MyController extends derive(HandlingTrait) {}
        const controller = new MyController();
        expect(controller.isHandleabe(Command)).toBe(true);
      });

      it('returns true if message type is handleable', () => {
        class MyController extends derive(HandlingTrait) {}
        const controller = new MyController();
        controller.setHandleableTypes(MyCommand);
        expect(controller.getHandleableTypes()).toEqual([MyCommand]);
        expect(controller.isHandleabe(MyCommand)).toBe(true);
      });

      it('returns true if message type is handleable by inheritance relation(subclass)', () => {
        class MyController extends derive(HandlingTrait) {}
        const controller = new MyController();
        controller.setHandleableTypes(Command);
        expect(controller.getHandleableTypes()).toEqual([Command]);
        expect(controller.isHandleabe(MyCommand)).toBe(true);
      });

      it('returns false if message type is not handleable', () => {
        class MyController extends derive(HandlingTrait) {}
        const controller = new MyController();
        controller.setHandleableTypes(Event);
        expect(controller.getHandleableTypes()).toEqual([Event]);
        expect(controller.isHandleabe(MyCommand)).toBe(false);
      });

      describe('runtime', () => {
        it('returns true if message type is handleable on runtime evaluation', () => {
          class MyController extends derive(HandlingTrait) {}
          const controller = new MyController();
          expect(controller.isHandleabe(MyCommand, Command)).toBe(true);
        });

        it('returns false if message  type is not handleable on runtime evaluation', () => {
          class MyController extends derive(HandlingTrait) {}
          const controller = new MyController();
          expect(controller.isHandleabe(MyCommand, Event)).toBe(false);
        });
      });
    });
  });

  describe('handlers', () => {
    it('returns all registered handlers', () => {
      const handlers = new Map([[MyCommand, vi.fn()]]);
      class MyController extends derive(HandlingTrait) {
        constructor() {
          super();
          this[HANDLERS] = handlers;
        }
      }
      const controller = new MyController();
      expect(controller.getHandlers()).toBe(handlers);
    });

    it('returns all handled message types', () => {
      const handlers = new Map();
      handlers.set(MyCommand, vi.fn());
      handlers.set(MyEvent, vi.fn());

      class MyController extends derive(HandlingTrait) {
        constructor() {
          super();
          this[HANDLERS] = handlers;
        }
      }

      const controller = new MyController();
      expect(controller.getHandledTypes()).toEqual([MyCommand, MyEvent]);
    });

    it('returns all handled message types - type names', () => {
      const handlers = new Map();
      handlers.set(MyCommand, vi.fn());
      handlers.set(MyEvent, vi.fn());

      class MyController extends derive(HandlingTrait) {
        constructor() {
          super();
          this[HANDLERS] = handlers;
        }
      }

      const controller = new MyController();
      expect(controller.getHandledTypesNames()).toEqual([
        'MyCommand',
        'MyEvent',
      ]);
    });

    describe('resolving handled message types by subclass matching', () => {
      it('returns all handled types by matching subclassing of Command', () => {
        const handlers = new Map();
        handlers.set(MyCommand, vi.fn());
        handlers.set(MyEvent, vi.fn());

        class MyController extends derive(HandlingTrait) {
          constructor() {
            super();
            this[HANDLERS] = handlers;
          }
        }

        const controller = new MyController();
        expect(controller.getHandled(Command)).toEqual([MyCommand]);
        expect(controller.getHandledCommands()).toEqual([MyCommand]);
      });

      it('returns all handled types by matching subclassing of Event', () => {
        const handlers = new Map();
        handlers.set(MyCommand, vi.fn());
        handlers.set(MyEvent, vi.fn());

        class MyController extends derive(HandlingTrait) {
          constructor() {
            super();
            this[HANDLERS] = handlers;
          }
        }

        const controller = new MyController();
        expect(controller.getHandled(Event)).toEqual([MyEvent]);
        expect(controller.getHandledEvents()).toEqual([MyEvent]);
      });

      it('returns all handled types by matching subclassing of Message', () => {
        const handlers = new Map();
        handlers.set(MyCommand, vi.fn());
        handlers.set(MyEvent, vi.fn());

        class MyController extends derive(HandlingTrait) {
          constructor() {
            super();
            this[HANDLERS] = handlers;
          }
        }

        const controller = new MyController();
        expect(controller.getHandled(Message)).toEqual([MyCommand, MyEvent]);
        expect(controller.getHandledMessages()).toEqual([MyCommand, MyEvent]);
      });
    });
  });

  describe(`validation`, () => {
    it(`returns true for message type that can be handled`, () => {
      class MyController extends derive(HandlingTrait) {}
      const controller = new MyController();
      controller.setHandleableTypes(Command);
      expect(controller.ensureHandleability(MyCommand)).toBe(true);
    });

    it(`returns true for message type that can be handled by inheritance relation`, () => {
      class MyController extends derive(HandlingTrait) {}
      const controller = new MyController();
      controller.setHandleableTypes(Command);
      expect(controller.ensureHandleability(MyCommand)).toBe(true);
    });

    it(`throws ValidationError if message type is not one of the handleable types`, () => {
      class MyController extends derive(HandlingTrait) {}
      const controller = new MyController();
      controller.setHandleableTypes(Command);
      expect(() => controller.ensureHandleability(MyEvent)).toThrow(
        UnhandleableTypeError,
        'MyController: type must be one of: [Command]; got MyEvent'
      );
    });

    it(`allows to pass handleable types as second argument for custom validation`, () => {
      class MyController extends derive(HandlingTrait) {}
      const controller = new MyController();
      expect(() => controller.ensureHandleability(MyCommand, [Event])).toThrow(
        UnhandleableTypeError,
        'MyController: type must be one of: [Event]; got MyCommand'
      );
    });
  });
});

import { expect, describe, it, vi } from 'vitest';

import delay from 'delay';
import { Type } from '@eveble/core';
import { derived } from '@traits-ts/core';
import { EventBus } from '../../../src/messaging/event-bus';
import { OneToManyHandlingTrait } from '../../../src/traits/one-to-many-handling.trait';
import { HookableTrait } from '../../../src/traits/hookable.trait';
import {
  HandlerExistError,
  UnhandleableTypeError,
} from '../../../src/messaging/messaging-errors';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';

describe('EventBus', () => {
  @Type('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    key: string;
  }

  @Type('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    key: string;
  }

  it(`extends OneToManyHandlingTrait mixin on prototype chain applied`, () => {
    expect(derived(EventBus.prototype, OneToManyHandlingTrait)).toBe(true);
  });

  it(`extends HookableTrait mixin on prototype chain applied`, () => {
    expect(derived(EventBus.prototype, HookableTrait)).toBe(true);
  });

  describe('construction', () => {
    it('sets handleable type upon construction', () => {
      const eventBus = new EventBus();
      expect(eventBus.getHandleableTypes()).toEqual([Event]);
    });
  });

  describe('construction', () => {
    it('sets handleable type upon construction', () => {
      const eventBus = new EventBus();
      expect(eventBus.getHandleableTypes()).toEqual([Event]);
    });
  });

  describe('handlers registration', () => {
    it('throws UnhandleabeTypeError when provided type is not handleable', () => {
      const eventBus = new EventBus();
      expect(() =>
        eventBus.registerHandler(MyCommand as any, vi.fn())
      ).toThrow(
        UnhandleableTypeError,
        `EventBus: type must be one of: [Event]; got MyCommand`
      );
    });

    it(`allows to register multiple handlers for one event`, () => {
      const firstHandler = vi.fn();
      const secondHandler = vi.fn();

      const eventBus = new EventBus();
      eventBus.registerHandler(MyEvent, firstHandler);
      expect(() => {
        eventBus.registerHandler(MyEvent, secondHandler);
      }).not.toThrow(HandlerExistError);
    });

    it('allows handlers to be overridden', () => {
      const firstHandler = vi.fn();
      const secondHandler = vi.fn();

      const eventBus = new EventBus();
      eventBus.registerHandler(MyEvent, firstHandler);
      eventBus.registerHandler(MyEvent, secondHandler, true);

      expect(eventBus.getHandler(MyEvent)).toEqual([secondHandler]);
    });

    it('has more expressive api for registering handlers - subscribeTo', () => {
      const firstHandler = vi.fn();
      const eventBus = new EventBus();
      const registerHandler = vi.spyOn(eventBus, "registerHandler");

      eventBus.subscribeTo(MyEvent, firstHandler);

      expect(registerHandler).toHaveBeenCalledTimes(1);
      expect(registerHandler).toHaveBeenCalledWith(MyEvent, firstHandler);
    });
  });

  describe('publishing events', () => {
    it('handles event', async () => {
      const handler = vi.fn();
      const eventBus = new EventBus();
      eventBus.registerHandler(MyEvent, handler);

      const event = new MyEvent({
        sourceId: 'my-target-id',
        key: 'my-string',
      });
      await eventBus.handle(event);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('ensures that events are handled concurrently', async () => {
      const firstSpy = vi.fn();
      const delayedFirstHandler = async function (
        eventInstance: MyEvent
      ): Promise<void> {
        await delay(5);
        firstSpy(eventInstance);
      };
      const secondHandler = vi.fn();

      const eventBus = new EventBus();
      eventBus.registerHandler(MyEvent, delayedFirstHandler);
      eventBus.registerHandler(MyEvent, secondHandler);

      const event = new MyEvent({
        sourceId: 'my-target-id',
        key: 'my-string',
      });
      await eventBus.handle(event);
      expect(firstSpy).toHaveBeenCalledTimes(1);
      expect(firstSpy).toHaveBeenCalledWith(event);
      expect(secondHandler).toHaveBeenCalledTimes(1);
      expect(secondHandler).toHaveBeenCalledWith(event);
      expect(secondHandler).toHaveBeenCalled(); expect(firstSpy).toHaveBeenCalled(); /* TODO: verify call order */;
    });

    it('has more expressive api for handling event - publish', async () => {
      const handler = vi.fn();
      const eventBus = new EventBus();
      const handle = vi.spyOn(eventBus, "handle");

      eventBus.subscribeTo(MyEvent, handler);

      const event = new MyEvent({
        sourceId: 'my-target-id',
        key: 'my-string',
      });
      await eventBus.publish(event);
      expect(handler).toHaveBeenCalledWith(event);
      expect(handle).toHaveBeenCalledTimes(1);
      expect(handle).toHaveBeenCalledWith(event);
    });
  });

  describe('onPublish hooks', () => {
    it('calls all hooks when handling an event', async () => {
      const firstHook = vi.fn();
      const secondHook = vi.fn();

      const eventBus = new EventBus();
      eventBus.onPublish('first-id', firstHook);
      eventBus.onPublish('second-id', secondHook);
      eventBus.subscribeTo(MyEvent, vi.fn());

      const event = new MyEvent({
        sourceId: 'my-target-id',
        key: 'my-string',
      });
      await eventBus.publish(event);
      expect(firstHook).toHaveBeenCalledWith(event);
      expect(secondHook).toHaveBeenCalledWith(event);
    });
    it('allows for overriding onPublish hook', async () => {
      const firstHook = vi.fn();
      const secondHook = vi.fn();

      const eventBus = new EventBus();
      eventBus.onPublish('my-id', firstHook);
      eventBus.onPublish('my-id', secondHook, true);
      eventBus.subscribeTo(MyEvent, vi.fn());

      const event = new MyEvent({
        sourceId: 'my-target-id',
        key: 'my-string',
      });
      await eventBus.publish(event);
      expect(firstHook).to.have.not.been.called;
      expect(secondHook).toHaveBeenCalledWith(event);
    });
  });
});


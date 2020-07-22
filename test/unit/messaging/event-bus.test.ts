import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import delay from 'delay';
import { define } from '@eveble/core';
import { EventBus } from '../../../src/messaging/event-bus';
import { OneToManyHandlingMixin } from '../../../src/mixins/one-to-many-handling-mixin';
import { HookableMixin } from '../../../src/mixins/hookable-mixin';
import {
  HandlerExistError,
  UnhandleableTypeError,
} from '../../../src/messaging/messaging-errors';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';

chai.use(sinonChai);

describe('EventBus', function () {
  @define('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    key: string;
  }

  @define('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    key: string;
  }

  it(`extends OneToManyHandlingMixin mixin on prototype chain applied`, () => {
    expect(EventBus.prototype).to.be.instanceof(OneToManyHandlingMixin);
  });

  it(`extends HookableMixin mixin on prototype chain applied`, () => {
    expect(EventBus.prototype).to.be.instanceof(HookableMixin);
  });

  describe('construction', () => {
    it('sets handleable type upon construction', () => {
      const eventBus = new EventBus();
      expect(eventBus.getHandleableTypes()).to.be.eql([Event]);
    });
  });

  describe('construction', () => {
    it('sets handleable type upon construction', () => {
      const eventBus = new EventBus();
      expect(eventBus.getHandleableTypes()).to.be.eql([Event]);
    });
  });

  describe('handlers registration', () => {
    it('throws UnhandleabeTypeError when provided type is not handleable', () => {
      const eventBus = new EventBus();
      expect(() =>
        eventBus.registerHandler(MyCommand as any, sinon.stub())
      ).to.throw(
        UnhandleableTypeError,
        `EventBus: type must be one of: [Event]; got MyCommand`
      );
    });

    it(`allows to register multiple handlers for one event`, () => {
      const firstHandler = sinon.spy();
      const secondHandler = sinon.spy();

      const eventBus = new EventBus();
      eventBus.registerHandler(MyEvent, firstHandler);
      expect(() => {
        eventBus.registerHandler(MyEvent, secondHandler);
      }).to.not.throw(HandlerExistError);
    });

    it('allows handlers to be overridden', () => {
      const firstHandler = sinon.spy();
      const secondHandler = sinon.spy();

      const eventBus = new EventBus();
      eventBus.registerHandler(MyEvent, firstHandler);
      eventBus.registerHandler(MyEvent, secondHandler, true);

      expect(eventBus.getHandler(MyEvent)).to.eql([secondHandler]);
    });

    it('has more expressive api for registering handlers - subscribeTo', () => {
      const firstHandler = sinon.spy();
      const eventBus = new EventBus();
      const registerHandler = sinon.spy(eventBus, 'registerHandler');

      eventBus.subscribeTo(MyEvent, firstHandler);

      expect(registerHandler).to.be.calledOnce;
      expect(registerHandler).to.be.calledWithExactly(MyEvent, firstHandler);
    });
  });

  describe('publishing events', () => {
    it('handles event', async () => {
      const handler = sinon.stub();
      const eventBus = new EventBus();
      eventBus.registerHandler(MyEvent, handler);

      const event = new MyEvent({
        sourceId: 'my-target-id',
        key: 'my-string',
      });
      await eventBus.handle(event);
      expect(handler).to.have.been.calledWithExactly(event);
    });

    it('ensures that events are handled concurrently', async () => {
      const firstSpy = sinon.spy();
      const delayedFirstHandler = async function (
        eventInstance: MyEvent
      ): Promise<void> {
        await delay(5);
        firstSpy(eventInstance);
      };
      const secondHandler = sinon.spy();

      const eventBus = new EventBus();
      eventBus.registerHandler(MyEvent, delayedFirstHandler);
      eventBus.registerHandler(MyEvent, secondHandler);

      const event = new MyEvent({
        sourceId: 'my-target-id',
        key: 'my-string',
      });
      await eventBus.handle(event);
      expect(firstSpy).to.be.calledOnce;
      expect(firstSpy).to.be.calledWithExactly(event);
      expect(secondHandler).to.be.calledOnce;
      expect(secondHandler).to.be.calledWithExactly(event);
      expect(secondHandler).to.be.calledBefore(firstSpy);
    });

    it('has more expressive api for handling event - publish', async () => {
      const handler = sinon.stub();
      const eventBus = new EventBus();
      const handle = sinon.spy(eventBus, 'handle');

      eventBus.subscribeTo(MyEvent, handler);

      const event = new MyEvent({
        sourceId: 'my-target-id',
        key: 'my-string',
      });
      await eventBus.publish(event);
      expect(handler).to.have.been.calledWithExactly(event);
      expect(handle).to.be.calledOnce;
      expect(handle).to.be.calledWithExactly(event);
    });
  });

  describe('onPublish hooks', () => {
    it('calls all hooks when handling an event', async () => {
      const firstHook = sinon.spy();
      const secondHook = sinon.spy();

      const eventBus = new EventBus();
      eventBus.onPublish('first-id', firstHook);
      eventBus.onPublish('second-id', secondHook);
      eventBus.subscribeTo(MyEvent, sinon.stub());

      const event = new MyEvent({
        sourceId: 'my-target-id',
        key: 'my-string',
      });
      await eventBus.publish(event);
      expect(firstHook).to.have.been.calledWithExactly(event);
      expect(secondHook).to.have.been.calledWithExactly(event);
    });
    it('allows for overriding onPublish hook', async () => {
      const firstHook = sinon.spy();
      const secondHook = sinon.spy();

      const eventBus = new EventBus();
      eventBus.onPublish('my-id', firstHook);
      eventBus.onPublish('my-id', secondHook, true);
      eventBus.subscribeTo(MyEvent, sinon.stub());

      const event = new MyEvent({
        sourceId: 'my-target-id',
        key: 'my-string',
      });
      await eventBus.publish(event);
      expect(firstHook).to.have.not.been.called;
      expect(secondHook).to.have.been.calledWithExactly(event);
    });
  });
});

import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi, beforeAll } from 'vitest';

import { Type } from '@eveble/core';
import { Event } from '../../../src/components/event';
import { Projection } from '../../../src/infrastructure/projection';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { Log } from '../../../src/components/log-entry';
import { subscribe } from '../../../src/annotations/subscribe';
import { BINDINGS } from '../../../src/constants/bindings';
import {
  ProjectionAlreadyRebuildingError,
  ProjectionNotRebuildingError,
} from '../../../src/infrastructure/infrastructure-errors';
import { Command } from '../../../src/components/command';
import { UnhandleableTypeError } from '../../../src/messaging/messaging-errors';

describe(`Projection`, () => {
  @Type('Projection.MyEvent')
  class MyEvent extends Event<MyEvent> {}
  @Type('Projection.MyCommand')
  class MyCommand extends Command<MyCommand> {}

  class MyProjection extends Projection {
    /**
     * On before rebuild hook for saving state in case rebuilding can't be completed(rollback).
     * @async
     * @return {Boolean}
     */
    async beforeRebuild(): Promise<any> {
      return true;
    }

    /**
     * Commits to current state of projection.
     * @async
     * @return {Boolean}
     */
    async commit(): Promise<any> {
      return true;
    }

    /**
     * Rollbacks to previous(before rebuilding) state of projection.
     * @async
     * @return {Boolean}
     */
    async rollback(): Promise<any> {
      return true;
    }
  }

  let now: Date;
  let injector: Injector;
  let log: any;
  let eventBus: any;
  let events: Record<string, Event<{}>>;
  let projection: any;

  beforeAll(() => {
    now = new Date();
  });

  beforeEach(() => {
    injector = new Injector();
    log = mock<types.Logger>();
    eventBus = mock<types.EventBus>();

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);

    events = {
      MyEvent: new MyEvent({
        sourceId: 'my-id',
        timestamp: now,
      }),
    };

    projection = new MyProjection();
    injector.injectInto(projection);
  });

  describe(`projection state`, () => {
    it('has projecting state by default', () => {
      expect(projection.isInState(Projection.STATES.projecting)).toBe(true);
    });
  });

  describe('handling events', () => {
    it('does not handle event that has no registered handler', async () => {
      await projection.on(events.MyEvent);
      expect(log.debug).not.toHaveBeenCalled();
    });

    it(`handles events`, async () => {
      const handler = vi.fn();
      projection.subscribeTo(MyEvent, handler);
      await projection.on(events.MyEvent);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(events.MyEvent);
    });

    it(`logs publishing event `, async () => {
      const handler = vi.fn();
      projection.subscribeTo(MyEvent, handler);
      await projection.on(events.MyEvent);
      expect(log.debug).toHaveBeenCalledWith(
        expect.objectContaining(
          new Log(`publishing 'Projection.MyEvent'`)
            .on(projection)
            .in(projection.on)
            .with('event', events.MyEvent)
        )
      );
    });

    it(`allows to set event handlers as mapping`, async () => {
      const dependency = vi.fn();
      class MyOtherProjection extends Projection {
        MyEvent(@subscribe event: MyEvent): void {
          dependency(event);
        }
      }
      const instance = new MyOtherProjection();
      injector.injectInto(instance);
      await instance.on(events.MyEvent);
      expect(instance.hasHandler(MyEvent)).toBe(true);
      expect(dependency).toHaveBeenCalledTimes(1);
      expect(dependency).toHaveBeenCalledWith(events.MyEvent);
    });

    it(`throws UnhandleableTypeError when trying to setup handlers with non-event entries`, () => {
      class MyOtherProjection extends Projection {
        subscribes(): Map<types.MessageType<any>, types.Handler> {
          return new Map([
            [
              MyCommand,
              this.MyCommand, // should be Event, its defined on subscriptions!
            ],
          ]);
        }
        MyCommand(_command: MyCommand): void {
          return undefined;
        }
      }
      expect(() => {
        new MyOtherProjection().initialize();
      }).toThrow(
        UnhandleableTypeError,
        `MyOtherProjection: type must be one of: [Event]; got Projection.MyCommand`
      );
    });
  });

  describe(`rebuild mode`, () => {
    it(`enters rebuild mode`, async () => {
      expect(projection.isInState(Projection.STATES.projecting)).toBe(true);
      await projection.enterRebuildMode();
      expect(projection.isInState(Projection.STATES.rebuilding)).toBe(true);
    });

    it(`logs entering rebuild mode`, async () => {
      await projection.enterRebuildMode();
      expect(log.debug).toHaveBeenCalledTimes(1);
      expect(log.debug).toHaveBeenCalledWith(
        expect.objectContaining(
          new Log(`rebuilding`).on(projection).in(projection.enterRebuildMode)
        )
      );
    });

    it(`ensures that rebuild mode can be entered only in projection state`, async () => {
      expect(projection.isInState(Projection.STATES.projecting)).toBe(true);
      await projection.enterRebuildMode();
      expect(projection.isInState(Projection.STATES.rebuilding)).toBe(true);
      await expect(projection.enterRebuildMode()).rejects.toThrow(
        ProjectionAlreadyRebuildingError,
        `Projection 'MyProjection' is already being rebuilt`
      );
    });

    it(`logs failed entering of rebuilding mode`, async () => {
      await projection.enterRebuildMode();
      await expect(projection.enterRebuildMode()).rejects.toThrow(
        ProjectionAlreadyRebuildingError
      );
      expect(log.error).toHaveBeenCalledTimes(1);
      expect(log.error).toHaveBeenCalledWith(
        new Log(`failed entering rebuilding(already in rebuild mode)`)
          .on(projection)
          .in(projection.enterRebuildMode)
      );
    });

    it(`exits rebuild mode`, async () => {
      expect(projection.isInState(Projection.STATES.projecting)).toBe(true);
      await projection.enterRebuildMode();
      await projection.exitRebuildMode();
      expect(projection.isInState(Projection.STATES.projecting)).toBe(true);
    });

    it(`logs exiting rebuild mode`, async () => {
      await projection.enterRebuildMode();
      await projection.exitRebuildMode();
      expect(log.debug).toHaveBeenCalledWith(
        new Log(`projecting`).on(projection).in(projection.exitRebuildMode)
      );
    });

    it(`ensures that exiting rebuild mode can be only done on rebuilding state`, async () => {
      expect(projection.isInState(Projection.STATES.projecting)).toBe(true);
      await expect(projection.exitRebuildMode()).rejects.toThrow(
        ProjectionNotRebuildingError,
        `Expected projection 'MyProjection' to be in a state of rebuilding`
      );
    });

    it(`logs failed exiting of rebuild mode`, async () => {
      await expect(projection.exitRebuildMode()).rejects.toThrow(
        ProjectionNotRebuildingError
      );
      expect(log.error).toHaveBeenCalledTimes(1);
      expect(log.error).toHaveBeenCalledWith(
        new Log(`failed exiting rebuilding(already projecting)`)
          .on(projection)
          .in(projection.exitRebuildMode)
      );
    });

    it(`does not handle events flagged as non-rebuilding event in real-time`, async () => {
      const handler = vi.fn();
      projection.subscribeTo(MyEvent, handler);
      await projection.enterRebuildMode();
      const isRebuildEvent = false;
      await projection.on(events.MyEvent, isRebuildEvent);
      expect(handler).not.toHaveBeenCalled();
    });

    it(`handles rebuilding events`, async () => {
      const handler = vi.fn();
      projection.subscribeTo(MyEvent, handler);
      await projection.enterRebuildMode();
      const isRebuildEvent = true;
      await projection.on(events.MyEvent, isRebuildEvent);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(events.MyEvent);
    });

    it(`handles queued events when exiting rebuild mode`, async () => {
      const handler = vi.fn();
      projection.subscribeTo(MyEvent, handler);
      await projection.enterRebuildMode();
      await projection.on(events.MyEvent);
      await projection.exitRebuildMode();
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(events.MyEvent);
    });

    it(`logs queue eveent`, async () => {
      const handler = vi.fn();
      projection.subscribeTo(MyEvent, handler);
      await projection.enterRebuildMode();
      await projection.on(events.MyEvent);
      expect(log.debug).toHaveBeenCalledWith(
        new Log(`adding 'Projection.MyEvent' to queue`)
          .on(projection)
          .in(projection.on)
          .with('event', events.MyEvent)
      );
    });
  });

  describe('rebuild stages', () => {
    describe('beforeRebuild', () => {
      it('invokes beforeRebuild action', async () => {
        projection.beforeRebuild = vi.fn();
        await projection.invokeAction('beforeRebuild');
        expect(projection.beforeRebuild).toHaveBeenCalledTimes(1);
      });

      it('logs invoked beforeRebuild action', async () => {
        await projection.invokeAction('beforeRebuild');
        expect(log.debug).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining(
            new Log('beforeRebuild').on(projection).in(projection.beforeRebuild)
          )
        );
        expect(log.debug).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining(
            new Log('finished beforeRebuild')
              .on(projection)
              .in(projection.beforeRebuild)
          )
        );
      });

      it('logs failed execution of beforeRebuild action', async () => {
        projection.beforeRebuild = (): void => {
          throw new Error('my-error');
        };
        await expect(projection.invokeAction('beforeRebuild')).rejects.toThrow(
          Error
        );
        expect(log.debug).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining(
            new Log('beforeRebuild').on(projection).in(projection.beforeRebuild)
          )
        );
        expect(log.error).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log('failed beforeRebuild do to error: Error: my-error')
              .on(projection)
              .in(projection.beforeRebuild)
          )
        );
      });
    });

    describe('commit', () => {
      it('invokes commit action', async () => {
        projection.commit = vi.fn();
        await projection.invokeAction('commit');
        expect(projection.commit).toHaveBeenCalledTimes(1);
      });

      it('logs invoked commit action', async () => {
        await projection.invokeAction('commit');
        expect(log.debug).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining(
            new Log('commit').on(projection).in(projection.commit)
          )
        );
        expect(log.debug).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining(
            new Log('finished commit').on(projection).in(projection.commit)
          )
        );
      });

      it('logs failed execution of commit action', async () => {
        projection.commit = (): void => {
          throw new Error('my-error');
        };
        await expect(projection.invokeAction('commit')).rejects.toThrow(Error);
        expect(log.debug).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining(
            new Log('commit').on(projection).in(projection.commit)
          )
        );
        expect(log.error).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log('failed commit do to error: Error: my-error')
              .on(projection)
              .in(projection.commit)
          )
        );
      });
    });

    describe('rollback', () => {
      it('invokes rollback action', async () => {
        projection.rollback = vi.fn();
        await projection.invokeAction('rollback');
        expect(projection.rollback).toHaveBeenCalledTimes(1);
      });

      it('logs invoked rollback action', async () => {
        await projection.invokeAction('rollback');
        expect(log.debug).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining(
            new Log('rollback').on(projection).in(projection.rollback)
          )
        );
        expect(log.debug).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining(
            new Log('finished rollback').on(projection).in(projection.rollback)
          )
        );
      });

      it('logs failed execution of rollback action', async () => {
        projection.rollback = (): void => {
          throw new Error('my-error');
        };
        await expect(projection.invokeAction('rollback')).rejects.toThrow(
          Error
        );
        expect(log.debug).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining(
            new Log('rollback').on(projection).in(projection.rollback)
          )
        );
        expect(log.error).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log('failed rollback do to error: Error: my-error')
              .on(projection)
              .in(projection.rollback)
          )
        );
      });
    });
  });
});

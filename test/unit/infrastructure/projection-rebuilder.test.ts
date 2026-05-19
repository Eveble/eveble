import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi } from 'vitest';

import { Type } from '@eveble/core';
import { Event } from '../../../src/components/event';
import { Projection } from '../../../src/infrastructure/projection';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import {
  RebuildingResult,
  ProjectionRebuilder,
} from '../../../src/infrastructure/projection-rebuilder';
import { Log } from '../../../src/components/log-entry';
import { ProjectionAlreadyRebuildingError } from '../../../src/infrastructure/infrastructure-errors';

describe(`ProjectionRebuilder`, () => {
  @Type('ProjectionRebuilder.MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    value: string;
  }

  class FirstProjection extends Projection {
    public MyEvent(_event: MyEvent): void {
      return undefined;
    }

    public async beforeRebuild(): Promise<any> {
      return true;
    }

    public async commit(): Promise<any> {
      return true;
    }

    public async rollback(): Promise<any> {
      return true;
    }
  }

  class SecondProjection extends Projection {
    public MyEvent(_event: MyEvent): void {
      return undefined;
    }

    public async beforeRebuild(): Promise<any> {
      return true;
    }

    public async commit(): Promise<any> {
      return true;
    }

    public async rollback(): Promise<any> {
      return true;
    }
  }

  class ThirdProjection extends Projection {
    public MyEvent(_event: MyEvent): void {
      return undefined;
    }

    public async beforeRebuild(): Promise<any> {
      return true;
    }

    public async commit(): Promise<any> {
      return true;
    }

    public async rollback(): Promise<any> {
      return true;
    }
  }

  let injector: Injector;
  let log: any;
  let commitStore: any;
  let eventBus: any;
  let projections: any[];
  let rebuilder: ProjectionRebuilder;

  beforeEach(async () => {
    injector = new Injector();

    log = mock<types.Logger>();
    commitStore = mock<types.CommitStore>();
    eventBus = mock<types.EventBus>();

    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector
      .bind<types.CommitStore>(BINDINGS.CommitStore)
      .toConstantValue(commitStore);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);

    // Projections
    projections = [
      new FirstProjection(),
      new SecondProjection(),
      new ThirdProjection(),
    ];

    // Spies
    const projectionSpiedMethods = ['enterRebuildMode', 'exitRebuildMode'];
    for (const projection of projections) {
      for (const methodName of projectionSpiedMethods) {
        vi.spyOn(projection, methodName as any);
      }
    }
    // Stubs
    const projectionStubbedMethods = [
      'beforeRebuild',
      'commit',
      'rollback',
      'MyEvent',
    ];
    for (const projection of projections) {
      for (const methodName of projectionStubbedMethods) {
        vi.spyOn(projection, methodName as any);
      }
      projection.registerHandler(MyEvent, projection.MyEvent);
    }
    commitStore.getAllEvents.mockReturnValue([]);

    // Projection initialization
    for (const projection of projections) {
      await injector.injectIntoAsync(projection);
    }

    // Rebuilder
    rebuilder = new ProjectionRebuilder();
    injector.injectInto(rebuilder);
  });

  it('logs start of rebuilding process', async () => {
    await rebuilder.rebuild(projections);
    expect(log.info).toHaveBeenCalledWith(
      new Log(
        `rebuilding projections: 'FirstProjection, SecondProjection, ThirdProjection'`
      )
        .on(rebuilder)
        .in(rebuilder.rebuild)
    );
  });

  describe('successful rebuild', () => {
    const firstEvent = new MyEvent({
      sourceId: 'my-id',
      value: 'first-value',
    });
    const secondEvent = new MyEvent({
      sourceId: 'my-id',
      value: 'second-value',
    });

    describe('single projection id', () => {
      it('rebuilds the projection using historical events', async () => {
        commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);

        const result = await rebuilder.rebuild([projections[0]]);
        expect(result).toBeInstanceOf(RebuildingResult);
        expect(result.duration).toBeTypeOf('number');
        expect(result.message).toBe(
          `finished rebuilding 'FirstProjection' in ${result.duration}ms`
        );
        expect(result.projectionsNames).toEqual(['FirstProjection']);
      });

      it('logs rebuilding the projection using historical events', async () => {
        commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);

        const result = await rebuilder.rebuild([projections[0]]);

        expect(log.info).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log(
              `finished rebuilding 'FirstProjection' in ${result.duration}ms`
            )
              .on(rebuilder)
              .in(rebuilder.rebuild)
          )
        );
      });

      it('rebuilds multiple projections using historical events', async () => {
        commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);
        const projectionsNames = [
          'FirstProjection',
          'SecondProjection',
          'ThirdProjection',
        ];
        const result = await rebuilder.rebuild(projections);
        expect(result).toBeInstanceOf(RebuildingResult);
        expect(result.duration).toBeTypeOf('number');
        expect(result.message).toBe(
          `finished rebuilding 'FirstProjection, SecondProjection, ThirdProjection' in ${result.duration}ms`
        );
        expect(result.projectionsNames).toEqual(projectionsNames);
      });

      it('logs rebuilding multiple projections using historical events', async () => {
        commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);
        const result = await rebuilder.rebuild(projections);

        expect(log.info).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log(
              `finished rebuilding 'FirstProjection, SecondProjection, ThirdProjection' in ${result.duration}ms`
            )
              .on(rebuilder)
              .in(rebuilder.rebuild)
          )
        );
      });

      it('enters rebuild mode on projection before rebuilding', async () => {
        commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);
        const projection = projections[0];
        await rebuilder.rebuild([projection]);

        expect(projection.enterRebuildMode).toHaveBeenCalledTimes(1);
        expect(projection.enterRebuildMode).toHaveBeenCalledBefore(
          projection.beforeRebuild
        );
      });

      it('runs projection beforeRebuild hook for preparations before rebuilding', async () => {
        commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);
        const projection = projections[0];
        await rebuilder.rebuild([projection]);

        expect(projection.beforeRebuild).toHaveBeenCalledTimes(1);
        expect(projection.beforeRebuild).toHaveBeenCalledBefore(
          commitStore.getAllEvents
        );
      });

      it('handles events from commit store on projection(rebuilding)', async () => {
        commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);
        await rebuilder.rebuild(projections);

        expect(log.debug).toHaveBeenCalledWith(
          expect.objectContaining(
            new Log(`publishing events on projections`)
              .on(rebuilder)
              .in('publishAllEventsFromCommitStoreOnQueuedProjections')
          )
        );
        expect(commitStore.getAllEvents).toHaveBeenCalledTimes(1);
        for (const projection of projections) {
          expect(projection.MyEvent).to.be.callCount(2);
          expect(projection.MyEvent).toHaveBeenCalledWith(firstEvent);
          expect(projection.MyEvent).toHaveBeenCalledWith(secondEvent);
        }
        expect(log.debug).toHaveBeenCalledWith(
          new Log(`finished publishing events`)
            .on(rebuilder)
            .in('publishAllEventsFromCommitStoreOnQueuedProjections')
        );
      });

      it('commits new storage state on projection', async () => {
        commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);
        await rebuilder.rebuild(projections);

        for (const projection of projections) {
          expect(projection.commit).toHaveBeenCalledAfter(projection.MyEvent);
          expect(projection.commit).toHaveBeenCalledTimes(1);
        }
      });

      it('exits rebuilding mode on projection after completion', async () => {
        commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);
        await rebuilder.rebuild(projections);

        for (const projection of projections) {
          expect(projection.exitRebuildMode).toHaveBeenCalledTimes(1);
          expect(projection.exitRebuildMode).toHaveBeenCalledAfter(
            projection.commit
          );
        }
      });
    });
  });

  describe('failed rebuild', () => {
    const firstEvent = new MyEvent({
      sourceId: 'my-id',
      value: 'first-value',
    });
    const secondEvent = new MyEvent({
      sourceId: 'my-id',
      value: 'second-value',
    });

    it(`throws error if projection can't enter rebuild mode`, async () => {
      const firstProjection = projections[0];
      await firstProjection.enterRebuildMode(); // Simulate rebuild mode being already in progress

      await expect(rebuilder.rebuild([firstProjection])).rejects.toThrow(
        ProjectionAlreadyRebuildingError,
        `Projection 'FirstProjection' is already being rebuilt`
      );
    });

    it(`rollbacks already queued projections states if on any projection occurs an exception before rebuild`, async () => {
      const firstProjection = projections[0];
      const secondProjection = projections[1];
      const thirdProjection = projections[2];
      const errorMessage = 'my-before-rebuild-error-on-third-projection';
      thirdProjection.beforeRebuild.mockRejectedValue(new Error(errorMessage));

      await expect(rebuilder.rebuild(projections)).rejects.toThrow(
        Error,
        errorMessage
      );

      expect(firstProjection.rollback).toHaveBeenCalledTimes(1);
      expect(secondProjection.rollback).toHaveBeenCalledTimes(1);
      expect(thirdProjection.rollback).not.toHaveBeenCalled(); // Not yet added to queue
    });

    it(`logs initializing rollback on thrown before rebuild error`, async () => {
      const thirdProjection = projections[2];
      const error = new Error('my-error');
      thirdProjection.beforeRebuild.mockRejectedValue(error);

      await expect(rebuilder.rebuild(projections)).rejects.toThrow(Error);
      expect(log.emerg).toHaveBeenCalledWith(
        new Log(`initializing rollback on projections due to error: ${error}`)
          .on(rebuilder)
          .in(rebuilder.rebuild)
      );
    });

    it(`throws error if projection sate can't be committed`, async () => {
      commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);

      const firstProjection = projections[0];
      const errorMessage = 'my-commit-error';
      firstProjection.commit.mockRejectedValue(new Error(errorMessage));

      await expect(rebuilder.rebuild([projections[0]])).rejects.toThrow(
        Error,
        errorMessage
      );
    });

    it(`logs initializing rollback on committing error`, async () => {
      const thirdProjection = projections[2];
      const error = new Error('my-error');
      thirdProjection.commit.mockRejectedValue(error);

      await expect(rebuilder.rebuild(projections)).rejects.toThrow(Error);
      expect(log.emerg).toHaveBeenCalledWith(
        new Log(`initializing rollback on projections due to error: ${error}`)
          .on(rebuilder)
          .in(rebuilder.rebuild)
      );
    });

    it(`rollbacks already queued projections states if one of projection throws error on handling event`, async () => {
      commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);

      const firstProjection = projections[0];
      const secondProjection = projections[1];
      const thirdProjection = projections[2];
      const errorMessage = 'my-event-error-on-third-projection';
      thirdProjection.MyEvent.mockRejectedValue(new Error(errorMessage));

      await expect(rebuilder.rebuild(projections)).rejects.toThrow(
        Error,
        errorMessage
      );

      expect(firstProjection.rollback).toHaveBeenCalledTimes(1);
      expect(secondProjection.rollback).toHaveBeenCalledTimes(1);
      expect(thirdProjection.rollback).toHaveBeenCalledTimes(1);
    });

    it(`rollbacks already queued projections states if on any projection exception occurs durning committing new state`, async () => {
      commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);

      const firstProjection = projections[0];
      const secondProjection = projections[1];
      const thirdProjection = projections[2];
      const errorMessage = 'my-commit-error-on-third-projection';
      thirdProjection.commit.mockRejectedValue(new Error(errorMessage));

      await expect(rebuilder.rebuild(projections)).rejects.toThrow(
        Error,
        errorMessage
      );

      expect(firstProjection.rollback).toHaveBeenCalledTimes(1);
      expect(secondProjection.rollback).toHaveBeenCalledTimes(1);
      expect(thirdProjection.rollback).toHaveBeenCalledTimes(1);
    });

    it(`logs initializing rollback on thrown event handler error`, async () => {
      commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);

      const firstProjection = projections[0];
      const error = new Error('my-error');
      firstProjection.MyEvent.mockRejectedValue(error);

      await expect(rebuilder.rebuild(projections)).rejects.toThrow(Error);
      expect(log.emerg).toHaveBeenCalledWith(
        new Log(`initializing rollback on projections due to error: ${error}`)
          .on(rebuilder)
          .in(rebuilder.rebuild)
      );
    });

    it(`throws error if state on one of projections can't be rollbacked`, async () => {
      commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);
      const firstProjection = projections[0];
      // Throw first error on committing to force rollback
      const errorMessage = 'my-rollback-error';
      firstProjection.commit.mockRejectedValue(new Error('my-commit-error'));
      firstProjection.rollback.mockRejectedValue(new Error(errorMessage));

      await expect(rebuilder.rebuild(projections)).rejects.toThrow(
        Error,
        errorMessage
      );

      expect(firstProjection.isInState(Projection.STATES.projecting));
    });

    it(`ensures that all projections are rollbacked after any rollback error`, async () => {
      commitStore.getAllEvents.mockReturnValue([firstEvent, secondEvent]);
      const firstProjection = projections[0];
      const secondProjection = projections[1];
      const thirdProjection = projections[2];
      // Throw first error on committing to force rollback
      const errorMessage = 'my-rollback-error';
      firstProjection.commit.mockRejectedValue(new Error('my-commit-error'));
      firstProjection.rollback.mockRejectedValue(new Error(errorMessage));

      await expect(rebuilder.rebuild(projections)).rejects.toThrow(
        Error,
        errorMessage
      );

      expect(firstProjection.rollback).toHaveBeenCalledTimes(1);
      expect(secondProjection.rollback).toHaveBeenCalledTimes(1);
      expect(thirdProjection.rollback).toHaveBeenCalledTimes(1);
      expect(firstProjection.isInState(Projection.STATES.projecting));
      expect(secondProjection.isInState(Projection.STATES.projecting));
      expect(thirdProjection.isInState(Projection.STATES.projecting));
    });
  });
});

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import { define } from '../../../src/decorators/define';
import { Event } from '../../../src/components/event';
import { Projection } from '../../../src/infrastructure/projection';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Container } from '../../../src/core/injector';
import {
  RebuildingResult,
  ProjectionRebuilder,
} from '../../../src/infrastructure/projection-rebuilder';
import { Log } from '../../../src/components/log-entry';
import { ProjectionAlreadyRebuildingError } from '../../../src/infrastructure/infrastructure-errors';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`ProjectionRebuilder`, function() {
  @define('ProjectionRebuilder.MyEvent', { isRegistrable: false })
  class MyEvent extends Event {
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

  let container: Container;
  let log: any;
  let commitStore: any;
  let eventBus: any;
  let projections: any[];
  let rebuilder: ProjectionRebuilder;

  beforeEach(async () => {
    container = new Container();

    log = stubInterface<types.Logger>();
    commitStore = stubInterface<types.CommitStore>();
    eventBus = stubInterface<types.EventBus>();

    container.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    container
      .bind<types.CommitStore>(BINDINGS.CommitStore)
      .toConstantValue(commitStore);
    container.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);

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
        sinon.spy(projection, methodName as any);
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
        sinon.stub(projection, methodName as any);
      }
      projection.registerHandler(MyEvent, projection.MyEvent);
    }
    commitStore.getAllEvents.returns([]);

    // Projection initialization
    for (const projection of projections) {
      await container.injectIntoAsync(projection);
    }

    // Rebuilder
    rebuilder = new ProjectionRebuilder();
    container.injectInto(rebuilder);
  });

  it('logs start of rebuilding process', async () => {
    await rebuilder.rebuild(projections);
    expect(log.info).to.be.calledWithExactly(
      new Log(
        `rebuilding projections: 'FirstProjection, SecondProjection, ThirdProjection'`
      )
        .on(rebuilder)
        .in(rebuilder.rebuild)
    );
  });

  context('successful rebuild', () => {
    const firstEvent = new MyEvent({
      sourceId: 'my-id',
      value: 'first-value',
    });
    const secondEvent = new MyEvent({
      sourceId: 'my-id',
      value: 'second-value',
    });

    context('single projection id', () => {
      it('rebuilds the projection using historical events', async () => {
        commitStore.getAllEvents.returns([firstEvent, secondEvent]);

        const result = await rebuilder.rebuild([projections[0]]);
        expect(result).to.be.instanceof(RebuildingResult);
        expect(result.duration).to.be.a('number');
        expect(result.message).to.be.equal(
          `finished rebuilding 'FirstProjection' in ${result.duration}ms`
        );
        expect(result.projectionsNames).to.be.eql(['FirstProjection']);
      });

      it('logs rebuilding the projection using historical events', async () => {
        commitStore.getAllEvents.returns([firstEvent, secondEvent]);

        const result = await rebuilder.rebuild([projections[0]]);

        expect(log.info).to.be.calledWithMatch(
          new Log(
            `finished rebuilding 'FirstProjection' in ${result.duration}ms`
          )
            .on(rebuilder)
            .in(rebuilder.rebuild)
        );
      });

      it('rebuilds multiple projections using historical events', async () => {
        commitStore.getAllEvents.returns([firstEvent, secondEvent]);
        const projectionsNames = [
          'FirstProjection',
          'SecondProjection',
          'ThirdProjection',
        ];
        const result = await rebuilder.rebuild(projections);
        expect(result).to.be.instanceof(RebuildingResult);
        expect(result.duration).to.be.a('number');
        expect(result.message).to.be.equal(
          `finished rebuilding 'FirstProjection, SecondProjection, ThirdProjection' in ${result.duration}ms`
        );
        expect(result.projectionsNames).to.be.eql(projectionsNames);
      });

      it('logs rebuilding multiple projections using historical events', async () => {
        commitStore.getAllEvents.returns([firstEvent, secondEvent]);
        const result = await rebuilder.rebuild(projections);

        expect(log.info).to.be.calledWithMatch(
          new Log(
            `finished rebuilding 'FirstProjection, SecondProjection, ThirdProjection' in ${result.duration}ms`
          )
            .on(rebuilder)
            .in(rebuilder.rebuild)
        );
      });

      it('enters rebuild mode on projection before rebuilding', async () => {
        commitStore.getAllEvents.returns([firstEvent, secondEvent]);
        const projection = projections[0];
        await rebuilder.rebuild([projection]);

        expect(projection.enterRebuildMode).to.be.calledOnce;
        expect(projection.enterRebuildMode).to.be.calledBefore(
          projection.beforeRebuild
        );
      });

      it('runs projection beforeRebuild hook for preparations before rebuilding', async () => {
        commitStore.getAllEvents.returns([firstEvent, secondEvent]);
        const projection = projections[0];
        await rebuilder.rebuild([projection]);

        expect(projection.beforeRebuild).to.be.calledOnce;
        expect(projection.beforeRebuild).to.be.calledBefore(
          commitStore.getAllEvents
        );
      });

      it('handles events from commit store on projection(rebuilding)', async () => {
        commitStore.getAllEvents.returns([firstEvent, secondEvent]);
        await rebuilder.rebuild(projections);

        expect(log.debug).to.be.calledWithMatch(
          new Log(`publishing events on projections`)
            .on(rebuilder)
            .in('publishAllEventsFromCommitStoreOnQueuedProjections')
        );
        expect(commitStore.getAllEvents).to.be.calledOnce;
        for (const projection of projections) {
          expect(projection.MyEvent).to.be.callCount(2);
          expect(projection.MyEvent).to.be.calledWithExactly(firstEvent);
          expect(projection.MyEvent).to.be.calledWithExactly(secondEvent);
        }
        expect(log.debug).to.be.calledWithExactly(
          new Log(`finished publishing events`)
            .on(rebuilder)
            .in('publishAllEventsFromCommitStoreOnQueuedProjections')
        );
      });

      it('commits new storage state on projection', async () => {
        commitStore.getAllEvents.returns([firstEvent, secondEvent]);
        await rebuilder.rebuild(projections);

        for (const projection of projections) {
          expect(projection.commit).to.be.calledAfter(projection.MyEvent);
          expect(projection.commit).to.be.calledOnce;
        }
      });

      it('exits rebuilding mode on projection after completion', async () => {
        commitStore.getAllEvents.returns([firstEvent, secondEvent]);
        await rebuilder.rebuild(projections);

        for (const projection of projections) {
          expect(projection.exitRebuildMode).to.be.calledOnce;
          expect(projection.exitRebuildMode).to.be.calledAfter(
            projection.commit
          );
        }
      });
    });
  });

  context('failed rebuild', () => {
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

      await expect(
        rebuilder.rebuild([firstProjection])
      ).to.eventually.be.rejectedWith(
        ProjectionAlreadyRebuildingError,
        `Projection 'FirstProjection' is already being rebuilt`
      );
    });

    it(`rollbacks already queued projections states if on any projection occurs an exception before rebuild`, async () => {
      const firstProjection = projections[0];
      const secondProjection = projections[1];
      const thirdProjection = projections[2];
      const errorMessage = 'my-before-rebuild-error-on-third-projection';
      thirdProjection.beforeRebuild.rejects(new Error(errorMessage));

      await expect(
        rebuilder.rebuild(projections)
      ).to.eventually.be.rejectedWith(Error, errorMessage);

      expect(firstProjection.rollback).to.be.calledOnce;
      expect(secondProjection.rollback).to.be.calledOnce;
      expect(thirdProjection.rollback).to.be.not.called; // Not yet added to queue
    });

    it(`logs initializing rollback on thrown before rebuild error`, async () => {
      const thirdProjection = projections[2];
      const error = new Error('my-error');
      thirdProjection.beforeRebuild.rejects(error);

      await expect(
        rebuilder.rebuild(projections)
      ).to.eventually.be.rejectedWith(Error);
      expect(log.emerg).to.be.calledWith(
        new Log(`initializing rollback on projections due to error: ${error}`)
          .on(rebuilder)
          .in(rebuilder.rebuild)
      );
    });

    it(`throws error if projection sate can't be committed`, async () => {
      commitStore.getAllEvents.returns([firstEvent, secondEvent]);

      const firstProjection = projections[0];
      const errorMessage = 'my-commit-error';
      firstProjection.commit.rejects(new Error(errorMessage));

      await expect(
        rebuilder.rebuild([projections[0]])
      ).to.eventually.be.rejectedWith(Error, errorMessage);
    });

    it(`logs initializing rollback on committing error`, async () => {
      const thirdProjection = projections[2];
      const error = new Error('my-error');
      thirdProjection.commit.rejects(error);

      await expect(
        rebuilder.rebuild(projections)
      ).to.eventually.be.rejectedWith(Error);
      expect(log.emerg).to.be.calledWith(
        new Log(`initializing rollback on projections due to error: ${error}`)
          .on(rebuilder)
          .in(rebuilder.rebuild)
      );
    });

    it(`rollbacks already queued projections states if one of projection throws error on handling event`, async () => {
      commitStore.getAllEvents.returns([firstEvent, secondEvent]);

      const firstProjection = projections[0];
      const secondProjection = projections[1];
      const thirdProjection = projections[2];
      const errorMessage = 'my-event-error-on-third-projection';
      thirdProjection.MyEvent.rejects(new Error(errorMessage));

      await expect(
        rebuilder.rebuild(projections)
      ).to.eventually.be.rejectedWith(Error, errorMessage);

      expect(firstProjection.rollback).to.be.calledOnce;
      expect(secondProjection.rollback).to.be.calledOnce;
      expect(thirdProjection.rollback).to.be.calledOnce;
    });

    it(`rollbacks already queued projections states if on any projection exception occurs durning committing new state`, async () => {
      commitStore.getAllEvents.returns([firstEvent, secondEvent]);

      const firstProjection = projections[0];
      const secondProjection = projections[1];
      const thirdProjection = projections[2];
      const errorMessage = 'my-commit-error-on-third-projection';
      thirdProjection.commit.rejects(new Error(errorMessage));

      await expect(
        rebuilder.rebuild(projections)
      ).to.eventually.be.rejectedWith(Error, errorMessage);

      expect(firstProjection.rollback).to.be.calledOnce;
      expect(secondProjection.rollback).to.be.calledOnce;
      expect(thirdProjection.rollback).to.be.calledOnce;
    });

    it(`logs initializing rollback on thrown event handler error`, async () => {
      commitStore.getAllEvents.returns([firstEvent, secondEvent]);

      const firstProjection = projections[0];
      const error = new Error('my-error');
      firstProjection.MyEvent.rejects(error);

      await expect(
        rebuilder.rebuild(projections)
      ).to.eventually.be.rejectedWith(Error);
      expect(log.emerg).to.be.calledWith(
        new Log(`initializing rollback on projections due to error: ${error}`)
          .on(rebuilder)
          .in(rebuilder.rebuild)
      );
    });

    it(`throws error if state on one of projections can't be rollbacked`, async () => {
      commitStore.getAllEvents.returns([firstEvent, secondEvent]);
      const firstProjection = projections[0];
      // Throw first error on committing to force rollback
      const errorMessage = 'my-rollback-error';
      firstProjection.commit.rejects(new Error('my-commit-error'));
      firstProjection.rollback.rejects(new Error(errorMessage));

      await expect(
        rebuilder.rebuild(projections)
      ).to.eventually.be.rejectedWith(Error, errorMessage);

      expect(firstProjection.isInState(Projection.STATES.projecting));
    });

    it(`ensures that all projections are rollbacked after any rollback error`, async () => {
      commitStore.getAllEvents.returns([firstEvent, secondEvent]);
      const firstProjection = projections[0];
      const secondProjection = projections[1];
      const thirdProjection = projections[2];
      // Throw first error on committing to force rollback
      const errorMessage = 'my-rollback-error';
      firstProjection.commit.rejects(new Error('my-commit-error'));
      firstProjection.rollback.rejects(new Error(errorMessage));

      await expect(
        rebuilder.rebuild(projections)
      ).to.eventually.be.rejectedWith(Error, errorMessage);

      expect(firstProjection.rollback).to.be.calledOnce;
      expect(secondProjection.rollback).to.be.calledOnce;
      expect(thirdProjection.rollback).to.be.calledOnce;
      expect(firstProjection.isInState(Projection.STATES.projecting));
      expect(secondProjection.isInState(Projection.STATES.projecting));
      expect(thirdProjection.isInState(Projection.STATES.projecting));
    });
  });
});

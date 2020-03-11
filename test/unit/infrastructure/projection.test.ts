import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { Event } from '../../../src/components/event';
import { Projection } from '../../../src/infrastructure/projection';
import { define } from '../../../src/decorators/define';
import { types } from '../../../src/types';
import { Container } from '../../../src/core/injector';
import { Log } from '../../../src/components/log-entry';
import { subscribe } from '../../../src/annotations/subscribe';
import { BINDINGS } from '../../../src/constants/bindings';
import {
  ProjectionAlreadyRebuildingError,
  ProjectionNotRebuildingError,
} from '../../../src/infrastructure/infrastructure-errors';
import { Command } from '../../../src/components/command';
import { UnhandleableTypeError } from '../../../src/messaging/messaging-errors';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`Projection`, function() {
  @define('Projection.MyEvent')
  class MyEvent extends Event {}
  @define('Projection.MyCommand')
  class MyCommand extends Command {}

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
  let container: Container;
  let log: any;
  let eventBus: any;
  let events: Record<string, Event>;
  let projection: any;

  before(() => {
    now = new Date();
  });

  beforeEach(() => {
    container = new Container();
    log = stubInterface<types.Logger>();
    eventBus = stubInterface<types.EventBus>();

    container.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    container.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);

    events = {
      MyEvent: new MyEvent({
        sourceId: 'my-id',
        timestamp: now,
      }),
    };

    projection = new MyProjection();
    container.injectInto(projection);
  });

  describe(`projection state`, () => {
    it('has projecting state by default', () => {
      expect(projection.isInState(Projection.STATES.projecting)).to.be.true;
    });
  });

  describe('handling events', () => {
    it('does not handle event that has no registered handler', async () => {
      await projection.on(events.MyEvent);
      expect(log.debug).to.not.be.called;
    });

    it(`handles events`, async () => {
      const handler = sinon.stub();
      projection.subscribeTo(MyEvent, handler);

      await projection.on(events.MyEvent);
      expect(handler).to.be.calledOnce;
      expect(handler).to.be.calledWithExactly(events.MyEvent);
    });

    it(`logs publishing event `, async () => {
      const handler = sinon.stub();
      projection.subscribeTo(MyEvent, handler);

      await projection.on(events.MyEvent);
      expect(log.debug).to.be.calledWithMatch(
        new Log(`publishing 'Projection.MyEvent'`)
          .on(projection)
          .in(projection.on)
          .with('event', events.MyEvent)
      );
    });

    it(`allows to set event handlers as mapping`, async () => {
      const dependency = sinon.stub();
      class MyOtherProjection extends Projection {
        MyEvent(@subscribe event: MyEvent): void {
          dependency(event);
        }
      }

      const instance = new MyOtherProjection();
      container.injectInto(instance);

      await instance.on(events.MyEvent);
      expect(instance.hasHandler(MyEvent)).to.be.true;
      expect(dependency).to.be.calledOnce;
      expect(dependency).to.be.calledWithExactly(events.MyEvent);
    });

    it(`throws UnhandleableTypeError when trying to setup handlers with non-event entries`, () => {
      class MyOtherProjection extends Projection {
        subscribes(): Map<types.MessageType<any>, types.Handler> {
          return new Map([
            [MyCommand, this.MyCommand], // should be Event, its defined on subscriptions!
          ]);
        }

        MyCommand(_command: MyCommand): void {
          return undefined;
        }
      }

      expect(() => {
        new MyOtherProjection().initialize();
      }).to.throw(
        UnhandleableTypeError,
        `MyOtherProjection: type must be one of: [Event]; got Projection.MyCommand`
      );
    });
  });

  describe(`rebuild mode`, () => {
    it(`enters rebuild mode`, async () => {
      expect(projection.isInState(Projection.STATES.projecting)).to.be.true;
      await projection.enterRebuildMode();
      expect(projection.isInState(Projection.STATES.rebuilding)).to.be.true;
    });

    it(`logs entering rebuild mode`, async () => {
      await projection.enterRebuildMode();
      expect(log.debug).to.be.calledOnce;
      expect(log.debug).to.be.calledWithMatch(
        new Log(`rebuilding`).on(projection).in(projection.enterRebuildMode)
      );
    });

    it(`ensures that rebuild mode can be entered only in projection state`, async () => {
      expect(projection.isInState(Projection.STATES.projecting)).to.be.true;
      await projection.enterRebuildMode();
      expect(projection.isInState(Projection.STATES.rebuilding)).to.be.true;
      await expect(projection.enterRebuildMode()).to.eventually.be.rejectedWith(
        ProjectionAlreadyRebuildingError,
        `Projection 'MyProjection' is already being rebuilt`
      );
    });

    it(`logs failed entering of rebuilding mode`, async () => {
      await projection.enterRebuildMode();
      await expect(projection.enterRebuildMode()).to.eventually.be.rejectedWith(
        ProjectionAlreadyRebuildingError
      );

      expect(log.error).to.be.calledOnce;
      expect(log.error).to.be.calledWithExactly(
        new Log(`failed entering rebuilding(already in rebuild mode)`)
          .on(projection)
          .in(projection.enterRebuildMode)
      );
    });

    it(`exits rebuild mode`, async () => {
      expect(projection.isInState(Projection.STATES.projecting)).to.be.true;
      await projection.enterRebuildMode();
      await projection.exitRebuildMode();
      expect(projection.isInState(Projection.STATES.projecting)).to.be.true;
    });

    it(`logs exiting rebuild mode`, async () => {
      await projection.enterRebuildMode();
      await projection.exitRebuildMode();
      expect(log.debug).to.be.calledWithExactly(
        new Log(`projecting`).on(projection).in(projection.exitRebuildMode)
      );
    });

    it(`ensures that exiting rebuild mode can be only done on rebuilding state`, async () => {
      expect(projection.isInState(Projection.STATES.projecting)).to.be.true;
      await expect(projection.exitRebuildMode()).to.eventually.be.rejectedWith(
        ProjectionNotRebuildingError,
        `Expected projection 'MyProjection' to be in a state of rebuilding`
      );
    });

    it(`logs failed exiting of rebuild mode`, async () => {
      await expect(projection.exitRebuildMode()).to.eventually.be.rejectedWith(
        ProjectionNotRebuildingError
      );

      expect(log.error).to.be.calledOnce;
      expect(log.error).to.be.calledWithExactly(
        new Log(`failed exiting rebuilding(already projecting)`)
          .on(projection)
          .in(projection.exitRebuildMode)
      );
    });

    it(`does not handle events flagged as non-rebuilding event in real-time`, async () => {
      const handler = sinon.stub();
      projection.subscribeTo(MyEvent, handler);

      await projection.enterRebuildMode();

      const isRebuildEvent = false;
      await projection.on(events.MyEvent, isRebuildEvent);
      expect(handler).to.not.be.called;
    });

    it(`handles rebuilding events`, async () => {
      const handler = sinon.stub();
      projection.subscribeTo(MyEvent, handler);

      await projection.enterRebuildMode();

      const isRebuildEvent = true;
      await projection.on(events.MyEvent, isRebuildEvent);
      expect(handler).to.be.calledOnce;
      expect(handler).to.be.calledWithExactly(events.MyEvent);
    });

    it(`handles queued events when exiting rebuild mode`, async () => {
      const handler = sinon.stub();
      projection.subscribeTo(MyEvent, handler);

      await projection.enterRebuildMode();
      await projection.on(events.MyEvent);
      await projection.exitRebuildMode();

      expect(handler).to.be.calledOnce;
      expect(handler).to.be.calledWithExactly(events.MyEvent);
    });

    it(`logs queue eveent`, async () => {
      const handler = sinon.stub();
      projection.subscribeTo(MyEvent, handler);

      await projection.enterRebuildMode();

      await projection.on(events.MyEvent);
      expect(log.debug).to.be.calledWithExactly(
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
        projection.beforeRebuild = sinon.stub();
        await projection.invokeAction('beforeRebuild');

        expect(projection.beforeRebuild).to.be.calledOnce;
      });

      it('logs invoked beforeRebuild action', async () => {
        await projection.invokeAction('beforeRebuild');

        expect(
          log.debug
            .getCall(0)
            .calledWithMatch(
              new Log('beforeRebuild')
                .on(projection)
                .in(projection.beforeRebuild)
            )
        ).to.be.true;
        expect(
          log.debug
            .getCall(1)
            .calledWithMatch(
              new Log('finished beforeRebuild')
                .on(projection)
                .in(projection.beforeRebuild)
            )
        ).to.be.true;
      });

      it('logs failed execution of beforeRebuild action', async () => {
        projection.beforeRebuild = (): void => {
          throw new Error('my-error');
        };
        await expect(
          projection.invokeAction('beforeRebuild')
        ).to.eventually.be.rejectedWith(Error);

        expect(
          log.debug
            .getCall(0)
            .calledWithMatch(
              new Log('beforeRebuild')
                .on(projection)
                .in(projection.beforeRebuild)
            )
        ).to.be.true;
        expect(log.error).to.be.calledWithMatch(
          new Log('failed beforeRebuild do to error: Error: my-error')
            .on(projection)
            .in(projection.beforeRebuild)
        );
      });
    });

    describe('commit', () => {
      it('invokes commit action', async () => {
        projection.commit = sinon.stub();
        await projection.invokeAction('commit');

        expect(projection.commit).to.be.calledOnce;
      });

      it('logs invoked commit action', async () => {
        await projection.invokeAction('commit');

        expect(
          log.debug
            .getCall(0)
            .calledWithMatch(
              new Log('commit').on(projection).in(projection.commit)
            )
        ).to.be.true;
        expect(
          log.debug
            .getCall(1)
            .calledWithMatch(
              new Log('finished commit').on(projection).in(projection.commit)
            )
        ).to.be.true;
      });

      it('logs failed execution of commit action', async () => {
        projection.commit = (): void => {
          throw new Error('my-error');
        };
        await expect(
          projection.invokeAction('commit')
        ).to.eventually.be.rejectedWith(Error);

        expect(
          log.debug
            .getCall(0)
            .calledWithMatch(
              new Log('commit').on(projection).in(projection.commit)
            )
        ).to.be.true;
        expect(log.error).to.be.calledWithMatch(
          new Log('failed commit do to error: Error: my-error')
            .on(projection)
            .in(projection.commit)
        );
      });
    });

    describe('rollback', () => {
      it('invokes rollback action', async () => {
        projection.rollback = sinon.stub();
        await projection.invokeAction('rollback');

        expect(projection.rollback).to.be.calledOnce;
      });

      it('logs invoked rollback action', async () => {
        await projection.invokeAction('rollback');

        expect(
          log.debug
            .getCall(0)
            .calledWithMatch(
              new Log('rollback').on(projection).in(projection.rollback)
            )
        ).to.be.true;
        expect(
          log.debug
            .getCall(1)
            .calledWithMatch(
              new Log('finished rollback')
                .on(projection)
                .in(projection.rollback)
            )
        ).to.be.true;
      });

      it('logs failed execution of rollback action', async () => {
        projection.rollback = (): void => {
          throw new Error('my-error');
        };
        await expect(
          projection.invokeAction('rollback')
        ).to.eventually.be.rejectedWith(Error);

        expect(
          log.debug
            .getCall(0)
            .calledWithMatch(
              new Log('rollback').on(projection).in(projection.rollback)
            )
        ).to.be.true;
        expect(log.error).to.be.calledWithMatch(
          new Log('failed rollback do to error: Error: my-error')
            .on(projection)
            .in(projection.rollback)
        );
      });
    });
  });
});

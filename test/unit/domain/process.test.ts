import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { define } from '@eveble/core';
import { Command } from '../../../src/components/command';
import { Process } from '../../../src/domain/process';
import { subscribe } from '../../../src/annotations/subscribe';
import { Event } from '../../../src/components/event';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { isDefinable } from '../../../src/utils/helpers';
import { Guid } from '../../../src/domain/value-objects/guid';
import { History } from '../../../src/domain/history';
import { EventIdMismatchError } from '../../../src/domain/domain-errors';
import { initial } from '../../../src/annotations/initial';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`Process`, function () {
  let now: Date;
  let clock: any;
  let handlers: Record<string, Function>;
  let props: Record<string, any>;
  let commands: Record<string, Command<{}>>;
  let events: Record<string, Event<{}>>;

  @define('MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    name: string;
  }
  @define('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    name: string;
  }

  @define('MyCommandProcess', { isRegistrable: false })
  class MyCommandProcess extends Process {
    name: string;

    MyCommand(@initial command: MyCommand): void {
      this.record(new MyEvent({ ...this.eventProps(), name: command.name }));
      handlers.MyCommand(command);
    }
  }

  @define('MyEventProcess')
  class MyEventProcess extends Process {
    name: string;

    MyEvent(@initial event: MyEvent): void {
      this.assign(event);
      handlers.MyEvent(event);
    }
  }

  @define('MyProcess', { isRegistrable: false })
  class MyProcess extends Process {
    name: string;

    MyCommand(@initial command: MyCommand): void {
      this.record(new MyEvent({ ...this.eventProps(), name: command.name }));
      handlers.MyCommand(command);
    }

    MyEvent(@subscribe event: MyEvent): void {
      this.assign(event);
      handlers.MyEvent(event);
    }
  }

  before(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime());

    handlers = {
      MyCommand: sinon.spy(),
      MyEvent: sinon.spy(),
    };

    props = {
      id: 'my-id',
      name: 'Foo',
    };

    commands = {
      MyCommand: new MyCommand({
        targetId: props.id,
        name: props.name,
        timestamp: now,
      }),
    };

    events = {
      MyEvent: new MyEvent({
        sourceId: props.id,
        name: props.name,
        version: 0,
        timestamp: now,
      }),
    };
  });

  afterEach(() => {
    clock.restore();
  });

  it(`extends EventSourceable`, () => {
    expect(Process.prototype).to.be.instanceof(EventSourceable);
  });

  it('defines the type name correctly', () => {
    expect(Process.getTypeName()).to.equal('Process');
    expect(Process.prototype.getTypeName()).to.equal('Process');
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(Process.prototype)).to.be.true;
  });

  describe(`construction`, () => {
    it(`makes the id publicly available`, () => {
      const id = 'my-id';
      const process = new Process({ id });
      expect(process.getId()).to.be.equal(id);
    });

    it(`sets the initial version to 0`, () => {
      const process = new Process({ id: 'my-id' });
      expect(process.getVersion()).to.be.equal(0);
    });

    it(`initializes uncommitted changes as empty array`, () => {
      const process = new Process({ id: 'my-id' });
      expect(process.getEvents()).to.be.eql([]);
    });

    it(`initializes untriggered commands as empty array`, () => {
      const process = new Process({ id: 'my-id' });
      expect(process.getCommands()).to.be.eql([]);
    });

    describe('construction flows', () => {
      describe('initializing command flow', () => {
        it(`takes a command as initializing message and assigns only id`, () => {
          const process = new MyCommandProcess(commands.MyCommand);
          expect(process.id).to.be.equal(props.id);
        });

        it(`ensures that manual handling of command is required`, () => {
          const process = new MyCommandProcess(commands.MyCommand);
          expect(process.id).to.be.equal(props.id);
          expect(handlers.MyCommand).to.not.be.called;
        });

        it(`initializes process instance and handles command after construction`, () => {
          const process = new MyCommandProcess(commands.MyCommand);
          expect(process.id).to.be.equal(props.id);
          process.initialize();
          process.handle(commands.MyCommand);
          expect(handlers.MyCommand).to.be.calledOnce;
          expect(handlers.MyCommand).to.be.calledWithExactly(
            commands.MyCommand
          );
        });
      });
      describe('initializing event flow', () => {
        it(`takes a event as initializing message and assings newly created id`, () => {
          const process = new MyEventProcess(events.MyEvent);
          expect(process.id).to.not.be.equal(props.id);
          expect(process.id).to.be.instanceof(Guid);
        });

        it(`ensures that manual handling of event is required`, () => {
          const process = new MyEventProcess(events.MyEvent);
          expect(process.id).to.not.be.equal(props.id);
          expect(process.id).to.be.instanceof(Guid);
          expect(handlers.MyEvent).to.not.be.called;
        });

        it(`initializes process instance and handles event after construction`, () => {
          const process = new MyEventProcess(events.MyEvent);
          expect(process.id).to.not.be.equal(props.id);
          expect(process.id).to.be.instanceof(Guid);
          process.initialize();
          process.handle(events.MyEvent);
          expect(handlers.MyEvent).to.be.calledOnce;
          expect(handlers.MyEvent).to.be.calledWithExactly(events.MyEvent);
        });
      });

      describe('replay history flow', () => {
        it('takes instance of History with list of Event instances', () => {
          const history = new History([events.MyEvent]);
          const aggregate = new MyProcess(history);
          expect(aggregate.getId()).to.equal(events.MyEvent.sourceId);
        });

        it('ensures that manual replay of history is required', () => {
          const history = new History([events.MyEvent]);
          const aggregate = new MyProcess(history);
          aggregate.replayHistory = sinon.stub();
          expect(aggregate.replayHistory).to.not.be.called;
        });

        it('initializes aggregate and replies history', () => {
          const history = new History([events.MyEvent]);
          const aggregate = new MyProcess(history);
          aggregate.initialize();
          aggregate.replayHistory(history);
          expect(aggregate.getId()).to.equal(events.MyEvent.sourceId);
          expect(handlers.MyEvent).to.have.been.calledWithExactly(
            events.MyEvent
          );
        });
      });
    });
  });
  describe(`triggering`, () => {
    it('allows to define custom correlation key as static class property', () => {
      @define('MyCorrelationProcess', { isRegistrable: false })
      class MyCorrelationProcess extends Process {
        public static correlationKey = 'myCorrelationKey';
      }

      expect(MyCorrelationProcess.getCorrelationKey()).to.be.equal(
        'myCorrelationKey'
      );
      expect(
        new MyCorrelationProcess({ id: 'my-id' }).getCorrelationKey()
      ).to.equal('myCorrelationKey');
    });

    it('allows to define custom correlation key with static setter', () => {
      @define('MyCorrelationProcess2')
      class MyCorrelationProcess extends Process {
        static correlationKey = 'myCorrelationKey';
      }

      MyCorrelationProcess.setCorrelationKey('myOtherCorrelationKey');
      expect(MyCorrelationProcess.getCorrelationKey()).to.be.equal(
        'myOtherCorrelationKey'
      );
      expect(
        new MyCorrelationProcess({ id: 'my-id' }).getCorrelationKey()
      ).to.equal('myOtherCorrelationKey');
    });

    it('returns default correlation key as process type name', () => {
      @define('Process.MyCorrelationProcess')
      class MyCorrelationProcess extends Process {}
      expect(MyCorrelationProcess.getCorrelationKey()).to.be.equal(
        'Process.MyCorrelationProcess'
      );
    });

    it(`can define commands to be triggered later, including metadata containing the instance id as a string for the purpose of correlating events published externally`, () => {
      const id = 'my-id';
      const metadata = {
        correlation: {
          MyProcess: id,
        },
      };
      const expectedCommand = new MyCommand({
        targetId: id,
        name: props.name,
        metadata,
        timestamp: now,
      });

      const process = new MyProcess({ id });
      process.initialize();
      process.trigger(commands.MyCommand);
      expect(process.getCommands()).to.have.eql([expectedCommand]);
    });

    it(`ensures that correlating key using dot notation is correctly set on metadata for databases that does not allow such notations `, () => {
      @define('Namespaced.MyProcess', { isRegistrable: false })
      class NamespacedMyProcess extends Process {
        name: string;

        MyCommand(@initial command: MyCommand): void {
          this.record(
            new MyEvent({ ...this.eventProps(), name: command.name })
          );
          handlers.MyCommand(command);
        }
      }

      const id = 'my-id';
      const metadata = {
        correlation: {
          Namespaced: {
            MyProcess: id,
          },
        },
      };
      const expectedCommand = new MyCommand({
        targetId: id,
        name: props.name,
        metadata,
        timestamp: now,
      });

      const process = new NamespacedMyProcess({ id });
      process.initialize();
      process.trigger(commands.MyCommand);
      expect(process.getCommands()).to.have.eql([expectedCommand]);
    });
  });

  describe(`recording`, () => {
    it(`does not require recorded event's source id to match event sourcable's id`, () => {
      const event = new MyEvent({
        sourceId: 'other-id',
        name: 'Foo',
      });

      const instance = new MyProcess({ id: 'my-id' });
      expect(() => {
        instance.record(event);
      }).to.not.throw(EventIdMismatchError);
    });
  });
});

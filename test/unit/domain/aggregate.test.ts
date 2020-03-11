import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { define } from '../../../src/decorators/define';
import { Command } from '../../../src/components/command';
import { Aggregate } from '../../../src/domain/aggregate';
import { History } from '../../../src/domain/history';
import { subscribe } from '../../../src/annotations/subscribe';
import { Event } from '../../../src/components/event';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { isDefinable } from '../../../src/utils/helpers';
import { InvalidInitializingMessageError } from '../../../src/domain/domain-errors';
import { Guid } from '../../../src/domain/value-objects/guid';
import { initial } from '../../../src/annotations/initial';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`Aggregate`, function() {
  let now: Date;
  let clock: any;
  let handlers: Record<string, Function>;
  let props: Record<string, any>;
  let commands: Record<string, Command>;
  let events: Record<string, Event>;

  @define('MyCommand', { isRegistrable: false })
  class MyCommand extends Command {
    name: string;
  }
  @define('MyEvent', { isRegistrable: false })
  class MyEvent extends Event {
    name: string;
  }

  @define('MyAggregate', { isRegistrable: false })
  class MyAggregate extends Aggregate {
    name: string;

    MyCommand(@initial command: MyCommand): void {
      this.record(new MyEvent(this.pickEventProps(command)));
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
    expect(Aggregate.prototype).to.be.instanceof(EventSourceable);
  });

  it('defines the type name correctly', () => {
    expect(Aggregate.getTypeName()).to.equal('Aggregate');
    expect(Aggregate.prototype.getTypeName()).to.equal('Aggregate');
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(Aggregate.prototype)).to.be.true;
  });

  describe(`construction`, () => {
    it(`makes the id publicly available`, () => {
      const id = 'my-id';
      const aggregate = new Aggregate({ id });
      expect(aggregate.getId()).to.be.equal(id);
    });

    it(`sets the initial version to 0`, () => {
      const aggregate = new Aggregate({ id: 'my-id' });
      expect(aggregate.getVersion()).to.be.equal(0);
    });

    it(`initializes uncommitted changes as empty array`, () => {
      const aggregate = new Aggregate({ id: 'my-id' });
      expect(aggregate.getEvents()).to.be.eql([]);
    });

    it(`initializes untriggered commands as empty array`, () => {
      const aggregate = new Aggregate({ id: 'my-id' });
      expect(aggregate.getCommands()).to.be.eql([]);
    });

    describe('construction flows', () => {
      describe('initializing command flow', () => {
        it(`takes a command as initializing message and assigns only id`, () => {
          const aggregate = new MyAggregate(commands.MyCommand);
          expect(aggregate.id).to.be.equal(props.id);
        });

        it(`ensures that manual handling of command is required`, () => {
          const aggregate = new MyAggregate(commands.MyCommand);
          expect(aggregate.id).to.be.equal(props.id);
          expect(handlers.MyCommand).to.not.be.called;
        });

        it(`initializes aggregate instance and handles command after construction`, () => {
          const aggregate = new MyAggregate(commands.MyCommand);
          expect(aggregate.id).to.be.equal(props.id);
          aggregate.initialize();
          aggregate.handle(commands.MyCommand);
          expect(handlers.MyCommand).to.be.calledOnce;
          expect(handlers.MyCommand).to.be.calledWithExactly(
            commands.MyCommand
          );
        });
      });

      describe('replay history flow', () => {
        it('takes instance of History with list of Event instances', () => {
          const history = new History([events.MyEvent]);
          const aggregate = new MyAggregate(history);
          expect(aggregate.getId()).to.equal(events.MyEvent.sourceId);
        });

        it('ensures that manual replay of history is required', () => {
          const history = new History([events.MyEvent]);
          const aggregate = new MyAggregate(history);
          aggregate.replayHistory = sinon.stub();
          expect(aggregate.replayHistory).to.not.be.called;
        });

        it('initializes aggregate and replies history', () => {
          const history = new History([events.MyEvent]);
          const aggregate = new MyAggregate(history);
          aggregate.initialize();
          aggregate.replayHistory(history);
          expect(aggregate.getId()).to.equal(events.MyEvent.sourceId);
          expect(handlers.MyEvent).to.have.been.calledWithExactly(
            events.MyEvent
          );
        });
      });

      describe('properties flow', () => {
        it('takes required properties for aggregate and assings them', () => {
          const properties = {
            id: new Guid(),
            name: 'Foo',
            version: 0,
          };
          const aggregate = new MyAggregate(properties);
          expect(aggregate).to.eql(properties);
        });
      });
    });

    it(`does not initialize from passed event`, () => {
      expect(() => new MyAggregate(events.MyEvent)).to.throw(
        InvalidInitializingMessageError,
        `MyAggregate: the given initializing message is not one of allowed types. Expected [Command, Function], got MyEvent({"sourceId":"my-id","name":"Foo","version":0,"timestamp":"${now.toISOString()}","metadata":{}}`
      );
    });
  });
});

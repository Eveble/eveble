import sinon from 'sinon';
import { expect } from 'chai';
import { PropTypes } from 'typend';
import { Message } from '../../../src/components/message';
import { Command, Assignment } from '../../../src/components/command';
import { define } from '../../../src/decorators/define';
import { isDefinable } from '../../../src/utils/helpers';
import { Guid } from '../../../src/domain/value-objects/guid';

describe('Command', function() {
  let now: Date;
  let clock: any;

  before(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  @define('MyCommand', { isRegistrable: false })
  class MyCommand extends Command {}

  @define('MyCustomCommand', { isRegistrable: false })
  class MyCustomCommand extends Command {
    name: string;
  }

  it(`extends Message`, () => {
    expect(Command.prototype).to.be.instanceof(Message);
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(Command.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(Command.getTypeName()).to.equal('Command');
    expect(Command.prototype.getTypeName()).to.equal('Command');
  });

  describe('prop types', () => {
    it('takes required targetId property as a string or Guid', () => {
      expect(Command.getPropTypes().targetId).to.be.eql(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes timestamp property as a Date', () => {
      clock.restore();

      expect(Command.getPropTypes().timestamp).to.be.eql(
        PropTypes.instanceOf(Date)
      );
    });

    it('takes metadata property as an object', () => {
      expect(Command.getPropTypes().metadata).to.be.eql(PropTypes.object);
    });
  });

  describe(`construction`, () => {
    context('required properties', () => {
      it(`takes an object with targetId property as a string`, () => {
        const targetId = 'my-id';
        expect(
          new MyCommand({
            targetId,
          }).targetId
        ).to.be.equal(targetId);
      });

      it(`takes an object with targetId property as a guid`, () => {
        const targetId = new Guid();
        expect(
          new MyCommand({
            targetId,
          }).targetId
        ).to.be.equal(targetId);
      });
    });

    context('optional properties', () => {
      it(`takes an object with optional timestamp property as a date`, () => {
        const targetId = new Guid();
        const timestamp = new Date();
        const command = new MyCommand({ targetId, timestamp });
        expect(command.timestamp).to.be.equal(timestamp);
      });

      it('adds current date if property timestamp is missing on construction', () => {
        expect(new MyCommand({ targetId: 'my-id' }).timestamp).to.be.instanceof(
          Date
        );
      });

      it(`takes an object with optional metadata property as an object`, () => {
        const targetId = new Guid();
        const metadata = {
          key: 'value',
        };
        const command = new MyCommand({ targetId, metadata });
        expect(command.metadata).to.be.eql(metadata);
      });
    });

    describe('immutability', () => {
      it('makes the message instance immutable', () => {
        const message = new MyCustomCommand({
          targetId: 'my-id',
          name: 'set-durning-construction',
        });
        expect(Object.isFrozen(message)).to.be.true;
        // eslint-disable-next-line no-return-assign
        expect(() => (message.name = 'set-after')).to.throw(TypeError);
      });

      it('requires explicit constructor for messages with property initializers', () => {
        @define('MyDefaultCommand', { isRegistrable: false })
        class MyDefaultCommand extends Command {
          key: string;

          default = 'default';

          constructor(props: Partial<MyDefaultCommand>) {
            super();
            Object.assign(this, this.processProps(props));
            Object.freeze(this);
          }
        }

        const message = new MyDefaultCommand({
          targetId: 'my-id',
          key: 'my-key',
          timestamp: now,
        });
        expect(Object.isFrozen(message)).to.be.true;
        expect(message).to.be.eql({
          targetId: 'my-id',
          key: 'my-key',
          default: 'default',
          metadata: {},
          timestamp: now,
        });
      });
    });
  });

  describe(`accessors`, () => {
    it(`returns command target id as a string`, () => {
      const targetId = 'my-id';
      expect(
        new MyCommand({
          targetId,
        }).getId()
      ).to.be.equal(targetId);
    });

    it(`returns command target id as a guid`, () => {
      const targetId = new Guid();
      expect(
        new MyCommand({
          targetId,
        }).getId()
      ).to.be.equal(targetId);
    });
  });

  describe('scheduling', () => {
    describe('getters', () => {
      context('scheduling', () => {
        it('returns true if command is scheduled', () => {
          const assignment = new Assignment({
            assignmentId: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: now,
            assignerId: new Guid(),
            assignerType: 'MyEventSourceable',
          });
          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          expect(command.isScheduled()).to.be.true;
        });

        it('returns false if command is not scheduled', () => {
          const command = new MyCommand({ targetId: 'my-id' });
          expect(command.isScheduled()).to.be.false;
        });

        it('returns true if command can be delivered(deliver at date is in past now)', () => {
          const assignment = new Assignment({
            assignmentId: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: now,
            assignerId: new Guid(),
            assignerType: 'MyEventSourceable',
          });
          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          expect(command.isDeliverable()).to.be.true;
        });

        it(`returns true if command can be delivered(deliver at date is in past)`, () => {
          const assignment = new Assignment({
            assignmentId: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: new Date(new Date().getTime() - 1000),
            assignerId: new Guid(),
            assignerType: 'MyEventSourceable',
          });
          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          expect(command.isDeliverable()).to.be.true;
        });

        it(`returns false if command is not deliverable(deliver at date is in future)`, () => {
          const assignment = new Assignment({
            assignmentId: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: new Date(new Date().getTime() + 1000),
            assignerId: new Guid(),
            assignerType: 'MyEventSourceable',
          });
          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          expect(command.isScheduled()).to.be.true;
        });
      });
    });

    describe('mutators', () => {
      context('scheduling', () => {
        it('schedules command to be delivered at specific date with task id', () => {
          const assignmentId = 'my-custom-id-to-identify-scheduled-task';
          const assignerId = new Guid();
          const assignerType = 'MyEventSourceable';
          const deliverAt = now;

          const assignment = new Assignment({
            assignmentId,
            deliverAt,
            assignerId,
            assignerType,
          });

          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          const metadata = command.getMetadata();
          expect(metadata?.scheduling?.assignmentId).to.be.equal(assignmentId);
          expect(metadata?.scheduling?.assignerId).to.be.equal(assignerId);
          expect(metadata?.scheduling?.assignerType).to.be.equal(assignerType);
          expect(metadata?.scheduling?.deliverAt).to.be.equal(deliverAt);
        });
      });
    });
  });
});

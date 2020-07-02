import { expect } from 'chai';
import sinon from 'sinon';
import { PropTypes } from 'typend';
import { Command, Assignment } from '../../../src/components/command';
import { isDefinable } from '../../../src/utils/helpers';
import { define } from '../../../src/decorators/define';
import { ScheduleCommand } from '../../../src/domain/schedule-command';
import { Guid } from '../../../src/domain/value-objects/guid';

describe('ScheduleCommand', function() {
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
  class MyCommand extends Command {
    key: string;
  }

  it(`extends Command`, () => {
    expect(ScheduleCommand.prototype).to.be.instanceof(Command);
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(ScheduleCommand.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(ScheduleCommand.getTypeName()).to.equal('ScheduleCommand');
    expect(ScheduleCommand.prototype.getTypeName()).to.equal('ScheduleCommand');
  });

  describe('prop types', () => {
    it('takes required targetId property as a string or Guid', () => {
      expect(ScheduleCommand.getPropTypes().targetId).to.be.eql(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes required command property as a Command', () => {
      expect(ScheduleCommand.getPropTypes().command).to.be.eql(
        PropTypes.instanceOf(Command)
      );
    });

    it('takes timestamp property as a Date', () => {
      clock.restore();

      expect(ScheduleCommand.getPropTypes().timestamp).to.be.eql(
        PropTypes.instanceOf(Date)
      );
    });

    it('takes metadata property as an object', () => {
      expect(ScheduleCommand.getPropTypes().metadata).to.be.eql(
        PropTypes.object
      );
    });
  });

  describe(`construction`, () => {
    context('required properties', () => {
      it(`takes an object with targetId property as a string and command as Command instance`, () => {
        const targetId = 'my-id';
        const command = new MyCommand({ targetId, key: 'my-key' });
        const scheduleCommand = new ScheduleCommand({
          targetId,
          command,
        });
        expect(scheduleCommand.targetId).to.be.equal(targetId);
        expect(scheduleCommand.command).to.be.equal(command);
      });

      it(`takes an object with targetId property as a Guid and command as Command instance`, () => {
        const targetId = new Guid();
        const command = new MyCommand({ targetId, key: 'my-key' });
        const scheduleCommand = new ScheduleCommand({
          targetId,
          command,
        });
        expect(scheduleCommand.targetId).to.be.equal(targetId);
        expect(scheduleCommand.command).to.be.equal(command);
      });
    });

    describe('optional properties', () => {
      it(`takes an object with optional timestamp property as a date`, () => {
        const targetId = new Guid();
        const timestamp = new Date();
        const command = new MyCommand({ targetId, key: 'my-key' });
        const scheduleCommand = new ScheduleCommand({
          targetId,
          command,
          timestamp,
        });
        expect(scheduleCommand.timestamp).to.be.equal(timestamp);
      });

      it('adds current date if property timestamp is missing on construction', () => {
        const targetId = new Guid();
        const command = new MyCommand({ targetId, key: 'my-key' });
        expect(
          new ScheduleCommand({ targetId, command }).timestamp
        ).to.be.instanceof(Date);
      });

      it(`takes an object with optional metadata property as an object`, () => {
        const targetId = new Guid();
        const metadata = {
          key: 'value',
        };
        const command = new MyCommand({ targetId, key: 'my-key' });
        const scheduleCommand = new ScheduleCommand({
          targetId,
          command,
          metadata,
        });
        expect(scheduleCommand.metadata).to.be.eql(metadata);
      });
    });
  });

  describe('accessors', () => {
    it('returns delivery date for command', () => {
      const targetId = new Guid();
      const assignmentId = new Guid();
      const deliverAt = new Date(new Date().getTime() - 1000);
      const assignerId = new Guid();
      const assignerType = 'MyAssigner';

      const assignment = new Assignment({
        assignmentId,
        deliverAt,
        assignerId,
        assignerType,
      });
      const command = new MyCommand({
        targetId,
        key: 'foo',
      });
      command.schedule(assignment);
      const scheduleMessage = new ScheduleCommand({ targetId, command });
      expect(scheduleMessage.getDeliveryDate()).to.be.equal(deliverAt);
    });
  });

  describe(`evaluation`, () => {
    describe('evaluating delivery date', () => {
      it(`returns true if command can be delivered(deliver at date is in past)`, () => {
        const targetId = new Guid();
        const assignmentId = new Guid();
        const deliverAt = new Date(new Date().getTime() - 1000);
        const assignerId = new Guid();
        const assignerType = 'MyAssigner';

        const assignment = new Assignment({
          assignmentId,
          deliverAt,
          assignerId,
          assignerType,
        });
        const command = new MyCommand({
          targetId,
          key: 'foo',
        });
        command.schedule(assignment);
        const scheduleMessage = new ScheduleCommand({ targetId, command });
        expect(scheduleMessage.isDeliverable()).to.be.true;
      });

      it(`returns false if command is not deliverable(deliver at date is in future)`, () => {
        const targetId = new Guid();
        const assignmentId = new Guid();
        const deliverAt = new Date(new Date().getTime() + 1000);
        const assignerId = new Guid();
        const assignerType = 'MyAssigner';

        const assignment = new Assignment({
          assignmentId,
          deliverAt,
          assignerId,
          assignerType,
        });
        const command = new MyCommand({
          targetId,
          key: 'foo',
        });
        command.schedule(assignment);
        const scheduleMessage = new ScheduleCommand({ targetId, command });
        expect(scheduleMessage.isDeliverable()).to.be.false;
      });
    });
  });
});

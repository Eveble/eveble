import { expect } from 'chai';
import sinon from 'sinon';
import { PropTypes } from 'typend';
import { define } from '@eveble/core';
import { Command, Assignment } from '../../../src/components/command';
import { isDefinable } from '../../../src/utils/helpers';
import { ScheduleCommand } from '../../../src/domain/schedule-command';
import { Guid } from '../../../src/domain/value-objects/guid';

describe('ScheduleCommand', () => {
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
  class MyCommand extends Command<MyCommand> {
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
      clock.restore();
      const shape = PropTypes.interface({
        targetId: PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.interface({ toString: PropTypes.instanceOf(Function) }),
        ]),
        getId: PropTypes.instanceOf(Function),
        isDeliverable: PropTypes.instanceOf(Function),
        isScheduled: PropTypes.instanceOf(Function),
        schedule: PropTypes.instanceOf(Function),
        getAssignment: PropTypes.instanceOf(Function),
        timestamp: PropTypes.instanceOf(Date).isOptional,
        metadata: PropTypes.object.isOptional,
        getTimestamp: PropTypes.instanceOf(Function),
        assignMetadata: PropTypes.instanceOf(Function),
        hasMetadata: PropTypes.instanceOf(Function),
        getMetadata: PropTypes.instanceOf(Function),
        setCorrelationId: PropTypes.instanceOf(Function),
        getCorrelationId: PropTypes.instanceOf(Function),
        hasCorrelationId: PropTypes.instanceOf(Function),
        getTypeName: PropTypes.instanceOf(Function),
        toString: PropTypes.instanceOf(Function),
        getPropTypes: PropTypes.instanceOf(Function),
        toPlainObject: PropTypes.instanceOf(Function),
        validateProps: PropTypes.instanceOf(Function),
        getPropertyInitializers: PropTypes.instanceOf(Function),
        equals: PropTypes.instanceOf(Function),
        getSchemaVersion: PropTypes.instanceOf(Function),
        transformLegacyProps: PropTypes.instanceOf(Function),
        registerLegacyTransformer: PropTypes.instanceOf(Function),
        overrideLegacyTransformer: PropTypes.instanceOf(Function),
        hasLegacyTransformer: PropTypes.instanceOf(Function),
        getLegacyTransformers: PropTypes.instanceOf(Function),
        getLegacyTransformer: PropTypes.instanceOf(Function),
      });
      expect(ScheduleCommand.getPropTypes().command).to.be.eql(shape);
    });

    it('takes optional timestamp property as a Date', () => {
      clock.restore();

      expect(ScheduleCommand.getPropTypes().timestamp).to.be.eql(
        PropTypes.instanceOf(Date).isOptional
      );
    });

    it('takes optional metadata property as an object', () => {
      expect(ScheduleCommand.getPropTypes().metadata).to.be.eql(
        PropTypes.object.isOptional
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

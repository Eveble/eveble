import sinon from 'sinon';
import { expect } from 'chai';
import { Message } from '../../../src/components/message';
import { Command, Assignment } from '../../../src/components/command';
import { define } from '../../../src/decorators/define';
import { isDefinable } from '../../../src/utils/helpers';
import { Guid } from '../../../src/domain/value-objects/guid';

describe('Command', function() {
  let now;
  let clock;

  before(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  @define('MyCommand')
  class MyCommand extends Command {}

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

  describe(`construction`, () => {
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

    it(`takes an object with targetId property as a guid and timestamp as a date`, () => {
      const targetId = new Guid();
      const timestamp = new Date();
      const command = new MyCommand({ targetId, timestamp });
      expect(command.targetId).to.be.equal(targetId);
      expect(command.timestamp).to.be.equal(timestamp);
    });

    it('adds current date if property timestamp is missing on construction', () => {
      expect(new MyCommand({ targetId: 'my-id' }).timestamp).to.be.instanceof(
        Date
      );
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
            id: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: now,
            sourceId: new Guid(),
            sourceTypeName: 'MyEventSourceable',
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
            id: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: now,
            sourceId: new Guid(),
            sourceTypeName: 'MyEventSourceable',
          });
          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          expect(command.isDeliverable()).to.be.true;
        });

        it(`returns true if command can be delivered(deliver at date is in past)`, () => {
          const assignment = new Assignment({
            id: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: new Date(new Date().getTime() - 1000),
            sourceId: new Guid(),
            sourceTypeName: 'MyEventSourceable',
          });
          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          expect(command.isDeliverable()).to.be.true;
        });

        it(`returns false if command is not deliverable(deliver at date is in future)`, () => {
          const assignment = new Assignment({
            id: 'my-custom-id-to-identify-scheduled-task',
            deliverAt: new Date(new Date().getTime() + 1000),
            sourceId: new Guid(),
            sourceTypeName: 'MyEventSourceable',
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
          const id = 'my-custom-id-to-identify-scheduled-task';
          const sourceId = new Guid();
          const sourceTypeName = 'MyEventSourceable';
          const deliverAt = now;

          const assignment = new Assignment({
            id,
            deliverAt,
            sourceId,
            sourceTypeName,
          });

          const command = new MyCommand({ targetId: 'my-id' });
          command.schedule(assignment);
          const metadata = command.getMetadata();
          expect(metadata?.scheduling?.id).to.be.equal(id);
          expect(metadata?.scheduling?.sourceId).to.be.equal(sourceId);
          expect(metadata?.scheduling?.sourceTypeName).to.be.equal(
            sourceTypeName
          );
          expect(metadata?.scheduling?.deliverAt).to.be.equal(deliverAt);
        });
      });
    });
  });
});

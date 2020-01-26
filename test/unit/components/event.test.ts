import sinon from 'sinon';
import { expect } from 'chai';
import { Message } from '../../../src/components/message';
import { Event } from '../../../src/components/event';
import { define } from '../../../src/decorators/define';
import { isDefinable } from '../../../src/utils/helpers';
import { Guid } from '../../../src/domain/value-objects/guid';

describe('Event', function() {
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

  @define('MyEvent', { isRegistrable: false })
  class MyEvent extends Event {}

  it(`extends Message`, () => {
    expect(Event.prototype).to.be.instanceof(Message);
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(Event.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(Event.getTypeName()).to.equal('Event');
    expect(Event.prototype.getTypeName()).to.equal('Event');
  });

  describe(`construction`, () => {
    it(`takes an object with sourceId property as a string`, () => {
      const sourceId = 'my-id';
      expect(
        new MyEvent({
          sourceId,
        }).sourceId
      ).to.be.equal(sourceId);
    });

    it(`takes an object with sourceId property  as a guid`, () => {
      const sourceId = new Guid();
      expect(
        new MyEvent({
          sourceId,
        }).sourceId
      ).to.be.equal(sourceId);
    });

    it(`takes an object with sourceId property as a guid and timestamp as a date`, () => {
      const sourceId = new Guid();
      const timestamp = new Date();
      const event = new MyEvent({
        sourceId,
        timestamp,
      });
      expect(event.sourceId).to.be.equal(sourceId);
      expect(event.timestamp).to.be.equal(timestamp);
    });

    it('adds current date if property timestamp is missing on construction', () => {
      expect(new MyEvent({ sourceId: 'my-id' }).timestamp).to.be.instanceof(
        Date
      );
    });
  });

  describe(`accessors`, () => {
    it(`returns event source id as a string`, () => {
      const sourceId = 'my-id';
      expect(
        new MyEvent({
          sourceId,
        }).getId()
      ).to.be.equal(sourceId);
    });

    it(`returns event source id as a guid`, () => {
      const sourceId = new Guid();
      expect(
        new MyEvent({
          sourceId,
        }).getId()
      ).to.be.equal(sourceId);
    });
  });
});

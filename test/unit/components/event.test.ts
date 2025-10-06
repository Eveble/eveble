import sinon from 'sinon';
import { expect } from 'chai';
import { PropTypes } from 'typend';
import { Type } from '@eveble/core';
import { Message } from '../../../src/components/message';
import { Event } from '../../../src/components/event';
import { isTyped } from '../../../src/utils/helpers';
import { Guid } from '../../../src/domain/value-objects/guid';
import { types } from '../../../src';

describe('Event', () => {
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

  @Type('MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {}

  @Type('MyCustomEvent', { isRegistrable: false })
  class MyCustomEvent extends Event<MyCustomEvent> {
    name: string;
  }

  it(`extends Message`, () => {
    expect(Event.prototype).to.be.instanceof(Message);
  });

  it('ensures that type is defined', () => {
    expect(isTyped(Event.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(Event.getTypeName()).to.equal('Event');
    expect(Event.prototype.getTypeName()).to.equal('Event');
  });

  describe('prop types', () => {
    it('takes required sourceId property as a string or Guid', () => {
      expect(Event.getPropTypes().sourceId).to.be.eql(
        PropTypes.oneOf([
          PropTypes.instanceOf(String),
          PropTypes.instanceOf(Guid),
        ])
      );
    });

    it('takes optional version property as a number', () => {
      expect(Event.getPropTypes().version).to.be.eql(
        PropTypes.instanceOf(Number).isOptional
      );
    });

    it('takes optional timestamp property as a Date', () => {
      clock.restore();

      expect(Event.getPropTypes().timestamp).to.be.eql(
        PropTypes.instanceOf(Date).isOptional
      );
    });

    it('takes optional metadata property as an object', () => {
      expect(Event.getPropTypes().metadata).to.be.eql(
        PropTypes.object.isOptional
      );
    });
  });

  describe(`construction`, () => {
    context('required properties', () => {
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
    });

    context('optional properties', () => {
      it(`takes an object with optional timestamp property as a date`, () => {
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

      it(`takes an object with optional metadata property as an object`, () => {
        const sourceId = new Guid();
        const metadata = {
          key: 'value',
        };
        const event = new MyEvent({ sourceId, metadata });
        expect(event.metadata).to.be.eql(metadata);
      });
    });

    describe('immutability', () => {
      it('makes the message instance immutable', () => {
        const message = new MyCustomEvent({
          sourceId: 'my-id',
          name: 'set-durning-construction',
        });
        expect(Object.isFrozen(message)).to.be.true;
        // eslint-disable-next-line no-return-assign
        expect(() => (message.name = 'set-after')).to.throw(TypeError);
      });

      it('requires explicit constructor for messages with property initializers', () => {
        @Type('MyDefaultEvent', { isRegistrable: false })
        class MyDefaultEvent extends Event<MyDefaultEvent> {
          key: string;

          default? = 'default';

          constructor(props: types.ConstructorType<MyDefaultEvent>) {
            super(props as any);
            Object.assign(this, this.processProps(props));
            Object.freeze(this);
          }
        }

        const message = new MyDefaultEvent({
          sourceId: 'my-id',
          key: 'my-key',
          timestamp: now,
        });
        expect(Object.isFrozen(message)).to.be.true;
        expect(message).to.be.eql({
          sourceId: 'my-id',
          key: 'my-key',
          default: 'default',
          metadata: {},
          timestamp: now,
        });
      });
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

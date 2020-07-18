import sinon from 'sinon';
import { expect } from 'chai';
import { PropTypes } from 'typend';
import { Message } from '../../../src/components/message';
import { define } from '../../../src/decorators/define';
import { Serializable } from '../../../src/components/serializable';
import { isDefinable } from '../../../src/utils/helpers';

describe('Message', function () {
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

  @define('MyMessage', { isRegistrable: false })
  class MyMessage extends Message {}

  @define('MyCustomMessage', { isRegistrable: false })
  class MyCustomMessage extends Message {
    name: string;
  }

  it(`extends Serializable`, () => {
    expect(Message.prototype).to.be.instanceof(Serializable);
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(Serializable.prototype)).to.be.true;
  });

  it('defines the type name correctly', () => {
    expect(Message.getTypeName()).to.equal('Message');
    expect(Message.prototype.getTypeName()).to.equal('Message');
  });

  describe(`prop types`, () => {
    beforeEach(() => {
      clock.restore();
    });

    it('returns property types as an object', () => {
      expect(Message.getPropTypes()).to.be.eql({
        timestamp: PropTypes.instanceOf(Date).isOptional,
        metadata: PropTypes.object.isOptional,
        schemaVersion: PropTypes.instanceOf(Number).isOptional,
      });
    });
  });

  describe('construction', () => {
    it('initializes itself with current time as instance of Date if timestamp is undefined', () => {
      const message = new MyMessage();
      expect(message.timestamp).to.be.eql(now);
    });

    it('takes required timestamp as a instance of Date and assigns it', () => {
      const message = new MyMessage({ timestamp: now });
      expect(message.timestamp).to.be.eql(now);
    });

    it('takes metadata as an object and assigns it', () => {
      const metadata = { key: 'value' };
      const message = new MyMessage({ metadata });
      expect(message.metadata).to.be.eql(metadata);
    });

    it('requires explicit constructor for messages with property initializers', () => {
      @define('MyDefaultMessage', { isRegistrable: false })
      class MyDefaultMessage extends Message {
        key: string;

        default = 'default';

        constructor(props: Partial<MyDefaultMessage>) {
          super();
          Object.assign(this, this.processProps(props));
        }
      }

      const message = new MyDefaultMessage({ key: 'my-key', timestamp: now });
      expect(message).to.be.eql({
        key: 'my-key',
        default: 'default',
        metadata: {},
        timestamp: now,
      });
    });
  });

  describe('setters', () => {
    context('metadata', () => {
      it('attaches metadata to current instance of message', () => {
        const message = new MyCustomMessage({ name: 'Foo' });
        const metadata = {
          'my-key': 'my-value',
        };
        message.assignMetadata(metadata);
        expect(message.getMetadata()).to.be.eql(metadata);
      });

      it('attaches additional metadata to already existing metadata on message', () => {
        const message = new MyCustomMessage({ name: 'Foo' });
        const metadata = {
          'my-key': 'my-value',
        };
        const otherMetadata = {
          'other-key': 'other-value',
        };
        message.assignMetadata(metadata);
        message.assignMetadata(otherMetadata);
        expect(message.getMetadata()).to.be.eql({
          'my-key': 'my-value',
          'other-key': 'other-value',
        });
      });

      it('ensures that metadata is deeply extended', () => {
        const message = new MyCustomMessage({ name: 'Foo' });
        const metadata = {
          'level-1-a': {
            'level-2-a': 'level-2-a-value',
            'level-3-b': {
              'level-4-a': 'level-4-a-value',
            },
          },
        };
        const changedMetadata = {
          'level-1-a': {
            'level-2-a': 'level-2-a-value',
            'level-3-b': {
              'level-4-a': 'level-4-a-value',
              'level-4-b': 'level-4-b-value',
            },
          },
          'level-1-b': 'level-1-b-value',
        };
        message.assignMetadata(metadata);
        message.assignMetadata(changedMetadata);
        expect(message.getMetadata()).to.be.eql({
          'level-1-a': {
            'level-2-a': 'level-2-a-value',
            'level-3-b': {
              'level-4-a': 'level-4-a-value',
              'level-4-b': 'level-4-b-value',
            },
          },
          'level-1-b': 'level-1-b-value',
        });
      });
      describe('evaluation', () => {
        it('returns true if metadata is assigned to instance of message', () => {
          const message = new MyCustomMessage({ name: 'Foo' });
          const metadata = {
            'my-key': 'my-value',
          };
          message.assignMetadata(metadata);
          expect(message.hasMetadata()).to.be.true;
        });

        it('returns false if metadata is not assigned to instance of message', () => {
          const message = new MyCustomMessage({ name: 'Foo' });
          expect(message.hasMetadata()).to.be.false;
        });
      });

      describe(`correlation id`, () => {
        describe('setting', () => {
          it(`attaches correlation id with custom key`, () => {
            const id = 'my-id';
            const key = 'myProcessId';
            const name = 'my-name';

            const message = new MyCustomMessage({ name });
            message.setCorrelationId(key, id);
            expect(message.getMetadata()).to.be.eql({
              correlation: {
                myProcessId: id,
              },
            });
          });

          it(`attaches correlation id to message with event sourceable's type name and id`, () => {
            const id = 'my-id';
            const key = 'MyEventSourceable';
            const name = 'my-name';

            const message = new MyCustomMessage({ name });
            message.setCorrelationId(key, id);
            expect(message.getMetadata()).to.be.eql({
              correlation: {
                MyEventSourceable: id,
              },
            });
          });

          it(`supports namespaced keys by creating nested objects for databasees like MongoDB`, () => {
            const id = 'my-id';
            const key = 'MyNamespace.MyEventSourceable';
            const name = 'my-name';

            const message = new MyCustomMessage({ name });
            message.setCorrelationId(key, id);
            expect(message.getMetadata()).to.be.eql({
              correlation: {
                MyNamespace: {
                  MyEventSourceable: id,
                },
              },
            });

            expect(message.getCorrelationId(key)).to.be.equal(id);
            expect(message.hasCorrelationId(key)).to.be.true;
          });
        });

        describe('getters', () => {
          it(`returns message correlation id`, () => {
            const id = 'my-id';
            const key = 'MyEventSourceable';
            const name = 'my-name';

            const message = new MyCustomMessage({
              name,
            });

            message.setCorrelationId(key, id);
            expect(message.getCorrelationId(key)).to.be.equal(id);
          });

          it(`returns undefined if correlation id can't be found`, () => {
            const key = 'MyEventSourceable';
            const name = 'my-name';

            const message = new MyCustomMessage({
              name,
            });
            expect(message.getCorrelationId(key)).to.be.equal(undefined);
          });
        });

        describe('evaluation', () => {
          it(`returns true if message contains event correlation id`, () => {
            const id = 'my-id';
            const key = 'MyEventSourceable';
            const name = 'my-name';

            const message = new MyCustomMessage({
              name,
            });
            message.setCorrelationId(key, id);
            expect(message.hasCorrelationId(key)).to.be.true;
          });

          it(`returns false if message does not contain event correlation id`, () => {
            const key = 'MyEventSourceable';
            const name = 'my-name';

            const message = new MyCustomMessage({
              name,
            });

            expect(message.hasCorrelationId(key)).to.be.false;
          });
        });
      });
    });
  });
});

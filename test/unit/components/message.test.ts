import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
} from 'vitest';

import { PropTypes } from 'typend';
import { Type } from '@eveble/core';
import { Message } from '../../../src/components/message';
import { Serializable } from '../../../src/components/serializable';
import { isTyped } from '../../../src/utils/helpers';

describe('Message', () => {
  let now: Date;
  let clock: any;

  beforeAll(() => {
    now = new Date();
  });

  beforeEach(() => {
    clock = vi.useFakeTimers({ now });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  @Type('MyMessage', { isRegistrable: false })
  class MyMessage extends Message {}

  @Type('MyCustomMessage', { isRegistrable: false })
  class MyCustomMessage extends Message {
    name: string;
  }

  it(`extends Serializable`, () => {
    expect(Message.prototype).toBeInstanceOf(Serializable);
  });

  it('ensures that type is defined', () => {
    expect(isTyped(Serializable.prototype)).toBe(true);
  });

  it('defines the type name correctly', () => {
    expect(Message.getTypeName()).toBe('Message');
    expect(Message.prototype.getTypeName()).toBe('Message');
  });

  describe(`prop types`, () => {
    beforeEach(() => {
      vi.useRealTimers();
    });

    it('returns property types as an object', () => {
      expect(Message.getPropTypes()).toEqual({
        timestamp: PropTypes.instanceOf(Date).isOptional,
        metadata: PropTypes.object.isOptional,
        schemaVersion: PropTypes.instanceOf(Number).isOptional,
      });
    });
  });

  describe('construction', () => {
    it('initializes itself with current time as instance of Date if timestamp is undefined', () => {
      const message = new MyMessage();
      expect(message.timestamp).toBeInstanceOf(Date);
      expect(message.timestamp.getTime()).toBe(now.getTime());
    });

    it('takes required timestamp as a instance of Date and assigns it', () => {
      const message = new MyMessage({ timestamp: now });
      expect(message.timestamp.getTime()).toBe(now.getTime());
    });

    it('takes metadata as an object and assigns it', () => {
      const metadata = { key: 'value' };
      const message = new MyMessage({ metadata });
      expect(message.metadata).toEqual(metadata);
    });

    it('requires explicit constructor for messages with property initializers', () => {
      @Type('MyDefaultMessage', { isRegistrable: false })
      class MyDefaultMessage extends Message {
        key: string;

        default = 'default';

        constructor(props: Partial<MyDefaultMessage>) {
          super(props);
          Object.assign(this, this.processProps(props));
        }
      }

      const message = new MyDefaultMessage({ key: 'my-key', timestamp: now });
      expect(message).toEqual({
        key: 'my-key',
        default: 'default',
        metadata: {},
        timestamp: now,
      });
    });
  });

  describe('setters', () => {
    describe('metadata', () => {
      it('attaches metadata to current instance of message', () => {
        const message = new MyCustomMessage({ name: 'Foo' });
        const metadata = {
          'my-key': 'my-value',
        };
        message.assignMetadata(metadata);
        expect(message.getMetadata()).toEqual(metadata);
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
        expect(message.getMetadata()).toEqual({
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
        expect(message.getMetadata()).toEqual({
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
          expect(message.hasMetadata()).toBe(true);
        });

        it('returns false if metadata is not assigned to instance of message', () => {
          const message = new MyCustomMessage({ name: 'Foo' });
          expect(message.hasMetadata()).toBe(false);
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
            expect(message.getMetadata()).toEqual({
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
            expect(message.getMetadata()).toEqual({
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
            expect(message.getMetadata()).toEqual({
              correlation: {
                MyNamespace: {
                  MyEventSourceable: id,
                },
              },
            });

            expect(message.getCorrelationId(key)).toBe(id);
            expect(message.hasCorrelationId(key)).toBe(true);
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
            expect(message.getCorrelationId(key)).toBe(id);
          });

          it(`returns undefined if correlation id can't be found`, () => {
            const key = 'MyEventSourceable';
            const name = 'my-name';

            const message = new MyCustomMessage({
              name,
            });
            expect(message.getCorrelationId(key)).toBe(undefined);
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
            expect(message.hasCorrelationId(key)).toBe(true);
          });

          it(`returns false if message does not contain event correlation id`, () => {
            const key = 'MyEventSourceable';
            const name = 'my-name';

            const message = new MyCustomMessage({
              name,
            });

            expect(message.hasCorrelationId(key)).toBe(false);
          });
        });
      });
    });
  });
});

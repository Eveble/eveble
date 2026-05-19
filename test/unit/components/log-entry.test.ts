import { expect, describe, it } from 'vitest';

import { Type } from '@eveble/core';
import { derive } from '@traits-ts/core';
import { Log, LogMetadata } from '../../../src/components/log-entry';
import { TypeTrait } from '../../../src/traits/type.trait';

describe('Log', () => {
  @Type('MyClass')
  class MyClass extends derive(TypeTrait) {
    myMethod(first: string, second: string, third: string): void {
      Object.assign(this, { first, second, third });
    }

    static myStaticMethod(first: string, second: string): void {
      Object.assign(this, { first, second });
    }
  }

  const message = 'my-message';

  describe('construction', () => {
    it('takes message as a string and assigns it', () => {
      const log = new Log(message);
      expect(log.message).toBe(message);
    });

    it('initializes with empty metadata map', () => {
      const log = new Log(message);
      expect(log.metadata).toBeInstanceOf(Map);
      expect(log.metadata).toHaveLength(0);
    });

    it('initializes with empty options object', () => {
      const log = new Log(message);
      expect(log.options).toBeInstanceOf(Object);
      expect(Object.keys(log.options)).toHaveLength(0);
    });
  });

  describe('conversion', () => {
    it('converts log message to string', () => {
      expect(new Log(message).toString()).toBe(message);
    });
  });

  describe('describing log', () => {
    describe('on', () => {
      it(`sets target 'on' which log was done`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target);
        expect(log.getTarget()).toBe(target);
      });
    });

    describe('in', () => {
      it(`sets target's method function 'in' which log was done`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in(target.myMethod);
        expect(log.getTarget()).toBe(target);
        expect(log.method).toBe(target.myMethod);
        expect(log.methodName).toBe('myMethod');
      });

      it(`sets target's method function name as a String 'in' which log was done`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in('myMethod');
        expect(log.getTarget()).toBe(target);
        expect(log.methodName).toBe('myMethod');
        expect(log.method).toBe(target.myMethod);
      });
    });

    describe('with', () => {
      it(`adds additional metadata 'with' is related to log`, () => {
        const result = {
          first: 'first',
        };
        const keys = ['first', 'second'];
        const target = new MyClass();
        const log = new Log(message)
          .on(target)
          .in(target.myMethod)
          .with('result', result, keys);
        expect(log.hasMetadata('result')).toBe(true);
        expect(log.getMetadata('result')).toBeInstanceOf(LogMetadata);
        expect(log.getMetadata('result')).toEqual(
          new LogMetadata('result', result, keys)
        );
      });

      it(`allows to add multiple metadata items`, () => {
        const target = new MyClass();
        const log = new Log(message)
          .on(target)
          .in(target.myMethod)
          .with('first', 'first-value')
          .with('second', 'second-value');

        expect(log.hasMetadata('first')).toBe(true);
        expect(log.getMetadata('first')).toBeInstanceOf(LogMetadata);
        expect(log.getMetadata('first')).toEqual(
          new LogMetadata('first', 'first-value')
        );

        expect(log.hasMetadata('second')).toBe(true);
        expect(log.getMetadata('second')).toBeInstanceOf(LogMetadata);
        expect(log.getMetadata('second')).toEqual(
          new LogMetadata('second', 'second-value')
        );
      });

      it(`allows to add value-less metadata that converter handles explicitly`, () => {
        const target = new MyClass();
        const log = new Log(message)
          .on(target)
          .in(target.myMethod)
          .with('properties');
        expect(log.hasMetadata('properties')).toBe(true);
        expect(log.getMetadata('properties')).toBeInstanceOf(LogMetadata);
        expect(log.getMetadata('properties')).toEqual(
          new LogMetadata('properties')
        );
      });
    });

    describe('format', () => {
      it('allows to define additional formatting options', () => {
        const options = { isSimple: true };
        const target = new MyClass();
        const log = new Log(message).on(target).format(options);

        expect(log.options).toEqual(options);
      });

      it('ensures that formatting options can be chained', () => {
        const firstOptions = { isSimple: true };
        const secondOptions = { isColored: false };
        const target = new MyClass();
        const log = new Log(message)
          .on(target)
          .format(firstOptions)
          .format(secondOptions);

        expect(log.options).toEqual({ ...firstOptions, ...secondOptions });
      });
    });

    describe('level', () => {
      it('allows to set log entry level', () => {
        const log = new Log(message).setLevel('debug');
        expect(log.level).toBe('debug');
      });
    });
  });

  describe('getters', () => {
    describe('type name', () => {
      it(`returns target type name as type name`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target);
        expect(log.typeName).toBe('MyClass');
      });

      it(`returns target name based on constructor name`, () => {
        class MyOtherClass {}

        const target = new MyOtherClass();
        const log = new Log(message).on(target);
        expect(log.typeName).toBe('MyOtherClass');
      });

      it(`returns empty string if target is not set`, () => {
        const log = new Log(message);
        expect(log.typeName).toBe('');
      });
    });

    describe('method name', () => {
      it(`returns method name based on function's name property`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in('myMethod');
        expect(log.methodName).toBe('myMethod');
      });
      it(`returns method name based on direct named function`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in(target.myMethod);
        expect(log.methodName).toBe('myMethod');
      });
    });
  });

  describe('evaluation', () => {
    describe('isStaticMethod', () => {
      it('returns true if assigned method is static', () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in(MyClass.myStaticMethod);
        expect(log.methodName).toBe('myStaticMethod');
        expect(log.isStaticMethod()).toBe(true);
      });
      it('returns false if assigned method is prototype(instance)', () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in(target.myMethod);
        expect(log.isStaticMethod()).toBe(false);
      });
    });
  });
});

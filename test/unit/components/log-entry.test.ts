import { expect } from 'chai';
import { define } from '@eveble/core';
import { Log, LogMetadata } from '../../../src/components/log-entry';
import { DefinableMixin } from '../../../src/mixins/definable-mixin';

describe('Log', () => {
  @define('MyClass')
  class MyClass extends DefinableMixin {
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
      expect(log.message).to.be.equal(message);
    });

    it('initializes with empty metadata map', () => {
      const log = new Log(message);
      expect(log.metadata).to.be.instanceOf(Map);
      expect(log.metadata).to.be.empty;
    });

    it('initializes with empty options object', () => {
      const log = new Log(message);
      expect(log.options).to.be.instanceOf(Object);
      expect(log.options).to.be.empty;
    });
  });

  describe('conversion', () => {
    it('converts log message to string', () => {
      expect(new Log(message).toString()).to.be.equal(message);
    });
  });

  describe('describing log', () => {
    context('on', () => {
      it(`sets target 'on' which log was done`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target);
        expect(log.getTarget()).to.be.equal(target);
      });
    });

    context('in', () => {
      it(`sets target's method function 'in' which log was done`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in(target.myMethod);
        expect(log.getTarget()).to.be.equal(target);
        expect(log.method).to.be.equal(target.myMethod);
        expect(log.methodName).to.be.equal('myMethod');
      });

      it(`sets target's method function name as a String 'in' which log was done`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in('myMethod');
        expect(log.getTarget()).to.be.equal(target);
        expect(log.methodName).to.be.equal('myMethod');
        expect(log.method).to.be.equal(target.myMethod);
      });
    });

    context('with', () => {
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
        expect(log.hasMetadata('result')).to.be.true;
        expect(log.getMetadata('result')).to.be.instanceof(LogMetadata);
        expect(log.getMetadata('result')).to.be.eql(
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

        expect(log.hasMetadata('first')).to.be.true;
        expect(log.getMetadata('first')).to.be.instanceof(LogMetadata);
        expect(log.getMetadata('first')).to.be.eql(
          new LogMetadata('first', 'first-value')
        );

        expect(log.hasMetadata('second')).to.be.true;
        expect(log.getMetadata('second')).to.be.instanceof(LogMetadata);
        expect(log.getMetadata('second')).to.be.eql(
          new LogMetadata('second', 'second-value')
        );
      });

      it(`allows to add value-less metadata that converter handles explicitly`, () => {
        const target = new MyClass();
        const log = new Log(message)
          .on(target)
          .in(target.myMethod)
          .with('properties');
        expect(log.hasMetadata('properties')).to.be.true;
        expect(log.getMetadata('properties')).to.be.instanceof(LogMetadata);
        expect(log.getMetadata('properties')).to.be.eql(
          new LogMetadata('properties')
        );
      });
    });

    context('format', () => {
      it('allows to define additional formatting options', () => {
        const options = { isSimple: true };
        const target = new MyClass();
        const log = new Log(message).on(target).format(options);

        expect(log.options).to.be.eql(options);
      });

      it('ensures that formatting options can be chained', () => {
        const firstOptions = { isSimple: true };
        const secondOptions = { isColored: false };
        const target = new MyClass();
        const log = new Log(message)
          .on(target)
          .format(firstOptions)
          .format(secondOptions);

        expect(log.options).to.be.eql({ ...firstOptions, ...secondOptions });
      });
    });

    context('level', () => {
      it('allows to set log entry level', () => {
        const log = new Log(message).setLevel('debug');
        expect(log.level).to.be.equal('debug');
      });
    });
  });

  describe('getters', () => {
    describe('type name', () => {
      it(`returns target type name as type name`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target);
        expect(log.typeName).to.be.equal('MyClass');
      });

      it(`returns target name based on constructor name`, () => {
        class MyOtherClass {}

        const target = new MyOtherClass();
        const log = new Log(message).on(target);
        expect(log.typeName).to.be.equal('MyOtherClass');
      });

      it(`returns empty string if target is not set`, () => {
        const log = new Log(message);
        expect(log.typeName).to.be.equal('');
      });
    });

    describe('method name', () => {
      it(`returns method name based on function's name property`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in('myMethod');
        expect(log.methodName).to.be.equal('myMethod');
      });
      it(`returns method name based on direct named function`, () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in(target.myMethod);
        expect(log.methodName).to.be.equal('myMethod');
      });
    });
  });

  describe('evaluation', () => {
    describe('isStaticMethod', () => {
      it('returns true if assigned method is static', () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in(MyClass.myStaticMethod);
        expect(log.methodName).to.be.equal('myStaticMethod');
        expect(log.isStaticMethod()).to.be.true;
      });
      it('returns false if assigned method is prototype(instance)', () => {
        const target = new MyClass();
        const log = new Log(message).on(target).in(target.myMethod);
        expect(log.isStaticMethod()).to.be.false;
      });
    });
  });
});

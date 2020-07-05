import { expect } from 'chai';
import { ExtendableError } from '../../../src/components/extendable-error';

describe('MyExtendableError', function () {
  class MyExtendableError extends ExtendableError {}

  class MyError extends ExtendableError {
    constructor(messageOrData = 'The default message for this error') {
      super(messageOrData);
    }
  }

  class MyOtherError extends ExtendableError {
    message = 'The other default message for other error';
  }

  class MyCustomError extends ExtendableError {
    customKey: string;
  }

  it('is an instance of Error', () => {
    expect(new MyError()).to.be.instanceof(Error);
  });

  it('has same behavior as Error', () => {
    const props = {
      message: 'my-message',
      code: 123,
    };
    const error = new MyExtendableError(props);
    expect(error).to.be.instanceof(Error);
    expect(error).to.be.instanceof(MyExtendableError);
    expect(error.name).to.equal('MyExtendableError');
    expect(error.message).to.equal(props.message);
    expect(error.code).to.equal(props.code);
  });

  describe(`construction`, () => {
    it(`can be instantiated without passed arguments`, () => {
      const error = new MyExtendableError();
      expect(error.message).to.be.equal('');
    });

    it('takes optional message as a string during construction', () => {
      const message = 'This is a custom message';
      const error = new MyError(message);
      expect(error.message).to.be.equal(message);
    });

    it('takes optional properties matching prop types on construction', () => {
      const props = {
        message: 'my-message',
        code: 123,
        customKey: 'my-custom-key',
      };
      const error = new MyCustomError(props);
      expect(error.customKey).to.be.equal('my-custom-key');
    });

    it(`allows to set message as initializing class property`, () => {
      expect(new MyOtherError().message).to.be.equal(
        'The other default message for other error'
      );
    });

    it('throws the prototype message by default', () => {
      expect(() => {
        throw new MyError();
      }).to.throw(MyError.prototype.message);
    });

    it('includes a stack trace', () => {
      const error = new MyError();
      expect(error.stack).to.be.a('string');
    });
  });
});

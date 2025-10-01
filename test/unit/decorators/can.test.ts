import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Type, Entity } from '../../../src';
import {
  DISABLE_ACTION_VALIDATION_METHOD_KEY,
  ENABLE_ACTION_VALIDATION_METHOD_KEY,
} from '../../../src/constants/literal-keys';
import { can } from '../../../src/decorators/can';

chai.use(sinonChai);

describe('can', () => {
  const id = 'my-id';
  const joeDoe = 'Joe Doe';
  const joeMama = 'Joe Mama';
  let validationFn: any;
  let actionMethod: any;

  beforeEach(() => {
    validationFn = sinon.stub();
    actionMethod = sinon.stub();
  });

  @Type('can.Person')
  class Person extends Entity {
    name: string;

    constructor(props: { id: string; name: string }) {
      super(props);
    }

    @can((person: Person, name: string) => {
      validationFn(person, name);
    })
    changeName(name: string) {
      actionMethod(name);
    }
  }

  describe('validation', () => {
    it('ensures that validation function is executed upon enabled action validation', () => {
      const person = new Person({ id, name: joeDoe });
      person[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
      person.changeName(joeMama);
      expect(validationFn).to.be.calledOnce;
      expect(validationFn).to.be.calledWith(person, joeMama);
      expect(actionMethod).to.be.not.called;
    });

    it('ensures that action method is not executed on action validation', () => {
      const person = new Person({ id, name: joeDoe });
      person[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
      person.changeName(joeMama);
      expect(validationFn).to.be.calledOnce;
      expect(actionMethod).to.be.not.called;
    });

    it('ensures that validation function is skipped on disabled action validation', () => {
      const person = new Person({ id, name: joeDoe });
      person[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
      person[DISABLE_ACTION_VALIDATION_METHOD_KEY]();
      person.changeName(joeMama);
      expect(actionMethod).to.be.calledOnce;
      expect(validationFn).to.be.not.called;
    });

    it('ensures that action method is called upon disabled action validation', () => {
      const person = new Person({ id, name: joeDoe });
      person[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
      person[DISABLE_ACTION_VALIDATION_METHOD_KEY]();
      person.changeName(joeMama);
      expect(actionMethod).to.be.calledOnce;
      expect(actionMethod).to.be.calledWith(joeMama);
      expect(validationFn).to.be.not.called;
    });
  });
});

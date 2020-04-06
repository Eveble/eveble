import { stubInterface } from 'ts-sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { types } from '../../../../src/types';
import { AbilityAssertion } from '../../../../src/domain/assertions/ability-assertion';
import { Asserter } from '../../../../src/domain/asserter';
import {
  SAVE_STATE_METHOD_KEY,
  ROLLBACK_STATE_METHOD_KEY,
} from '../../../../src/constants/literal-keys';

chai.use(sinonChai);

describe(`AbilityAssertion`, () => {
  let entity: any;
  let asserter: any;

  beforeEach(() => {
    entity = stubInterface<types.Entity>();
    asserter = new Asserter();
    asserter.setEntity(entity);
  });

  describe('extends asserter API', () => {
    it('ensure.is.ableTo', () => {
      const assertion = new AbilityAssertion(asserter);
      expect(assertion.getApi().get('ensure.is.ableTo')).to.be.instanceof(
        AbilityAssertion
      );
    });

    it('is.ableTo', () => {
      const assertion = new AbilityAssertion(asserter);
      expect(assertion.getApi().get('is.ableTo')).to.be.instanceof(
        AbilityAssertion
      );
    });
  });

  describe('ensures ability to change state', () => {
    it('ensures that state of entity is being snapshotted before validation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = sinon.stub();
      entity.myAction.returns('result');

      entity[SAVE_STATE_METHOD_KEY] = sinon.stub();
      expect(asserter.ensure.is.ableTo.myAction(...args)).to.be.equal('result');
      expect(entity.myAction).to.be.calledOnce;
      expect(entity.myAction).to.be.calledWithExactly(...args);
      expect(entity[SAVE_STATE_METHOD_KEY]).to.be.calledBefore(entity.myAction);
    });

    it('ensures that state of entity is being rollbacked after validation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = sinon.stub();
      entity.myAction.returns('result');

      expect(asserter.ensure.is.ableTo.myAction(...args)).to.be.equal('result');
      expect(entity.myAction).to.be.calledOnce;
      expect(entity.myAction).to.be.calledWithExactly(...args);
      expect(entity[ROLLBACK_STATE_METHOD_KEY]).to.be.calledAfter(
        entity.myAction
      );
    });
  });

  describe('evaluation of ability to change state', () => {
    it('returns true for successful evaluation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = sinon.stub();
      entity.myAction.returns(true);

      expect(asserter.is.ableTo.myAction(...args)).to.be.true;
      expect(entity.myAction).to.be.calledOnce;
      expect(entity.myAction).to.be.calledWithExactly(...args);
    });

    it('ensures that state of entity is being snapshotted before evaluation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = sinon.stub();
      entity.myAction.returns(true);
      entity[SAVE_STATE_METHOD_KEY] = sinon.stub();

      expect(asserter.is.ableTo.myAction(...args)).to.be.true;
      expect(entity[SAVE_STATE_METHOD_KEY]).to.be.calledBefore(entity.myAction);
    });

    it('ensures that state of entity is being rollbacked after validation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = sinon.stub();
      entity.myAction.returns(true);

      expect(asserter.is.ableTo.myAction(...args)).to.be.true;
      expect(entity[ROLLBACK_STATE_METHOD_KEY]).to.be.calledAfter(
        entity.myAction
      );
    });

    it('returns false for failed evaluation', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = sinon.stub();
      entity.myAction.throws(new Error());

      expect(asserter.is.ableTo.myAction(...args)).to.be.false;
      expect(entity.myAction).to.be.calledOnce;
      expect(entity.myAction).to.be.calledWithExactly(...args);
    });

    it('ensures that state of entity is being rollbacked if action throws error', () => {
      const assertion = new AbilityAssertion(asserter);
      asserter.registerAssertion(assertion);
      const args = [1, 2, 3, 4];

      entity.myAction = sinon.stub();
      entity.myAction.throws(new Error());

      expect(asserter.is.ableTo.myAction(...args)).to.be.false;
      expect(entity[ROLLBACK_STATE_METHOD_KEY]).to.be.calledAfter(
        entity.myAction
      );
    });
  });
});

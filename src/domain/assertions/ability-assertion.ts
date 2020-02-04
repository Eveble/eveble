import { Assertion } from '../assertion';
import { types } from '../../types';
import {
  SAVE_STATE_METHOD_KEY,
  ROLLBACK_STATE_METHOD_KEY,
} from '../../constants/literal-keys';

export class AbilityAssertion extends Assertion {
  public api: Map<string, Function> = new Map([
    ['ensure.is.ableTo', this.ensureIsAbleTo as Function],
    ['is.ableTo', this.isAbleTo as Function],
  ]);

  /**
   * Ensures that `Entity` is able to handle an action.
   * @param args - Arguments that should be passed to action on `Entity`.
   * @returns `Asserter` implementation instance.
   */
  ensureIsAbleTo(...args: any[]): types.Asserter {
    const action = this.asserter.getAction();
    const entity = this.asserter.getEntity();
    entity[SAVE_STATE_METHOD_KEY]();
    entity[action.toString()](...args);
    entity[ROLLBACK_STATE_METHOD_KEY]();
    return this.asserter;
  }

  /**
   * Ensures that `Entity` is able to handle an action.
   * @param args - Arguments that should be passed to action on `Entity`.
   * @returns `Asserter` implementation instance.
   */
  isAbleTo(...args: any[]): boolean {
    const action = this.asserter.getAction();
    const entity = this.asserter.getEntity();
    entity[SAVE_STATE_METHOD_KEY]();
    let isAble = true;
    try {
      entity[action.toString()](...args);
    } catch (e) {
      isAble = false;
    }
    entity[ROLLBACK_STATE_METHOD_KEY]();
    return isAble;
  }
}

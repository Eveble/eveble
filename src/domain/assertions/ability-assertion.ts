import { Assertion } from '../assertion';
import {
  DISABLE_ACTION_VALIDATION_METHOD_KEY,
  ENABLE_ACTION_VALIDATION_METHOD_KEY,
} from '../../constants/literal-keys';

export class AbilityAssertion extends Assertion {
  /**
   * Since our goal is to enable expressive API in form of:
   * @example
   *```ts
   * entity.ensure.is.ableTo.doAction(...)
   *```
   * We need to use Proxy to pass-through all calls to the entity itself
   * (entity state will be not changed upon invoking method).
   * @remarks
   * The `entity.ensure` getter-method will return a Proxified instance of the
   * `Entity`. This proxified instance listens to all get methods and
   * catches the requested method name.
   *
   * If the requested get method is named `is` - `is` an existing api registered
   * on `Asserter` with `AbilityAssertion` as assertion API.
   * This will return an object that will include property:
   *```ts
   * {ableTo: ...}
   *```
   * That will be fired with code below.
   * @remarks
   * Same approach is used for evaluator api `is.ableTo`(returning boolean
   * by catching any thrown error) - however it was replaced by
   * `Entity.prototype.can` method directly build on Entity.
   * The `is.ableTo` legacy code is still available to show possibilities of
   * building custom assertion apis without direct modification of
   * `Entity` or its subclasses - to have a assertion api code shared
   * 'globally'.
   */
  public api: Map<string, any> = new Map([
    // Validation - ensures that `Entity` is able to handle an action(throws error)
    [
      'ensure.is.ableTo',
      new Proxy(this, {
        get(target: any, propKey: string): any {
          const entity = target.asserter.getEntity();
          if (typeof entity[propKey] === 'function') {
            const proxifiedMethod = new Proxy(entity[propKey], {
              apply(_targetMethod, _thisArg, args): any {
                entity[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
                const result = entity[propKey](...args);
                entity[DISABLE_ACTION_VALIDATION_METHOD_KEY]();
                target.asserter.clearAction();
                return result;
              },
            });
            return proxifiedMethod;
          }
          return entity[propKey];
        },
      }),
    ],
    // Evaluation - evaluates that `Entity` is able to handle an action(returns boolean)
    [
      'is.ableTo',
      new Proxy(this, {
        get(target: any, propKey: string): any {
          const entity = target.asserter.getEntity();
          if (typeof entity[propKey] === 'function') {
            const proxifiedMethod = new Proxy(entity[propKey], {
              apply(_targetMethod, _thisArg, args): any {
                entity[ENABLE_ACTION_VALIDATION_METHOD_KEY]();
                let isAble = true;
                try {
                  entity[propKey](...args);
                } catch (e) {
                  isAble = false;
                }
                entity[DISABLE_ACTION_VALIDATION_METHOD_KEY]();
                return isAble;
              },
            });
            return proxifiedMethod;
          }
          return entity[propKey];
        },
      }),
    ],
  ]);
}

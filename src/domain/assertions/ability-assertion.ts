import { Assertion } from '../assertion';
import {
  SAVE_STATE_METHOD_KEY,
  ROLLBACK_STATE_METHOD_KEY,
} from '../../constants/literal-keys';

export class AbilityAssertion extends Assertion {
  /**
   * Since our goal is to enable expressive API in form of:
   * @example
   *```ts
   * entity.ensure.is.ableTo.doAction(...)
   *```
   * We need to use Proxy to pass-through all calls to the entity itself
   * (entity instance will be not set upon assertion registration)
   */
  public api: Map<string, any> = new Map([
    [
      'ensure.is.ableTo',
      new Proxy(this, {
        get(target: any, propKey: string): any {
          const entity = target.asserter.getEntity();
          if (typeof entity[propKey] === 'function') {
            const proxifiedMethod = new Proxy(entity[propKey], {
              apply(_targetMethod, _thisArg, args): any {
                entity[SAVE_STATE_METHOD_KEY]();
                const result = entity[propKey](...args);
                entity[ROLLBACK_STATE_METHOD_KEY]();
                return result;
              },
            });
            return proxifiedMethod;
          }
        },
      }),
    ],
    [
      'is.ableTo',
      new Proxy(this, {
        get(target: any, propKey: string): any {
          const entity = target.asserter.getEntity();
          if (typeof entity[propKey] === 'function') {
            const proxifiedMethod = new Proxy(entity[propKey], {
              apply(_targetMethod, _thisArg, args): any {
                entity[SAVE_STATE_METHOD_KEY]();
                let isAble = true;
                try {
                  entity[propKey](...args);
                } catch (e) {
                  isAble = false;
                }
                entity[ROLLBACK_STATE_METHOD_KEY]();
                return isAble;
              },
            });
            return proxifiedMethod;
          }
        },
      }),
    ],
  ]);
}

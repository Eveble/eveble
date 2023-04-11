import { IS_ACTION_VALIDATED_METHOD_KEY } from '../constants/literal-keys';
import { Entity } from '../domain/entity';

/**
 * Decorates action(method) of `Entity`.
 * @param target - Target which method parameter is being decorated.
 * @param methodName - Method name which parameter is being decorated.
 * @param descriptor - Type matching `PropertyDescriptor`
 * @remarks
 * This decorators have two flows - one upon applying decorator to class method and one
 * upon executing runtime the method itself.
 *
 * First flow upon applying the decorator evaluates if applied target(class) is
 * indeed child(instanceof) `Entity` class from Eveble.
 *
 * Second flow(ACTION-VALIDATIOn) upon executing method(action) evaluates if
 * `ACTION_VALIDATION_KEY` on class instance is set to `true`.
 *
 * To enable action validation run:
 * ```ts
 * myInstance[ENABLE_ACTION_VALIDATION_METHOD_KEY]()
 * ```
 * To disable:
 * ```ts
 * myInstance[DISABLE_ACTION_VALIDATION_METHOD_KEY]()
 * ```
 *
 * What it essentials does is mark runtime wise that validator function
 * passed to `@can()` decorator should or shouldn't be running
 * before executing the method itself.
 *
 * This is used to add additional validation logic to `Entities`
 * without necessity of creating multiple confusing methods which one:
 * 1. validates if action can take place
 * 2. changes the state
 *
 * After execution the flag `ACTION_VALIDATION_KEY` is set to
 * `false` always to prevent further execution.
 *
 * @example
 *```ts
 * @define()
 * class Task extends Entity {
 *
 *   @can((_task: Task, priority: number) => {
 *     if (priority > 3) {
 *       throw new PriorityOutOfRangeError(priority);
 *     }
 *   })
 *   changePriority(priority: 0 | 1 | 2 | 3): void {
 *     this.priority = priority;
 *   }
 *
 *   @can((task: Task) => {
 *     task.on('expire').ensure.is.not.inState(Task.STATES.completed);
 *     task.on('expire').ensure.is.not.inState(Task.STATES.completed);
 *   })
 *   expire(): void {
 *     this.setState(Task.STATES.expired);
 *   }
 * }
 *```
 */
export const can =
  (validator: Function) =>
  (target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    if (target.prototype instanceof Entity) {
      throw new Error(
        `Only 'Entity' child classes actions(methods) can be decorated with @can(...) decorator`
      );
    }
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]): any {
      if (this[IS_ACTION_VALIDATED_METHOD_KEY]()) {
        return validator(this, ...args);
      }
      const result = originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };

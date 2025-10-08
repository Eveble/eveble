import { trait } from '@traits-ts/core';

export const ValidableTrait = trait(
  (base) =>
    class extends base {
      /**
       * Sets validator on `ValueObject` in form of `onValidation` hook.
       * @param validator - Function validating ValueObject properties.
       */
      public static setValidator(validator: (...args: any[]) => boolean): void {
        (this.prototype as any).overrideHook(
          'onValidation',
          'validation',
          validator
        );
      }

      /**
       * Returns `ValueObject` validator from `onValidation` hook.
       * @returns Validation `Function` if assigned, else `undefined`.
       */
      public static getValidator(): () => boolean {
        return (this.prototype as any).getHook('onValidation', 'validation');
      }

      /**
       * Removes validation from `onValidation` hook.
       */
      public static removeValidator(): void {
        (this.prototype as any).removeHook('onValidation', 'validation');
      }

      /**
       * Evaluates if validator is assigned to `ValueObject`
       * @returns Returns `true` if validator is assigned, else `false`.
       */
      public static hasValidator(): boolean {
        return (this.prototype as any).hasHook('onValidation', 'validation');
      }
    }
);

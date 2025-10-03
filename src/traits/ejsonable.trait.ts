import { trait } from '@traits-ts/core';
import { types } from '../types';
import { SerializableTrait } from './serializable.trait';

export const EjsonableTrait = trait(
  [SerializableTrait],
  (base) =>
    class extends base {
      /**
       * Gets the type name of the class or instance.
       * @returns The type name as a string.
       */
      /**
       * @alias getTypeName
       * @remarks
       * Compatibility for EJSON serializer: `@eveble/ejson`
       */
      public typeName(): types.TypeName {
        return this.getTypeName();
      }

      /**
       * @alias getTypeName
       * @remarks
       * Compatibility for EJSON serializer: `@eveble/ejson`
       */
      public static typeName(): types.TypeName {
        return this.getTypeName();
      }
    }
);

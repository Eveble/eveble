import 'reflect-metadata';
import { getTypeName } from '@eveble/helpers';
import { instanceOf } from 'typend';
import { types } from '../types';
import {
  NotVersionableError,
  InvalidLegacyTransformerError,
} from '../mixins/versionable-mixin';

/**
 * Annotates legacy schema transformer method on a class that will used for processing legacy
 * properties(data).
 * @param schemaVersion - Schema version for which legacy transformation will be done.
 * @example
 *```ts
 * // In the best interest of future developer's sanity is to keep track
 * // of previous type versions. You can define previous prop types of a class as type
 * // and assign it as generic type at @version<T>(schemaVersion: number)
 *
 * type CustomerV0 = {
 *   firstName: string;
 *   lastName: string;
 *   city: string;
 *   street: string;
 * };
 *
 * @define('Customer')
 * class Customer extends Serializable {
 *   name: string;
 *
 *   address: string;
 *
 *   @version<CustomerV0>(1)
 *   transformToVersion1(props: types.Props): types.Props {
 *     props.name = `${props.firstName} ${props.lastName}`;
 *     props.address = `${props.city}, ${props.street}`;
 *     delete props.firstName;
 *     delete props.lastName;
 *     delete props.city;
 *     delete props.street;
 *     return props;
 *   }
 * }
 *```
 */
export function version<T>(schemaVersion: number): any {
  return function (proto: types.Prototype, propertyKey: string): void {
    const target: any = proto.constructor;
    const descriptor:
      | PropertyDescriptor
      | undefined = Object.getOwnPropertyDescriptor(proto, propertyKey);

    const type: 'property' | 'method' =
      descriptor === undefined ? 'property' : 'method';

    if (type !== 'method') {
      throw new InvalidLegacyTransformerError(
        getTypeName(target) as types.TypeName,
        propertyKey,
        schemaVersion
      );
    }

    if (
      !instanceOf<types.Versionable>(proto) ||
      !instanceOf<types.Hookable>(proto)
    ) {
      throw new NotVersionableError(getTypeName(target) as types.TypeName);
    }

    if (!proto.hasHook('onConstruction', 'versionable')) {
      proto.registerHook(
        'onConstruction',
        'versionable',
        proto.transformLegacyProps
      );
    }

    proto.registerLegacyTransformer(schemaVersion, descriptor?.value);
  };
}

import { injectable } from 'inversify';
import { SerializableMixin } from './serializable-mixin';
import { types } from '../types';

@injectable()
export class EjsonableMixin extends SerializableMixin {
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

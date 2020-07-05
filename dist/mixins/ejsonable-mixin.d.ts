import { SerializableMixin } from './serializable-mixin';
import { types } from '../types';
export declare class EjsonableMixin extends SerializableMixin {
    typeName(): types.TypeName;
    static typeName(): types.TypeName;
}

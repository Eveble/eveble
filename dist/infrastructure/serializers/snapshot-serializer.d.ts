import { types } from '../../types';
import 'reflect-metadata';
export declare class SnapshotSerializer implements types.SnapshotSerializer {
    protected serializer: types.Serializer;
    serialize(eventSourceable: types.EventSourceable): Record<string, any>;
    deserialize(_EventSourceableType: types.EventSourceableType, serializedEventSourceable: string): types.EventSourceable;
}

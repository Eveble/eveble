import { types } from '../types';
import { Guid } from '../domain/value-objects/guid';
export declare class EventSourceableRepository implements types.EventSourceableRepository {
    protected injector: types.Injector;
    protected config: types.Configurable;
    protected log: types.Logger;
    protected commitStore: types.CommitStore;
    save(eventSourceable: types.EventSourceable): Promise<types.StorageIdentifiers>;
    find(EventSourceableType: types.EventSourceableType, eventSourceableId: string | Guid): Promise<types.EventSourceable | undefined>;
    hasBySourceId(eventSourceableId: string | Guid): Promise<boolean>;
    makeSnapshotOf(eventSourceable: types.EventSourceable): Promise<string | undefined>;
    getSnapshotOf(EventSourceableType: types.EventSourceableType, eventSourceableId: string | Guid): Promise<types.EventSourceable | undefined>;
    isSnapshotting(): boolean;
    protected restoreFromSnapshot(EventSourceableType: types.EventSourceableType, eventSourceableId: string | Guid): Promise<types.EventSourceable | undefined>;
    protected rehydrateFromEventHistory(EventSourceableType: types.EventSourceableType, eventSourceableId: string | Guid): Promise<types.EventSourceable | undefined>;
}

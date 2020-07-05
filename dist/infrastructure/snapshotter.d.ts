import { types } from '../types';
import { Guid } from '../domain/value-objects/guid';
export declare class Snapshotter implements types.Snapshotter {
    protected config: types.Configurable;
    protected log: types.Logger;
    protected storage: types.SnapshotStorage;
    initialize(): void;
    makeSnapshotOf(eventSourceable: types.EventSourceable): Promise<string | undefined>;
    getSnapshotOf(EventSourceableType: types.EventSourceableType, eventSourceableId: string | Guid): Promise<types.EventSourceable | undefined>;
    protected getVersionFrequency(): number;
    protected saveToStorage(eventSourceable: types.EventSourceable): Promise<string | undefined>;
    protected updateOnStorage(eventSourceable: types.EventSourceable, lastSnapshot: types.EventSourceable): Promise<string>;
    protected logInsufficientPassedVersionsForSnapshot(eventSourceable: types.EventSourceable, lastSnapshot?: types.EventSourceable): void;
}

import { injectable } from 'inversify';
import { types } from '../../types';
import { Guid } from '../../domain/value-objects/guid';

@injectable()
export class InMemorySnapshotStorage implements types.SnapshotStorage {
  protected snapshots: Map<string, types.EventSourceable>;

  constructor() {
    this.snapshots = new Map();
  }

  async save(
    eventSourceable: types.EventSourceable
  ): Promise<string | undefined> {
    const id = eventSourceable.getId().toString();
    this.snapshots.set(id, eventSourceable);
    return id;
  }

  async findById(
    _eventSourceableType: types.EventSourceableType,
    eventSourceableId: string | types.Stringifiable
  ): Promise<types.EventSourceable | undefined> {
    const id = eventSourceableId.toString();
    return this.snapshots.get(id);
  }

  async update(
    eventSourceable: types.EventSourceable,
    _lastSnapshot?: types.EventSourceable
  ): Promise<boolean> {
    const id = eventSourceable.getId().toString();
    this.snapshots.set(id, eventSourceable);
    return true;
  }
}

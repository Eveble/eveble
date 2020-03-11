import { inject, injectable } from '@parisholley/inversify-async';
import { types } from '../../types';
import { BINDINGS } from '../../constants/bindings';
import 'reflect-metadata';

@injectable()
export class SnapshotSerializer implements types.SnapshotSerializer {
  @inject(BINDINGS.Serializer)
  protected serializer: types.Serializer;

  /**
   * Serializes `EventSourceable` instance.
   * @param eventSourceable - Instance implementing `EventSourceable` interface.
   * @returns Serialized event sourceable as a string.
   */
  public serialize(eventSourceable: types.EventSourceable): string {
    const data = this.serializer.toData(eventSourceable);
    return this.serializer.stringify(data);
  }

  /**
   * Deserializes serialized event sourceable.
   * @param EventSourceableType - Event sourceable type(constructor).
   * @param serializedEventSourceable - Serialized event sourceable as a string.
   * @returns Deserialized instance of `EventSourceable`.
   */
  public deserialize(
    _EventSourceableType: types.EventSourceableType,
    serializedEventSourceable: string
  ): types.EventSourceable {
    const data = this.serializer.parse(serializedEventSourceable);
    return this.serializer.fromData(data) as any;
  }
}

import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach } from 'vitest';

import { Type } from '@eveble/core';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { BINDINGS } from '../../../src/constants/bindings';
import { EventSourceable } from '../../../src/domain/event-sourceable';

describe(`SnapshotSerializer`, () => {
  @Type('MyEventSourceable', { isRegistrable: false })
  class MyEventSourceable extends EventSourceable {
    key: string;
  }

  let injector: Injector;
  let serializer: any;
  let esSerializer: SnapshotSerializer;

  beforeEach(() => {
    serializer = mock<types.Serializer>();

    injector = new Injector();
    esSerializer = new SnapshotSerializer();

    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .toConstantValue(serializer);
    injector.injectInto(esSerializer);
  });

  it('serializes event sourceable', () => {
    const serializedEs = 'my-fake-serialized-es';
    const data = {
      $type: 'MyEventSourceable',
      key: 'my-value',
    };
    const instance = new MyEventSourceable({
      id: 'my-id',
      key: 'my-value',
    });
    serializer.toData.calledWith(instance).mockReturnValue(data);
    serializer.stringify.calledWith(data).mockReturnValue(serializedEs);

    expect(esSerializer.serialize(instance)).toEqual({
      _id: 'my-id',
      snapshot: serializedEs,
    });
    expect(serializer.toData).toHaveBeenCalledTimes(1);
    expect(serializer.toData).toHaveBeenCalledWith(instance);
    expect(serializer.stringify).toHaveBeenCalledTimes(1);
    expect(serializer.stringify).toHaveBeenCalledWith(data);
  });

  it('deserializes serialized event sourceable', () => {
    const serializedEs = 'my-fake-serialized-es';
    const data = {
      $type: 'MyEventSourceable',
      key: 'my-value',
    };
    const instance = new MyEventSourceable({
      key: 'my-value',
    });
    serializer.parse.calledWith(serializedEs).mockReturnValue(data);
    serializer.fromData.calledWith(data).mockReturnValue(instance);

    expect(esSerializer.deserialize(MyEventSourceable, serializedEs)).toBe(
      instance
    );
    expect(serializer.parse).toHaveBeenCalledTimes(1);
    expect(serializer.parse).toHaveBeenCalledWith(serializedEs);
    expect(serializer.fromData).toHaveBeenCalledTimes(1);
    expect(serializer.fromData).toHaveBeenCalledWith(data);
  });
});

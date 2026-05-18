import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach } from 'vitest';

import { Type } from '@eveble/core';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Guid } from '../../../src/domain/value-objects/guid';
import { Injector } from '../../../src/core/injector';

describe(`CommitSerializer`, () => {
  @Type('CommitMongoDBStorage.MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    name: string;
  }
  @Type('CommitMongoDBStorage.MyEvent', { isRegistrable: false })
  class MyEvent extends Event<MyEvent> {
    name: string;
  }

  const now = new Date();
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';

  const generateCommit = (
    commitId: string,
    eventSourceableId: string,
    version: number
  ): Commit => {
    const event = new MyEvent({
      sourceId: eventSourceableId,
      timestamp: now,
      name: 'Foo',
      version,
    });
    const command = new MyCommand({
      targetId: eventSourceableId,
      timestamp: now,
      name: 'Foo',
    });
    const receiver = new CommitReceiver({
      state: 'received',
      appId,
      workerId,
      receivedAt: now,
    });

    return new Commit({
      id: commitId,
      sourceId: eventSourceableId.toString(),
      version,
      eventSourceableType: 'CommitMongoDBStorage.MyEventSourceable',
      events: [event],
      commands: [command],
      insertedAt: now,
      sentBy: appId,
      receivers: [receiver],
    });
  };

  const serializeId = (
    id: string | Guid
  ): string | { _type: string; id: string } => {
    if (id instanceof Guid) {
      return {
        _type: 'Guid',
        id: id.toString(),
      };
    }
    return id.toString();
  };

  const generateSerializedCommit = (
    commitId: string,
    eventSourceableId: string,
    version: number
  ): Record<string, any> => {
    const props = {
      _id: commitId,
      id: commitId,
      sourceId: eventSourceableId.toString(),
      version,
      eventSourceableType: 'CommitMongoDBStorage.MyEventSourceable',
      events: [
        {
          type: 'CommitMongoDBStorage.MyEvent',
          data: {
            _type: 'CommitMongoDBStorage.MyEvent',
            sourceId: serializeId(eventSourceableId),
            timestamp: now,
            name: 'Foo',
            version,
          },
        },
      ],
      commands: [
        {
          type: 'CommitMongoDBStorage.MyCommand',
          data: {
            _type: 'CommitMongoDBStorage.MyCommand',
            targetId: serializeId(eventSourceableId),
            timestamp: now,
            name: 'Foo',
          },
        },
      ],
      insertedAt: now,
      eventTypes: ['CommitMongoDBStorage.MyEvent'],
      commandTypes: ['CommitMongoDBStorage.MyCommand'],
      sentBy: appId,
      receivers: [
        {
          appId,
          workerId,
          state: 'received',
          receivedAt: now,
        },
      ],
    };
    return props;
  };

  let injector: Injector;
  let serializer: any;
  let commitSerializer: CommitSerializer;

  beforeEach(() => {
    serializer = mock<types.Serializer>();

    injector = new Injector();
    commitSerializer = new CommitSerializer();

    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .toConstantValue(serializer);
    injector.injectInto(commitSerializer);
  });

  const commitId = new Guid().toString();
  const eventSourceableId = 'my-event-sourceable-id';

  const commit = generateCommit(commitId, eventSourceableId, 10);
  const srlzdCommit = generateSerializedCommit(commitId, eventSourceableId, 10);

  it('serializes commit', () => {
    serializer.toData
      .calledWith(commit.events[0])
      .mockReturnValue(srlzdCommit.events[0].data);
    serializer.toData
      .calledWith(commit.commands[0])
      .mockReturnValue(srlzdCommit.commands[0].data);

    const result = commitSerializer.serialize(commit);
    expect(result).toBeInstanceOf(Object);
    expect(result).toEqual(srlzdCommit);
    expect(serializer.toData).toHaveBeenCalledWith(commit.events[0]);
    expect(serializer.toData).toHaveBeenCalledWith(commit.commands[0]);
  });

  it('deserializes commit', () => {
    serializer.hasType.calledWith('CommitMongoDBStorage.MyCommand').mockReturnValue(true);
    serializer.hasType.calledWith('CommitMongoDBStorage.MyEvent').mockReturnValue(true);
    serializer.fromData
      .calledWith(srlzdCommit.events[0].data)
      .mockReturnValue(commit.events[0]);
    serializer.fromData
      .calledWith(srlzdCommit.commands[0].data)
      .mockReturnValue(commit.commands[0]);

    const result = commitSerializer.deserialize(srlzdCommit);
    expect(result).toBeInstanceOf(Commit);
    expect(result).toEqual(commit);
    expect(serializer.hasType).toHaveBeenCalledWith(
      'CommitMongoDBStorage.MyCommand'
    );
    expect(serializer.hasType).toHaveBeenCalledWith(
      'CommitMongoDBStorage.MyEvent'
    );
    expect(serializer.fromData).toHaveBeenCalledWith(
      srlzdCommit.events[0].data
    );
    expect(serializer.fromData).toHaveBeenCalledWith(
      srlzdCommit.commands[0].data
    );
  });
});


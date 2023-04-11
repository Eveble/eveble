import chai, { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinonChai from 'sinon-chai';
import { define } from '@eveble/core';
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

chai.use(sinonChai);

describe(`CommitSerializer`, () => {
  @define('CommitMongoDBStorage.MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    name: string;
  }
  @define('CommitMongoDBStorage.MyEvent', { isRegistrable: false })
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
    serializer = stubInterface<types.Serializer>();

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
      .withArgs(commit.events[0])
      .returns(srlzdCommit.events[0].data);
    serializer.toData
      .withArgs(commit.commands[0])
      .returns(srlzdCommit.commands[0].data);

    const result = commitSerializer.serialize(commit);
    expect(result).to.be.instanceof(Object);
    expect(result).to.be.eql(srlzdCommit);
    expect(serializer.toData).to.be.calledWithExactly(commit.events[0]);
    expect(serializer.toData).to.be.calledWithExactly(commit.commands[0]);
  });

  it('deserializes commit', () => {
    serializer.hasType.withArgs('CommitMongoDBStorage.MyCommand').returns(true);
    serializer.hasType.withArgs('CommitMongoDBStorage.MyEvent').returns(true);
    serializer.fromData
      .withArgs(srlzdCommit.events[0].data)
      .returns(commit.events[0]);
    serializer.fromData
      .withArgs(srlzdCommit.commands[0].data)
      .returns(commit.commands[0]);

    const result = commitSerializer.deserialize(srlzdCommit);
    expect(result).to.be.instanceof(Commit);
    expect(result).to.be.eql(commit);
    expect(serializer.hasType).to.be.calledWithExactly(
      'CommitMongoDBStorage.MyCommand'
    );
    expect(serializer.hasType).to.be.calledWithExactly(
      'CommitMongoDBStorage.MyEvent'
    );
    expect(serializer.fromData).to.be.calledWithExactly(
      srlzdCommit.events[0].data
    );
    expect(serializer.fromData).to.be.calledWithExactly(
      srlzdCommit.commands[0].data
    );
  });
});

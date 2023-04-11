import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { Collection } from 'mongodb';
import { stubInterface } from 'ts-sinon';
import { define, kernel } from '@eveble/core';
import { CommitMongoDBStorage } from '../../../src/infrastructure/storages/commit-mongodb-storage';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import {
  Commit,
  CommitReceiver,
} from '../../../src/infrastructure/structs/commit';
import { CommitConcurrencyError } from '../../../src/infrastructure/infrastructure-errors';
import { Guid } from '../../../src/domain/value-objects/guid';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { Injector } from '../../../src/core/injector';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { createEJSON } from '../../../src/utils/helpers';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`CommitMongoDBStorage`, () => {
  @define('IntegrationCommitMongoDBStorage.MyCommand')
  class MyCommand extends Command<MyCommand> {
    name: string;
  }
  @define('IntegrationCommitMongoDBStorage.MyEvent')
  class MyEvent extends Event<MyEvent> {
    name: string;
  }

  // Props
  const now = new Date();
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  // MongoDB
  const clients: Record<string, types.Client> = {};
  const collections: Record<string, Collection> = {};
  // Dependencies
  let serializer: types.Serializer;
  let storage: types.CommitStorage;

  /*
  HELPERS
  */
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
      eventSourceableType: 'IntegrationCommitMongoDBStorage.MyEventSourceable',
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
      eventSourceableType: 'IntegrationCommitMongoDBStorage.MyEventSourceable',
      events: [
        {
          type: 'IntegrationCommitMongoDBStorage.MyEvent',
          data: {
            _type: 'IntegrationCommitMongoDBStorage.MyEvent',
            sourceId: serializeId(eventSourceableId),
            timestamp: now,
            name: 'Foo',
            version,
            metadata: {},
          },
        },
      ],
      commands: [
        {
          type: 'IntegrationCommitMongoDBStorage.MyCommand',
          data: {
            _type: 'IntegrationCommitMongoDBStorage.MyCommand',
            targetId: serializeId(eventSourceableId),
            timestamp: now,
            name: 'Foo',
            metadata: {},
          },
        },
      ],
      insertedAt: now,
      eventTypes: ['IntegrationCommitMongoDBStorage.MyEvent'],
      commandTypes: ['IntegrationCommitMongoDBStorage.MyCommand'],
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

  /*
  SETUP
  */
  const setupInjector = function (): void {
    injector = new Injector();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupEvebleDependencies = function (): void {
    // Serializer
    injector.bind<any>(BINDINGS.EJSON).toConstantValue(createEJSON());
    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .to(EJSONSerializerAdapter)
      .inSingletonScope();
    // Commit
    injector
      .bind<types.CommitStorage>(BINDINGS.CommitStorage)
      .to(CommitMongoDBStorage)
      .inSingletonScope();
    injector
      .bind<types.CommitSerializer>(BINDINGS.CommitSerializer)
      .to(CommitSerializer)
      .inSingletonScope();

    serializer = injector.get<types.Serializer>(BINDINGS.Serializer);
    storage = injector.get<types.CommitStorage>(BINDINGS.CommitStorage);
  };

  const setupTypes = function (): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  before(async () => {
    setupInjector();
    await setupCommitStoreMongo(injector, clients, collections);
    setupEvebleDependencies();
    setupTypes();
  });

  let commitId: string;
  let eventSourceableId: string;

  beforeEach(() => {
    commitId = new Guid().toString();
    eventSourceableId = new Guid().toString();
  });

  afterEach(async () => {
    await collections.commitStore.deleteMany({});
  });

  after(async () => {
    await clients.commitStore.disconnect();
    kernel.setSerializer(undefined as any);
  });

  describe(`adding commit`, () => {
    it(`inserts commit to MongoDB collection`, async () => {
      const commit = generateCommit(commitId, eventSourceableId, 1);

      const result = await storage.save(commit);
      expect(result).to.be.equal(commitId);

      const expectedCommit = generateSerializedCommit(
        commitId,
        eventSourceableId,
        1
      );
      const foundCommit = await collections.commitStore.findOne({
        _id: commit.id,
      });
      expect(foundCommit).to.be.eql(expectedCommit);
    });

    it(`throws commit concurrency exception on duplicated key error`, async () => {
      await storage.save(generateCommit(commitId, eventSourceableId, 1));

      await expect(
        storage.save(generateCommit(commitId, eventSourceableId, 1))
      ).to.eventually.be.rejectedWith(
        CommitConcurrencyError,
        `IntegrationCommitMongoDBStorage.MyEventSourceable: expected event sourceable with id of '${eventSourceableId}' to be at version 0 but is at version 1`
      );
    });
  });

  describe(`retrieving last commit version`, () => {
    it(`returns last commit version by event sourceable's id`, async () => {
      await storage.save(generateCommit(commitId, eventSourceableId, 10));
      const lastCommitVersion = await storage.findLastVersionById(
        eventSourceableId
      );
      expect(lastCommitVersion).to.be.equal(10);
    });

    it(`returns undefined when commit cannot be found for event sourceable's`, async () => {
      const lastCommitVersion = await storage.findLastVersionById('my-id');
      expect(lastCommitVersion).to.be.equal(undefined);
    });
  });

  describe(`retrieving commits`, () => {
    it('returns commit by id', async () => {
      await storage.save(generateCommit(commitId, eventSourceableId, 1));

      const foundCommit = await storage.findById(commitId);
      expect(foundCommit).to.be.instanceof(Commit);
      expect(foundCommit).to.be.eql(
        generateCommit(commitId, eventSourceableId, 1)
      );
    });

    it(`returns undefined if commit by id can't be found`, async () => {
      const foundCommit = await storage.findById(commitId);
      expect(foundCommit).to.be.equal(undefined);
    });

    it(`returns commits by event sourcealbe's id and version offset`, async () => {
      const firstCommitId = new Guid().toString();
      const secondCommitId = new Guid().toString();

      await storage.save(generateCommit(firstCommitId, eventSourceableId, 10));
      await storage.save(generateCommit(secondCommitId, eventSourceableId, 11));

      const foundCommits = await storage.getCommits(eventSourceableId, 10);
      expect(foundCommits).to.be.eql([
        generateCommit(firstCommitId, eventSourceableId, 10),
        generateCommit(secondCommitId, eventSourceableId, 11),
      ]);
    });

    it(`returns empty array when no commits can be found for version offset`, async () => {
      const foundCommits = await storage.getCommits(eventSourceableId, 10);
      expect(foundCommits).to.be.eql([]);
    });

    it(`returns all commits for every event sourceable`, async () => {
      const firstCommitId = new Guid().toString();
      const secondCommitId = new Guid().toString();
      const thirdCommitId = new Guid().toString();
      const otherEventSourceableId = 'my-other-id';

      await storage.save(generateCommit(firstCommitId, eventSourceableId, 1));
      await storage.save(generateCommit(secondCommitId, eventSourceableId, 2));
      await storage.save(
        generateCommit(thirdCommitId, otherEventSourceableId, 5)
      );

      const foundCommit = await storage.getAllCommits();
      expect(foundCommit).to.be.eql([
        generateCommit(firstCommitId, eventSourceableId, 1),
        generateCommit(secondCommitId, eventSourceableId, 2),
        generateCommit(thirdCommitId, otherEventSourceableId, 5),
      ]);
    });
  });

  describe(`flagging commits`, () => {
    it(`flags commit as published`, async () => {
      await storage.save(generateCommit(commitId, eventSourceableId, 1));

      await storage.flagCommitAsPublished(commitId, appId, workerId, now);
    });

    it(`flags commit as failed`, async () => {
      await storage.save(generateCommit(commitId, eventSourceableId, 1));

      await storage.flagCommitAsFailed(commitId, appId, workerId, now);
    });

    it(`flags commit as timeouted`, async () => {
      await storage.save(generateCommit(commitId, eventSourceableId, 1));

      await storage.flagAndResolveCommitAsTimeouted(
        commitId,
        appId,
        workerId,
        now
      );
    });
  });
});

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { Collection } from 'mongodb';
import { stubInterface } from 'ts-sinon';
import { Type, kernel } from '@eveble/core';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { SnapshotMongoDBStorage } from '../../../src/infrastructure/storages/snapshot-mongodb-storage';
import { types } from '../../../src/types';
import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { createEJSON } from '../../../src/utils/helpers';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { Guid } from '../../../src/domain/value-objects/guid';
import { setupSnapshotterMongo } from '../../utilities/setups/snapshotter-mongo.util';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`SnapshotMongoDBStorage`, () => {
  @Type('IntegrationSnapshotMongoDBStorage.MyEventSourceable')
  class MyEventSourceable extends EventSourceable {
    name: string;
  }

  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  // MongoDB
  const clients: Record<string, types.Client> = {};
  const collections: Record<string, Collection> = {};
  // Dependencies
  let serializer: types.Serializer;
  let storage: types.SnapshotStorage;

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
    // Snapshotter
    injector
      .bind<types.SnapshotStorage>(BINDINGS.SnapshotStorage)
      .to(SnapshotMongoDBStorage)
      .inSingletonScope();
    injector
      .bind<types.SnapshotSerializer>(BINDINGS.SnapshotSerializer)
      .to(SnapshotSerializer)
      .inSingletonScope();

    serializer = injector.get<types.Serializer>(BINDINGS.Serializer);
    storage = injector.get<types.SnapshotStorage>(BINDINGS.SnapshotStorage);
  };

  const setupTypes = function (): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  before(async () => {
    setupInjector();
    await setupSnapshotterMongo(injector, clients, collections);
    setupEvebleDependencies();
    setupTypes();
  });

  let eventSourceableId: string;
  let eventSourceable: MyEventSourceable;

  beforeEach(() => {
    eventSourceableId = new Guid().toString();
    eventSourceable = new MyEventSourceable({
      id: eventSourceableId,
      name: 'Foo',
    });
  });

  afterEach(async () => {
    await collections.snapshotter.deleteMany({});
  });

  after(async () => {
    await clients.snapshotter.disconnect();
  });

  it(`inserts snapshot to MongoDB snapshots collection`, async () => {
    const result = await storage.save(eventSourceable);
    expect(result).to.be.equal(eventSourceableId);

    const expectedSnapshot = {
      _id: `${eventSourceableId}`,
      snapshot: `{"_type":"IntegrationSnapshotMongoDBStorage.MyEventSourceable","id":"${eventSourceableId}","version":0,"name":"Foo"}`,
    };
    const foundSnapshot = await collections.snapshotter.findOne({
      _id: eventSourceableId,
    });
    expect(foundSnapshot).to.be.eql(expectedSnapshot);
  });

  it(`updates snapshot on MongoDB snapshots collection`, async () => {
    const updatedName = 'Not-Foo-Anymore';

    await storage.save(eventSourceable);

    eventSourceable.name = updatedName;
    await storage.update(eventSourceable);

    const expectedUpdatedSnapshot = {
      _id: `${eventSourceableId}`,
      snapshot: `{"_type":"IntegrationSnapshotMongoDBStorage.MyEventSourceable","id":"${eventSourceableId}","version":0,"name":"Not-Foo-Anymore"}`,
    };
    const foundUpdatedSnapshot = await collections.snapshotter.findOne({
      _id: eventSourceableId,
    });
    expect(foundUpdatedSnapshot).to.be.eql(expectedUpdatedSnapshot);
  });

  it(`returns deserialized event sourceable snapshot from MongoDB snapshots collection by event sourceable's id`, async () => {
    await storage.save(eventSourceable);
    const foundSnapshot = await storage.findById(
      MyEventSourceable,
      eventSourceableId
    );
    expect(foundSnapshot).to.be.instanceOf(MyEventSourceable);
    expect(foundSnapshot).to.be.eql(eventSourceable);
  });

  it(`returns undefined if snapshot cannot be found on MongoDB snapshots collection`, async () => {
    const foundSnapshot = await storage.findById(
      MyEventSourceable,
      eventSourceableId
    );
    expect(foundSnapshot).to.be.equal(undefined);
  });
});

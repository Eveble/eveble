import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { Collection } from 'mongodb';
import { stubInterface } from 'ts-sinon';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { SnapshotMongoDBStorage } from '../../../src/infrastructure/storages/snapshot-mongodb-storage';
import { Snapshotter } from '../../../src/infrastructure/snapshotter';
import { define } from '../../../src/decorators/define';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';
import { Container } from '../../../src/core/injector';
import { createEJSON } from '../../../src/utils/helpers';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { kernel } from '../../../src/core/kernel';
import { setupSnapshotterMongo } from '../../utilities/setups/snapshotter-mongo.util';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`SnapshotMongoDBStorage with MongoDB storage`, function() {
  @define('SnapshotterWithMongoDBStorage.MyEventSourceable')
  class MyEventSourceable extends EventSourceable {
    name: string;
  }

  // Props
  const appId = 'my-app-id';
  // Injector
  let injector: Container;
  let log: any;
  let config: any;
  // MongoDB
  const clients: Record<string, types.Client> = {};
  const collections: Record<string, Collection> = {};
  // Dependencies
  let serializer: types.Serializer;
  let snapshotter: types.Snapshotter;

  const setupInjector = function(): void {
    injector = new Container();
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupDefaultConfiguration = function(): void {
    // Config.prototype.get
    config.get.withArgs('appId').returns(appId);
    config.get.withArgs('eveble.commitStore.timeout').returns(60);
    config.get.withArgs('eveble.Snapshotter.frequency').returns(10);
    // Config.prototype.has
    config.has.withArgs('eveble.Snapshotter.frequency').returns(true);
  };

  const setupEvebleDependencies = function(): void {
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
    injector
      .bind<types.Snapshotter>(BINDINGS.Snapshotter)
      .to(Snapshotter)
      .inSingletonScope();

    serializer = injector.get<types.Serializer>(BINDINGS.Serializer);
    snapshotter = injector.get<types.Snapshotter>(BINDINGS.Snapshotter);
  };

  const setupTypes = function(): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  before(async () => {
    setupInjector();
    setupDefaultConfiguration();
    await setupSnapshotterMongo(injector, clients, collections);
    setupEvebleDependencies();
    setupTypes();
  });

  afterEach(async () => {
    await collections.snapshotter.deleteMany({});
  });

  after(async () => {
    await clients.snapshotter.disconnect();
  });

  describe(`making snapshots`, () => {
    it(`skips snapshot if not enough versions have passed`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = 1;

      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshot = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshot).to.be.undefined;
    });

    it(`saves the current state of event sourceable to storage`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = 11;

      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshot = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshot).to.be.instanceof(MyEventSourceable);
      expect(foundSnapshot).to.be.eql(eventSourceable);
    });

    it(`updates existing event sourceable snapshot on storage`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = 11;

      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshotV5 = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshotV5).to.be.eql(eventSourceable);

      eventSourceable.version = 21;
      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshotV10 = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshotV10).to.be.eql(eventSourceable);
    });

    it(`does not update existing event sourceable snapshot when not enough versions have passed`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = 11;

      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshotV5 = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshotV5).to.be.eql(eventSourceable);

      eventSourceable.version = 12;
      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshotStillOnV11 = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshotStillOnV11).to.be.eql(
        Object.assign(eventSourceable, { version: 11 })
      );
    });
  });

  describe(`restoring latest snapshot of event sourceable`, () => {
    it(`creates and returns an aggregate instance based on the snapshot`, async () => {
      const id = 'my-id';
      const eventSourceable = new MyEventSourceable({
        id,
      });
      eventSourceable.version = 11;

      await snapshotter.makeSnapshotOf(eventSourceable);
      const foundSnapshot = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshot).to.be.instanceof(MyEventSourceable);
      expect(foundSnapshot).to.be.eql(eventSourceable);
    });

    it(`returns undefined if event sourceable snapshot cannot be found on storage`, async () => {
      const id = 'my-id';
      const foundSnapshot = await snapshotter.getSnapshotOf(
        MyEventSourceable,
        id
      );
      expect(foundSnapshot).to.be.undefined;
    });
  });
});

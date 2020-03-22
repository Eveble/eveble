import { stubInterface } from 'ts-sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { BINDINGS } from '../../../src/constants/bindings';
import { EventSourceable } from '../../../src/domain/event-sourceable';
import { define } from '../../../src/decorators/define';

chai.use(sinonChai);

describe(`SnapshotSerializer`, function() {
  @define('MyEventSourceable', { isRegistrable: false })
  class MyEventSourceable extends EventSourceable {
    key: string;
  }

  let injector: Injector;
  let serializer: any;
  let esSerializer: SnapshotSerializer;

  beforeEach(() => {
    serializer = stubInterface<types.Serializer>();

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
    serializer.toData.withArgs(instance).returns(data);
    serializer.stringify.withArgs(data).returns(serializedEs);

    expect(esSerializer.serialize(instance)).to.be.eql({
      _id: 'my-id',
      snapshot: serializedEs,
    });
    expect(serializer.toData).to.be.calledOnce;
    expect(serializer.toData).to.be.calledWithExactly(instance);
    expect(serializer.stringify).to.be.calledOnce;
    expect(serializer.stringify).to.be.calledWithExactly(data);
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
    serializer.parse.withArgs(serializedEs).returns(data);
    serializer.fromData.withArgs(data).returns(instance);

    expect(
      esSerializer.deserialize(MyEventSourceable, serializedEs)
    ).to.be.equal(instance);
    expect(serializer.parse).to.be.calledOnce;
    expect(serializer.parse).to.be.calledWithExactly(serializedEs);
    expect(serializer.fromData).to.be.calledOnce;
    expect(serializer.fromData).to.be.calledWithExactly(data);
  });
});

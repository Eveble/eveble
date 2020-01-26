import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import {
  injectable,
  inject,
  postConstruct,
} from '@parisholley/inversify-async';
import sinon from 'sinon';
import delay from 'delay';
import { Container } from '../../../src/core/injector';

chai.use(sinonChai);

describe(`Injector`, () => {
  let initialize;

  beforeEach(() => {
    initialize = sinon.stub();
  });

  it(`injects synchronously dependencies from IoC container to existing value`, () => {
    interface Ninja {
      fight(): string;
      sneak(): string;
    }

    interface Katana {
      hit(): string;
    }

    interface Shuriken {
      throw(): string;
    }

    @injectable()
    class Katana implements Katana {
      public hit() {
        return 'cut!';
      }
    }

    @injectable()
    class Shuriken implements Shuriken {
      public throw() {
        return 'hit!';
      }
    }

    const BINDINGS = {
      Katana: Symbol.for('Katana'),
      Shuriken: Symbol.for('Shuriken'),
    };

    @injectable()
    class Ninja implements Ninja {
      @inject(BINDINGS.Katana)
      public katana: Katana;

      @inject(BINDINGS.Shuriken)
      public shuriken: Shuriken;

      public name: string;

      public constructor(name: string) {
        this.name = name;
      }

      @postConstruct()
      public initialize(): void {
        initialize(this);
      }

      public fight(): string {
        return this.katana.hit();
      }

      public sneak(): string {
        return this.shuriken.throw();
      }
    }
    const container = new Container();
    container.bind<Ninja>('Ninja').to(Ninja);
    container.bind<Katana>(BINDINGS.Katana).to(Katana);
    container.bind<Shuriken>(BINDINGS.Shuriken).to(Shuriken);

    const name = 'Naruto Uzumaki';
    const ninja = new Ninja(name);
    container.injectInto(ninja);

    expect(ninja.name).to.be.equal(name);
    expect(ninja.katana).to.be.instanceof(Katana);
    expect(ninja.shuriken).to.be.instanceof(Shuriken);
    expect(ninja.sneak()).to.be.equal('hit!');
    expect(ninja.fight()).to.be.equal('cut!');
    expect(initialize).to.be.calledOnce;
    expect(initialize).to.be.calledOnceWithExactly(ninja);
  });

  it(`injects asynchronously injects dependencies from IoC container to existing value`, async () => {
    const before = sinon.stub();
    const after = sinon.stub();

    @injectable()
    class Transport {
      @postConstruct()
      async initialize(): Promise<void> {
        initialize('transport');
        before();
        await delay(50);
        after();
      }
    }
    @injectable()
    class Logger {
      @inject('Transport')
      public transport: Transport;

      public id: string;

      constructor(id) {
        this.id = id;
      }
    }

    const container = new Container();
    container.bind<Transport>('Transport').to(Transport);

    const id = 'my-id';
    const logger = new Logger(id);
    await container.injectIntoAsync(logger);

    expect(logger.id).to.be.equal(id);
    expect(logger.transport).to.be.instanceof(Transport);
    expect(initialize).to.be.calledOnce;
    expect(initialize).to.be.calledWithExactly('transport');
    expect(before).to.be.calledBefore(after);
    expect(after).to.be.calledAfter(before);
  });
});

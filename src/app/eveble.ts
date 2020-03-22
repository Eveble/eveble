import { types } from '../types';
import { Module } from '../core/module';
import { Log } from '../components/log-entry';
import { BINDINGS } from '../constants/bindings';
import { EJSONSerializerAdapter } from '../messaging/serializers/ejson-serializer-adapter';
import { CommandBus } from '../messaging/command-bus';
import { EventBus } from '../messaging/event-bus';
import { EventSourceableRepository } from '../infrastructure/event-sourceable-repository';
import { CommitStore } from '../infrastructure/commit-store';
import { CommitPublisher } from '../infrastructure/commit-publisher';
import { CommandSchedulingService } from '../infrastructure/command-scheduling-service';
import { Snapshotter } from '../infrastructure/snapshotter';
import { kernel } from '../core/kernel';
import { Router } from '../infrastructure/router';
import { createEJSON } from '../utils/helpers';
import { Asserter } from '../domain/asserter';
import { StatefulAssertion } from '../domain/assertions/stateful-assertion';
import { StatusfulAssertion } from '../domain/assertions/statusful-assertion';
import { AbilityAssertion } from '../domain/assertions/ability-assertion';

export class Eveble extends Module {
  protected commitPublisher?: types.CommitPublisher;

  protected commandScheduler?: types.CommandScheduler;

  /**
   * Create a Eveble module.
   * @param props - Properties of the type required for construction.
   * @param props.config - Configuration as instance of `EvebleConfig`.
   */
  constructor(props: types.ModuleProps = {}) {
    super(props);
  }

  /**
   * Evaluates if application has snapshotter enabled.
   * @returns Returns `true` if application is snapshotting , else `false`.
   */
  public isSnapshotting(): boolean {
    return this.config.get('eveble.Snapshotter.isEnabled') === true;
  }

  /**
   * Evaluates if application has command scheduler enabled.
   * @returns Returns `true` if application is scheduling commands, else `false`.
   */
  public isCommandScheduling(): boolean {
    return this.config.get('eveble.CommandScheduler.isEnabled') === true;
  }

  /**
   * On initialize hook.
   * @async
   */
  protected async onInitialize(): Promise<void> {
    await this.initializeTopLevelDependencies();
  }

  /**
   * Initializes top level dependencies.
   * @async
   */
  protected async initializeTopLevelDependencies(): Promise<void> {
    this.log?.debug(
      new Log(`initializing top level dependencies`)
        .on(this)
        .in(this.initializeTopLevelDependencies)
    );

    this.setAsserterOnKernel();
    this.bindSerializer();
    await this.setSerializerOnKernel();
    await this.registerTypesOnSerializer();
    this.bindRouter();
    this.bindInfrastructure();
    this.bindSnapshotter();
    this.bindCommandSchedulingService();
  }

  /**
   * On after initialize hook.
   * @async
   */
  protected async afterInitialize(): Promise<void> {
    this.commitPublisher = await this.injector.getAsync<types.CommitPublisher>(
      BINDINGS.CommitPublisher
    );
  }

  /**
   * On before start hook.
   * @async
   */
  protected async beforeStart(): Promise<void> {
    if (this.isCommandScheduling()) {
      this.commandScheduler = await this.injector.getAsync<
        types.CommandScheduler
      >(BINDINGS.CommandScheduler);
    }
  }

  /**
   * On module start hook.
   * @async
   */
  protected async onStart(): Promise<void> {
    if (this.isCommandScheduling()) {
      this.commandScheduler?.startScheduling();
    }
    await this.commitPublisher?.startPublishing();
  }

  /**
   * On stop hook.
   * @async
   */
  protected async onStop(): Promise<void> {
    await this.commitPublisher?.stopPublishing();
    if (this.isCommandScheduling()) {
      this.commandScheduler?.stopScheduling();
    }
  }

  /**
   * Sets `Asserter` on Kernel.
   */
  protected setAsserterOnKernel(): void {
    const asserter = new Asserter();
    asserter.registerAssertion(new StatefulAssertion(asserter));
    asserter.registerAssertion(new StatusfulAssertion(asserter));
    asserter.registerAssertion(new AbilityAssertion(asserter));
    kernel.setAsserter(asserter);

    this.log?.debug(
      new Log(`set asserter '${asserter.constructor.name}' on Kernel`)
        .on(this)
        .in(this.initializeTopLevelDependencies)
    );
  }

  /**
   * Binds `Serializer` on IoC.
   */
  protected bindSerializer(): void {
    if (!this.injector.isBound(BINDINGS.Serializer)) {
      this.injector
        .bind<any>(BINDINGS.EJSON)
        .toConstantValue(this.createEJSON());
      this.log?.debug(
        new Log(`bound 'EJSON' to constant value`)
          .on(this)
          .in(this.initializeTopLevelDependencies)
      );

      this.injector
        .bind<types.Serializer>(BINDINGS.Serializer)
        .to(EJSONSerializerAdapter);

      this.log?.debug(
        new Log(
          `bound 'Serializer' to 'EJSONSerializerAdapter' in singleton scope`
        )
          .on(this)
          .in(this.initializeTopLevelDependencies)
      );
    }
  }

  /**
   * Sets `Serializer` on Kernel.
   * @async
   */
  protected async setSerializerOnKernel(): Promise<void> {
    const serializer = await this.injector.getAsync<types.Serializer>(
      BINDINGS.Serializer
    );
    kernel.setSerializer(serializer);

    this.log?.debug(
      new Log(`set serializer '${serializer.constructor.name}' on Kernel`)
        .on(this)
        .in(this.initializeTopLevelDependencies)
    );
  }

  /**
   * Registers types on `Serializer`.
   * @async
   */
  protected async registerTypesOnSerializer(): Promise<void> {
    const library = await this.injector.getAsync<types.Library>(
      BINDINGS.Library
    );
    const serializer = await this.injector.getAsync<types.Serializer>(
      BINDINGS.Serializer
    );

    this.log?.debug(new Log(`registering types`).on(serializer));

    for (const [typeName, type] of library.getTypes()) {
      serializer.registerType(typeName, type);
      this.log?.debug(
        new Log(
          `registered type '${typeName}' on '${serializer.constructor.name}' serializer`
        )
          .on(this)
          .in(this.initializeTopLevelDependencies)
      );
    }
  }

  /**
   * Binds `Router` constructor on IoC.
   */
  protected bindRouter(): void {
    if (!this.injector.isBound(BINDINGS.Router)) {
      this.injector
        .bind<types.RouterType>(BINDINGS.Router)
        .toConstantValue(Router);
      this.log?.debug(
        new Log(`bound 'Router' as constant value`)
          .on(this)
          .in(this.initializeTopLevelDependencies)
      );
    }
  }

  /**
   * Binds infrastructure components on IoC.
   */
  protected bindInfrastructure(): void {
    const singletons = {
      CommitPublisher,
      CommitStore,
      CommandBus,
      EventBus,
      EventSourceableRepository,
    };

    for (const [id, component] of Object.entries(singletons)) {
      if (!this.injector.isBound(BINDINGS[id])) {
        this.injector
          .bind(BINDINGS[id])
          .to(component)
          .inSingletonScope();
        this.log?.debug(
          new Log(`bound '${id}' in singleton scope`)
            .on(this)
            .in(this.initializeTopLevelDependencies)
        );
      }
    }
  }

  /**
   * Binds snapshotter on IoC.
   */
  protected bindSnapshotter(): void {
    if (this.isSnapshotting() && !this.injector.isBound(BINDINGS.Snapshotter)) {
      this.log?.debug(
        new Log(`enabling snapshotting`).on(this).in(this.bindSnapshotter)
      );

      this.injector
        .bind<types.Snapshotter>(BINDINGS.Snapshotter)
        .to(Snapshotter)
        .inSingletonScope();
      this.log?.debug(
        new Log(`bound 'Snapshotter' in singleton scope`)
          .on(this)
          .in(this.initializeTopLevelDependencies)
      );

      this.log?.debug(
        new Log(`enabled snapshotting`).on(this).in(this.bindSnapshotter)
      );
    }
  }

  /**
   * Binds `CommandSchedulingService` on IoC.
   */
  protected bindCommandSchedulingService(): void {
    if (
      this.isCommandScheduling() &&
      this.injector.isBound(BINDINGS.CommandScheduler) &&
      !this.injector.isBound(BINDINGS.CommandSchedulingService)
    ) {
      const service = new CommandSchedulingService();
      this.injector.injectInto(service);
      this.injector
        .bind<CommandSchedulingService>(BINDINGS.CommandSchedulingService)
        .toConstantValue(service);
      this.log?.debug(
        new Log(`bound 'CommandSchedulingService' as constant value`)
          .on(this)
          .in(this.initializeTopLevelDependencies)
      );
    }
  }

  /**
   * Creates instance of EJSON.
   * @returns De-cached version of EJSON module.
   * @remarks
   * By default, EJSON module stores types in variable that is not referenced on the EJSON object
   * itself. This creates issue when running tests in watch modes(like Mocha's --watch) since the state of EJSON is cached.
   */
  protected createEJSON(): Record<keyof any, any> {
    return createEJSON();
  }
}

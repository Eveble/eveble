import { mock } from 'vitest-mock-extended';
import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';

import { Collection } from 'mongodb';

import { kernel } from '@eveble/core';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { CommitPublisher } from '../../../src/infrastructure/commit-publisher';
import { EventSourceableRepository } from '../../../src/infrastructure/event-sourceable-repository';
import { CommitStore } from '../../../src/infrastructure/commit-store';
import { Snapshotter } from '../../../src/infrastructure/snapshotter';
import { Router } from '../../../src/infrastructure/router';
import { CommitMongoDBStorage } from '../../../src/infrastructure/storages/commit-mongodb-storage';
import { CommitMongoDBObserver } from '../../../src/infrastructure/storages/commit-mongodb-observer';
import { SnapshotMongoDBStorage } from '../../../src/infrastructure/storages/snapshot-mongodb-storage';
import { TaskList } from '../../domains/task-list/task-list';
import {
  Employee,
  EmployeeTerminatedError,
} from '../../domains/employee/employee';
import {
  CreateEmployee,
  TerminateEmployee,
} from '../../domains/employee/employee-commands';
import {
  ProductivityEstimation,
  ProductivityEstimationUnavailableForEmployeeError,
} from '../../domains/employee/productivity-estimation';
import {
  CreateTaskList,
  AssignTaskList,
  CreateTask,
  CompleteTask,
} from '../../domains/task-list/task-commands';
import { TaskCompleted } from '../../domains/task-list/task-events';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { setupSnapshotterMongo } from '../../utilities/setups/snapshotter-mongo.util';
import { InfiniteTaskCompletionPolicy } from '../../domains/task-list/infinite-task-completion-policy';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';
import { createEJSON } from '../../../src/utils/helpers';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { Guid } from '../../../src/domain/value-objects/guid';
import { StatusfulAssertion } from '../../../src/domain/assertions/statusful-assertion';
import { StatefulAssertion } from '../../../src/domain/assertions/stateful-assertion';
import { AbilityAssertion } from '../../../src/domain/assertions/ability-assertion';
import { Asserter } from '../../../src/domain/asserter';
import { DomainException } from '../../../src/domain/domain-exception';

describe(`Routing with initializing Event on Process`, () => {
  class TaskListRouter extends Router {
    EventSourceableType = TaskList;

    InitializingMessage = CreateTaskList;
  }
  class EmployeeRouter extends Router {
    EventSourceableType = Employee;

    InitializingMessage = CreateEmployee;
  }
  class ProductivityEstimationRouter extends Router {
    EventSourceableType = ProductivityEstimation;

    InitializingMessage = TaskCompleted;
  }

  // Props
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  // Kernel
  let asserter: Asserter;
  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  // MongoDB
  const clients: Record<string, types.Client> = {};
  const collections: Record<string, Collection> = {};
  // Dependencies
  let serializer: types.Serializer;
  let commandBus: types.CommandBus;
  let eventBus: types.EventBus;
  let repository: types.EventSourceableRepository;

  const setupInjector = function (): void {
    injector = new Injector();
    log = mock<types.Logger>();
    config = mock<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupDefaultConfiguration = function (): void {
    // Config.prototype.get
    config.get.calledWith('appId').mockReturnValue(appId);
    config.get.calledWith('workerId').mockReturnValue(workerId);
    config.get.calledWith('eveble.commitStore.timeout').mockReturnValue(60);
    config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(1);
    // Config.prototype.has
    config.has.calledWith('eveble.Snapshotter.frequency').mockReturnValue(true);
  };

  const setupEvebleDependencies = function (): void {
    commandBus = new CommandBus();
    eventBus = new EventBus();

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
      .bind<types.CommitObserver>(BINDINGS.CommitObserver)
      .to(CommitMongoDBObserver)
      .inSingletonScope();
    injector
      .bind<types.CommitSerializer>(BINDINGS.CommitSerializer)
      .to(CommitSerializer)
      .inSingletonScope();
    injector
      .bind<types.CommitPublisher>(BINDINGS.CommitPublisher)
      .to(CommitPublisher)
      .inSingletonScope();
    injector
      .bind<types.CommitStore>(BINDINGS.CommitStore)
      .to(CommitStore)
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
    // Buses
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    // Repositories
    injector
      .bind<types.EventSourceableRepository>(BINDINGS.EventSourceableRepository)
      .to(EventSourceableRepository)
      .inSingletonScope();

    serializer = injector.get<EJSONSerializerAdapter>(BINDINGS.Serializer);
    repository = injector.get<types.EventSourceableRepository>(
      BINDINGS.EventSourceableRepository
    );
  };

  const setupDomainDependencies = function (): void {
    injector
      .bind<any>('TaskList.TaskCompletionPolicy')
      .to(InfiniteTaskCompletionPolicy)
      .inSingletonScope();
  };

  const setupTypes = function (): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  const initializeRouters = function (): void {
    injector.injectInto(new TaskListRouter());
    injector.injectInto(new EmployeeRouter());
    injector.injectInto(new ProductivityEstimationRouter());
  };

  const setupKernel = function (): void {
    asserter = new Asserter();
    asserter.registerAssertion(new StatefulAssertion(asserter));
    asserter.registerAssertion(new StatusfulAssertion(asserter));
    asserter.registerAssertion(new AbilityAssertion(asserter));
    kernel.setAsserter(asserter);
    kernel.setSerializer(serializer);
  };

  beforeAll(async () => {
    setupInjector();
    await setupCommitStoreMongo(injector, clients, collections);
    await setupSnapshotterMongo(injector, clients, collections);
    setupDefaultConfiguration();
    setupEvebleDependencies();
    setupDomainDependencies();
    setupTypes();
    initializeRouters();
    setupKernel();
  });

  beforeEach(() => {
    setupDefaultConfiguration();
  });

  afterEach(async () => {
    await collections.commitStore.deleteMany({});
    await collections.snapshotter.deleteMany({});
  });

  afterAll(async () => {
    await clients.commitStore.disconnect();
    await clients.snapshotter.disconnect();
    kernel.setAsserter(undefined as any);
    kernel.setSerializer(undefined as any);
  });

  /*
  Testing against ProductivityEstimation process
  */
  it('handles routing with initializing Event to Process', async () => {
    config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(1);

    const taskListId = new Guid();
    const taskId = new Guid();
    const employeeId = new Guid();

    const createEmployee = new CreateEmployee({
      targetId: employeeId,
      firstName: 'Erlich',
      lastName: 'Bachman',
    });

    const createList = new CreateTaskList({
      targetId: taskListId,
      title: 'my-title',
    });
    const assignList = new AssignTaskList({
      targetId: taskListId,
      employeeId,
    });
    const createTask = new CreateTask({
      targetId: taskListId,
      id: taskId,
      name: 'My task',
      priority: 2,
    });
    const completeTask = new CompleteTask({
      targetId: taskListId,
      id: taskId,
    });

    await commandBus.handle(createEmployee);

    const foundEmployee = (await repository.find(
      Employee,
      employeeId
    )) as Employee;
    expect(foundEmployee).toBeInstanceOf(Employee);
    expect(foundEmployee.points).toBe(0);

    await commandBus.handle(createList);
    await commandBus.handle(assignList);
    await commandBus.handle(createTask);
    await commandBus.handle(completeTask);

    const foundEmployeeAfterEstimation = (await repository.find(
      Employee,
      employeeId
    )) as Employee;
    expect(foundEmployeeAfterEstimation).toBeInstanceOf(Employee);
    expect(foundEmployeeAfterEstimation.points).toBe(4);
    expect(foundEmployeeAfterEstimation.metadata).toBeInstanceOf(Object);
    expect(foundEmployeeAfterEstimation.metadata?.correlation).toBeInstanceOf(
      Object
    );
    expect(
      foundEmployeeAfterEstimation.metadata?.correlation?.ProductivityEstimation
    ).toBeTypeOf('string');
  });

  it('throws DomainError on initializing Event handler on Process', async () => {
    config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(1);

    const domainExceptionHandler = vi.fn();
    eventBus.registerHandler(DomainException, domainExceptionHandler);

    const taskListId = new Guid();
    const taskId = new Guid();
    // This id triggers ProductivityEstimationUnavailableForEmployeeError error on ProductivityEstimation process
    const employeeId = new Guid('51a1849f-472f-45ca-92c7-5c3d5f353d40');

    const createEmployee = new CreateEmployee({
      targetId: employeeId,
      firstName: 'Erlich',
      lastName: 'Bachman',
    });

    const createList = new CreateTaskList({
      targetId: taskListId,
      title: 'my-title',
    });
    const assignList = new AssignTaskList({
      targetId: taskListId,
      employeeId,
    });
    const createTask = new CreateTask({
      targetId: taskListId,
      id: taskId,
      name: 'My task',
      priority: 2,
    });
    const completeTask = new CompleteTask({
      targetId: taskListId,
      id: taskId,
    });

    await commandBus.handle(createEmployee);
    await commandBus.handle(createList);
    await commandBus.handle(assignList);
    await commandBus.handle(createTask);

    await expect(commandBus.handle(completeTask)).rejects.toThrow(
      ProductivityEstimationUnavailableForEmployeeError,
      `Productivity estimation for employee with id '${employeeId}' is unavailable`
    );

    // Since error is happening directly on initializing Event handler on ProductivityEstimation process,
    // process will be never saved - so there is no requirement to evaluate the state of the process
    const domainException = domainExceptionHandler.mock.calls[0][0];
    expect(domainException).toBeInstanceOf(DomainException);
    expect(domainException.thrower).toBe('ProductivityEstimation');
    expect(domainException.error).toBeInstanceOf(
      ProductivityEstimationUnavailableForEmployeeError
    );
    expect(domainException.error).toEqual(
      new ProductivityEstimationUnavailableForEmployeeError(
        employeeId.toString()
      )
    );
  });

  it('throws DomainError on Command handler triggered by process and publishes DomainException ', async () => {
    config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(1);

    // Since process is created from initializing Event, prior to it's creation we don't know it's identifier.
    // Register stub handler to hijack DomainException that should be routed back to process on
    // any triggered error where we can retrieve process id from correlation metadata.
    const domainExceptionHandler = vi.fn();
    eventBus.registerHandler(DomainException, domainExceptionHandler);

    const taskListId = new Guid();
    const taskId = new Guid();
    const employeeId = new Guid();

    const createEmployee = new CreateEmployee({
      targetId: employeeId,
      firstName: 'Erlich',
      lastName: 'Bachman',
    });
    const terminateEmployee = new TerminateEmployee({
      targetId: employeeId,
    });

    const createList = new CreateTaskList({
      targetId: taskListId,
      title: 'my-title',
    });
    const assignList = new AssignTaskList({
      targetId: taskListId,
      employeeId,
    });
    const createTask = new CreateTask({
      targetId: taskListId,
      id: taskId,
      name: 'My task',
      priority: 2,
    });
    const completeTask = new CompleteTask({
      targetId: taskListId,
      id: taskId,
    });

    await commandBus.handle(createEmployee);
    await commandBus.handle(terminateEmployee);
    await commandBus.handle(createList);
    await commandBus.handle(assignList);
    await commandBus.handle(createTask);

    await expect(commandBus.handle(completeTask)).rejects.toThrow(
      EmployeeTerminatedError,
      `Can't add new productivity points to terminated employee with id '${employeeId}'`
    );

    const domainException = domainExceptionHandler.mock.calls[0][0];
    expect(domainException).toBeInstanceOf(DomainException);
    expect(domainException.thrower).toBe('Employee');
    expect(domainException.error).toBeInstanceOf(EmployeeTerminatedError);
    expect(domainException.error).toEqual(
      new EmployeeTerminatedError(employeeId.toString())
    );

    const processId = domainException.getCorrelationId(
      'ProductivityEstimation'
    );
    const foundProductivityEstimationProcess = (await repository.find(
      ProductivityEstimation,
      processId
    )) as ProductivityEstimation;
    expect(foundProductivityEstimationProcess).toBeInstanceOf(
      ProductivityEstimation
    );
    expect(foundProductivityEstimationProcess.getState()).toBe(
      ProductivityEstimation.STATES.failed
    );
  });
});

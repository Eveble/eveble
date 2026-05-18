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
  EmployeeAlreadyTerminatedError,
} from '../../domains/employee/employee';
import {
  CreateEmployee,
  AssignTaskListToEmployee,
  CancelEmployment,
  TerminateEmployee,
} from '../../domains/employee/employee-commands';
import {
  CancelingEmployment,
  CancelingEmploymentUnavailableForEmployee,
} from '../../domains/employee/canceling-employment';
import {
  CreateTaskList,
  AssignTaskList,
  OpenTaskList,
} from '../../domains/task-list/task-commands';
import { EventsNotFoundError } from '../../../src/infrastructure/infrastructure-errors';
import { DomainException } from '../../../src/domain/domain-exception';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { setupSnapshotterMongo } from '../../utilities/setups/snapshotter-mongo.util';
import { InfiniteTaskCompletionPolicy } from '../../domains/task-list/infinite-task-completion-policy';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { BINDINGS } from '../../../src/constants/bindings';
import { types } from '../../../src/types';
import { createEJSON } from '../../../src/utils/helpers';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { StatefulAssertion } from '../../../src/domain/assertions/stateful-assertion';
import { StatusfulAssertion } from '../../../src/domain/assertions/statusful-assertion';
import { AbilityAssertion } from '../../../src/domain/assertions/ability-assertion';
import { Injector } from '../../../src/core/injector';
import { Asserter } from '../../../src/domain/asserter';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';
import { Guid } from '../../../src/domain/value-objects/guid';

describe(`Routing with initializing Command on Process`, () => {
  class TaskListRouter extends Router {
    EventSourceableType = TaskList;

    InitializingMessage = CreateTaskList;
  }
  class EmployeeRouter extends Router {
    EventSourceableType = Employee;

    InitializingMessage = CreateEmployee;
  }
  class CancelingEmploymentRouter extends Router {
    EventSourceableType = CancelingEmployment;

    InitializingMessage = CancelEmployment;
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
    injector.injectInto(new CancelingEmploymentRouter());
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
  Testing against CancelingEmployment process
  */
  it('handles routing with initializing Command to process', async () => {
    config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(3);

    /*
      [!] Since assigning list to employee is connected between two aggregates, this should be also a process(for simplicity sake omit this concept here)
      */

    const firstTaskListId = new Guid();
    const secondTaskListId = new Guid();
    const employeeId = new Guid();

    const createEmployee = new CreateEmployee({
      targetId: employeeId,
      firstName: 'Erlich',
      lastName: 'Bachman',
    });

    const firstCreatList = new CreateTaskList({
      targetId: firstTaskListId,
      title: 'my-title',
    });
    const firstOpenList = new OpenTaskList({
      targetId: firstTaskListId,
    });
    const firstAssignList = new AssignTaskList({
      targetId: firstTaskListId,
      employeeId,
    });
    const firstAssignListToEmployee = new AssignTaskListToEmployee({
      targetId: employeeId,
      taskListId: firstTaskListId,
    });
    const secondCreatList = new CreateTaskList({
      targetId: secondTaskListId,
      title: 'my-title',
    });
    const secondOpenList = new OpenTaskList({
      targetId: secondTaskListId,
    });
    const secondAssignList = new AssignTaskList({
      targetId: secondTaskListId,
      employeeId,
    });
    const secondAssignListToEmployee = new AssignTaskListToEmployee({
      targetId: employeeId,
      taskListId: secondTaskListId,
    });

    const cancelEmployment = new CancelEmployment({
      targetId: new Guid(),
      employeeId,
    });

    await commandBus.handle(createEmployee);

    await commandBus.handle(firstCreatList);
    await commandBus.handle(firstOpenList);
    await commandBus.handle(firstAssignList);
    await commandBus.handle(firstAssignListToEmployee);

    await commandBus.handle(secondCreatList);
    await commandBus.handle(secondOpenList);
    await commandBus.handle(secondAssignList);
    await commandBus.handle(secondAssignListToEmployee);

    await commandBus.handle(cancelEmployment);

    const foundEmployee = (await repository.find(
      Employee,
      employeeId
    )) as Employee;
    expect(foundEmployee).to.be.an.instanceof(Employee);
    expect(foundEmployee.getState()).toBe(Employee.STATES.terminated);

    const foundFirstTaskList = (await repository.find(
      TaskList,
      firstTaskListId
    )) as TaskList;
    expect(foundFirstTaskList).to.be.an.instanceof(TaskList);
    expect(foundFirstTaskList.getState()).toBe(TaskList.STATES.closed);

    const foundSecondTaskList = (await repository.find(
      TaskList,
      secondTaskListId
    )) as TaskList;
    expect(foundSecondTaskList).to.be.an.instanceof(TaskList);
    expect(foundSecondTaskList.getState()).toBe(TaskList.STATES.closed);
  });

  it('throws DomainError on initializing Command handler on Process', async () => {
    config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(3);

    const domainExceptionHandler = vi.fn();
    eventBus.registerHandler(DomainException, domainExceptionHandler);

    // This id triggers CancelingEmploymentUnavailableForEmployee error on CancelingEmployment process
    const employeeId = new Guid('51a1849f-472f-45ca-92c7-5c3d5f353d40');

    const processId = new Guid();
    const cancelEmployment = new CancelEmployment({
      targetId: processId,
      employeeId,
    });

    await expect(commandBus.handle(cancelEmployment)).rejects.toThrow(
      CancelingEmploymentUnavailableForEmployee,
      `Canceling employment for employee with id '${employeeId}' is unavailable`
    );

    await expect(
      repository.find(CancelingEmployment, processId)
    ).rejects.toThrow(
      EventsNotFoundError,
      `No events found for event sourceable 'CancelingEmployment' with id '${processId}'`
    );

    // Since error is happening directly on initializing Event handler on CancelingEmployment process,
    // process will be never saved - so there is no requirement to evaluate the state of the process
    const domainException = domainExceptionHandler.mock.calls[0][0];
    expect(domainException).toBeInstanceOf(DomainException);
    expect(domainException.thrower).toBe('CancelingEmployment');
    expect(domainException.error).toBeInstanceOf(
      CancelingEmploymentUnavailableForEmployee
    );
    expect(domainException.error).toEqual(
      new CancelingEmploymentUnavailableForEmployee(employeeId.toString())
    );
  });

  it('throws DomainError on Command handler triggered by process and publishes DomainException', async () => {
    config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(3);

    const domainExceptionHandler = vi.fn();
    eventBus.registerHandler(DomainException, domainExceptionHandler);

    const employeeId = new Guid();

    const createEmployee = new CreateEmployee({
      targetId: employeeId,
      firstName: 'Erlich',
      lastName: 'Bachman',
    });
    const terminateEmployee = new TerminateEmployee({
      targetId: employeeId,
    });
    const processId = new Guid();
    const cancelEmployment = new CancelEmployment({
      targetId: processId,
      employeeId,
    });

    await commandBus.handle(createEmployee);
    await commandBus.handle(terminateEmployee);
    await expect(commandBus.handle(cancelEmployment)).rejects.toThrow(
      EmployeeAlreadyTerminatedError,
      `Can't terminate already terminated employee with id '${employeeId}'`
    );

    const foundCancelingEmploymentProcess = (await repository.find(
      CancelingEmployment,
      processId
    )) as CancelingEmployment;
    expect(foundCancelingEmploymentProcess).toBeInstanceOf(CancelingEmployment);
    expect(foundCancelingEmploymentProcess.getState()).toBe(
      CancelingEmployment.STATES.failed
    );

    const domainException = domainExceptionHandler.mock.calls[0][0];
    expect(domainException).toBeInstanceOf(DomainException);
    expect(domainException.thrower).toBe('Employee');
    expect(domainException.error).toBeInstanceOf(
      EmployeeAlreadyTerminatedError
    );
    expect(domainException.error).toEqual(
      new EmployeeAlreadyTerminatedError(employeeId.toString())
    );
  });
});

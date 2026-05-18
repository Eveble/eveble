import { mock } from 'vitest-mock-extended';
import {
  expect,
  describe,
  it,
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
import { Task } from '../../domains/task-list/task';
import {
  TaskList,
  TaskListClosedError,
  InappropriateTaskListTitleError,
} from '../../domains/task-list/task-list';
import {
  CreateTaskList,
  AssignTaskList,
  OpenTaskList,
  CloseTaskList,
  CreateTask,
  AcceptTask,
  CompleteTask,
} from '../../domains/task-list/task-commands';
import { EventsNotFoundError } from '../../../src/infrastructure/infrastructure-errors';
import { DomainException } from '../../../src/domain/domain-exception';
import { InfiniteTaskCompletionPolicy } from '../../domains/task-list/infinite-task-completion-policy';
import { Asserter } from '../../../src/domain/asserter';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { setupSnapshotterMongo } from '../../utilities/setups/snapshotter-mongo.util';
import { BINDINGS } from '../../../src/constants/bindings';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { createEJSON } from '../../../src/utils/helpers';
import { StatefulAssertion } from '../../../src/domain/assertions/stateful-assertion';
import { StatusfulAssertion } from '../../../src/domain/assertions/statusful-assertion';
import { AbilityAssertion } from '../../../src/domain/assertions/ability-assertion';
import { Guid } from '../../../src/domain/value-objects/guid';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';

describe(`Routing with initializing Command on Aggregate`, () => {
  class TaskListRouter extends Router {
    EventSourceableType = TaskList;

    InitializingMessage = CreateTaskList;
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
      .bind<types.CommitStore>(BINDINGS.CommitStore)
      .to(CommitStore)
      .inSingletonScope();
    injector
      .bind<types.CommitPublisher>(BINDINGS.CommitPublisher)
      .to(CommitPublisher)
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
    // Busses
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    // Repositories
    injector
      .bind<types.EventSourceableRepository>(BINDINGS.EventSourceableRepository)
      .to(EventSourceableRepository)
      .inSingletonScope();

    serializer = injector.get<types.Serializer>(BINDINGS.Serializer);
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

  it(`registers initializing handler on command bus for initializing Command`, async () => {
    expect(commandBus.hasHandler(CreateTaskList)).toBe(true);
    const foundBoundToRouterHandler = commandBus.getHandler(CreateTaskList);
    expect((foundBoundToRouterHandler as any).original).toBe(
      TaskListRouter.prototype.initializingMessageHandler
    );
  });

  it('handles routing of initializing Command to Aggregate', async () => {
    const taskListId = new Guid();
    const title = 'my-title';

    const createList = new CreateTaskList({
      targetId: taskListId,
      title,
    });
    await commandBus.handle(createList);

    const foundTaskList = (await repository.find(
      TaskList,
      taskListId
    )) as TaskList;
    expect(foundTaskList).toBeInstanceOf(TaskList);
    expect(foundTaskList.id).toEqual(taskListId);
    expect(foundTaskList.getState()).toEqual('created');
    expect(foundTaskList.title).toBe(title);
    expect(foundTaskList.tasks).toEqual([]);
    expect(foundTaskList.employeeId).toBeUndefined();
  });

  it('handles multiple commands with initializing Command to Aggregate', async () => {
    const taskListId = new Guid();
    const firstTaskId = new Guid();
    const secondTaskId = new Guid();
    const employeeId = new Guid();
    const title = 'my-title';

    const createList = new CreateTaskList({
      targetId: taskListId,
      title,
    });
    const openList = new OpenTaskList({
      targetId: taskListId,
    });
    const closeList = new CloseTaskList({
      targetId: taskListId,
    });
    const assignList = new AssignTaskList({
      targetId: taskListId,
      employeeId,
    });

    const firstCreateTask = new CreateTask({
      targetId: taskListId,
      id: firstTaskId,
      name: 'my-first-task',
      priority: 0,
    });
    const firstAcceptTask = new AcceptTask({
      targetId: taskListId,
      id: firstTaskId,
    });

    const secondCreateTask = new CreateTask({
      targetId: taskListId,
      id: secondTaskId,
      name: 'my-second-task',
      priority: 3,
    });
    const secondAcceptTask = new AcceptTask({
      targetId: taskListId,
      id: secondTaskId,
    });
    const secondCompleteTask = new CompleteTask({
      targetId: taskListId,
      id: secondTaskId,
    });

    await commandBus.handle(createList);
    await commandBus.handle(openList);
    await commandBus.handle(assignList);
    await commandBus.handle(firstCreateTask);
    await commandBus.handle(firstAcceptTask);
    await commandBus.handle(secondCreateTask);
    await commandBus.handle(secondAcceptTask);
    await commandBus.handle(secondCompleteTask);
    await commandBus.handle(closeList);

    const foundTaskList = (await repository.find(
      TaskList,
      taskListId
    )) as TaskList;
    expect(foundTaskList).toBeInstanceOf(TaskList);
    expect(foundTaskList.id).toEqual(taskListId);
    expect(foundTaskList.getState()).toEqual('closed');
    expect(foundTaskList.title).toBe(title);
    expect(foundTaskList.tasks).toEqual([
      new Task({
        id: firstTaskId,
        name: 'my-first-task',
        priority: 0,
        state: 'accepted',
      }),
      new Task({
        id: secondTaskId,
        name: 'my-second-task',
        priority: 3,
        state: 'completed',
      }),
    ]);
    expect(foundTaskList.employeeId).toEqual(employeeId);
  });

  it('throws DomainError on initializing Command handler on Aggregate', async () => {
    const domainExceptionHandler = vi.fn();
    eventBus.registerHandler(DomainException, domainExceptionHandler);

    const taskListId = new Guid();
    const inappropriateTitle = 'twatwaffle';

    const createList = new CreateTaskList({
      targetId: taskListId,
      title: inappropriateTitle,
    });

    await expect(commandBus.handle(createList)).rejects.toThrow(
      InappropriateTaskListTitleError,
      `Title for task list with id '${taskListId}' can't use inappropriate words like '${inappropriateTitle}'`
    );

    await expect(repository.find(TaskList, taskListId)).rejects.toThrow(
      EventsNotFoundError,
      `No events found for event sourceable 'TaskList' with id '${taskListId}'`
    );

    const domainException = domainExceptionHandler.mock.calls[0][0];
    expect(domainException).toBeInstanceOf(DomainException);
    expect(domainException.thrower).toBe('TaskList');
    expect(domainException.error).toBeInstanceOf(
      InappropriateTaskListTitleError
    );
    expect(domainException.error).toEqual(
      new InappropriateTaskListTitleError(
        taskListId.toString(),
        inappropriateTitle
      )
    );
  });

  it('throws DomainError on Command handler on Aggregate', async () => {
    const domainExceptionHandler = vi.fn();
    eventBus.registerHandler(DomainException, domainExceptionHandler);

    const taskListId = new Guid();

    const createList = new CreateTaskList({
      targetId: taskListId,
      title: 'my-title',
    });
    const openList = new OpenTaskList({
      targetId: taskListId,
    });
    const closeList = new CloseTaskList({
      targetId: taskListId,
    });
    const createTask = new CreateTask({
      targetId: taskListId,
      id: new Guid(),
      name: 'my-first-task',
      priority: 0,
    });

    await commandBus.handle(createList);
    await commandBus.handle(openList);
    await commandBus.handle(closeList);

    await expect(commandBus.handle(createTask)).rejects.toThrow(
      TaskListClosedError,
      `Can't add new tasks to closed task list with id '${taskListId}'`
    );

    const domainException = domainExceptionHandler.mock.calls[0][0];
    expect(domainException).toBeInstanceOf(DomainException);
    expect(domainException.thrower).toBe('TaskList');
    expect(domainException.error).toBeInstanceOf(TaskListClosedError);
    expect(domainException.error).toEqual(
      new TaskListClosedError(taskListId.toString())
    );
  });
});

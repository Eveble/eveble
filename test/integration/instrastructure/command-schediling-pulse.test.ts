import { mock } from 'vitest-mock-extended';
import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';

import { Pulse } from '@pulsecron/pulse';
import delay from 'delay';
import { Collection } from 'mongodb';

import { Type, kernel } from '@eveble/core';
import { CommitPublisher } from '../../../src/infrastructure/commit-publisher';
import { EventSourceableRepository } from '../../../src/infrastructure/event-sourceable-repository';
import { CommitStore } from '../../../src/infrastructure/commit-store';
import { Snapshotter } from '../../../src/infrastructure/snapshotter';
import { CommitMongoDBStorage } from '../../../src/infrastructure/storages/commit-mongodb-storage';
import { CommitMongoDBObserver } from '../../../src/infrastructure/storages/commit-mongodb-observer';
import { SnapshotMongoDBStorage } from '../../../src/infrastructure/storages/snapshot-mongodb-storage';
import { PulseCommandScheduler } from '../../../src/infrastructure/schedulers/pulse-command-scheduler';
import { PulseClient } from '../../../src/app/clients/pulse-client';
import { Router } from '../../../src/infrastructure/router';
import { Task } from '../../domains/task-list/task';
import { TaskList } from '../../domains/task-list/task-list';
import {
  CreateTaskList,
  CreateTask,
  ExpireTask,
  CompleteTask,
} from '../../domains/task-list/task-commands';
import { ExpiringTaskCompletionPolicy } from '../../domains/task-list/expiring-task-completion-policy';
import { ScheduledJob } from '../../../src/infrastructure/structs/scheduled-job';
import { Command, Assignment } from '../../../src/components/command';
import { ScheduleCommand } from '../../../src/domain/schedule-command';
import { Guid } from '../../../src/domain/value-objects/guid';
import { types } from '../../../src/types';
import { setupCommitStoreMongo } from '../../utilities/setups/commit-store-mongo.util';
import { setupSnapshotterMongo } from '../../utilities/setups/snapshotter-mongo.util';
import {
  setupSchedulerMongo,
  getCachedDatabaseName,
} from '../../utilities/setups/scheduler-mongo.util';
import { Asserter } from '../../../src/domain/asserter';
import { StatefulAssertion } from '../../../src/domain/assertions/stateful-assertion';
import { StatusfulAssertion } from '../../../src/domain/assertions/statusful-assertion';
import { AbilityAssertion } from '../../../src/domain/assertions/ability-assertion';

import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { getCollectionName } from '../../utilities/setups/mongo-env.util';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { PulseScheduledJobTransformer } from '../../../src/infrastructure/transformers/pulse-scheduled-job-transformer';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';
import { CommandSchedulingService } from '../../../src/infrastructure/command-scheduling-service';
import { createEJSON } from '../../../src/utils/helpers';

describe(`Command scheduling with Pulse`, () => {
  class TaskListRouter extends Router {
    EventSourceableType = TaskList;

    InitializingMessage = CreateTaskList;
  }

  /*
  SETUP
  */
  // Props
  const appId = 'my-app-id';
  const workerId = 'my-worker-id';
  const now = new Date();
  // Kernel
  let asserter: Asserter;
  // Injector
  let injector: Injector;
  let log: any;
  let config: any;
  // MongoDB
  const clients: Record<string, types.Client> = {};
  const collections: Record<string, Collection> = {};
  // Eveble dependencies
  let serializer: types.Serializer;
  let commandBus: types.CommandBus;
  let eventBus: types.EventBus;
  let commandScheduler: types.CommandScheduler;
  let repository: types.EventSourceableRepository;
  let commandSchedulingService: CommandSchedulingService;
  // Domain dependencies
  let taskCompletionPolicy: any;

  const setupInjector = function (): void {
    injector = new Injector();
    log = mock<types.Logger>();
    config = mock<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupPulse = async function (): Promise<void> {
    injector.bind<any>(BINDINGS.Pulse.library).toConstantValue(Pulse);

    clients.pulse = new PulseClient({
      id: new Guid(),
      databaseName: getCachedDatabaseName('scheduler')!,
      collectionName: getCollectionName('scheduler'),
      options: {
        processEvery: '0.2 seconds',
      },
    });

    await injector.injectIntoAsync(clients.pulse);
    await clients.pulse.initialize();
    await clients.pulse.connect();

    injector
      .bind<types.Client>(BINDINGS.Pulse.clients.CommandScheduler)
      .toConstantValue(clients.pulse);
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
    commandSchedulingService = new CommandSchedulingService();

    // Serialization
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
    // Snapshotting
    injector
      .bind<types.SnapshotStorage>(BINDINGS.SnapshotStorage)
      .to(SnapshotMongoDBStorage)
      .inSingletonScope();
    injector
      .bind<types.Snapshotter>(BINDINGS.Snapshotter)
      .to(Snapshotter)
      .inSingletonScope();
    injector
      .bind<types.SnapshotSerializer>(BINDINGS.SnapshotSerializer)
      .to(SnapshotSerializer)
      .inSingletonScope();
    // Buses
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    // Scheduling
    injector
      .bind<types.PulseJobTransformer>(BINDINGS.Pulse.jobTransformer)
      .to(PulseScheduledJobTransformer as any)
      .inSingletonScope();
    injector
      .bind<CommandSchedulingService>(BINDINGS.CommandSchedulingService)
      .to(CommandSchedulingService)
      .inSingletonScope();
    injector
      .bind<types.CommandScheduler>(BINDINGS.CommandScheduler)
      .to(PulseCommandScheduler)
      .inSingletonScope();
    // Repository
    injector
      .bind<types.EventSourceableRepository>(BINDINGS.EventSourceableRepository)
      .to(EventSourceableRepository)
      .inSingletonScope();

    serializer = injector.get<EJSONSerializerAdapter>(BINDINGS.Serializer);
    repository = injector.get<types.EventSourceableRepository>(
      BINDINGS.EventSourceableRepository
    );
    commandScheduler = injector.get<types.CommandScheduler>(
      BINDINGS.CommandScheduler
    );
    injector.injectInto(commandSchedulingService);
  };

  const setupKernel = function (): void {
    asserter = new Asserter();
    asserter.registerAssertion(new StatefulAssertion(asserter));
    asserter.registerAssertion(new StatusfulAssertion(asserter));
    asserter.registerAssertion(new AbilityAssertion(asserter));
    kernel.setAsserter(asserter);
    kernel.setSerializer(serializer);
  };

  const setupDomainDependencies = function (): void {
    taskCompletionPolicy = new ExpiringTaskCompletionPolicy(500);
    injector
      .bind<any>('TaskList.TaskCompletionPolicy')
      .toConstantValue(taskCompletionPolicy);
  };

  const setupTypes = function (): void {
    for (const [typeName, type] of kernel.library.getTypes()) {
      serializer.registerType(typeName, type);
    }
  };

  const initializeRouters = function (): void {
    injector.injectInto(new TaskListRouter());
  };

  const initializeScheduler = async function (): Promise<void> {
    await commandScheduler.initialize();
  };

  beforeAll(async () => {
    setupInjector();

    await setupCommitStoreMongo(injector, clients, collections);

    await setupSnapshotterMongo(injector, clients, collections);

    await setupSchedulerMongo(injector, clients, collections);

    await setupPulse();

    setupDefaultConfiguration();

    setupEvebleDependencies();

    setupDomainDependencies();

    setupKernel();

    setupTypes();

    initializeRouters();

    await initializeScheduler();
  });

  beforeEach(() => {
    setupDefaultConfiguration();
  });

  afterEach(async () => {
    await collections.commitStore.deleteMany({});
    await collections.snapshotter.deleteMany({});
    await collections.scheduler.deleteMany({});
  });

  afterAll(async () => {
    await (clients.pulse as PulseClient).stop();
    await clients.pulse.disconnect();

    await clients.commitStore.disconnect();
    await clients.snapshotter.disconnect();
    await clients.scheduler.disconnect();

    kernel.setAsserter(undefined as any);
    kernel.setSerializer(undefined as any);
  });

  /*
  ASSERTIONS
  */
  const assertJobIsEnqueued = function (
    job: any,
    taskListId: Guid,
    taskId: Guid
  ): void {
    expect(job).toBeInstanceOf(ScheduledJob);
    expect(job.id).toBeTypeOf('string');
    expect(job.name).toBe('send scheduled command');
    expect(job.isInState(ScheduledJob.STATES.enqueued)).toBe(true);
    expect(job.priority).toBe(0);
    expect(job.nextRunAt).toBeInstanceOf(Date);
    expect(job.data.commandType).toBe('ExpireTask');
    expect(job.data.assignerId).toBe(taskListId.toString());
    expect(job.data.assignerType).toBe('TaskList');
    expect(job.data.id).toBe(taskId.toString());
  };

  const assertJobIsCompleted = function (
    job: any,
    taskListId: Guid,
    taskId: Guid
  ): void {
    expect(job).toBeInstanceOf(ScheduledJob);
    expect(job.id).toBeTypeOf('string');
    expect(job.name).toBe('send scheduled command');
    expect(job.isInState(ScheduledJob.STATES.completed)).toBe(true);
    expect(job.priority).toBe(0);
    expect(job.nextRunAt).toBeInstanceOf(Date);
    expect(job.completedAt).toBeInstanceOf(Date);
    expect(job.data.commandType).toBe('ExpireTask');
    expect(job.data.assignerId).toBe(taskListId.toString());
    expect(job.data.assignerType).toBe('TaskList');
    expect(job.data.id).toBe(taskId.toString());
  };

  const assertJobIsFailed = function (
    job: any,
    taskListId: Guid,
    taskId: Guid
  ): void {
    expect(job).toBeInstanceOf(ScheduledJob);
    expect(job.id).toBeTypeOf('string');
    expect(job.name).toBe('send scheduled command');
    expect(job.isInState(ScheduledJob.STATES.failed)).toBe(true);
    expect(job.priority).toBe(0);
    expect(job.nextRunAt).toBeInstanceOf(Date);
    expect(job.failedAt).toBeInstanceOf(Date);
    expect(job.data.commandType).toBe('ExpireTask');
    expect(job.data.assignerId).toBe(taskListId.toString());
    expect(job.data.assignerType).toBe('TaskList');
    expect(job.data.id).toBe(taskId.toString());
  };

  /*
  HELPERS
  */
  async function pollForJob(
    commandType: string,
    assignerId: string | Guid,
    assignerType: string,
    assignmentId?: string | Guid,
    timeout = 5000
  ): Promise<types.ScheduledJob | undefined> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const job = await commandScheduler.getJob(
        commandType,
        assignerId,
        assignerType,
        assignmentId
      );
      if (job !== undefined) return job;
      await delay(50);
    }
    return undefined;
  }

  async function pollForJobState(
    commandType: string,
    assignerId: string | Guid,
    assignerType: string,
    assignmentId: string | Guid,
    predicate: (job: types.ScheduledJob) => boolean,
    timeout = 5000
  ): Promise<types.ScheduledJob> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const job = await commandScheduler.getJob(
        commandType,
        assignerId,
        assignerType,
        assignmentId
      );
      if (job !== undefined && predicate(job)) return job;
      await delay(100);
    }
    throw new Error(
      `Timeout waiting for job state after ${timeout}ms for ${commandType}`
    );
  }

  /*
  TESTS
  */
  describe(`scheduling command`, () => {
    it('queues scheduling command that is deliverable in future', async () => {
      config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(1);

      const taskListId = new Guid();
      const taskId = new Guid();

      const createList = new CreateTaskList({
        targetId: taskListId,
        title: 'my-title',
      });
      const createTask = new CreateTask({
        targetId: taskListId,
        id: taskId,
        name: 'My task',
        priority: 2,
      });

      const expireIn = 5000;
      taskCompletionPolicy.setExpirationDuration(expireIn);

      await commandBus.handle(createList);
      await commandBus.handle(createTask);

      const scheduledJob = await pollForJob(
        ExpireTask.getTypeName(),
        taskListId,
        'TaskList',
        taskId
      );

      const foundTaskList = (await repository.find(
        TaskList,
        taskListId
      )) as TaskList;
      const foundTask = foundTaskList.in<Task>('tasks').findById(taskId);
      expect(foundTask.isInState(Task.STATES.expired)).toBe(false);

      assertJobIsEnqueued(scheduledJob!, taskListId, taskId);
    });

    it('queues scheduling command that is deliverable and executes command with handler', async () => {
      config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(1);

      const taskListId = new Guid();
      const taskId = new Guid();

      const createList = new CreateTaskList({
        targetId: taskListId,
        title: 'my-title',
      });
      const createTask = new CreateTask({
        targetId: taskListId,
        id: taskId,
        name: 'My task',
        priority: 2,
      });

      const expireIn = 1000;
      taskCompletionPolicy.setExpirationDuration(expireIn);

      await commandBus.handle(createList);
      await commandBus.handle(createTask);

      const scheduledJobEnqueued = await pollForJob(
        ExpireTask.getTypeName(),
        taskListId,
        'TaskList',
        taskId
      );

      await delay(expireIn);
      const scheduledJobCompleted = await pollForJobState(
        ExpireTask.getTypeName(),
        taskListId,
        'TaskList',
        taskId,
        (job) => job.isInState(ScheduledJob.STATES.completed)
      );

      const foundTaskList = (await repository.find(
        TaskList,
        taskListId
      )) as TaskList;
      const foundTask = foundTaskList.in<Task>('tasks').findById(taskId);
      expect(foundTask.isInState(Task.STATES.expired)).toBe(true);
      assertJobIsEnqueued(scheduledJobEnqueued!, taskListId, taskId);
      assertJobIsCompleted(scheduledJobCompleted, taskListId, taskId);
    });

    it('flags scheduled job as failed if scheduled command was delivered but command handler did throw error', async () => {
      config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(1);

      const taskListId = new Guid();
      const taskId = new Guid();

      const createList = new CreateTaskList({
        targetId: taskListId,
        title: 'error',
      });
      const createTask = new CreateTask({
        targetId: taskListId,
        id: taskId,
        name: 'My task',
        priority: 2,
      });

      const expireIn = 100;
      taskCompletionPolicy.setExpirationDuration(expireIn);

      await commandBus.handle(createList);
      await commandBus.handle(createTask);

      await delay(expireIn);
      const scheduledJob = await pollForJobState(
        ExpireTask.getTypeName(),
        taskListId,
        'TaskList',
        taskId,
        (job) => job.isInState(ScheduledJob.STATES.failed)
      );

      const foundTaskList = (await repository.find(
        TaskList,
        taskListId
      )) as TaskList;
      const foundTask = foundTaskList.in<Task>('tasks').findById(taskId);
      expect(foundTask.isInState(Task.STATES.expired)).toBe(false);

      assertJobIsFailed(scheduledJob, taskListId, taskId);
    });
  });

  describe('unscheduling commands', () => {
    it('unschedules queued command', async () => {
      config.get.calledWith('eveble.Snapshotter.frequency').mockReturnValue(1);

      const taskListId = new Guid();
      const taskId = new Guid();

      const createList = new CreateTaskList({
        targetId: taskListId,
        title: 'error',
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

      const expireIn = 100;
      taskCompletionPolicy.setExpirationDuration(expireIn);

      await commandBus.handle(createList);
      await commandBus.handle(createTask);
      await commandBus.handle(completeTask);

      await delay(expireIn);
      const deadline = Date.now() + 3000;
      let scheduledJob: types.ScheduledJob | undefined;
      while (Date.now() < deadline) {
        scheduledJob = await commandScheduler.getJob(
          ExpireTask.getTypeName(),
          taskListId,
          'TaskList',
          taskId
        );
        if (scheduledJob === undefined) break;
        await delay(50);
      }
      expect(scheduledJob).toBeUndefined();

      const foundTaskList = (await repository.find(
        TaskList,
        taskListId
      )) as TaskList;
      const foundTask = foundTaskList.in<Task>('tasks').findById(taskId);
      expect(foundTask.isInState(Task.STATES.expired)).toBe(false);
    });
  });

  describe('batch unscheduling commands', () => {
    @Type('CommandScheduling.MyCommand')
    class MyCommand extends Command<MyCommand> {
      name: string;
    }

    it('successfully cancels all scheduled commands', async () => {
      const assignmentId = new Guid();
      const targetId = new Guid();
      const assignerId = new Guid();
      const name = 'Foo';
      const assignment = new Assignment({
        assignmentId,
        assignerId,
        assignerType: 'MyEventSourceable',
        deliverAt: now,
      });
      const command = new MyCommand({
        targetId,
        name,
        timestamp: now,
      });
      command.schedule(assignment);
      const scheduleCommand = new ScheduleCommand({
        targetId,
        command,
      });

      await commandScheduler.schedule(scheduleCommand);
      await commandScheduler.schedule(scheduleCommand);
      await commandScheduler.schedule(scheduleCommand);

      // Give Pulse time to persist jobs
      await delay(50);

      const scheduledJobs = await collections.scheduler.find({}).toArray();

      expect(scheduledJobs).toBeInstanceOf(Array);
      expect(scheduledJobs).toHaveLength(3);

      await commandScheduler.unscheduleAll();

      const remainingJobs = await collections.scheduler.find({}).toArray();
      expect(remainingJobs).toBeInstanceOf(Array);
      expect(remainingJobs).toHaveLength(0);
    });
  });
});

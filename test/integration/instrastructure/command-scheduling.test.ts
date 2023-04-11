import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import Agenda from 'agenda';
import delay from 'delay';
import { Collection } from 'mongodb';
import { stubInterface } from 'ts-sinon';
import { define, kernel } from '@eveble/core';
import { CommitPublisher } from '../../../src/infrastructure/commit-publisher';
import { EventSourceableRepository } from '../../../src/infrastructure/event-sourceable-repository';
import { CommitStore } from '../../../src/infrastructure/commit-store';
import { Snapshotter } from '../../../src/infrastructure/snapshotter';
import { CommitMongoDBStorage } from '../../../src/infrastructure/storages/commit-mongodb-storage';
import { CommitMongoDBObserver } from '../../../src/infrastructure/storages/commit-mongodb-observer';
import { SnapshotMongoDBStorage } from '../../../src/infrastructure/storages/snapshot-mongodb-storage';
import { AgendaCommandScheduler } from '../../../src/infrastructure/schedulers/agenda-command-scheduler';
import { AgendaClient } from '../../../src/app/clients/agenda-client';
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
import { setupSchedulerMongo } from '../../utilities/setups/scheduler-mongo.util';
import { Asserter } from '../../../src/domain/asserter';
import { StatefulAssertion } from '../../../src/domain/assertions/stateful-assertion';
import { StatusfulAssertion } from '../../../src/domain/assertions/statusful-assertion';
import { AbilityAssertion } from '../../../src/domain/assertions/ability-assertion';

import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import {
  getDatabaseName,
  getCollectionName,
} from '../../utilities/setups/mongo-env.util';
import { CommitSerializer } from '../../../src/infrastructure/serializers/commit-serializer';
import { SnapshotSerializer } from '../../../src/infrastructure/serializers/snapshot-serializer';
import { EJSONSerializerAdapter } from '../../../src/messaging/serializers/ejson-serializer-adapter';
import { AgendaScheduledJobTransformer } from '../../../src/infrastructure/transformers/agenda-scheduled-job-transformer';
import { CommandBus } from '../../../src/messaging/command-bus';
import { EventBus } from '../../../src/messaging/event-bus';
import { CommandSchedulingService } from '../../../src/infrastructure/command-scheduling-service';
import { createEJSON } from '../../../src/utils/helpers';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`Command scheduling`, () => {
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
    log = stubInterface<types.Logger>();
    config = stubInterface<types.Configurable>();

    injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  };

  const setupAgenda = async function (): Promise<void> {
    injector.bind<any>(BINDINGS.Agenda.library).toConstantValue(Agenda);

    clients.agenda = new AgendaClient({
      id: new Guid(),
      databaseName: getDatabaseName('scheduler'),
      collectionName: getCollectionName('scheduler'),
      options: {
        processEvery: 10,
      },
    });

    await injector.injectIntoAsync(clients.agenda);
    await clients.agenda.initialize();
    await clients.agenda.connect();

    injector
      .bind<types.Client>(BINDINGS.Agenda.clients.CommandScheduler)
      .toConstantValue(clients.agenda);
  };

  const setupDefaultConfiguration = function (): void {
    // Config.prototype.get
    config.get.withArgs('appId').returns(appId);
    config.get.withArgs('workerId').returns(workerId);
    config.get.withArgs('eveble.commitStore.timeout').returns(60);
    config.get.withArgs('eveble.Snapshotter.frequency').returns(1);
    // Config.prototype.has
    config.has.withArgs('eveble.Snapshotter.frequency').returns(true);
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
      .bind<types.AgendaJobTransformer>(BINDINGS.Agenda.jobTransformer)
      .to(AgendaScheduledJobTransformer)
      .inSingletonScope();
    injector
      .bind<CommandSchedulingService>(BINDINGS.CommandSchedulingService)
      .to(CommandSchedulingService)
      .inSingletonScope();
    injector
      .bind<types.CommandScheduler>(BINDINGS.CommandScheduler)
      .to(AgendaCommandScheduler)
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

  before(async () => {
    setupInjector();

    await setupCommitStoreMongo(injector, clients, collections);
    await setupSnapshotterMongo(injector, clients, collections);
    await setupSchedulerMongo(injector, clients, collections);
    await setupAgenda();
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

  after(async () => {
    await clients.commitStore.disconnect();
    await clients.snapshotter.disconnect();
    await clients.agenda.disconnect();
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
    expect(job).to.be.instanceof(ScheduledJob);
    expect(job.id).to.be.a('string');
    expect(job.name).to.be.equal('send scheduled command');
    expect(job.isInState(ScheduledJob.STATES.enqueued)).to.be.true;
    expect(job.priority).to.be.equal(0);
    expect(job.nextRunAt).to.be.instanceof(Date);
    expect(job.data.commandType).to.be.equal('ExpireTask');
    expect(job.data.assignerId).to.be.equal(taskListId.toString());
    expect(job.data.assignerType).to.be.equal('TaskList');
    expect(job.data.id).to.be.equal(taskId.toString());
  };

  const assertJobIsCompleted = function (
    job: any,
    taskListId: Guid,
    taskId: Guid
  ): void {
    expect(job).to.be.instanceof(ScheduledJob);
    expect(job.id).to.be.a('string');
    expect(job.name).to.be.equal('send scheduled command');
    expect(job.isInState(ScheduledJob.STATES.completed)).to.be.true;
    expect(job.priority).to.be.equal(0);
    expect(job.nextRunAt).to.be.instanceof(Date);
    expect(job.completedAt).to.be.instanceof(Date);
    expect(job.data.commandType).to.be.equal('ExpireTask');
    expect(job.data.assignerId).to.be.equal(taskListId.toString());
    expect(job.data.assignerType).to.be.equal('TaskList');
    expect(job.data.id).to.be.equal(taskId.toString());
  };

  const assertJobIsFailed = function (
    job: any,
    taskListId: Guid,
    taskId: Guid
  ): void {
    expect(job).to.be.instanceof(ScheduledJob);
    expect(job.id).to.be.a('string');
    expect(job.name).to.be.equal('send scheduled command');
    expect(job.isInState(ScheduledJob.STATES.failed)).to.be.true;
    expect(job.priority).to.be.equal(0);
    expect(job.nextRunAt).to.be.instanceof(Date);
    expect(job.failedAt).to.be.instanceof(Date);
    expect(job.data.commandType).to.be.equal('ExpireTask');
    expect(job.data.assignerId).to.be.equal(taskListId.toString());
    expect(job.data.assignerType).to.be.equal('TaskList');
    expect(job.data.id).to.be.equal(taskId.toString());
  };

  /*
  TESTS
  */
  describe(`scheduling command`, () => {
    it('queues scheduling command that is deliverable in future', async () => {
      config.get.withArgs('eveble.Snapshotter.frequency').returns(1);

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
      await commandBus.handle(createTask); // Expiring Policy sends ExpireTask to Scheduler

      const scheduledJob = await commandScheduler.getJob(
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
      expect(foundTask.isInState(Task.STATES.expired)).to.be.false;

      assertJobIsEnqueued(scheduledJob, taskListId, taskId);
    });

    it('queues scheduling command that is deliverable and executes command with handler', async () => {
      config.get.withArgs('eveble.Snapshotter.frequency').returns(1);

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

      const expireIn = 500;
      taskCompletionPolicy.setExpirationDuration(expireIn);

      await commandBus.handle(createList);
      await commandBus.handle(createTask); // Expiring Policy sends ExpireTask to Scheduler

      const scheduledJobEnqueued = await commandScheduler.getJob(
        ExpireTask.getTypeName(),
        taskListId,
        'TaskList',
        taskId
      );
      await delay(expireIn + 500);
      const scheduledJobCompleted = await commandScheduler.getJob(
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
      expect(foundTask.isInState(Task.STATES.expired)).to.be.true;
      assertJobIsEnqueued(scheduledJobEnqueued, taskListId, taskId);
      assertJobIsCompleted(scheduledJobCompleted, taskListId, taskId);
    });

    it('flags scheduled job as failed if scheduled command was delivered but command handler did throw error', async () => {
      config.get.withArgs('eveble.Snapshotter.frequency').returns(1);

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

      const expireIn = 500;
      taskCompletionPolicy.setExpirationDuration(expireIn);

      await commandBus.handle(createList);
      await commandBus.handle(createTask);

      await delay(expireIn + 500);
      const scheduledJob = await commandScheduler.getJob(
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
      expect(foundTask.isInState(Task.STATES.expired)).to.be.false;

      assertJobIsFailed(scheduledJob, taskListId, taskId);
    });
  });

  describe('unscheduling commands', () => {
    it('unschedules queued command', async () => {
      config.get.withArgs('eveble.Snapshotter.frequency').returns(1);

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

      const expireIn = 500;
      taskCompletionPolicy.setExpirationDuration(expireIn);

      await commandBus.handle(createList);
      await commandBus.handle(createTask);
      await commandBus.handle(completeTask);

      await delay(expireIn + 500);
      const scheduledJob = await commandScheduler.getJob(
        ExpireTask.getTypeName(),
        taskListId,
        'TaskList',
        taskId
      );
      expect(scheduledJob).to.be.undefined;

      const foundTaskList = (await repository.find(
        TaskList,
        taskListId
      )) as TaskList;
      const foundTask = foundTaskList.in<Task>('tasks').findById(taskId);
      expect(foundTask.isInState(Task.STATES.expired)).to.be.false;
    });
  });

  describe('batch unscheduling commands', () => {
    @define('CommandScheduling.MyCommand')
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

      const databaseName = getDatabaseName('scheduler');
      const collectionName = getCollectionName('scheduler');
      const collection = (clients.scheduler as any).getCollection(
        databaseName,
        collectionName
      );

      await commandScheduler.schedule(scheduleCommand);
      await commandScheduler.schedule(scheduleCommand);
      await commandScheduler.schedule(scheduleCommand);

      const beforeUnschedule = await collection.find({}).toArray();
      expect(beforeUnschedule).to.be.instanceof(Array);
      expect(beforeUnschedule).to.have.length(3);

      await commandScheduler.unscheduleAll();

      const afterUnschedule = await collection.find({}).toArray();
      expect(afterUnschedule).to.be.instanceof(Array);
      expect(afterUnschedule).to.have.length(0);
    });
  });
});

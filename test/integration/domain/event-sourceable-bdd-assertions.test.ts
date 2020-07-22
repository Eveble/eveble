import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { kernel } from '@eveble/core';
import { Injector } from '../../../src/core/injector';
import { Guid } from '../../../src/domain/value-objects/guid';
import { InfiniteTaskCompletionPolicy } from '../../domains/task-list/infinite-task-completion-policy';
import {
  CreateTaskList,
  OpenTaskList,
  CloseTaskList,
  AssignTaskList,
  CreateTask,
  AcceptTask,
  DeclineTask,
} from '../../domains/task-list/task-commands';
import {
  InvalidStateTransitionError,
  StatefulAssertion,
} from '../../../src/domain/assertions/stateful-assertion';
import { Asserter } from '../../../src/domain/asserter';
import {
  TaskListClosedError,
  TaskList,
} from '../../domains/task-list/task-list';
import { AbilityAssertion } from '../../../src/domain/assertions/ability-assertion';

chai.use(chaiAsPromised);

describe(`EventSourceable BDD assertions`, function () {
  let injector: Injector;
  let asserter: Asserter;

  before(() => {
    asserter = new Asserter();
    asserter.registerAssertion(new StatefulAssertion(asserter));
    asserter.registerAssertion(new AbilityAssertion(asserter));
  });

  beforeEach(() => {
    injector = new Injector();
    injector
      .bind('TaskList.TaskCompletionPolicy')
      .toConstantValue(new InfiniteTaskCompletionPolicy());

    kernel.setAsserter(asserter);
  });

  afterEach(() => {
    kernel.setAsserter(undefined as any);
  });

  describe(`validating state assertions`, () => {
    const taskListId = new Guid();
    const taskId = new Guid();

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
    const assignList = new AssignTaskList({
      targetId: taskListId,
      employeeId: new Guid(),
    });

    const createTask = new CreateTask({
      targetId: taskListId,
      id: taskId,
      name: 'my-task',
      priority: 0,
    });
    const acceptTask = new AcceptTask({
      targetId: taskListId,
      id: taskId,
    });
    const declineTask = new DeclineTask({
      targetId: taskListId,
      id: taskId,
      reason: 'my-reason',
    });

    it(`ensures that event sourceable is in expected state`, async () => {
      const taskList = new TaskList(createList);
      await injector.injectIntoAsync(taskList);

      await taskList.handle(createList);
      await taskList.handle(openList);
      await taskList.handle(closeList);
      expect(taskList.isInState(TaskList.STATES.closed)).to.be.true;
    });

    it(`ensures that event sourceable is in one of expected states`, async () => {
      const taskList = new TaskList(createList);
      await injector.injectIntoAsync(taskList);

      await taskList.handle(createList);
      await taskList.handle(assignList);
      expect(taskList.isInState(TaskList.STATES.created)).to.be.true;
    });

    it(`throws InvalidStateTransitionError if event sourceable is not in expected state`, async () => {
      const taskList = new TaskList(createList);
      await injector.injectIntoAsync(taskList);

      await taskList.handle(createList);
      await taskList.handle(openList);
      await taskList.handle(createTask);
      await taskList.handle(closeList);
      await expect(taskList.handle(acceptTask)).to.eventually.be.rejectedWith(
        InvalidStateTransitionError,
        `TaskList: cannot 'AcceptTask' when in 'closed' state(expected states: 'closed')`
      );
    });

    it(`throws InvalidStateTransitionError if event sourceable is not in one of expected states`, async () => {
      const taskList = new TaskList(createList);
      await injector.injectIntoAsync(taskList);

      await taskList.handle(createList);
      await taskList.handle(openList);
      await taskList.handle(closeList);
      await expect(taskList.handle(openList)).to.eventually.be.rejectedWith(
        InvalidStateTransitionError,
        `TaskList: cannot 'OpenTaskList' when in 'closed' state`
      );
    });

    it(`throws custom error on unexpected state`, async () => {
      const taskList = new TaskList(createList);
      await injector.injectIntoAsync(taskList);

      await taskList.handle(createList);
      await taskList.handle(openList);
      await taskList.handle(closeList);
      expect(taskList.handle(createTask)).to.eventually.be.rejectedWith(
        TaskListClosedError
      );
    });

    it(`ensures that correct error is thrown when entity is wrong state then expected`, async () => {
      const taskList = new TaskList(createList);
      await injector.injectIntoAsync(taskList);

      await taskList.handle(createList);
      await taskList.handle(openList);
      await taskList.handle(createTask);
      await taskList.handle(declineTask);
      await expect(taskList.handle(acceptTask)).to.eventually.be.rejectedWith(
        InvalidStateTransitionError,
        `Task: cannot 'accept' when in 'declined' state(expected states: 'created')`
      );
    });
  });
});

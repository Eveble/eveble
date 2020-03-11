import { inject } from '@parisholley/inversify-async';
import { Aggregate } from '../../../src/domain/aggregate';
import { Task } from './task';
import {
  CreateTaskList,
  AssignTaskList,
  OpenTaskList,
  CloseTaskList,
  CreateTask,
  ExpireTask,
  ChangeTaskPriority,
  AcceptTask,
  DeclineTask,
  StartTask,
  CompleteTask,
  PostponeTask,
  QuitTask,
  HoldTask,
} from './task-commands';
import {
  TaskListCreated,
  TaskListAssigned,
  TaskListOpened,
  TaskListClosed,
  TaskCreated,
  TaskExpired,
  TaskPriorityChanged,
  TaskAccepted,
  TaskDeclined,
  TaskStarted,
  TaskCompleted,
  TaskPostponed,
  TaskQuitted,
  TaskHold,
} from './task-events';
import { Guid } from '../../../src/domain/value-objects/guid';
import { DomainError } from '../../../src/domain/domain-error';
import { define } from '../../../src/decorators/define';
import { types } from '../../../src/types';
import { subscribe } from '../../../src/annotations/subscribe';
import { initial } from '../../../src/annotations/initial';
import { route } from '../../../src/annotations/route';

@define()
export class TaskListClosedError extends DomainError {
  constructor(taskListId: string) {
    super(`Can't add new tasks to closed task list with id '${taskListId}'`);
  }
}

@define()
export class InappropriateTaskListTitleError extends DomainError {
  constructor(taskListId: string, title: string) {
    super(
      `Title for task list with id '${taskListId}' can't use inappropriate words like '${title}'`
    );
  }
}

@define()
export class TaskList extends Aggregate {
  @inject('TaskList.TaskCompletionPolicy')
  taskCompletionPolicy: any;

  public static STATES = {
    created: 'created',
    open: 'open',
    closed: 'closed',
    removed: 'removed',
  };

  title: string;

  employeeId?: Guid;

  tasks: Task[];

  /*
  HANDLES
  /*
  /*
  TASK LIST
  */
  CreateTaskList(@initial command: CreateTaskList): void {
    const { title } = command;
    if (title === 'twatwaffle') {
      throw new InappropriateTaskListTitleError(
        command.getId().toString(),
        title
      );
    }

    this.record(
      new TaskListCreated(
        this.pickEventProps(command, {
          title,
          tasks: [],
        })
      )
    );
  }

  AssignTaskList(@route command: AssignTaskList): void {
    this.on('AssignTaskList').ensure.is.inOneOfStates([
      TaskList.STATES.created,
      TaskList.STATES.open,
    ]);
    this.record(
      new TaskListAssigned({
        ...this.eventProps(),
        employeeId: command.employeeId,
      })
    );
  }

  OpenTaskList(@route command: OpenTaskList): void {
    this.on('OpenTaskList').ensure.is.not.inOneOfStates([
      TaskList.STATES.open,
      TaskList.STATES.closed,
    ]);
    this.record(new TaskListOpened(this.pickEventProps(command)));
  }

  CloseTaskList(@route command: CloseTaskList): void {
    this.on('CloseTaskList').ensure.is.inState(TaskList.STATES.open);
    this.record(new TaskListClosed(this.pickEventProps(command)));
  }

  /*
  TASK
  */
  CreateTask(@route command: CreateTask): void {
    this.on('CreateTask').ensure.is.not.inState(
      TaskList.STATES.closed,
      new TaskListClosedError(this.getId().toString())
    );
    this.record(
      new TaskCreated({
        ...this.eventProps(),
        task: Task.from(command),
      })
    );

    this.taskCompletionPolicy.implement(this, command.id);
  }

  ExpireTask(@route command: ExpireTask): void {
    if (this.title === 'error') {
      throw new Error('error thrown for scheduled command');
    }

    const foundTask = this.in<Task>('tasks').findById(command.id);
    foundTask.on('expire').ensure.is.ableTo();

    this.record(
      new TaskExpired({
        ...this.eventProps(),
        task: foundTask,
      })
    );
  }

  AcceptTask(@route command: AcceptTask): void {
    this.on('AcceptTask').ensure.is.not.inState(TaskList.STATES.closed);

    const foundTask = this.in<Task>('tasks').findById(command.id);
    foundTask.on('accept').ensure.is.ableTo();

    this.record(
      new TaskAccepted({
        ...this.eventProps(),
        task: foundTask,
      })
    );
  }

  ChangeTaskPriority(@route command: ChangeTaskPriority): void {
    this.on('ChangeTaskPriority').ensure.is.not.inState(TaskList.STATES.closed);

    const foundTask = this.in<Task>('tasks').findById(command.id);
    foundTask.on('changePriority').ensure.is.ableTo(command.priority);

    this.record(
      new TaskAccepted({
        ...this.eventProps(),
        task: foundTask,
      })
    );
  }

  // Same as AcceptTask - just as helper function for simplicity, show of DRY
  DeclineTask(@route command: DeclineTask): void {
    this.recordTask(TaskDeclined, 'decline', command.id, {
      reason: command.reason,
    });
  }

  StartTask(@route command: StartTask): void {
    this.recordTask(TaskStarted, 'start', command.id);
  }

  CompleteTask(@route command: CompleteTask): void {
    this.recordTask(TaskCompleted, 'complete', command.id);

    this.taskCompletionPolicy.cancel(this, command.id);
  }

  PostponeTask(@route command: PostponeTask): void {
    this.recordTask(TaskPostponed, 'postpone', command.id, {
      tillAt: command.tillAt,
    });
  }

  QuitTask(@route command: QuitTask): void {
    this.recordTask(TaskQuitted, 'quit', command.id);

    this.taskCompletionPolicy.cancel(this, command.id);
  }

  HoldTask(@route command: HoldTask): void {
    this.recordTask(TaskHold, 'hold', command.id);
  }

  /**
   * Records a new event related to Task entity.
   * @param EventType - Subclass of `Event` type constructor.
   * @param actionName - Name of an action that is being invoked on Entity.
   * @param taskId - Task identifier.
   * @param props - Optional properties that will attached to event
   */
  protected recordTask(
    EventType: types.MessageType<types.Event>,
    actionName: string,
    taskId: Guid,
    props?: Record<string, any>
  ): void {
    const foundTask = this.in<Task>('tasks').findById(taskId);
    foundTask.on(actionName).ensure.is.ableTo(actionName);
    const eventProps: Record<string, any> = {
      ...this.eventProps(),
      task: foundTask,
      ...props,
    };
    if (this.employeeId) eventProps.employeeId = this.employeeId;
    this.record(new EventType(eventProps));
  }

  /*
  SUBSCRIPTIONS
  */
  /*
    TASK LIST
  */
  TaskListCreated(@subscribe event: TaskListCreated): void {
    this.assign(event);
    this.setState(TaskList.STATES.created);
  }

  TaskListAssigned(@subscribe event: TaskListAssigned): void {
    this.employeeId = event.employeeId;
  }

  TaskListOpened(@subscribe _event: TaskListOpened): void {
    this.setState(TaskList.STATES.open);
  }

  TaskListClosed(@subscribe _event: TaskListClosed): void {
    this.setState(TaskList.STATES.closed);
  }

  /*
    TASK
  */
  TaskCreated(@subscribe event: TaskCreated): void {
    this.in<Task>('tasks').add(event.task);
  }

  TaskExpired(@subscribe event: TaskExpired): void {
    this.in<Task>('tasks')
      .findById(event.task.id)
      .expire();
  }

  TaskPriorityChanged(@subscribe event: TaskPriorityChanged): void {
    this.in<Task>('tasks')
      .findById(event.task.id)
      .changePriority(event.priority);
  }

  TaskAccepted(@subscribe event: TaskAccepted): void {
    this.in<Task>('tasks')
      .findById(event.task.id)
      .accept();
  }

  TaskDeclined(@subscribe event: TaskDeclined): void {
    this.in<Task>('tasks')
      .findById(event.task.id)
      .decline(event.reason);
  }

  TaskStarted(@subscribe event: TaskStarted): void {
    this.in<Task>('tasks')
      .findById(event.task.id)
      .start();
  }

  TaskCompleted(@subscribe event: TaskCompleted): void {
    this.in<Task>('tasks')
      .findById(event.task.id)
      .complete();
  }

  TaskPostponed(@subscribe event: TaskPostponed): void {
    this.in<Task>('tasks')
      .findById(event.task.id)
      .postpone(event.tillAt);
  }

  TaskQuitted(@subscribe event: TaskQuitted): void {
    this.in<Task>('tasks')
      .findById(event.task.id)
      .quit();
  }

  TaskHold(@subscribe event: TaskHold): void {
    this.in<Task>('tasks')
      .findById(event.task.id)
      .hold();
  }
}

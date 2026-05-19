import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, beforeAll } from 'vitest';

import { Type } from '@eveble/core';
import { Command, Assignment } from '../../../src/components/command';
import { CommandSchedulingService } from '../../../src/infrastructure/command-scheduling-service';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Injector } from '../../../src/core/injector';
import { ScheduleCommand } from '../../../src/domain/schedule-command';
import { Service } from '../../../src/infrastructure/service';
import { UnscheduleCommand } from '../../../src/domain/unschedule-command';
import { Guid } from '../../../src/domain/value-objects/guid';

describe(`CommandSchedulingService`, () => {
  @Type('CommandSchedulingService.MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    name: string;
  }

  let now: any;
  // Dependencies
  let injector: Injector;
  let commandBus: any;
  let eventBus: any;
  let scheduler: any;
  let service: CommandSchedulingService;
  // Schedule command
  const targetId = new Guid();
  const assignmentId = new Guid();
  const timestamp = new Date();
  const assignerId = new Guid();
  const assignerType = 'MyEventSourceable';
  const name = 'foo';

  const unscheduleCommand = new UnscheduleCommand({
    targetId,
    assignmentId,
    commandType: MyCommand.getTypeName(),
    assignerId,
    assignerType,
  });

  beforeAll(() => {
    now = new Date();
  });

  beforeEach(() => {
    injector = new Injector();
    commandBus = mock<types.CommandBus>();
    eventBus = mock<types.EventBus>();
    scheduler = mock<types.CommandScheduler>();

    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    injector
      .bind<types.CommandScheduler>(BINDINGS.CommandScheduler)
      .toConstantValue(scheduler);

    service = new CommandSchedulingService();
    injector.injectInto(service);
  });

  it(`extends Service`, () => {
    expect(CommandSchedulingService.prototype).toBeInstanceOf(Service);
  });

  it(`handles ScheduleCommand command`, () => {
    expect(service.hasHandler(ScheduleCommand)).toBe(true);
  });

  it(`handles UnscheduleCommand command`, () => {
    expect(service.hasHandler(UnscheduleCommand)).toBe(true);
  });

  it(`schedules delayed command with command scheduler`, async () => {
    const deliverAt = new Date(now.getTime() + 1000);

    const assignment = new Assignment({
      assignmentId,
      deliverAt,
      assignerId,
      assignerType,
    });
    const command = new MyCommand({
      targetId,
      name,
      timestamp,
    });
    command.schedule(assignment);
    const scheduleCommand = new ScheduleCommand({
      targetId,
      command,
    });

    await service.handle(scheduleCommand);
    expect(commandBus.send).not.toHaveBeenCalled();
    expect(scheduler.schedule).toHaveBeenCalledTimes(1);
    expect(scheduler.schedule).toHaveBeenCalledWith(scheduleCommand);
  });

  it(`sends command immediately if command is deliverable`, async () => {
    const deliverAt = new Date(now.getTime() - 1000);

    const assignment = new Assignment({
      assignmentId,
      deliverAt,
      assignerId,
      assignerType,
    });
    const command = new MyCommand({
      targetId,
      name,
      timestamp,
    });
    command.schedule(assignment);
    const scheduleCommand = new ScheduleCommand({
      targetId,
      command,
    });

    await service.handle(scheduleCommand);
    expect(commandBus.send).toHaveBeenCalledTimes(1);
    expect(commandBus.send).toHaveBeenCalledWith(scheduleCommand.command);
  });

  it(`unschedules command from command scheduler`, async () => {
    await service.handle(unscheduleCommand);
    expect(scheduler.unschedule).toHaveBeenCalledTimes(1);
    expect(scheduler.unschedule).toHaveBeenCalledWith(unscheduleCommand);
  });
});

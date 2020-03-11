import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { Command, Assignment } from '../../../src/components/command';
import { define } from '../../../src/decorators/define';
import { CommandSchedulingService } from '../../../src/infrastructure/command-scheduling-service';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { Container } from '../../../src/core/injector';
import { ScheduleCommand } from '../../../src/domain/schedule-command';
import { Service } from '../../../src/infrastructure/service';
import { UnscheduleCommand } from '../../../src/domain/unschedule-command';
import { Guid } from '../../../src/domain/value-objects/guid';

chai.use(sinonChai);

describe(`CommandSchedulingService`, function() {
  @define('CommandSchedulingService.MyCommand', { isRegistrable: false })
  class MyCommand extends Command {
    name: string;
  }

  let now: any;
  // Dependencies
  let container: Container;
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

  before(() => {
    now = new Date();
  });

  beforeEach(() => {
    container = new Container();
    commandBus = stubInterface<types.CommandBus>();
    eventBus = stubInterface<types.EventBus>();
    scheduler = stubInterface<types.CommandScheduler>();

    container
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    container.bind<types.EventBus>(BINDINGS.EventBus).toConstantValue(eventBus);
    container
      .bind<types.CommandScheduler>(BINDINGS.CommandScheduler)
      .toConstantValue(scheduler);

    service = new CommandSchedulingService();
    container.injectInto(service);
  });

  it(`extends Service`, () => {
    expect(CommandSchedulingService.prototype).to.be.instanceof(Service);
  });

  it(`handles ScheduleCommand command`, () => {
    expect(service.hasHandler(ScheduleCommand)).to.be.true;
  });

  it(`handles UnscheduleCommand command`, () => {
    expect(service.hasHandler(UnscheduleCommand)).to.be.true;
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
    expect(commandBus.send).to.be.not.called;
    expect(scheduler.schedule).to.be.calledOnce;
    expect(scheduler.schedule).to.be.calledWithExactly(scheduleCommand);
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
    expect(commandBus.send).to.be.calledOnce;
    expect(commandBus.send).to.be.calledWithExactly(scheduleCommand.command);
  });

  it(`unschedules command from command scheduler`, async () => {
    await service.handle(unscheduleCommand);
    expect(scheduler.unschedule).to.be.calledOnce;
    expect(scheduler.unschedule).to.be.calledWithExactly(unscheduleCommand);
  });
});

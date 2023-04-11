import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { stubInterface } from 'ts-sinon';
import { Collection } from 'mongodb';
import Agenda from 'agenda';
import sinon from 'sinon';
import { define } from '@eveble/core';
import { AgendaClient } from '../../../src/app/clients/agenda-client';
import { Command, Assignment } from '../../../src/components/command';
import { types } from '../../../src/types';
import { AgendaCommandScheduler } from '../../../src/infrastructure/schedulers/agenda-command-scheduler';
import { Log } from '../../../src/components/log-entry';
import {
  InactiveClientError,
  CommandSchedulingError,
  CommandUnschedulingError,
} from '../../../src/infrastructure/infrastructure-errors';
import { Guid } from '../../../src/domain/value-objects/guid';
import { ScheduleCommand } from '../../../src/domain/schedule-command';
import { Injector } from '../../../src/core/injector';
import { BINDINGS } from '../../../src/constants/bindings';
import { UnscheduleCommand } from '../../../src/domain/unschedule-command';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe(`AgendaCommandScheduler`, () => {
  @define('AgendaCommandScheduler.MyCommand', { isRegistrable: false })
  class MyCommand extends Command<MyCommand> {
    name: string;
  }

  // Dependencies
  let log: any;
  let injector: Injector;
  let commandBus: any;
  let agendaClient: any;
  let serializer: any;
  let collection: any;
  let jobTransformer: any;
  let agendaInstance: any;
  let scheduler: AgendaCommandScheduler;

  // AgendaClient props
  const agendaClientId = 'my-agenda-client-id';
  // Scheduler props
  const jobName = 'my-job-name';
  const options = {
    concurrency: 5,
    lockLimit: 5,
    lockLifetime: 5,
    priority: 'normal',
  };

  // Schedule command
  const targetId = new Guid();
  const assignmentId = new Guid();
  const timestamp = new Date();
  const deliverAt = new Date();
  const assignerId = new Guid();
  const assignerType = 'MyEventSourceable';
  const name = 'foo';
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
  const unscheduleCommand = new UnscheduleCommand({
    targetId,
    assignmentId,
    commandType: MyCommand.getTypeName(),
    assignerId,
    assignerType,
  });

  // Returns
  const serializedCommand = `{"$type":"AgendaCommandScheduler.MyCommand","$value":{"timestamp":{"$date":${Number(
    timestamp
  )}},"targetId":{"$type":"Guid","$value":{"id":"${targetId.toString()}"}},"name":"Foo"}}`;

  beforeEach(() => {
    log = stubInterface<types.Logger>();
    commandBus = stubInterface<types.CommandBus>();
    agendaClient = stubInterface<AgendaClient>();
    serializer = stubInterface<types.Serializer>();
    collection = stubInterface<Collection>();
    jobTransformer = stubInterface<types.AgendaJobTransformer>();
    agendaInstance = stubInterface<Agenda>();

    agendaClient.library = agendaInstance;
    agendaClient.isConnected.returns(true);
    agendaClient.getId.returns(agendaClientId);

    serializer.stringify.withArgs(command).returns(serializedCommand);
    serializer.parse.withArgs(serializedCommand).returns(command);

    injector = new Injector();
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
    injector
      .bind<types.CommandBus>(BINDINGS.CommandBus)
      .toConstantValue(commandBus);
    injector
      .bind<types.Serializer>(BINDINGS.Serializer)
      .toConstantValue(serializer);
    injector
      .bind<Collection>(BINDINGS.MongoDB.collections.ScheduledCommands)
      .toConstantValue(collection);
    injector
      .bind<types.AgendaJobTransformer>(BINDINGS.Agenda.jobTransformer)
      .toConstantValue(jobTransformer);
    injector
      .bind<AgendaClient>(BINDINGS.Agenda.clients.CommandScheduler)
      .toConstantValue(agendaClient);

    scheduler = new AgendaCommandScheduler(jobName, options);
    injector.injectInto(scheduler);
  });

  describe(`construction`, () => {
    it(`takes jobName as a string and assigns it`, () => {
      const instance = new AgendaCommandScheduler(jobName);
      expect(instance.jobName).to.be.equal(jobName);
    });

    it(`takes jobName and  options as an object and assigns them`, () => {
      const instance = new AgendaCommandScheduler(jobName, options);
      expect(instance.jobName).to.be.equal(jobName);
      expect(instance.options).to.be.equal(options);
    });
  });

  describe('initialization', () => {
    context('successful', () => {
      it(`defines agenda job for scheduled command upon initialization`, async () => {
        await scheduler.initialize();

        expect(agendaInstance.define).to.be.calledOnce;
        const calledArgs = agendaInstance.define.args[0];
        expect(calledArgs[0]).to.be.equal(jobName);
        expect(calledArgs[1]).to.be.equal(options);
        expect(calledArgs[2]).to.be.instanceof(Function);
      });

      it('ensures that scheduled command job handler is bound to instance of scheduler', async () => {
        await scheduler.initialize();

        expect(agendaInstance.define).to.be.calledOnce;
        const calledArgs = agendaInstance.define.args[0];
        const boundHandler = calledArgs[2];
        const unboundHandler = boundHandler.original;
        expect(unboundHandler).to.be.equal(scheduler.handleScheduledCommand);
      });

      it('logs successful scheduler initialization', async () => {
        await scheduler.initialize();

        expect(log.debug).to.be.calledWithExactly(
          new Log(
            `defined new Agenda job '${jobName}' for client with id '${agendaClientId}'`
          )
            .on(scheduler)
            .in(scheduler.initialize)
        );
      });
    });
    context('failed', () => {
      it('logs failed initialization do to inactive Agenda client', async () => {
        agendaClient.isConnected.returns(false);
        await expect(scheduler.initialize()).to.eventually.be.rejectedWith(
          InactiveClientError,
          `AgendaCommandScheduler: can't be initialized since underlying client with id '${agendaClientId}' is inactive`
        );
      });

      it('throws InactiveClientError when Agenda client is inactive on initialization', async () => {
        agendaClient.isConnected.returns(false);
        await expect(scheduler.initialize()).to.eventually.be.rejectedWith(
          InactiveClientError
        );
        expect(log.error).to.be.calledWithMatch(
          new Log(`inactive Agenda client`)
            .on(scheduler)
            .in(scheduler.initialize)
        );
      });
    });
  });

  describe('managing state', () => {
    it('starts scheduling(processing scheduled jobs)', async () => {
      await scheduler.initialize();
      await scheduler.startScheduling();
      expect(scheduler.isInState(AgendaCommandScheduler.STATES.active)).to.be
        .true;
    });

    it('stops scheduling(stops processing scheduled jobs)', async () => {
      await scheduler.initialize();
      await scheduler.startScheduling();
      await scheduler.stopScheduling();
      expect(scheduler.isInState(AgendaCommandScheduler.STATES.stopped)).to.be
        .true;
    });
  });

  describe('scheduling command', () => {
    it('logs scheduling command', async () => {
      await scheduler.initialize();
      await scheduler.schedule(scheduleCommand);

      expect(log.debug).to.be.calledWithExactly(
        new Log(`scheduling command '${assignmentId}'`)
          .on(scheduler)
          .in(scheduler.schedule)
          .with('scheduled command', scheduleCommand)
      );
    });

    context('successful', () => {
      it(`schedules command`, async () => {
        const expectedSerializedData = {
          id: assignmentId.toString(),
          command: serializedCommand,
          commandType: 'AgendaCommandScheduler.MyCommand',
          assignerId: assignerId.toString(),
          assignerType: 'MyEventSourceable',
        };

        await scheduler.initialize();
        await scheduler.schedule(scheduleCommand);

        expect(agendaInstance.schedule).to.be.calledOnce;
        expect(agendaInstance.schedule).to.be.calledWith(
          deliverAt,
          jobName,
          expectedSerializedData
        );
      });

      it('logs successfully scheduled command', async () => {
        await scheduler.initialize();
        await scheduler.schedule(scheduleCommand);

        expect(log.debug).to.be.calledWithExactly(
          new Log(`scheduled command '${assignmentId}'`)
            .on(scheduler)
            .in(scheduler.schedule)
            .with('scheduled command', scheduleCommand)
        );
      });
    });

    context('failed', () => {
      it(`throws error when scheduled command can't be scheduled`, async () => {
        const error = new Error('my-error');
        agendaInstance.schedule.rejects(error);

        await scheduler.initialize();
        await expect(
          scheduler.schedule(scheduleCommand)
        ).to.be.eventually.rejectedWith(
          CommandSchedulingError,
          `${jobName}: cannot schedule command '${assignmentId}' that was scheduled by '${assignerType}@${assignerId}' do to error '${error}'`
        );
      });

      it(`logs thrown error when Agenda can't schedule command`, async () => {
        const error = new Error('my-error');
        agendaInstance.schedule.rejects(error);

        await scheduler.initialize();
        await expect(
          scheduler.schedule(scheduleCommand)
        ).to.be.eventually.rejectedWith(CommandSchedulingError);
        expect(log.error).to.be.calledWithExactly(
          new Log(
            `failed scheduling command '${assignmentId}' do to error: ${error}`
          )
            .on(scheduler)
            .in(scheduler.schedule)
            .with('scheduled command', scheduleCommand)
        );
      });
    });
  });

  describe('unscheduling command', () => {
    it('logs unscheduling command', async () => {
      await scheduler.initialize();
      await scheduler.unschedule(unscheduleCommand);

      expect(log.debug).to.be.calledWithExactly(
        new Log(`unscheduling command '${assignmentId}'`)
          .on(scheduler)
          .in(scheduler.unschedule)
          .with('unschedule command', unscheduleCommand)
      );
    });

    context('successful', () => {
      it(`unschedules command`, async () => {
        agendaInstance.cancel.resolves(1);

        await scheduler.initialize();
        const isSuccessful = await scheduler.unschedule(unscheduleCommand);
        expect(isSuccessful).to.be.true;

        const expectedMongoQuery = {
          'data.id': assignmentId.toString(),
          'data.commandType': MyCommand.getTypeName(),
          'data.assignerId': assignerId.toString(),
          'data.assignerType': assignerType,
        };
        expect(agendaInstance.cancel).to.be.calledOnce;
        expect(agendaInstance.cancel).to.be.calledWith(expectedMongoQuery);
      });

      it('logs successful cancellation of scheduled command', async () => {
        agendaInstance.cancel.resolves(1);

        await scheduler.initialize();
        await scheduler.unschedule(unscheduleCommand);

        expect(log.debug).to.be.calledWithExactly(
          new Log(`unscheduled command '${assignmentId}'`)
            .on(scheduler)
            .in(scheduler.unschedule)
            .with('unschedule command', unscheduleCommand)
        );
      });

      it('does not throw error if Agenda client resolves removed job count as 0', async () => {
        agendaInstance.cancel.resolves(0);

        await scheduler.initialize();
        const isSuccessful = await scheduler.unschedule(unscheduleCommand);
        expect(isSuccessful).to.be.false;
      });
    });

    context('failed', () => {
      it('throws CommandUnschedulingError when Agenda client throws error', async () => {
        const error = new Error('my-error');
        agendaInstance.cancel.rejects(error);

        await scheduler.initialize();
        await expect(
          scheduler.unschedule(unscheduleCommand)
        ).to.be.eventually.rejectedWith(
          CommandUnschedulingError,
          `${jobName}: cannot cancel command '${assignmentId}' that was scheduled by '${assignerType}@${assignerId}' do to error '${error}'`
        );
      });

      it('logs thrown error upon  Agenda client canceling the job', async () => {
        const error = new Error('my-error');
        agendaInstance.cancel.rejects(error);

        await scheduler.initialize();
        await expect(
          scheduler.unschedule(unscheduleCommand)
        ).to.be.eventually.rejectedWith(CommandUnschedulingError);

        expect(log.error).to.be.calledWithExactly(
          new Log(
            `failed unscheduling command '${assignmentId}' do to error: ${error}`
          )
            .on(scheduler)
            .in(scheduler.unschedule)
            .with('unschedule command', unscheduleCommand)
        );
      });
    });
  });

  describe('handling schedule command job', () => {
    it(`logs handling scheduled command`, async () => {
      const serializedData = {
        id: assignmentId.toString(),
        command: serializedCommand,
      };

      const job = stubInterface<Agenda.Job>();
      job.attrs.data = serializedData;

      await scheduler.handleScheduledCommand(job);
      expect(log.debug).to.be.calledWithMatch(
        new Log(`handling scheduled command '${assignmentId}'`)
          .on(scheduler)
          .in(scheduler.handleScheduledCommand)
          .with('command', command)
      );
    });

    it(`sends command through command bus upon scheduled time`, async () => {
      const serializedData = {
        id: assignmentId.toString(),
        command: serializedCommand,
        commandType: 'AgendaCommandScheduler.MyCommand',
        assignerId: assignerId.toString(),
        assignerType,
      };

      const job = stubInterface<Agenda.Job>();
      job.attrs.data = serializedData;

      await scheduler.handleScheduledCommand(job);
      expect(commandBus.send).to.be.calledOnce;
      expect(commandBus.send).to.be.calledWithExactly(command);
    });

    it(`logs sended command through command bus upon scheduled time`, async () => {
      const serializedData = {
        id: assignmentId.toString(),
        command: serializedCommand,
        commandType: 'AgendaCommandScheduler.MyCommand',
        assignerId: assignerId.toString(),
        assignerType,
      };

      const job = stubInterface<Agenda.Job>();
      job.attrs.data = serializedData;

      await scheduler.handleScheduledCommand(job);
      expect(log.debug).to.be.calledWithExactly(
        new Log(`handled scheduled command '${assignmentId}'`)
          .on(scheduler)
          .in(scheduler.handleScheduledCommand)
          .with('command', command)
      );
    });

    it('saves failed state on job upon thrown error', async () => {
      const serializedData = {
        id: assignmentId.toString(),
        command: serializedCommand,
        commandType: 'AgendaCommandScheduler.MyCommand',
        assignerId: assignerId.toString(),
        assignerType,
      };

      const job = stubInterface<Agenda.Job>();
      job.attrs.data = serializedData;

      const error = new Error('my-error');
      commandBus.send.rejects(error);

      await scheduler.handleScheduledCommand(job);
      expect(job.fail).to.be.calledOnce;
      expect(job.fail).to.be.calledWithExactly(error);
      expect(job.save).to.be.calledOnce;
      expect(job.save).to.be.calledWithExactly();
    });

    it('logs failed handling of job upon thrown error', async () => {
      const serializedData = {
        id: assignmentId.toString(),
        command: serializedCommand,
        commandType: 'AgendaCommandScheduler.MyCommand',
        assignerId: assignerId.toString(),
        assignerType,
      };

      const job = stubInterface<Agenda.Job>();
      job.attrs.data = serializedData;

      const error = new Error('my-error');
      commandBus.send.rejects(error);

      await scheduler.handleScheduledCommand(job);
      expect(log.error).to.be.calledWithExactly(
        new Log(
          `failed handling of scheduled command '${assignmentId}' do to error: ${error}`
        )
          .on(scheduler)
          .in(scheduler.handleScheduledCommand)
          .with('command', command)
      );
    });
  });

  describe('batch canceling of scheduled commands', () => {
    it('successfully cancels all scheduled commands', async () => {
      await scheduler.unscheduleAll();

      expect(collection.deleteMany).to.be.calledOnce;
      expect(collection.deleteMany).to.be.calledWith({
        name: jobName,
      });
    });

    it('logs successful cancellation of all scheduled commands', async () => {
      await scheduler.unscheduleAll();

      expect(log.debug).to.be.calledWithExactly(
        new Log(`successfully unscheduled all jobs from '${jobName}'`)
          .on(scheduler)
          .in(scheduler.unscheduleAll)
      );
    });

    it('throws error upon unsuccessful cancellation of all jobs', async () => {
      const error = new Error('my-error');
      collection.deleteMany.rejects(error);

      await expect(scheduler.unscheduleAll()).to.eventually.be.rejectedWith(
        error
      );
    });

    it('logs unsuccessful cancellation of all jobs', async () => {
      const error = new Error('my-error');
      collection.deleteMany.rejects(error);

      await expect(scheduler.unscheduleAll()).to.eventually.be.rejectedWith(
        error
      );
      expect(log.error).to.be.calledWithExactly(
        new Log(
          `failed unscheduling all jobs from '${jobName}' do to error: ${error}`
        )
          .on(scheduler)
          .in(scheduler.unscheduleAll)
      );
    });
  });

  describe('resolving', () => {
    it('returns scheduled job if job is found on queue', async () => {
      const returnedJob = sinon.stub();
      agendaInstance.jobs.returns([returnedJob]);

      const transformedJob = sinon.stub();
      jobTransformer.transform.returns(transformedJob);

      const foundJob = await scheduler.getJob(
        MyCommand.getTypeName(),
        assignerId,
        assignerType,
        assignmentId
      );
      expect(foundJob).to.be.equal(transformedJob);

      const expectedMongoQuery = {
        'data.commandType': MyCommand.getTypeName(),
        'data.assignerId': assignerId.toString(),
        'data.assignerType': assignerType,
        'data.id': assignmentId.toString(),
      };
      const expectedMongoSort = { data: -1 };
      const expectedMongoLimit = 1;
      expect(agendaInstance.jobs).to.be.calledOnce;
      expect(agendaInstance.jobs).to.be.calledWith(
        expectedMongoQuery,
        expectedMongoSort,
        expectedMongoLimit
      );
      expect(jobTransformer.transform).to.be.calledWith(returnedJob);
    });

    it('returns scheduled job with omitted optional assignmentId argument', async () => {
      const returnedJob = sinon.stub();
      agendaInstance.jobs.returns([returnedJob]);

      const transformedJob = sinon.stub();
      jobTransformer.transform.returns(transformedJob);

      const foundJob = await scheduler.getJob(
        MyCommand.getTypeName(),
        assignerId,
        assignerType
      );
      expect(foundJob).to.be.equal(transformedJob);

      const expectedMongoQuery = {
        'data.commandType': MyCommand.getTypeName(),
        'data.assignerId': assignerId.toString(),
        'data.assignerType': assignerType,
      };
      const expectedMongoSort = { data: -1 };
      const expectedMongoLimit = 1;
      expect(agendaInstance.jobs).to.be.calledOnce;
      expect(agendaInstance.jobs).to.be.calledWith(
        expectedMongoQuery,
        expectedMongoSort,
        expectedMongoLimit
      );
      expect(jobTransformer.transform).to.be.calledWith(returnedJob);
    });

    it(`returns undefined if job can't be found on queue`, async () => {
      agendaInstance.jobs.returns([]);

      const foundJob = await scheduler.getJob(
        MyCommand.getTypeName(),
        targetId,
        assignerType,
        assignmentId
      );
      expect(foundJob).to.be.equal(undefined);

      expect(agendaInstance.jobs).to.be.calledOnce;
      expect(jobTransformer.transform).to.not.be.called;
    });
  });

  describe('getters', () => {
    describe('getInterval', () => {
      it('returns interval in which jobs are processed', () => {
        const interval = 50;
        agendaClient.getInterval.returns(interval);
        expect(scheduler.getInterval()).to.be.equal(interval);
      });
    });
  });
});

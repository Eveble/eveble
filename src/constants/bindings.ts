export const BINDINGS = {
  chalk: Symbol.for('chalk'),
  App: Symbol.for('App'),
  Injector: Symbol.for('Injector'),
  Converter: Symbol.for('Converter'),
  Library: Symbol.for('Library'),
  Config: Symbol.for('Config'),
  Validator: Symbol.for('Validator'),
  Describer: Symbol.for('Describer'),
  log: Symbol.for('Logger'),
  winston: Symbol.for('winston'),
  LogConverter: Symbol.for('LogConverter'),
  SimpleLogFormatter: Symbol.for('SimpleLogFormatter'),
  DetailedLogFormatter: Symbol.for('DetailedLogFormatter'),
  console: 'console',
  CommandBus: Symbol.for('CommandBus'),
  EventBus: Symbol.for('EventBus'),
  EJSON: Symbol.for('EJSON'),
  Serializer: Symbol.for('Serializer'),
  Asserter: Symbol.for('Asserter'),
  Router: Symbol.for('Router'),
  EventSourceableRepository: Symbol.for('EventSourceableRepository'),
  CommitStore: Symbol.for('CommitStore'),
  Snapshotter: Symbol.for('Snapshotter'),
  SnapshotStorage: Symbol.for('SnapshotStorage'),
  SnapshotSerializer: Symbol.for('SnapshotSerializer'),
  CommitStorage: Symbol.for('CommitStorage'),
  CommitPublisher: Symbol.for('CommitPublisher'),
  CommitObserver: Symbol.for('CommitObserver'),
  CommitSerializer: Symbol.for('CommitSerializer'),
  MongoDB: {
    library: Symbol.for('MongoDB.library'),
    clients: {
      Snapshotter: Symbol.for('MongoDB.clients.Snapshotter'),
      CommitStore: Symbol.for('MongoDB.clients.CommitStore'),
      CommandScheduler: Symbol.for('MongoDB.clients.CommandScheduler'),
    },
    collections: {
      Snapshots: Symbol.for('MongoDB.collections.Snapshots'),
      Commits: Symbol.for('MongoDB.collections.Commits'),
      ScheduledCommands: Symbol.for('MongoDB.collections.ScheduledCommands'),
    },
  },
  Agenda: {
    library: Symbol.for('Agenda.library'),
    clients: {
      CommandScheduler: Symbol.for('Agenda.clients.CommandScheduler'),
    },
    jobTransformer: Symbol.for('Agenda.jobTransformer'),
  },
  CommandScheduler: Symbol.for('CommandScheduler'),
  CommandSchedulingService: Symbol.for('CommandSchedulingService'),
};

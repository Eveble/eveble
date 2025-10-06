export declare const BINDINGS: {
    chalk: symbol;
    App: symbol;
    Injector: symbol;
    Converter: symbol;
    Library: symbol;
    Config: symbol;
    Validator: symbol;
    Describer: symbol;
    log: symbol;
    winston: symbol;
    LogConverter: symbol;
    SimpleLogFormatter: symbol;
    DetailedLogFormatter: symbol;
    console: string;
    CommandBus: symbol;
    EventBus: symbol;
    EJSON: symbol;
    Serializer: symbol;
    Asserter: symbol;
    Router: symbol;
    EventSourceableRepository: symbol;
    CommitStore: symbol;
    Snapshotter: symbol;
    SnapshotStorage: symbol;
    SnapshotSerializer: symbol;
    CommitStorage: symbol;
    CommitPublisher: symbol;
    CommitObserver: symbol;
    CommitSerializer: symbol;
    MongoDB: {
        library: symbol;
        clients: {
            Snapshotter: symbol;
            CommitStore: symbol;
            CommandScheduler: symbol;
        };
        collections: {
            Snapshots: symbol;
            Commits: symbol;
            ScheduledCommands: symbol;
        };
    };
    Agenda: {
        library: symbol;
        clients: {
            CommandScheduler: symbol;
        };
        jobTransformer: symbol;
    };
    CommandScheduler: symbol;
    CommandSchedulingService: symbol;
};

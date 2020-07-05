import { types } from '../types';
export declare class CommitPublisher {
    protected log: types.Logger;
    protected config: types.Configurable;
    commandBus: types.CommandBus;
    protected eventBus: types.EventBus;
    protected serializer: types.Serializer;
    protected storage: types.CommitStorage;
    protected observer: types.CommitObserver;
    protected inProgress: Map<string, any>;
    constructor();
    startPublishing(): Promise<void>;
    stopPublishing(): Promise<void>;
    publishChanges(commit: types.Commit): Promise<void>;
    getHandledEventTypes(): types.TypeName[];
    getHandledCommandTypes(): types.TypeName[];
    protected canSendCommand(command: types.Command): boolean;
    isInProgress(commitId: string): boolean;
    protected publishEvent(event: types.Event): Promise<void>;
    protected sendCommand(command: types.Command): Promise<void>;
    protected setTimeout(commit: types.Commit): Promise<void>;
    protected onTimeout(commit: types.Commit): Promise<void>;
    protected clearTimeout(commitId: string): void;
    protected cleanupTimeout(commitId: string): void;
}

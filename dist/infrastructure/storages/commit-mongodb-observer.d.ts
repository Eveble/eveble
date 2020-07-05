import { Collection, Cursor } from 'mongodb';
import { types } from '../../types';
import { StatefulMixin } from '../../mixins/stateful-mixin';
export declare class CommitMongoDBObserver extends StatefulMixin {
    protected collection: Collection;
    protected storage: types.CommitStorage;
    protected log: types.Logger;
    protected config: types.Configurable;
    static STATES: {
        created: string;
        observing: string;
        paused: string;
        closed: string;
        finished: string;
        ended: string;
        failed: string;
    };
    state: types.State;
    stream: Cursor<any> | undefined;
    constructor();
    startObserving(commitPublisher: types.CommitPublisher): Promise<void>;
    pauseObserving(): Promise<void>;
    stopObserving(): Promise<void>;
    isObserving(): boolean;
    initializeEventHandlers(): Promise<void>;
    protected isInProduction(): boolean;
}

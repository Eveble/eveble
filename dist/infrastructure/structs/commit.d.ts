import { types } from '../../types';
import { StatefulMixin } from '../../mixins/stateful-mixin';
import { Serializable } from '../../components/serializable';
declare const CommitReceiver_base: import("polytype").Polytype.ClusteredConstructor<[typeof Serializable, typeof StatefulMixin]>;
export declare class CommitReceiver extends CommitReceiver_base implements types.CommitReceiver {
    static STATES: {
        received: string;
        published: string;
        timeouted: string;
        failed: string;
    };
    state: types.State;
    appId: string;
    workerId?: string;
    receivedAt: Date;
    publishedAt?: Date;
    failedAt?: Date;
    constructor(props?: types.Props);
    getCurrentTime(): Date;
    flagAsReceived(workerId: string): void;
    flagAsPublished(workerId: string): void;
    flagAsTimeouted(workerId: string): void;
    flagAsFailed(workerId: string): void;
}
export declare class Commit extends Serializable implements types.Commit {
    id: string;
    sourceId: string;
    version: number;
    eventSourceableType: string;
    commands: types.Command[];
    events: types.Event[];
    insertedAt: Date;
    sentBy: string;
    receivers: CommitReceiver[];
    getEventTypeNames(): types.TypeName[];
    getCommandTypeNames(): types.TypeName[];
    addReceiver(receiver: CommitReceiver): void;
    getReceiver(appId: string): CommitReceiver | undefined;
}
export {};

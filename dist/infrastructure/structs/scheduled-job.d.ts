import { StatefulMixin } from '../../mixins/stateful-mixin';
import { types } from '../../types';
import { Guid } from '../../domain/value-objects/guid';
import { Struct } from '../../components/struct';
declare const ScheduledJob_base: import("polytype").Polytype.ClusteredConstructor<[typeof Struct, typeof StatefulMixin]>;
export declare class ScheduledJob extends ScheduledJob_base implements types.ScheduledJob {
    static STATES: {
        enqueued: string;
        started: string;
        locked: string;
        failed: string;
        completed: string;
        removed: string;
    };
    id: string | Guid;
    state: types.State;
    name: string;
    data: Record<string, any>;
    priority: 'lowest' | 'low' | 'normal' | 'high' | 'highest' | number;
    nextRunAt?: Date;
    completedAt?: Date;
    lockedAt?: Date;
    lastRunAt?: Date;
    failedAt?: Date;
    constructor(props?: types.Props);
}
export {};

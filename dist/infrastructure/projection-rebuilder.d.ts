import { types } from '../types';
import { Struct } from '../components/struct';
export declare class RebuildingResult extends Struct {
    projectionsNames: string[];
    duration: number;
    message: string;
}
export declare class ProjectionRebuilder {
    protected commitStore: types.CommitStore;
    protected log: types.Logger;
    protected timer: [number, number];
    rebuild(projections: types.Projection[]): Promise<RebuildingResult>;
    protected startTimer(): void;
    protected calculateOperationTime(): number;
    protected enterRebuildModeOnProjection(projection: types.Projection): Promise<void>;
    protected runBeforeRebuildHookOnProjection(projection: types.Projection): Promise<void>;
    protected publishAllEventsFromCommitStoreOnQueuedProjections(queueProjections: types.Projection[]): Promise<void>;
    protected commitStateOnProjection(projection: types.Projection): Promise<void>;
    protected rollbackStateForProjection(projection: types.Projection): Promise<void>;
    protected logInitializingRollback(error: Error): void;
}

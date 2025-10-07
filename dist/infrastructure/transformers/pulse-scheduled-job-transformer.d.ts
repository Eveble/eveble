import { type Job } from '@pulsecron/pulse';
import { types } from '../../types';
export declare class PulseScheduledJobTransformer {
    transform(job: Job): types.ScheduledJob;
    protected pickProps(job: Job): Record<string, any>;
    protected determineState(job: Job): types.State;
}

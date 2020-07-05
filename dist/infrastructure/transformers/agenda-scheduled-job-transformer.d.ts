import Agenda from 'agenda';
import { types } from '../../types';
export declare class AgendaScheduledJobTransformer {
    transform(job: Agenda.Job): types.ScheduledJob;
    protected pickProps(job: Agenda.Job): Record<string, any>;
    protected determineState(job: Agenda.Job): types.State;
}

import { types } from '../types';
export declare class History extends Array {
    constructor(events: types.Event[]);
    getInitializingMessage(): types.Event;
}

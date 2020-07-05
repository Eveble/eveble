import { Message } from './message';
import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';
export declare class Event extends Message implements types.Event, types.Identifiable {
    sourceId: Guid | string;
    version?: number;
    constructor(props?: types.Props);
    getId(): Guid | string;
}

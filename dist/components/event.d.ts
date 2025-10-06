import { Message } from './message';
import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';
export declare class Event<T extends {
    [key: string]: any;
}> extends Message implements types.Event, types.Identifiable {
    sourceId: Guid | string;
    version?: number;
    constructor(props: types.ConstructorType<T> & {
        sourceId: Guid | string;
        version?: number;
    });
    getId(): Guid | string;
}

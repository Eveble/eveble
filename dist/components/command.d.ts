import { Message } from './message';
import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';
import { Serializable } from './serializable';
export declare class Assignment extends Serializable implements types.Assignment {
    assignmentId: Guid | string;
    deliverAt: Date;
    assignerId: Guid | string;
    assignerType: types.TypeName;
}
export declare class Command<T extends {
    [key: string]: any;
}> extends Message implements types.Command, types.Identifiable {
    targetId: Guid | string;
    constructor(props: types.ConstructorType<T> & {
        targetId: Guid | string;
    });
    getId(): Guid | string;
    schedule(assignment: Assignment): void;
    getAssignment(): Assignment | undefined;
    isScheduled(): boolean;
    isDeliverable(): boolean;
}

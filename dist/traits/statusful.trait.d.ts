import { ExtendableError } from '@eveble/core';
import { types } from '../types';
export declare class StatusError extends ExtendableError {
}
export declare class UndefinedStatusesError extends StatusError {
    constructor(typeName: types.TypeName);
}
export declare class InvalidStatusError extends StatusError {
    constructor(typeName: types.TypeName, currentStatus: types.Status, expectedStatuses: types.Status);
}
export declare const StatusfulTrait: import("@traits-ts/core").Trait<(base: any) => {
    new (): {
        [x: string]: any;
        status: types.Status;
        setStatus(status: types.Status): void;
        isInStatus(status: types.Status | types.Status[]): boolean;
        isInOneOfStatuses(status: types.Status | types.Status[]): boolean;
        getStatus(): types.Status;
        hasStatus(): boolean;
        validateStatus(statusOrStatuses: types.Status | types.Status[], error?: Error): boolean;
        getSelectableStatuses(): Record<string, types.Status>;
    };
    [x: string]: any;
}, undefined>;

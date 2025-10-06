import { Assertion } from '../assertion';
import { DomainError } from '../domain-error';
import { types } from '../../types';
import { AssertionError } from '../domain-errors';
export declare class InvalidStatusTransitionError extends AssertionError {
    entityName: string;
    entityId: string;
    currentStatus: string;
    expectedStatuses: string[];
    action: string;
    constructor(entityName: string, entityId: string, currentStatus: string, expected: string, action: string);
}
export declare class StatusfulAssertion extends Assertion {
    api: Map<string, Function>;
    ensureIsInStatus(expectedStatus: types.Status, error?: DomainError): types.Asserter;
    ensureIsNotInStatus(expectedStatus: types.Status, error?: DomainError): types.Asserter;
    ensureIsInOneOfStatuses(expectedStatuses: types.Status[], error?: DomainError): types.Asserter;
    ensureIsNotInOneOfStatuses(expectedStatuses: types.Status[], error?: DomainError): types.Asserter;
    protected failAssertion(expectedStatus: types.Status, api: string, error?: DomainError): void;
}

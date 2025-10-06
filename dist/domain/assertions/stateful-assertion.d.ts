import { Assertion } from '../assertion';
import { types } from '../../types';
import { AssertionError } from '../domain-errors';
import { DomainError } from '../domain-error';
export declare class InvalidStateTransitionError extends AssertionError {
    entityName: string;
    entityId: string;
    currentState: string;
    expectedStates: string[];
    action: string;
    constructor(entityName: string, entityId: string, currentState: string, expected: string, action: string);
}
export declare class StatefulAssertion extends Assertion {
    api: Map<string, Function>;
    ensureIsInState(expectedState: types.State, error?: DomainError): types.Asserter;
    ensureIsNotInState(expectedState: types.State, error?: DomainError): types.Asserter;
    ensureIsInOneOfStates(expectedStates: types.State[], error?: DomainError): types.Asserter;
    ensureIsNotInOneOfStates(expectedStates: types.State[], error?: DomainError): types.Asserter;
    protected failAssertion(expectedState: types.State, api: string, error?: DomainError): void;
}

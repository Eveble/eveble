import { types } from '../types';
import { ExtendableError } from '../components/extendable-error';
export declare class AssertionApiAlreadyExistsError extends ExtendableError {
    constructor(asserterName: string, assertionName: string, path: string);
}
export declare class Asserter implements types.Asserter {
    protected assertions: types.Assertion[];
    protected action?: types.Stringifiable | types.MessageType<types.Command>;
    protected entity: types.Entity;
    protected api: Map<string, Function>;
    constructor();
    registerAssertion(assertion: types.Assertion): void;
    hasAssertion(assertionCtor: any): boolean;
    hasApi(pathOrPartial: any): boolean;
    assert(): any;
    setEntity(entity: types.Entity): void;
    getEntity(): types.Entity;
    setAction(action: types.Stringifiable): void;
    clearAction(): void;
    getAction(): types.Stringifiable | types.MessageType<types.Message> | undefined;
    hasAction(): boolean;
    getAssertions(): types.Assertion[];
    getApi(): Map<string, Function>;
}

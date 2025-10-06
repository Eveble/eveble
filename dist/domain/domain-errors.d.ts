import { DomainError } from './domain-error';
import { types } from '../types';
import { SerializableError } from '../components/serializable-error';
export declare class AssertionError extends DomainError {
}
export declare class UndefinedActionError extends AssertionError {
    constructor(entityName: string, assertionApi: string);
}
export declare class ListError extends DomainError {
}
export declare class IdentifiableAlreadyExistsError extends ListError {
    constructor(props: {
        sourceName: string;
        sourceId: string | undefined;
        listKey: string;
        identifiableName: string;
        key: string;
        value: string;
    });
}
export declare class ElementAlreadyExistsError extends ListError {
    element: types.Serializable;
    constructor(props: {
        sourceName: string;
        sourceId: string | undefined;
        listKey: string;
        serializableName: string;
        element: types.Serializable;
    });
}
export declare class ElementNotFoundError extends ListError {
    constructor(props: {
        sourceName: string;
        sourceId: string | undefined;
        listKey: string;
        serializableName: string;
        key: string;
        value: string;
    });
}
export declare class InvalidListError extends ListError {
    constructor(sourceName: string, listName: string);
}
export declare class ValueObjectError extends SerializableError {
}
export declare class EntityError extends DomainError {
}
export declare class SavedStateNotFoundError extends EntityError {
    constructor(esTypeName: string, id: string);
}
export declare class EventSourceableError extends DomainError {
}
export declare class InvalidEventError extends EventSourceableError {
    constructor(esTypeName: string, got: string);
}
export declare class EventIdMismatchError extends EventSourceableError {
    constructor(esTypeName: string, expectedId: string, got: string);
}
export declare class InvalidInitializingMessageError extends EventSourceableError {
    constructor(esTypeName: string, expected: string, got: string);
}

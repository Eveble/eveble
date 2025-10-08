import { Type } from '@eveble/core';
import { DomainError } from './domain-error';
import { types } from '../types';
import { SerializableError } from '../components/serializable-error';

/*
ASSERTION ERRORS
*/
@Type('AssertionError')
export class AssertionError extends DomainError {}

@Type('UndefinedActionError')
export class UndefinedActionError extends AssertionError {
  constructor(entityName: string, assertionApi: string) {
    super(
      `${entityName}: action name is not set while using assertion '${assertionApi}'. Please define action by using 'entity.on('action-name-as-string').${assertionApi}(...)' or 'entity.on(MyCommandType).ensure.${assertionApi}(...)`
    );
  }
}

/*
LIST ERRORS
*/
@Type('ListError')
export class ListError extends DomainError {}

@Type('IdentifiableAlreadyExistsError')
export class IdentifiableAlreadyExistsError extends ListError {
  constructor(props: {
    sourceName: string;
    sourceId: string | undefined;
    listKey: string;
    identifiableName: string;
    key: string;
    value: string;
  }) {
    const { sourceName, listKey, identifiableName, key, value } = props;
    const sourceId = props.sourceId ? `@${props.sourceId}` : ``;
    const message = `${sourceName}${sourceId}: already has '${identifiableName}' with ${key} '${value}' on '${listKey}' list`;
    super({ message });
  }
}

@Type('ElementAlreadyExistsError')
export class ElementAlreadyExistsError extends ListError {
  element: types.Serializable;

  constructor(props: {
    sourceName: string;
    sourceId: string | undefined;
    listKey: string;
    serializableName: string;
    element: types.Serializable;
  }) {
    const { sourceName, listKey, serializableName, element } = props;
    const sourceId = props.sourceId ? `@${props.sourceId}` : ``;
    const message = `${sourceName}${sourceId}: already has same '${serializableName}' on '${listKey}' list`;
    super({ message, element });
  }
}

@Type('ElementNotFoundError')
export class ElementNotFoundError extends ListError {
  constructor(props: {
    sourceName: string;
    sourceId: string | undefined;
    listKey: string;
    serializableName: string;
    key: string;
    value: string;
  }) {
    const { sourceName, listKey, serializableName, key, value } = props;
    const sourceId = props.sourceId ? `@${props.sourceId}` : ``;

    const message = `${sourceName}${sourceId}: does not contain '${serializableName}' with ${key} '${value}' on '${listKey}' list`;
    super({ message });
  }
}

@Type('InvalidListError')
export class InvalidListError extends ListError {
  constructor(sourceName: string, listName: string) {
    super(
      `${sourceName}: list '${listName}' is not a serializable list property type`
    );
  }
}
/*
VALUE OBJECT ERRORS
*/
@Type('ValueObjectError')
export class ValueObjectError extends SerializableError {}

/*
ENTITY ERRORS
*/
@Type('EntityError')
export class EntityError extends DomainError {}

@Type('SavedStateNotFoundError')
export class SavedStateNotFoundError extends EntityError {
  constructor(esTypeName: string, id: string) {
    super(
      `${esTypeName}@${id}: expected entity to be have state saved before rollbacking it`
    );
  }
}

/*
EVENT SOURCEABLE ERRORS
*/
@Type('EventSourceableError')
export class EventSourceableError extends DomainError {}

@Type('InvalidEventError')
export class InvalidEventError extends EventSourceableError {
  constructor(esTypeName: string, got: string) {
    super(`${esTypeName}: event must be instance of Event, got ${got}`);
  }
}

@Type('EventIdMismatchError')
export class EventIdMismatchError extends EventSourceableError {
  constructor(esTypeName: string, expectedId: string, got: string) {
    super(
      `${esTypeName}: the given event has mismatching source id. Expected id '${expectedId}', got '${got}'`
    );
  }
}

@Type('InvalidInitializingMessageError')
export class InvalidInitializingMessageError extends EventSourceableError {
  constructor(esTypeName: string, expected: string, got: string) {
    super(
      `${esTypeName}: the given initializing message is not one of allowed types. Expected ${expected}, got ${got}`
    );
  }
}
/*
SHARED ERRORS
*/
@Type('EmptyStringError')
export class EmptyStringError extends ValueObjectError {
  constructor(typeName: string) {
    super(`${typeName}: can't be an empty string`);
  }
}

@Type('UnimplementedError')
export class UnimplementedError extends ValueObjectError {
  constructor() {
    super(`Not implemented`);
  }
}

import { define } from '../decorators/define';
import { DomainError } from './domain-error';
import { types } from '../types';
import { SerializableError } from '../components/serializable-error';

/*
ASSERTION ERRORS
*/
@define('AssertionError')
export class AssertionError extends DomainError {}

@define('UndefinedActionError')
export class UndefinedActionError extends DomainError {
  constructor(entityName: string, assertionApi: string) {
    super(
      `${entityName}: action name is not set while using assertion '${assertionApi}'. Please define action by using 'entity.on('action-name').ensure.${assertionApi}(...)' or 'entity.on(MyCommand).ensure.${assertionApi}(...)`
    );
  }
}

/*
LIST ERRORS
*/
@define('ListError')
export class ListError extends DomainError {}

@define('IdentifiableAlreadyExistsError')
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

@define('ElementAlreadyExistsError')
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

@define('ElementNotFoundError')
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

@define('InvalidListError')
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
@define('ValueObjectError')
export class ValueObjectError extends SerializableError {}

/*
ENTITY ERRORS
*/
@define('EntityError')
export class EntityError extends DomainError {}

@define('SavedStateNotFoundError')
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
@define('EventSourceableError')
export class EventSourceableError extends DomainError {}

@define('InvalidEventError')
export class InvalidEventError extends EventSourceableError {
  constructor(esTypeName: string, got: string) {
    super(`${esTypeName}: event must be instance of Event, got ${got}`);
  }
}

@define('EventIdMismatchError')
export class EventIdMismatchError extends EventSourceableError {
  constructor(esTypeName: string, expectedId: string, got: string) {
    super(
      `${esTypeName}: the given event has mismatching source id. Expected id '${expectedId}', got '${got}'`
    );
  }
}

@define('InvalidInitializingMessageError')
export class InvalidInitializingMessageError extends EventSourceableError {
  constructor(esTypeName: string, expected: string, got: string) {
    super(
      `${esTypeName}: the given initializing message is not one of allowed types. Expected ${expected}, got ${got}`
    );
  }
}

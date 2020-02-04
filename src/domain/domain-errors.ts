import { define } from '../decorators/define';
import { DomainError } from './domain-error';
import { types } from '../types';
import { SerializableError } from '../components/serializable-error';

/*
LIST ERRORS
*/
@define('ListError')
class ListError extends DomainError {}

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
export class ValueObjectError extends SerializableError {}

/*
ENTITY ERRORS
*/
@define('EntityError')
class EntityError extends DomainError {}

@define('AsserterNotFound')
export class AsserterNotFoundError extends EntityError {
  constructor(sourceName: string) {
    super(`${sourceName}: asserter not found on class constructor`);
  }
}

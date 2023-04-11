export const TYPE_KEY = '_type'; // Must be string, will be serializaed

export const HANDLERS: unique symbol = Symbol('eveble:handlers');

export const HANDLEABLE_TYPES: unique symbol = Symbol(
  'eveble:handleable-types'
);

export const SOURCE_KEY: unique symbol = Symbol('eveble:source');

export const LIST_KEY: unique symbol = Symbol('eveble:list-key');

export const SERIALIZABLE_TYPE_KEY: unique symbol = Symbol(
  'eveble:serializable-type'
);

export const SAVE_STATE_METHOD_KEY: unique symbol = Symbol('eveble:save-state');

export const SAVED_STATE_KEY: unique symbol = Symbol('eveble:saved-state');

export const ENABLE_ACTION_VALIDATION_METHOD_KEY: unique symbol = Symbol(
  'eveble:enable-action-validation'
);
export const DISABLE_ACTION_VALIDATION_METHOD_KEY: unique symbol = Symbol(
  'eveble:disable-action-validation'
);
export const IS_ACTION_VALIDATED_METHOD_KEY: unique symbol = Symbol(
  'eveble:is-action-validated'
);
export const ACTION_VALIDATION_KEY: unique symbol = Symbol(
  'eveble:action-validation'
);

export const ROLLBACK_STATE_METHOD_KEY: unique symbol = Symbol(
  'eveble:rollback-state'
);

export const COMMANDS_KEY: unique symbol = Symbol('eveble:commands');

export const EVENTS_KEY: unique symbol = Symbol('eveble:events');

export const LITERAL_KEYS = {
  TYPE_KEY,
  HANDLERS,
  HANDLEABLE_TYPES,
  SOURCE_KEY,
  LIST_KEY,
  SERIALIZABLE_TYPE_KEY,
  SAVE_STATE_METHOD_KEY,
  SAVED_STATE_KEY,
  ROLLBACK_STATE_METHOD_KEY,
  COMMANDS_KEY,
  EVENTS_KEY,
};

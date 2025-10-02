export const TYPE_KEY = '_type'; // Must be string, will be serializaed

export const HANDLERS = Symbol('eveble:handlers');

export const HANDLEABLE_TYPES = Symbol('eveble:handleable-types');

export const SOURCE_KEY = Symbol('eveble:source');

export const LIST_KEY = Symbol('eveble:list-key');

export const SERIALIZABLE_TYPE_KEY = Symbol('eveble:serializable-type');

export const SAVE_STATE_METHOD_KEY = Symbol('eveble:save-state');

export const SAVED_STATE_KEY = Symbol('eveble:saved-state');

export const ENABLE_ACTION_VALIDATION_METHOD_KEY = Symbol(
  'eveble:enable-action-validation'
);
export const DISABLE_ACTION_VALIDATION_METHOD_KEY = Symbol(
  'eveble:disable-action-validation'
);
export const IS_ACTION_VALIDATED_METHOD_KEY = Symbol(
  'eveble:is-action-validated'
);
export const ACTION_VALIDATION_KEY = Symbol('eveble:action-validation');
// export const ACTION_VALIDATION_KEY = 'eveble:action-validation';

export const ROLLBACK_STATE_METHOD_KEY = Symbol('eveble:rollback-state');

export const COMMANDS_KEY = Symbol('eveble:commands');

export const EVENTS_KEY = Symbol('eveble:events');

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

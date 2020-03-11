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

export const ROLLBACK_STATE_METHOD_KEY: unique symbol = Symbol(
  'eveble:rollback-state'
);

export const COMMANDS_KEY: unique symbol = Symbol('eveble:commands');

export const EVENTS_KEY: unique symbol = Symbol('eveble:events');

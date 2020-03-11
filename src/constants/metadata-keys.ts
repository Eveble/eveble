/*
CORE
*/
export const HOOKABLE_KEY: unique symbol = Symbol('eveble:flags:hookable');

export const HOOKS_CONTAINER_KEY: unique symbol = Symbol(
  'eveble:containers:hooks'
);

export const DEFAULT_PROPS_KEY: unique symbol = Symbol(
  'eveble:containers:default-props'
);

export const DELEGATED_KEY: unique symbol = Symbol('eveble:flags:delegated');

export const VERSIONABLE_KEY: unique symbol = Symbol('eveble:versionable');

export const LEGACY_TRANSFORMERS_CONTAINER_KEY: unique symbol = Symbol(
  'eveble:container:legacy-transformers'
);

/*
HANDLING
*/
export const HANDLER_KEY: unique symbol = Symbol('eveble:controller:handler');

export const COMMAND_HANDLERS_CONTAINER_KEY: unique symbol = Symbol(
  'eveble:container:command-handlers'
);

export const ROUTED_COMMANDS_CONTAINER_KEY: unique symbol = Symbol(
  'eveble:container:routed-commands'
);

export const SUBSCRIBER_KEY: unique symbol = Symbol(
  'eveble:controller:subscriber'
);

export const EVENT_HANDLERS_CONTAINER_KEY: unique symbol = Symbol(
  'eveble:container:event-handlers'
);

export const ROUTED_EVENTS_CONTAINER_KEY: unique symbol = Symbol(
  'eveble:container:routed-events'
);

export const INITIALIZING_MESSAGE_KEY: unique symbol = Symbol(
  'eveble:controller:initializing-message'
);

/*
SERIALIZABLE
*/
export const SERIALIZABLE_LIST_PROPS_KEY: unique symbol = Symbol(
  'eveble:container:serializable-list-props'
);

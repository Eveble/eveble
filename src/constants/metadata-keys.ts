/*
CORE
*/
export const HOOKABLE_KEY = Symbol('eveble:flags:hookable');

export const HOOKS_CONTAINER_KEY = Symbol('eveble:containers:hooks');

export const DEFAULT_PROPS_KEY = Symbol('eveble:containers:default-props');

export const DELEGATED_KEY = Symbol('eveble:flags:delegated');

export const VERSIONABLE_KEY = Symbol('eveble:versionable');

export const LEGACY_TRANSFORMERS_CONTAINER_KEY = Symbol(
  'eveble:container:legacy-transformers'
);

/*
HANDLING
*/
export const HANDLER_KEY = Symbol('eveble:controller:handler');

export const COMMAND_HANDLERS_CONTAINER_KEY = Symbol(
  'eveble:container:command-handlers'
);

export const SUBSCRIBER_KEY = Symbol('eveble:controller:subscriber');

export const EVENT_HANDLERS_CONTAINER_KEY = Symbol(
  'eveble:container:event-handlers'
);

/*
SERIALIZABLE
*/
export const MESSAGE_METADATA_KEY = Symbol('eveble:container:metadata');

export const SERIALIZABLE_LIST_PROPS_KEY = Symbol(
  'eveble:container:serializable-list-props'
);

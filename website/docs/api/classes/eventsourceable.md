---
id: "eventsourceable"
title: "EventSourceable"
sidebar_label: "EventSourceable"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

* SuperPrototypeSelector‹[Entity](entity.md) | [OneToOneHandlingMixin](onetoonehandlingmixin.md), this› & [Entity](entity.md)‹this› & [OneToOneHandlingMixin](onetoonehandlingmixin.md)‹this›

* SuperPrototypeSelector‹OneToOneHandlingMixin | Entity, this› & OneToOneHandlingMixin‹this› & Entity‹this›

  ↳ **EventSourceable**

  ↳ [Aggregate](aggregate.md)

  ↳ [Process](process.md)

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [Definable](../interfaces/types.definable.md)
* [Hookable](../interfaces/types.hookable.md)
* [Ejsonable](../interfaces/types.ejsonable.md)
* [Statusful](../interfaces/types.statusful.md)
* [Entity](../interfaces/types.entity.md)
* [Controller](../interfaces/types.controller.md)
* [EventSourceable](../interfaces/types.eventsourceable.md)
* Controller
* Stateful
* Definable
* Hookable
* Ejsonable
* Statusful
* Entity
* EventSourceable

## Index

### Constructors

* [constructor](eventsourceable.md#constructor)

### Properties

* [[COMMANDS_KEY]](eventsourceable.md#[commands_key])
* [[EVENTS_KEY]](eventsourceable.md#[events_key])
* [id](eventsourceable.md#id)
* [metadata](eventsourceable.md#optional-metadata)
* [schemaVersion](eventsourceable.md#optional-schemaversion)
* [state](eventsourceable.md#state)
* [status](eventsourceable.md#status)
* [version](eventsourceable.md#version)

### Accessors

* [ableTo](eventsourceable.md#ableto)
* [can](eventsourceable.md#can)
* [ensure](eventsourceable.md#ensure)
* [is](eventsourceable.md#is)

### Methods

* [[ROLLBACK_STATE_METHOD_KEY]](eventsourceable.md#[rollback_state_method_key])
* [[SAVE_STATE_METHOD_KEY]](eventsourceable.md#[save_state_method_key])
* [assignMetadata](eventsourceable.md#assignmetadata)
* [commandProps](eventsourceable.md#commandprops)
* [ensureHandleability](eventsourceable.md#ensurehandleability)
* [equals](eventsourceable.md#equals)
* [eventProps](eventsourceable.md#eventprops)
* [getActions](eventsourceable.md#getactions)
* [getCommands](eventsourceable.md#getcommands)
* [getEvents](eventsourceable.md#getevents)
* [getHandleableTypes](eventsourceable.md#gethandleabletypes)
* [getHandled](eventsourceable.md#gethandled)
* [getHandledCommands](eventsourceable.md#gethandledcommands)
* [getHandledEvents](eventsourceable.md#gethandledevents)
* [getHandledMessages](eventsourceable.md#gethandledmessages)
* [getHandledTypes](eventsourceable.md#gethandledtypes)
* [getHandledTypesNames](eventsourceable.md#gethandledtypesnames)
* [getHandler](eventsourceable.md#gethandler)
* [getHandlerOrThrow](eventsourceable.md#gethandlerorthrow)
* [getHandlers](eventsourceable.md#gethandlers)
* [getHook](eventsourceable.md#gethook)
* [getHookOrThrow](eventsourceable.md#gethookorthrow)
* [getHooks](eventsourceable.md#gethooks)
* [getId](eventsourceable.md#getid)
* [getLegacyTransformer](eventsourceable.md#getlegacytransformer)
* [getLegacyTransformers](eventsourceable.md#getlegacytransformers)
* [getPropTypes](eventsourceable.md#getproptypes)
* [getPropertyInitializers](eventsourceable.md#getpropertyinitializers)
* [getSchemaVersion](eventsourceable.md#getschemaversion)
* [getSelectableStates](eventsourceable.md#getselectablestates)
* [getSelectableStatuses](eventsourceable.md#getselectablestatuses)
* [getState](eventsourceable.md#getstate)
* [getStatus](eventsourceable.md#getstatus)
* [getTypeByHandler](eventsourceable.md#gettypebyhandler)
* [getTypeName](eventsourceable.md#gettypename)
* [getVersion](eventsourceable.md#getversion)
* [handle](eventsourceable.md#handle)
* [handles](eventsourceable.md#handles)
* [hasAction](eventsourceable.md#hasaction)
* [hasHandler](eventsourceable.md#hashandler)
* [hasHook](eventsourceable.md#hashook)
* [hasLegacyTransformer](eventsourceable.md#haslegacytransformer)
* [hasState](eventsourceable.md#hasstate)
* [hasStatus](eventsourceable.md#hasstatus)
* [in](eventsourceable.md#in)
* [incrementVersion](eventsourceable.md#incrementversion)
* [initialize](eventsourceable.md#initialize)
* [isHandleabe](eventsourceable.md#ishandleabe)
* [isInOneOfStates](eventsourceable.md#isinoneofstates)
* [isInOneOfStatuses](eventsourceable.md#isinoneofstatuses)
* [isInState](eventsourceable.md#isinstate)
* [isInStatus](eventsourceable.md#isinstatus)
* [isStateSaved](eventsourceable.md#isstatesaved)
* [on](eventsourceable.md#on)
* [overrideHandler](eventsourceable.md#overridehandler)
* [overrideHook](eventsourceable.md#overridehook)
* [overrideLegacyTransformer](eventsourceable.md#overridelegacytransformer)
* [processSerializableList](eventsourceable.md#processserializablelist)
* [record](eventsourceable.md#record)
* [registerHandler](eventsourceable.md#registerhandler)
* [registerHook](eventsourceable.md#registerhook)
* [registerLegacyTransformer](eventsourceable.md#registerlegacytransformer)
* [removeHandler](eventsourceable.md#removehandler)
* [removeHook](eventsourceable.md#removehook)
* [replay](eventsourceable.md#replay)
* [replayHistory](eventsourceable.md#replayhistory)
* [schedule](eventsourceable.md#schedule)
* [setHandleableTypes](eventsourceable.md#sethandleabletypes)
* [setState](eventsourceable.md#setstate)
* [setStatus](eventsourceable.md#setstatus)
* [setVersion](eventsourceable.md#setversion)
* [subscribes](eventsourceable.md#subscribes)
* [toJSONValue](eventsourceable.md#tojsonvalue)
* [toPlainObject](eventsourceable.md#toplainobject)
* [toString](eventsourceable.md#tostring)
* [transformLegacyProps](eventsourceable.md#transformlegacyprops)
* [typeName](eventsourceable.md#typename)
* [unschedule](eventsourceable.md#unschedule)
* [validateProps](eventsourceable.md#validateprops)
* [validateState](eventsourceable.md#validatestate)
* [validateStatus](eventsourceable.md#validatestatus)
* [disableSerializableLists](eventsourceable.md#static-disableserializablelists)
* [enableSerializableLists](eventsourceable.md#static-enableserializablelists)
* [from](eventsourceable.md#static-from)
* [getPropTypes](eventsourceable.md#static-getproptypes)
* [getPropertyInitializers](eventsourceable.md#static-getpropertyinitializers)
* [getTypeName](eventsourceable.md#static-gettypename)
* [resolveInitializingMessage](eventsourceable.md#static-resolveinitializingmessage)
* [resolveRoutedCommands](eventsourceable.md#static-resolveroutedcommands)
* [resolveRoutedEvents](eventsourceable.md#static-resolveroutedevents)
* [resolveRoutedMessages](eventsourceable.md#static-resolveroutedmessages)
* [toString](eventsourceable.md#static-tostring)
* [typeName](eventsourceable.md#static-typename)

## Constructors

###  constructor

\+ **new EventSourceable**(`props`: [Props](../modules/types.md#props)): *[EventSourceable](eventsourceable.md)*

*Overrides [Entity](entity.md).[constructor](entity.md#constructor)*

Creates an instance of `EventSourceable`.
Creates an instance of `EventSourceable`.

**`example`** 
```ts
new EventSourceable({id: 'my-id'})
new EventSourceable({id: 'my-id', key: 'value'})
```

**`example`** 
```ts
new EventSourceable({id: 'my-id'})
new EventSourceable({id: 'my-id', key: 'value'})
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | [Props](../modules/types.md#props) | Properties of the type required for construction. |

**Returns:** *[EventSourceable](eventsourceable.md)*

## Properties

###  [COMMANDS_KEY]

• **[COMMANDS_KEY]**: *Command[]*

___

###  [EVENTS_KEY]

• **[EVENTS_KEY]**: *Event[]*

___

###  id

• **id**: *string | Guid*

*Overrides [Entity](entity.md).[id](entity.md#id)*

___

### `Optional` metadata

• **metadata**? : *Record‹string, any›*

___

### `Optional` schemaVersion

• **schemaVersion**? : *number*

*Overrides [Entity](entity.md).[schemaVersion](entity.md#optional-schemaversion)*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md).[state](../interfaces/types.eventsourceable.md#state)*

*Overrides [Entity](entity.md).[state](entity.md#state)*

___

###  status

• **status**: *[Status](../modules/types.md#status)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md).[status](../interfaces/types.eventsourceable.md#status)*

*Overrides [Entity](entity.md).[status](entity.md#status)*

___

###  version

• **version**: *number*

## Accessors

###  ableTo

• **get ableTo**(): *this*

*Inherited from [Entity](entity.md).[ableTo](entity.md#ableto)*

*Overrides [Task](task.md).[ableTo](task.md#ableto)*

**Returns:** *this*

___

###  can

• **get can**(): *any*

*Inherited from [Entity](entity.md).[can](entity.md#can)*

*Overrides [Task](task.md).[can](task.md#can)*

**Returns:** *any*

___

###  ensure

• **get ensure**(): *this & object*

*Inherited from [Entity](entity.md).[ensure](entity.md#ensure)*

*Overrides [Task](task.md).[ensure](task.md#ensure)*

**Returns:** *this & object*

___

###  is

• **get is**(): *this & object*

*Inherited from [Entity](entity.md).[is](entity.md#is)*

*Overrides [Task](task.md).[is](task.md#is)*

**Returns:** *this & object*

## Methods

###  [ROLLBACK_STATE_METHOD_KEY]

▸ **[ROLLBACK_STATE_METHOD_KEY]**(): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [Entity](entity.md).[[ROLLBACK_STATE_METHOD_KEY]](entity.md#[rollback_state_method_key])*

*Overrides [Task](task.md).[[ROLLBACK_STATE_METHOD_KEY]](task.md#[rollback_state_method_key])*

**Returns:** *void*

___

###  [SAVE_STATE_METHOD_KEY]

▸ **[SAVE_STATE_METHOD_KEY]**(): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [Entity](entity.md).[[SAVE_STATE_METHOD_KEY]](entity.md#[save_state_method_key])*

*Overrides [Task](task.md).[[SAVE_STATE_METHOD_KEY]](task.md#[save_state_method_key])*

**Returns:** *void*

___

###  assignMetadata

▸ **assignMetadata**(`metadata`: Record‹string, any›): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

Attaches metadata to `EventSourceable`.

**Parameters:**

Name | Type |
------ | ------ |
`metadata` | Record‹string, any› |

**Returns:** *void*

___

###  commandProps

▸ **commandProps**(): *object*

Picks base properties(`timestamp` & `metadata`) for new `Command` instance.

**`example`** 
```ts
this.trigger(new MyCommand({
  ...this.commandProps(),
  customerName: command.customerName,
}));
```

**Returns:** *object*

Returns properties for `Command` instance.

* **metadata**: *Record‹string, any›*

* **timestamp**: *Date*

___

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[ensureHandleability](handlingmixin.md#ensurehandleability)*

*Overrides [CancelingEmployment](cancelingemployment.md).[ensureHandleability](cancelingemployment.md#ensurehandleability)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handleableTypes?` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] |

**Returns:** *boolean*

___

###  equals

▸ **equals**(`otherEntity`: [Entity](entity.md)): *boolean*

*Inherited from [Entity](entity.md).[equals](entity.md#equals)*

*Overrides [DefinableMixin](definablemixin.md).[equals](definablemixin.md#equals)*

**Parameters:**

Name | Type |
------ | ------ |
`otherEntity` | [Entity](entity.md) |

**Returns:** *boolean*

___

###  eventProps

▸ **eventProps**(): *object*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

Picks base properties(`sourceId`, `timestamp`, `metadata`, `version`) for new `Event` instance.

**`example`** 
```ts
this.record(new MyEvent({
  ...this.eventProps(),
  customerName: command.customerName,
}));
```

**Returns:** *object*

Returns properties for `Event` instance.

* **metadata**: *Record‹string, any›*

* **sourceId**: *[Guid](guid.md) | string*

* **timestamp**: *Date*

* **version**: *number*

___

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getActions](hookablemixin.md#getactions)*

*Overrides [CreateEmployee](createemployee.md).[getActions](createemployee.md#getactions)*

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

___

###  getCommands

▸ **getCommands**(): *[Command](../interfaces/types.command.md)[]*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

Returns triggered commands on `EventSourceable`.

**Returns:** *[Command](../interfaces/types.command.md)[]*

List of recorded `Commands`.

___

###  getEvents

▸ **getEvents**(): *[Event](../interfaces/types.event.md)[]*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

Returns recorded events on `EventSourceable`.

**Returns:** *[Event](../interfaces/types.event.md)[]*

List of recorded `Events`.

___

###  getHandleableTypes

▸ **getHandleableTypes**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandleableTypes](handlingmixin.md#gethandleabletypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandleableTypes](cancelingemployment.md#gethandleabletypes)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandled

▸ **getHandled**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandled](handlingmixin.md#gethandled)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandled](cancelingemployment.md#gethandled)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledCommands

▸ **getHandledCommands**(): *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledCommands](handlingmixin.md#gethandledcommands)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledCommands](cancelingemployment.md#gethandledcommands)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

___

###  getHandledEvents

▸ **getHandledEvents**(): *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledEvents](handlingmixin.md#gethandledevents)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledEvents](cancelingemployment.md#gethandledevents)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

___

###  getHandledMessages

▸ **getHandledMessages**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledMessages](handlingmixin.md#gethandledmessages)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledMessages](cancelingemployment.md#gethandledmessages)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledTypes

▸ **getHandledTypes**(): *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledTypes](handlingmixin.md#gethandledtypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledTypes](cancelingemployment.md#gethandledtypes)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]*

___

###  getHandledTypesNames

▸ **getHandledTypesNames**(): *[TypeName](../modules/types.md#typename)[]*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandledTypesNames](handlingmixin.md#gethandledtypesnames)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandledTypesNames](cancelingemployment.md#gethandledtypesnames)*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

___

###  getHandler

▸ **getHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler) | undefined*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[getHandler](onetoonehandlingmixin.md#gethandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandler](cancelingemployment.md#gethandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler) | undefined*

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *[Handler](../modules/types.md#handler)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[getHandlerOrThrow](onetoonehandlingmixin.md#gethandlerorthrow)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandlerOrThrow](cancelingemployment.md#gethandlerorthrow)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler)*

___

###  getHandlers

▸ **getHandlers**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[getHandlers](handlingmixin.md#gethandlers)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getHandlers](cancelingemployment.md#gethandlers)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

___

###  getHook

▸ **getHook**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getHook](hookablemixin.md#gethook)*

*Overrides [CreateEmployee](createemployee.md).[getHook](createemployee.md#gethook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook) | undefined*

___

###  getHookOrThrow

▸ **getHookOrThrow**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getHookOrThrow](hookablemixin.md#gethookorthrow)*

*Overrides [CreateEmployee](createemployee.md).[getHookOrThrow](createemployee.md#gethookorthrow)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook)*

___

###  getHooks

▸ **getHooks**(`action`: string): *[Mappings](../modules/types.hooks.md#mappings)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getHooks](hookablemixin.md#gethooks)*

*Overrides [CreateEmployee](createemployee.md).[getHooks](createemployee.md#gethooks)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *[Mappings](../modules/types.hooks.md#mappings)*

___

###  getId

▸ **getId**(): *string | [Guid](guid.md)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [Entity](entity.md).[getId](entity.md#getid)*

*Overrides [Task](task.md).[getId](task.md#getid)*

**Returns:** *string | [Guid](guid.md)*

___

###  getLegacyTransformer

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getLegacyTransformer](versionablemixin.md#getlegacytransformer)*

*Overrides [CreateEmployee](createemployee.md).[getLegacyTransformer](createemployee.md#getlegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *[Hook](../modules/types.md#hook)*

___

###  getLegacyTransformers

▸ **getLegacyTransformers**(): *[LegacyTransformers](../modules/types.md#legacytransformers)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getLegacyTransformers](versionablemixin.md#getlegacytransformers)*

*Overrides [CreateEmployee](createemployee.md).[getLegacyTransformers](createemployee.md#getlegacytransformers)*

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

___

###  getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

*Overrides [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getSchemaVersion](versionablemixin.md#getschemaversion)*

*Overrides [CreateEmployee](createemployee.md).[getSchemaVersion](createemployee.md#getschemaversion)*

**Returns:** *number | undefined*

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getSelectableStates](statefulmixin.md#getselectablestates)*

*Overrides [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getSelectableStatuses

▸ **getSelectableStatuses**(): *Record‹string, [Status](../modules/types.md#status)›*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[getSelectableStatuses](statusfulmixin.md#getselectablestatuses)*

*Overrides [Task](task.md).[getSelectableStatuses](task.md#getselectablestatuses)*

**Returns:** *Record‹string, [Status](../modules/types.md#status)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getState](statefulmixin.md#getstate)*

*Overrides [Task](task.md).[getState](task.md#getstate)*

**Returns:** *[State](../modules/types.md#state)*

___

###  getStatus

▸ **getStatus**(): *[Status](../modules/types.md#status)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[getStatus](statusfulmixin.md#getstatus)*

*Overrides [Task](task.md).[getStatus](task.md#getstatus)*

**Returns:** *[Status](../modules/types.md#status)*

___

###  getTypeByHandler

▸ **getTypeByHandler**(`handlerReference`: [Handler](../modules/types.md#handler)): *any | undefined*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[getTypeByHandler](onetoonehandlingmixin.md#gettypebyhandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getTypeByHandler](cancelingemployment.md#gettypebyhandler)*

**Parameters:**

Name | Type |
------ | ------ |
`handlerReference` | [Handler](../modules/types.md#handler) |

**Returns:** *any | undefined*

___

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[getTypeName](serializablemixin.md#gettypename)*

*Overrides [CreateEmployee](createemployee.md).[getTypeName](createemployee.md#gettypename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  getVersion

▸ **getVersion**(): *number*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

Returns current version of `EventSourceable`.

**Returns:** *number*

Current number version of instance.

___

###  handle

▸ **handle**(`message`: [Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)): *Promise‹any›*

*Overrides [OneToOneHandlingMixin](onetoonehandlingmixin.md).[handle](onetoonehandlingmixin.md#handle)*

Handles message.

**`async`** 

**`throws`** {HandlerNotFoundError}
Thrown if handler for type is not found.

**Parameters:**

Name | Type |
------ | ------ |
`message` | [Command](../interfaces/types.command.md) &#124; [Event](../interfaces/types.event.md) |

**Returns:** *Promise‹any›*

Instance of `EventSourceable`.

___

###  handles

▸ **handles**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[handles](handlingmixin.md#handles)*

*Overrides [CancelingEmployment](cancelingemployment.md).[handles](cancelingemployment.md#handles)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›, [Handler](../modules/types.md#handler)›*

___

###  hasAction

▸ **hasAction**(`action`: string): *boolean*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[hasAction](hookablemixin.md#hasaction)*

*Overrides [CreateEmployee](createemployee.md).[hasAction](createemployee.md#hasaction)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *boolean*

___

###  hasHandler

▸ **hasHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[hasHandler](handlingmixin.md#hashandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[hasHandler](cancelingemployment.md#hashandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *boolean*

___

###  hasHook

▸ **hasHook**(`action`: string, `id`: string): *boolean*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[hasHook](hookablemixin.md#hashook)*

*Overrides [CreateEmployee](createemployee.md).[hasHook](createemployee.md#hashook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *boolean*

___

###  hasLegacyTransformer

▸ **hasLegacyTransformer**(`schemaVersion`: number): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[hasLegacyTransformer](versionablemixin.md#haslegacytransformer)*

*Overrides [CreateEmployee](createemployee.md).[hasLegacyTransformer](createemployee.md#haslegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *boolean*

___

###  hasState

▸ **hasState**(): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[hasState](statefulmixin.md#hasstate)*

*Overrides [Task](task.md).[hasState](task.md#hasstate)*

**Returns:** *boolean*

___

###  hasStatus

▸ **hasStatus**(): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[hasStatus](statusfulmixin.md#hasstatus)*

*Overrides [Task](task.md).[hasStatus](task.md#hasstatus)*

**Returns:** *boolean*

___

###  in

▸ **in**‹**T**›(`listName`: string): *[List](../interfaces/types.list.md)‹T›*

*Inherited from [Serializable](serializable.md).[in](serializable.md#in)*

*Overrides [CreateEmployee](createemployee.md).[in](createemployee.md#in)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`listName` | string |

**Returns:** *[List](../interfaces/types.list.md)‹T›*

___

###  incrementVersion

▸ **incrementVersion**(): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

Increments version of event sourceable.

**Returns:** *void*

___

###  initialize

▸ **initialize**(): *Promise‹void›*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Overrides [OneToOneHandlingMixin](onetoonehandlingmixin.md).[initialize](onetoonehandlingmixin.md#initialize)*

Initializes EventSourceable.

**Returns:** *Promise‹void›*

___

###  isHandleabe

▸ **isHandleabe**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handleableTypes?`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *boolean*

*Inherited from [HandlingMixin](handlingmixin.md).[isHandleabe](handlingmixin.md#ishandleabe)*

*Overrides [CancelingEmployment](cancelingemployment.md).[isHandleabe](cancelingemployment.md#ishandleabe)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handleableTypes?` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] |

**Returns:** *boolean*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInOneOfStates](statefulmixin.md#isinoneofstates)*

*Overrides [Task](task.md).[isInOneOfStates](task.md#isinoneofstates)*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInOneOfStatuses

▸ **isInOneOfStatuses**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[isInOneOfStatuses](statusfulmixin.md#isinoneofstatuses)*

*Overrides [Task](task.md).[isInOneOfStatuses](task.md#isinoneofstatuses)*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInState](statefulmixin.md#isinstate)*

*Overrides [Task](task.md).[isInState](task.md#isinstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInStatus

▸ **isInStatus**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[isInStatus](statusfulmixin.md#isinstatus)*

*Overrides [Task](task.md).[isInStatus](task.md#isinstatus)*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |

**Returns:** *boolean*

___

###  isStateSaved

▸ **isStateSaved**(): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [Entity](entity.md).[isStateSaved](entity.md#isstatesaved)*

*Overrides [Task](task.md).[isStateSaved](task.md#isstatesaved)*

**Returns:** *boolean*

___

###  on

▸ **on**(`action`: string | [Stringifiable](../interfaces/types.stringifiable.md)): *this*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [Entity](entity.md).[on](entity.md#on)*

*Overrides [Task](task.md).[on](task.md#on)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string &#124; [Stringifiable](../interfaces/types.stringifiable.md) |

**Returns:** *this*

___

###  overrideHandler

▸ **overrideHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handler`: [Handler](../modules/types.md#handler)): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[overrideHandler](handlingmixin.md#overridehandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[overrideHandler](cancelingemployment.md#overridehandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |

**Returns:** *void*

___

###  overrideHook

▸ **overrideHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook)): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[overrideHook](hookablemixin.md#overridehook)*

*Overrides [CreateEmployee](createemployee.md).[overrideHook](createemployee.md#overridehook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

___

###  overrideLegacyTransformer

▸ **overrideLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook)): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[overrideLegacyTransformer](versionablemixin.md#overridelegacytransformer)*

*Overrides [CreateEmployee](createemployee.md).[overrideLegacyTransformer](createemployee.md#overridelegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

___

###  processSerializableList

▸ **processSerializableList**(`props?`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Inherited from [Serializable](serializable.md).[processSerializableList](serializable.md#processserializablelist)*

*Overrides [CreateEmployee](createemployee.md).[processSerializableList](createemployee.md#processserializablelist)*

**Parameters:**

Name | Type |
------ | ------ |
`props?` | [Props](../modules/types.md#props) |

**Returns:** *[Props](../modules/types.md#props)*

___

###  record

▸ **record**(`event`: [Event](../interfaces/types.event.md)): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

Records state change of `EventSourceable` as `Event` and updates event sourceable version.

**`example`** 
```ts
this.record(new MyEvent({
  sourceId: this.getId(),
  key: 'value'
});
this.record(new MyEvent({
  ...this.eventProps(),
  customerName: command.customerName,
}));
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | [Event](../interfaces/types.event.md) | Instance of `Event`. |

**Returns:** *void*

___

###  registerHandler

▸ **registerHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [OneToOneHandlingMixin](onetoonehandlingmixin.md).[registerHandler](onetoonehandlingmixin.md#registerhandler)*

*Overrides [HandlingMixin](handlingmixin.md).[registerHandler](handlingmixin.md#registerhandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  registerHook

▸ **registerHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[registerHook](hookablemixin.md#registerhook)*

*Overrides [CreateEmployee](createemployee.md).[registerHook](createemployee.md#registerhook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  registerLegacyTransformer

▸ **registerLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[registerLegacyTransformer](versionablemixin.md#registerlegacytransformer)*

*Overrides [CreateEmployee](createemployee.md).[registerLegacyTransformer](createemployee.md#registerlegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeHandler

▸ **removeHandler**(`messageType`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[removeHandler](handlingmixin.md#removehandler)*

*Overrides [CancelingEmployment](cancelingemployment.md).[removeHandler](cancelingemployment.md#removehandler)*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› |

**Returns:** *void*

___

###  removeHook

▸ **removeHook**(`action`: string, `id`: string): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[removeHook](hookablemixin.md#removehook)*

*Overrides [CreateEmployee](createemployee.md).[removeHook](createemployee.md#removehook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *void*

___

###  replay

▸ **replay**(`event`: [Event](../interfaces/types.event.md)): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

Replies event and updates `EventSourceable` version.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | [Event](../interfaces/types.event.md) | Instance of `Event`.  |

**Returns:** *void*

___

###  replayHistory

▸ **replayHistory**(`history`: [History](history.md)): *void*

Replies history from list of events.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`history` | [History](history.md) | Instance of `History` containing `Event` list.  |

**Returns:** *void*

___

###  schedule

▸ **schedule**(`command`: [Command](../interfaces/types.command.md), `deliverAt`: Date, `assignmentId?`: string | [Guid](guid.md)): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

Schedules command to be delivered at specific time.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`command` | [Command](../interfaces/types.command.md) | `Command` instance. |
`deliverAt` | Date | `Date` instance on which command should be delivered.  |
`assignmentId?` | string &#124; [Guid](guid.md) | Scheduling assignment identifer. |

**Returns:** *void*

___

###  setHandleableTypes

▸ **setHandleableTypes**(`handleableTypes`: [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[]): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[setHandleableTypes](handlingmixin.md#sethandleabletypes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[setHandleableTypes](cancelingemployment.md#sethandleabletypes)*

**Parameters:**

Name | Type |
------ | ------ |
`handleableTypes` | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› &#124; [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)›[] |

**Returns:** *void*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[setState](statefulmixin.md#setstate)*

*Overrides [Task](task.md).[setState](task.md#setstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  setStatus

▸ **setStatus**(`status`: [Status](../modules/types.md#status)): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[setStatus](statusfulmixin.md#setstatus)*

*Overrides [Task](task.md).[setStatus](task.md#setstatus)*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) |

**Returns:** *void*

___

###  setVersion

▸ **setVersion**(`version`: number): *void*

Sets version of `EventSourceable`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`version` | number | Version number. |

**Returns:** *void*

Current number version of instance.

___

###  subscribes

▸ **subscribes**(): *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [HandlingMixin](handlingmixin.md).[subscribes](handlingmixin.md#subscribes)*

*Overrides [CancelingEmployment](cancelingemployment.md).[subscribes](cancelingemployment.md#subscribes)*

**Returns:** *Map‹[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›, [Handler](../modules/types.md#handler)›*

___

###  toJSONValue

▸ **toJSONValue**(): *Record‹string, any›*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[toJSONValue](serializablemixin.md#tojsonvalue)*

*Overrides [CreateEmployee](createemployee.md).[toJSONValue](createemployee.md#tojsonvalue)*

**Returns:** *Record‹string, any›*

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[toPlainObject](definablemixin.md#toplainobject)*

*Overrides [CreateEmployee](createemployee.md).[toPlainObject](createemployee.md#toplainobject)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[toString](serializablemixin.md#tostring)*

*Overrides [CreateEmployee](createemployee.md).[toString](createemployee.md#tostring)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[transformLegacyProps](versionablemixin.md#transformlegacyprops)*

*Overrides [CreateEmployee](createemployee.md).[transformLegacyProps](createemployee.md#transformlegacyprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *[Props](../modules/types.md#props)*

___

###  typeName

▸ **typeName**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [Ejsonable](../interfaces/types.ejsonable.md)*

*Inherited from [EjsonableMixin](ejsonablemixin.md).[typeName](ejsonablemixin.md#typename)*

*Overrides [CreateEmployee](createemployee.md).[typeName](createemployee.md#typename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  unschedule

▸ **unschedule**(`assignmentId`: string | [Guid](guid.md), `commandType`: [MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

Unschedule delivery of a specific command by assignment specification.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`assignmentId` | string &#124; [Guid](guid.md) | Scheduling assignment identifer. |
`commandType` | [MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)› | A `Command` type that should be unscheduled.  |

**Returns:** *void*

___

###  validateProps

▸ **validateProps**(`props`: Record‹string | number | symbol, any› | undefined, `propTypes`: [PropTypes](../modules/types.md#proptypes), `isStrict?`: boolean): *boolean*

*Inherited from [DefinableMixin](definablemixin.md).[validateProps](definablemixin.md#validateprops)*

*Overrides [CreateEmployee](createemployee.md).[validateProps](createemployee.md#validateprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | Record‹string &#124; number &#124; symbol, any› &#124; undefined |
`propTypes` | [PropTypes](../modules/types.md#proptypes) |
`isStrict?` | boolean |

**Returns:** *boolean*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*

___

###  validateStatus

▸ **validateStatus**(`statusOrStatuses`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[], `error?`: Error): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[validateStatus](statusfulmixin.md#validatestatus)*

*Overrides [Task](task.md).[validateStatus](task.md#validatestatus)*

**Parameters:**

Name | Type |
------ | ------ |
`statusOrStatuses` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |
`error?` | Error |

**Returns:** *boolean*

___

### `Static` disableSerializableLists

▸ **disableSerializableLists**(): *void*

*Inherited from [Serializable](serializable.md).[disableSerializableLists](serializable.md#static-disableserializablelists)*

*Overrides [CreateEmployee](createemployee.md).[disableSerializableLists](createemployee.md#static-disableserializablelists)*

**Returns:** *void*

___

### `Static` enableSerializableLists

▸ **enableSerializableLists**(): *void*

*Inherited from [Serializable](serializable.md).[enableSerializableLists](serializable.md#static-enableserializablelists)*

*Overrides [CreateEmployee](createemployee.md).[enableSerializableLists](createemployee.md#static-enableserializablelists)*

**Returns:** *void*

___

### `Static` from

▸ **from**(...`sources`: Record‹string, any›[]): *any*

*Inherited from [Serializable](serializable.md).[from](serializable.md#static-from)*

*Overrides [CreateEmployee](createemployee.md).[from](createemployee.md#static-from)*

**Parameters:**

Name | Type |
------ | ------ |
`...sources` | Record‹string, any›[] |

**Returns:** *any*

___

### `Static` getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

*Overrides [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

### `Static` getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

### `Static` getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [SerializableMixin](serializablemixin.md).[getTypeName](serializablemixin.md#gettypename)*

*Overrides [CreateEmployee](createemployee.md).[getTypeName](createemployee.md#gettypename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

### `Static` resolveInitializingMessage

▸ **resolveInitializingMessage**(): *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)› | undefined*

Resolves initializing message on `EventSourceable`.

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)› | undefined*

`Command` or `Event` type.

___

### `Static` resolveRoutedCommands

▸ **resolveRoutedCommands**(): *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

Resolves routed commands.

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

List of all routed `Command` types.

___

### `Static` resolveRoutedEvents

▸ **resolveRoutedEvents**(): *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

Resolves routed events.

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

List of all routed `Event` types.

___

### `Static` resolveRoutedMessages

▸ **resolveRoutedMessages**(): *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)›[]*

Resolves routed messages.

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)›[]*

List of all routed messages types.

___

### `Static` toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [SerializableMixin](serializablemixin.md).[toString](serializablemixin.md#tostring)*

*Overrides [CreateEmployee](createemployee.md).[toString](createemployee.md#tostring)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

### `Static` typeName

▸ **typeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [EjsonableMixin](ejsonablemixin.md).[typeName](ejsonablemixin.md#typename)*

*Overrides [CreateEmployee](createemployee.md).[typeName](createemployee.md#typename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

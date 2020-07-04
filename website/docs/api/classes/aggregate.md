---
id: "aggregate"
title: "Aggregate"
sidebar_label: "Aggregate"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

  ↳ [EventSourceable](eventsourceable.md)

* EventSourceable

  ↳ **Aggregate**

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

* [constructor](aggregate.md#constructor)

### Properties

* [[COMMANDS_KEY]](aggregate.md#[commands_key])
* [[EVENTS_KEY]](aggregate.md#[events_key])
* [id](aggregate.md#id)
* [metadata](aggregate.md#optional-metadata)
* [schemaVersion](aggregate.md#optional-schemaversion)
* [state](aggregate.md#state)
* [status](aggregate.md#status)
* [version](aggregate.md#version)

### Accessors

* [ableTo](aggregate.md#ableto)
* [can](aggregate.md#can)
* [ensure](aggregate.md#ensure)
* [is](aggregate.md#is)

### Methods

* [[ROLLBACK_STATE_METHOD_KEY]](aggregate.md#[rollback_state_method_key])
* [[SAVE_STATE_METHOD_KEY]](aggregate.md#[save_state_method_key])
* [assignMetadata](aggregate.md#assignmetadata)
* [ensureHandleability](aggregate.md#ensurehandleability)
* [equals](aggregate.md#equals)
* [eventProps](aggregate.md#eventprops)
* [getActions](aggregate.md#getactions)
* [getCommands](aggregate.md#getcommands)
* [getEvents](aggregate.md#getevents)
* [getHandleableTypes](aggregate.md#gethandleabletypes)
* [getHandled](aggregate.md#gethandled)
* [getHandledCommands](aggregate.md#gethandledcommands)
* [getHandledEvents](aggregate.md#gethandledevents)
* [getHandledMessages](aggregate.md#gethandledmessages)
* [getHandledTypes](aggregate.md#gethandledtypes)
* [getHandledTypesNames](aggregate.md#gethandledtypesnames)
* [getHandler](aggregate.md#gethandler)
* [getHandlerOrThrow](aggregate.md#gethandlerorthrow)
* [getHandlers](aggregate.md#gethandlers)
* [getHook](aggregate.md#gethook)
* [getHookOrThrow](aggregate.md#gethookorthrow)
* [getHooks](aggregate.md#gethooks)
* [getId](aggregate.md#getid)
* [getLegacyTransformer](aggregate.md#getlegacytransformer)
* [getLegacyTransformers](aggregate.md#getlegacytransformers)
* [getPropTypes](aggregate.md#getproptypes)
* [getPropertyInitializers](aggregate.md#getpropertyinitializers)
* [getSchemaVersion](aggregate.md#getschemaversion)
* [getSelectableStates](aggregate.md#getselectablestates)
* [getSelectableStatuses](aggregate.md#getselectablestatuses)
* [getState](aggregate.md#getstate)
* [getStatus](aggregate.md#getstatus)
* [getTypeByHandler](aggregate.md#gettypebyhandler)
* [getTypeName](aggregate.md#gettypename)
* [getVersion](aggregate.md#getversion)
* [handle](aggregate.md#handle)
* [handles](aggregate.md#handles)
* [hasAction](aggregate.md#hasaction)
* [hasHandler](aggregate.md#hashandler)
* [hasHook](aggregate.md#hashook)
* [hasLegacyTransformer](aggregate.md#haslegacytransformer)
* [hasState](aggregate.md#hasstate)
* [hasStatus](aggregate.md#hasstatus)
* [in](aggregate.md#in)
* [incrementVersion](aggregate.md#incrementversion)
* [initialize](aggregate.md#initialize)
* [isHandleabe](aggregate.md#ishandleabe)
* [isInOneOfStates](aggregate.md#isinoneofstates)
* [isInOneOfStatuses](aggregate.md#isinoneofstatuses)
* [isInState](aggregate.md#isinstate)
* [isInStatus](aggregate.md#isinstatus)
* [isStateSaved](aggregate.md#isstatesaved)
* [on](aggregate.md#on)
* [overrideHandler](aggregate.md#overridehandler)
* [overrideHook](aggregate.md#overridehook)
* [overrideLegacyTransformer](aggregate.md#overridelegacytransformer)
* [pickEventProps](aggregate.md#pickeventprops)
* [processSerializableList](aggregate.md#processserializablelist)
* [record](aggregate.md#record)
* [registerHandler](aggregate.md#registerhandler)
* [registerHook](aggregate.md#registerhook)
* [registerLegacyTransformer](aggregate.md#registerlegacytransformer)
* [removeHandler](aggregate.md#removehandler)
* [removeHook](aggregate.md#removehook)
* [replay](aggregate.md#replay)
* [replayHistory](aggregate.md#replayhistory)
* [schedule](aggregate.md#schedule)
* [setHandleableTypes](aggregate.md#sethandleabletypes)
* [setState](aggregate.md#setstate)
* [setStatus](aggregate.md#setstatus)
* [setVersion](aggregate.md#setversion)
* [subscribes](aggregate.md#subscribes)
* [toJSONValue](aggregate.md#tojsonvalue)
* [toPlainObject](aggregate.md#toplainobject)
* [toString](aggregate.md#tostring)
* [transformLegacyProps](aggregate.md#transformlegacyprops)
* [typeName](aggregate.md#typename)
* [unschedule](aggregate.md#unschedule)
* [validateProps](aggregate.md#validateprops)
* [validateState](aggregate.md#validatestate)
* [validateStatus](aggregate.md#validatestatus)
* [disableSerializableLists](aggregate.md#static-disableserializablelists)
* [enableSerializableLists](aggregate.md#static-enableserializablelists)
* [from](aggregate.md#static-from)
* [getPropTypes](aggregate.md#static-getproptypes)
* [getPropertyInitializers](aggregate.md#static-getpropertyinitializers)
* [getTypeName](aggregate.md#static-gettypename)
* [resolveInitializingMessage](aggregate.md#static-resolveinitializingmessage)
* [resolveRoutedCommands](aggregate.md#static-resolveroutedcommands)
* [resolveRoutedEvents](aggregate.md#static-resolveroutedevents)
* [resolveRoutedMessages](aggregate.md#static-resolveroutedmessages)
* [toString](aggregate.md#static-tostring)
* [typeName](aggregate.md#static-typename)

## Constructors

###  constructor

\+ **new Aggregate**(`arg`: [History](history.md) | [Command](command.md) | [Props](../modules/types.md#props)): *[Aggregate](aggregate.md)*

*Overrides [EventSourceable](eventsourceable.md).[constructor](eventsourceable.md#constructor)*

Creates an instance of `Aggregate`.
**Flows**:
1. **Replay History** - `Aggregate` is recreated from `History` instance - list  of `Events`(manual initialization and replay is required before running Aggregate.prototype.replayHistory!).
2. **Command** - `Command` instance is passed as initializing message and `Aggregate` has assigned id from it.
3. **Properties** - `Aggregate` is deserialized, so props as object are passed.
Creates an instance of `Aggregate`.
**Flows**:
1. **Replay History** - `Aggregate` is recreated from `History` instance - list  of `Events`(manual initialization and replay is required before running Aggregate.prototype.replayHistory!).
2. **Command** - `Command` instance is passed as initializing message and `Aggregate` has assigned id from it.
3. **Properties** - `Aggregate` is deserialized, so props as object are passed.

**`example`** 
```ts
new Aggregate(
 new History([
   new Event({targetId: 'my-id', key: 'value'})
 ])
); // 1
new Aggregate(new Command({targetId: 'my-id', key: 'value'})); // 2
new Aggregate({id: 'my-id'}); // 3
new Aggregate({id: 'my-id', key: 'value'}); // 3
```

**`throws`** {InvalidInitializingMessageError}
Thrown if provided initializing message is not instance of `Command`.

**`example`** 
```ts
new Aggregate(
 new History([
   new Event({targetId: 'my-id', key: 'value'})
 ])
); // 1
new Aggregate(new Command({targetId: 'my-id', key: 'value'})); // 2
new Aggregate({id: 'my-id'}); // 3
new Aggregate({id: 'my-id', key: 'value'}); // 3
```

**`throws`** {InvalidInitializingMessageError}
Thrown if provided initializing message is not instance of `Command`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`arg` | [History](history.md) &#124; [Command](command.md) &#124; [Props](../modules/types.md#props) | Instance of: `History`, `Command` or properties. |

**Returns:** *[Aggregate](aggregate.md)*

## Properties

###  [COMMANDS_KEY]

• **[COMMANDS_KEY]**: *Command[]*

*Overrides [EventSourceable](eventsourceable.md).[[COMMANDS_KEY]](eventsourceable.md#[commands_key])*

___

###  [EVENTS_KEY]

• **[EVENTS_KEY]**: *Event[]*

*Overrides [EventSourceable](eventsourceable.md).[[EVENTS_KEY]](eventsourceable.md#[events_key])*

___

###  id

• **id**: *string | Guid*

*Overrides [EventSourceable](eventsourceable.md).[id](eventsourceable.md#id)*

___

### `Optional` metadata

• **metadata**? : *Record‹string, any›*

*Overrides [EventSourceable](eventsourceable.md).[metadata](eventsourceable.md#optional-metadata)*

___

### `Optional` schemaVersion

• **schemaVersion**? : *number*

*Overrides [EventSourceable](eventsourceable.md).[schemaVersion](eventsourceable.md#optional-schemaversion)*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md).[state](../interfaces/types.eventsourceable.md#state)*

*Overrides [EventSourceable](eventsourceable.md).[state](eventsourceable.md#state)*

___

###  status

• **status**: *[Status](../modules/types.md#status)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md).[status](../interfaces/types.eventsourceable.md#status)*

*Overrides [EventSourceable](eventsourceable.md).[status](eventsourceable.md#status)*

___

###  version

• **version**: *number*

*Overrides [EventSourceable](eventsourceable.md).[version](eventsourceable.md#version)*

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

*Inherited from [EventSourceable](eventsourceable.md).[assignMetadata](eventsourceable.md#assignmetadata)*

*Overrides [CancelingEmployment](cancelingemployment.md).[assignMetadata](cancelingemployment.md#assignmetadata)*

**Parameters:**

Name | Type |
------ | ------ |
`metadata` | Record‹string, any› |

**Returns:** *void*

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

▸ **eventProps**(): *Record‹keyof any, any›*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [EventSourceable](eventsourceable.md).[eventProps](eventsourceable.md#eventprops)*

*Overrides [CancelingEmployment](cancelingemployment.md).[eventProps](cancelingemployment.md#eventprops)*

**Returns:** *Record‹keyof any, any›*

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

*Inherited from [EventSourceable](eventsourceable.md).[getCommands](eventsourceable.md#getcommands)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getCommands](cancelingemployment.md#getcommands)*

**Returns:** *[Command](../interfaces/types.command.md)[]*

___

###  getEvents

▸ **getEvents**(): *[Event](../interfaces/types.event.md)[]*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [EventSourceable](eventsourceable.md).[getEvents](eventsourceable.md#getevents)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getEvents](cancelingemployment.md#getevents)*

**Returns:** *[Event](../interfaces/types.event.md)[]*

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

*Inherited from [EventSourceable](eventsourceable.md).[getVersion](eventsourceable.md#getversion)*

*Overrides [CancelingEmployment](cancelingemployment.md).[getVersion](cancelingemployment.md#getversion)*

**Returns:** *number*

___

###  handle

▸ **handle**(`message`: [Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)): *Promise‹any›*

*Inherited from [EventSourceable](eventsourceable.md).[handle](eventsourceable.md#handle)*

*Overrides [OneToOneHandlingMixin](onetoonehandlingmixin.md).[handle](onetoonehandlingmixin.md#handle)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | [Command](../interfaces/types.command.md) &#124; [Event](../interfaces/types.event.md) |

**Returns:** *Promise‹any›*

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

*Inherited from [EventSourceable](eventsourceable.md).[incrementVersion](eventsourceable.md#incrementversion)*

*Overrides [CancelingEmployment](cancelingemployment.md).[incrementVersion](cancelingemployment.md#incrementversion)*

**Returns:** *void*

___

###  initialize

▸ **initialize**(): *Promise‹void›*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [EventSourceable](eventsourceable.md).[initialize](eventsourceable.md#initialize)*

*Overrides [OneToOneHandlingMixin](onetoonehandlingmixin.md).[initialize](onetoonehandlingmixin.md#initialize)*

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

###  pickEventProps

▸ **pickEventProps**(...`sources`: Record‹string, any›[]): *[PickableProperties](pickableproperties.md)*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [EventSourceable](eventsourceable.md).[pickEventProps](eventsourceable.md#pickeventprops)*

*Overrides [CancelingEmployment](cancelingemployment.md).[pickEventProps](cancelingemployment.md#pickeventprops)*

**Parameters:**

Name | Type |
------ | ------ |
`...sources` | Record‹string, any›[] |

**Returns:** *[PickableProperties](pickableproperties.md)*

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

*Inherited from [EventSourceable](eventsourceable.md).[record](eventsourceable.md#record)*

*Overrides [CancelingEmployment](cancelingemployment.md).[record](cancelingemployment.md#record)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Event](../interfaces/types.event.md) |

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

*Inherited from [EventSourceable](eventsourceable.md).[replay](eventsourceable.md#replay)*

*Overrides [CancelingEmployment](cancelingemployment.md).[replay](cancelingemployment.md#replay)*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Event](../interfaces/types.event.md) |

**Returns:** *void*

___

###  replayHistory

▸ **replayHistory**(`history`: [History](history.md)): *void*

*Inherited from [EventSourceable](eventsourceable.md).[replayHistory](eventsourceable.md#replayhistory)*

*Overrides [CancelingEmployment](cancelingemployment.md).[replayHistory](cancelingemployment.md#replayhistory)*

**Parameters:**

Name | Type |
------ | ------ |
`history` | [History](history.md) |

**Returns:** *void*

___

###  schedule

▸ **schedule**(`command`: [Command](../interfaces/types.command.md), `deliverAt`: Date, `assignmentId?`: string | [Guid](guid.md)): *void*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [EventSourceable](eventsourceable.md).[schedule](eventsourceable.md#schedule)*

*Overrides [CancelingEmployment](cancelingemployment.md).[schedule](cancelingemployment.md#schedule)*

**Parameters:**

Name | Type |
------ | ------ |
`command` | [Command](../interfaces/types.command.md) |
`deliverAt` | Date |
`assignmentId?` | string &#124; [Guid](guid.md) |

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

*Inherited from [EventSourceable](eventsourceable.md).[setVersion](eventsourceable.md#setversion)*

*Overrides [CancelingEmployment](cancelingemployment.md).[setVersion](cancelingemployment.md#setversion)*

**Parameters:**

Name | Type |
------ | ------ |
`version` | number |

**Returns:** *void*

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

*Inherited from [EventSourceable](eventsourceable.md).[unschedule](eventsourceable.md#unschedule)*

*Overrides [CancelingEmployment](cancelingemployment.md).[unschedule](cancelingemployment.md#unschedule)*

**Parameters:**

Name | Type |
------ | ------ |
`assignmentId` | string &#124; [Guid](guid.md) |
`commandType` | [MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)› |

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

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | [Error](extendableerror.md#static-error) |

**Returns:** *boolean*

___

###  validateStatus

▸ **validateStatus**(`statusOrStatuses`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Implementation of [EventSourceable](../interfaces/types.eventsourceable.md)*

*Inherited from [StatusfulMixin](statusfulmixin.md).[validateStatus](statusfulmixin.md#validatestatus)*

*Overrides [Task](task.md).[validateStatus](task.md#validatestatus)*

**Parameters:**

Name | Type |
------ | ------ |
`statusOrStatuses` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |
`error?` | [Error](extendableerror.md#static-error) |

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

*Inherited from [EventSourceable](eventsourceable.md).[resolveInitializingMessage](eventsourceable.md#static-resolveinitializingmessage)*

*Overrides [CancelingEmployment](cancelingemployment.md).[resolveInitializingMessage](cancelingemployment.md#static-resolveinitializingmessage)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)› | undefined*

___

### `Static` resolveRoutedCommands

▸ **resolveRoutedCommands**(): *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

*Inherited from [EventSourceable](eventsourceable.md).[resolveRoutedCommands](eventsourceable.md#static-resolveroutedcommands)*

*Overrides [CancelingEmployment](cancelingemployment.md).[resolveRoutedCommands](cancelingemployment.md#static-resolveroutedcommands)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md)›[]*

___

### `Static` resolveRoutedEvents

▸ **resolveRoutedEvents**(): *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

*Inherited from [EventSourceable](eventsourceable.md).[resolveRoutedEvents](eventsourceable.md#static-resolveroutedevents)*

*Overrides [CancelingEmployment](cancelingemployment.md).[resolveRoutedEvents](cancelingemployment.md#static-resolveroutedevents)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Event](../interfaces/types.event.md)›[]*

___

### `Static` resolveRoutedMessages

▸ **resolveRoutedMessages**(): *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)›[]*

*Inherited from [EventSourceable](eventsourceable.md).[resolveRoutedMessages](eventsourceable.md#static-resolveroutedmessages)*

*Overrides [CancelingEmployment](cancelingemployment.md).[resolveRoutedMessages](cancelingemployment.md#static-resolveroutedmessages)*

**Returns:** *[MessageType](../interfaces/types.messagetype.md)‹[Command](../interfaces/types.command.md) | [Event](../interfaces/types.event.md)›[]*

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

---
id: "types.eventsourceable"
title: "@eveble/eveble"
sidebar_label: "EventSourceable"
---

## Hierarchy

  ↳ [Entity](types.entity.md)

* [Controller](types.controller.md)

* Entity

* Controller

  ↳ **EventSourceable**

## Implemented by

* [Aggregate](../classes/aggregate.md)
* [EventSourceable](../classes/eventsourceable.md)
* [Process](../classes/process.md)

## Index

### Properties

* [state](types.eventsourceable.md#state)
* [status](types.eventsourceable.md#status)

### Methods

* [[ROLLBACK_STATE_METHOD_KEY]](types.eventsourceable.md#[rollback_state_method_key])
* [[SAVE_STATE_METHOD_KEY]](types.eventsourceable.md#[save_state_method_key])
* [assignMetadata](types.eventsourceable.md#assignmetadata)
* [ensureHandleability](types.eventsourceable.md#ensurehandleability)
* [equals](types.eventsourceable.md#equals)
* [eventProps](types.eventsourceable.md#eventprops)
* [getCommands](types.eventsourceable.md#getcommands)
* [getEvents](types.eventsourceable.md#getevents)
* [getHandleableTypes](types.eventsourceable.md#gethandleabletypes)
* [getHandled](types.eventsourceable.md#gethandled)
* [getHandledTypes](types.eventsourceable.md#gethandledtypes)
* [getHandler](types.eventsourceable.md#gethandler)
* [getHandlerOrThrow](types.eventsourceable.md#gethandlerorthrow)
* [getHandlers](types.eventsourceable.md#gethandlers)
* [getId](types.eventsourceable.md#getid)
* [getLegacyTransformer](types.eventsourceable.md#getlegacytransformer)
* [getLegacyTransformers](types.eventsourceable.md#getlegacytransformers)
* [getPropTypes](types.eventsourceable.md#getproptypes)
* [getPropertyInitializers](types.eventsourceable.md#getpropertyinitializers)
* [getSchemaVersion](types.eventsourceable.md#getschemaversion)
* [getSelectableStates](types.eventsourceable.md#getselectablestates)
* [getSelectableStatuses](types.eventsourceable.md#getselectablestatuses)
* [getState](types.eventsourceable.md#getstate)
* [getStatus](types.eventsourceable.md#getstatus)
* [getTypeName](types.eventsourceable.md#gettypename)
* [getVersion](types.eventsourceable.md#getversion)
* [handle](types.eventsourceable.md#handle)
* [handles](types.eventsourceable.md#handles)
* [hasHandler](types.eventsourceable.md#hashandler)
* [hasLegacyTransformer](types.eventsourceable.md#haslegacytransformer)
* [hasState](types.eventsourceable.md#hasstate)
* [hasStatus](types.eventsourceable.md#hasstatus)
* [incrementVersion](types.eventsourceable.md#incrementversion)
* [initialize](types.eventsourceable.md#initialize)
* [isHandleabe](types.eventsourceable.md#ishandleabe)
* [isInOneOfStates](types.eventsourceable.md#isinoneofstates)
* [isInOneOfStatuses](types.eventsourceable.md#isinoneofstatuses)
* [isInState](types.eventsourceable.md#isinstate)
* [isInStatus](types.eventsourceable.md#isinstatus)
* [isStateSaved](types.eventsourceable.md#isstatesaved)
* [on](types.eventsourceable.md#on)
* [overrideHandler](types.eventsourceable.md#overridehandler)
* [overrideLegacyTransformer](types.eventsourceable.md#overridelegacytransformer)
* [pickEventProps](types.eventsourceable.md#pickeventprops)
* [record](types.eventsourceable.md#record)
* [registerHandler](types.eventsourceable.md#registerhandler)
* [registerLegacyTransformer](types.eventsourceable.md#registerlegacytransformer)
* [removeHandler](types.eventsourceable.md#removehandler)
* [replay](types.eventsourceable.md#replay)
* [replayHistory](types.eventsourceable.md#replayhistory)
* [schedule](types.eventsourceable.md#schedule)
* [setHandleableTypes](types.eventsourceable.md#sethandleabletypes)
* [setState](types.eventsourceable.md#setstate)
* [setStatus](types.eventsourceable.md#setstatus)
* [subscribes](types.eventsourceable.md#subscribes)
* [toPlainObject](types.eventsourceable.md#toplainobject)
* [toString](types.eventsourceable.md#tostring)
* [transformLegacyProps](types.eventsourceable.md#transformlegacyprops)
* [unschedule](types.eventsourceable.md#unschedule)
* [validateProps](types.eventsourceable.md#validateprops)
* [validateState](types.eventsourceable.md#validatestate)
* [validateStatus](types.eventsourceable.md#validatestatus)

## Properties

###  state

• **state**: *[State](../modules/types.md#state)*

*Inherited from [Stateful](types.stateful.md).[state](types.stateful.md#state)*

*Overrides void*

___

###  status

• **status**: *[Status](../modules/types.md#status)*

*Inherited from [Statusful](types.statusful.md).[status](types.statusful.md#status)*

*Overrides void*

## Methods

###  [ROLLBACK_STATE_METHOD_KEY]

▸ **[ROLLBACK_STATE_METHOD_KEY]**(): *void*

*Inherited from [Entity](types.entity.md).[[ROLLBACK_STATE_METHOD_KEY]](types.entity.md#[rollback_state_method_key])*

*Overrides void*

**Returns:** *void*

___

###  [SAVE_STATE_METHOD_KEY]

▸ **[SAVE_STATE_METHOD_KEY]**(): *void*

*Inherited from [Entity](types.entity.md).[[SAVE_STATE_METHOD_KEY]](types.entity.md#[save_state_method_key])*

*Overrides void*

**Returns:** *void*

___

###  assignMetadata

▸ **assignMetadata**(`metadata`: Record‹string, any›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`metadata` | Record‹string, any› |

**Returns:** *void*

▸ **assignMetadata**(`metadata`: Record‹string, any›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`metadata` | Record‹string, any› |

**Returns:** *void*

___

###  ensureHandleability

▸ **ensureHandleability**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handleableTypes`: [MessageType](types.messagetype.md)‹[Message](types.message.md)› | [MessageType](types.messagetype.md)‹[Message](types.message.md)›[]): *boolean*

*Inherited from [Controller](types.controller.md).[ensureHandleability](types.controller.md#ensurehandleability)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |
`handleableTypes` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› &#124; [MessageType](types.messagetype.md)‹[Message](types.message.md)›[] |

**Returns:** *boolean*

___

###  equals

▸ **equals**(`other`: any): *boolean*

*Inherited from [Definable](types.definable.md).[equals](types.definable.md#equals)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  eventProps

▸ **eventProps**(): *Record‹keyof any, any›*

**Returns:** *Record‹keyof any, any›*

▸ **eventProps**(): *Record‹keyof any, any›*

**Returns:** *Record‹keyof any, any›*

___

###  getCommands

▸ **getCommands**(): *[Command](types.command.md)[]*

**Returns:** *[Command](types.command.md)[]*

▸ **getCommands**(): *Command[]*

**Returns:** *Command[]*

___

###  getEvents

▸ **getEvents**(): *[Event](types.event.md)[]*

**Returns:** *[Event](types.event.md)[]*

▸ **getEvents**(): *Event[]*

**Returns:** *Event[]*

___

###  getHandleableTypes

▸ **getHandleableTypes**(): *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

*Inherited from [Controller](types.controller.md).[getHandleableTypes](types.controller.md#gethandleabletypes)*

*Overrides void*

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

___

###  getHandled

▸ **getHandled**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

*Inherited from [Controller](types.controller.md).[getHandled](types.controller.md#gethandled)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

___

###  getHandledTypes

▸ **getHandledTypes**(): *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

*Inherited from [Controller](types.controller.md).[getHandledTypes](types.controller.md#gethandledtypes)*

*Overrides void*

**Returns:** *[MessageType](types.messagetype.md)‹[Message](types.message.md)›[]*

___

###  getHandler

▸ **getHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[] | undefined*

*Inherited from [Controller](types.controller.md).[getHandler](types.controller.md#gethandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[] | undefined*

___

###  getHandlerOrThrow

▸ **getHandlerOrThrow**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]*

*Inherited from [Controller](types.controller.md).[getHandlerOrThrow](types.controller.md#gethandlerorthrow)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *[Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]*

___

###  getHandlers

▸ **getHandlers**(): *Map‹[MessageType](types.messagetype.md)‹[Message](types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

*Inherited from [Controller](types.controller.md).[getHandlers](types.controller.md#gethandlers)*

*Overrides void*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Message](types.message.md)›, [Handler](../modules/types.md#handler) | [Handler](../modules/types.md#handler)[]›*

___

###  getId

▸ **getId**(): *string | [Stringifiable](types.stringifiable.md)*

*Inherited from [Identifiable](types.identifiable.md).[getId](types.identifiable.md#getid)*

*Overrides void*

**Returns:** *string | [Stringifiable](types.stringifiable.md)*

___

###  getLegacyTransformer

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

*Inherited from [Versionable](types.versionable.md).[getLegacyTransformer](types.versionable.md#getlegacytransformer)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *[Hook](../modules/types.md#hook)*

___

###  getLegacyTransformers

▸ **getLegacyTransformers**(): *[LegacyTransformers](../modules/types.md#legacytransformers)*

*Inherited from [Versionable](types.versionable.md).[getLegacyTransformers](types.versionable.md#getlegacytransformers)*

*Overrides void*

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

___

###  getPropTypes

▸ **getPropTypes**(): *Record‹keyof any, any›*

*Inherited from [Definable](types.definable.md).[getPropTypes](types.definable.md#getproptypes)*

*Overrides void*

**Returns:** *Record‹keyof any, any›*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Inherited from [Definable](types.definable.md).[getPropertyInitializers](types.definable.md#getpropertyinitializers)*

*Overrides void*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

*Inherited from [Versionable](types.versionable.md).[getSchemaVersion](types.versionable.md#getschemaversion)*

*Overrides void*

**Returns:** *number | undefined*

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Inherited from [Stateful](types.stateful.md).[getSelectableStates](types.stateful.md#getselectablestates)*

*Overrides void*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getSelectableStatuses

▸ **getSelectableStatuses**(): *Record‹string, [Status](../modules/types.md#status)›*

*Inherited from [Statusful](types.statusful.md).[getSelectableStatuses](types.statusful.md#getselectablestatuses)*

*Overrides void*

**Returns:** *Record‹string, [Status](../modules/types.md#status)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Inherited from [Stateful](types.stateful.md).[getState](types.stateful.md#getstate)*

*Overrides void*

**Returns:** *[State](../modules/types.md#state)*

___

###  getStatus

▸ **getStatus**(): *[Status](../modules/types.md#status)*

*Inherited from [Statusful](types.statusful.md).[getStatus](types.statusful.md#getstatus)*

*Overrides void*

**Returns:** *[Status](../modules/types.md#status)*

___

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [Serializable](types.serializable.md).[getTypeName](types.serializable.md#gettypename)*

*Overrides void*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  getVersion

▸ **getVersion**(): *number*

**Returns:** *number*

▸ **getVersion**(): *number*

**Returns:** *number*

___

###  handle

▸ **handle**(`message`: [Message](types.message.md)): *any*

*Overrides [Controller](types.controller.md).[handle](types.controller.md#handle)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | [Message](types.message.md) |

**Returns:** *any*

▸ **handle**(`message`: Message): *any*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Message |

**Returns:** *any*

___

###  handles

▸ **handles**(): *Map‹[MessageType](types.messagetype.md)‹[Command](types.command.md)›, [Handler](../modules/types.md#handler)›*

*Inherited from [Controller](types.controller.md).[handles](types.controller.md#handles)*

*Overrides void*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Command](types.command.md)›, [Handler](../modules/types.md#handler)›*

___

###  hasHandler

▸ **hasHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *boolean*

*Inherited from [Controller](types.controller.md).[hasHandler](types.controller.md#hashandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *boolean*

___

###  hasLegacyTransformer

▸ **hasLegacyTransformer**(`schemaVersion`: number): *boolean*

*Inherited from [Versionable](types.versionable.md).[hasLegacyTransformer](types.versionable.md#haslegacytransformer)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *boolean*

___

###  hasState

▸ **hasState**(): *boolean*

*Inherited from [Stateful](types.stateful.md).[hasState](types.stateful.md#hasstate)*

*Overrides void*

**Returns:** *boolean*

___

###  hasStatus

▸ **hasStatus**(): *boolean*

*Inherited from [Statusful](types.statusful.md).[hasStatus](types.statusful.md#hasstatus)*

*Overrides void*

**Returns:** *boolean*

___

###  incrementVersion

▸ **incrementVersion**(): *void*

**Returns:** *void*

▸ **incrementVersion**(): *void*

**Returns:** *void*

___

###  initialize

▸ **initialize**(): *void*

*Inherited from [Controller](types.controller.md).[initialize](types.controller.md#initialize)*

*Overrides void*

**Returns:** *void*

___

###  isHandleabe

▸ **isHandleabe**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *boolean*

*Inherited from [Controller](types.controller.md).[isHandleabe](types.controller.md#ishandleabe)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *boolean*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Inherited from [Stateful](types.stateful.md).[isInOneOfStates](types.stateful.md#isinoneofstates)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInOneOfStatuses

▸ **isInOneOfStatuses**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

*Inherited from [Statusful](types.statusful.md).[isInOneOfStatuses](types.statusful.md#isinoneofstatuses)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Inherited from [Stateful](types.stateful.md).[isInState](types.stateful.md#isinstate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInStatus

▸ **isInStatus**(`status`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[]): *boolean*

*Inherited from [Statusful](types.statusful.md).[isInStatus](types.statusful.md#isinstatus)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |

**Returns:** *boolean*

___

###  isStateSaved

▸ **isStateSaved**(): *boolean*

*Inherited from [Entity](types.entity.md).[isStateSaved](types.entity.md#isstatesaved)*

*Overrides void*

**Returns:** *boolean*

___

###  on

▸ **on**(`action`: string | [Stringifiable](types.stringifiable.md)): *any*

*Inherited from [Entity](types.entity.md).[on](types.entity.md#on)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *any*

___

###  overrideHandler

▸ **overrideHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handler`: [Handler](../modules/types.md#handler)): *void*

*Inherited from [Controller](types.controller.md).[overrideHandler](types.controller.md#overridehandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |

**Returns:** *void*

___

###  overrideLegacyTransformer

▸ **overrideLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook)): *void*

*Inherited from [Versionable](types.versionable.md).[overrideLegacyTransformer](types.versionable.md#overridelegacytransformer)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

___

###  pickEventProps

▸ **pickEventProps**(...`sources`: Record‹string, any›[]): *Record‹keyof any, any›[]*

**Parameters:**

Name | Type |
------ | ------ |
`...sources` | Record‹string, any›[] |

**Returns:** *Record‹keyof any, any›[]*

▸ **pickEventProps**(...`sources`: Record‹string, any›[]): *Record‹keyof any, any›[]*

**Parameters:**

Name | Type |
------ | ------ |
`...sources` | Record‹string, any›[] |

**Returns:** *Record‹keyof any, any›[]*

___

###  record

▸ **record**(`event`: [Event](types.event.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Event](types.event.md) |

**Returns:** *void*

▸ **record**(`event`: Event): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | Event |

**Returns:** *void*

___

###  registerHandler

▸ **registerHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›, `handler`: [Handler](../modules/types.md#handler), `shouldOverride?`: boolean): *void*

*Inherited from [Controller](types.controller.md).[registerHandler](types.controller.md#registerhandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |
`handler` | [Handler](../modules/types.md#handler) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  registerLegacyTransformer

▸ **registerLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook), `shouldOverride`: boolean): *void*

*Inherited from [Versionable](types.versionable.md).[registerLegacyTransformer](types.versionable.md#registerlegacytransformer)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |
`transformer` | [Hook](../modules/types.md#hook) |
`shouldOverride` | boolean |

**Returns:** *void*

___

###  removeHandler

▸ **removeHandler**(`messageType`: [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *void*

*Inherited from [Controller](types.controller.md).[removeHandler](types.controller.md#removehandler)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageType` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *void*

___

###  replay

▸ **replay**(`event`: [Event](types.event.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [Event](types.event.md) |

**Returns:** *void*

▸ **replay**(`event`: Event): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | Event |

**Returns:** *void*

___

###  replayHistory

▸ **replayHistory**(`history`: [Event](types.event.md)[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`history` | [Event](types.event.md)[] |

**Returns:** *void*

▸ **replayHistory**(`history`: Event[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`history` | Event[] |

**Returns:** *void*

___

###  schedule

▸ **schedule**(`command`: [Command](types.command.md), `deliverAt`: Date, `assignmentId?`: string | [Stringifiable](types.stringifiable.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`command` | [Command](types.command.md) |
`deliverAt` | Date |
`assignmentId?` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *void*

▸ **schedule**(`command`: Command, `deliverAt`: Date, `assignmentId?`: string | Stringifiable): *void*

**Parameters:**

Name | Type |
------ | ------ |
`command` | Command |
`deliverAt` | Date |
`assignmentId?` | string &#124; Stringifiable |

**Returns:** *void*

___

###  setHandleableTypes

▸ **setHandleableTypes**(`handleableTypes`: [MessageType](types.messagetype.md)‹[Message](types.message.md)› | [MessageType](types.messagetype.md)‹[Message](types.message.md)›[]): *void*

*Inherited from [Controller](types.controller.md).[setHandleableTypes](types.controller.md#sethandleabletypes)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`handleableTypes` | [MessageType](types.messagetype.md)‹[Message](types.message.md)› &#124; [MessageType](types.messagetype.md)‹[Message](types.message.md)›[] |

**Returns:** *void*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Inherited from [Stateful](types.stateful.md).[setState](types.stateful.md#setstate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  setStatus

▸ **setStatus**(`status`: [Status](../modules/types.md#status)): *void*

*Inherited from [Statusful](types.statusful.md).[setStatus](types.statusful.md#setstatus)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`status` | [Status](../modules/types.md#status) |

**Returns:** *void*

___

###  subscribes

▸ **subscribes**(): *Map‹[MessageType](types.messagetype.md)‹[Event](types.event.md)›, [Handler](../modules/types.md#handler)›*

*Inherited from [Controller](types.controller.md).[subscribes](types.controller.md#subscribes)*

*Overrides void*

**Returns:** *Map‹[MessageType](types.messagetype.md)‹[Event](types.event.md)›, [Handler](../modules/types.md#handler)›*

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Inherited from [Definable](types.definable.md).[toPlainObject](types.definable.md#toplainobject)*

*Overrides void*

**Returns:** *[Props](../modules/types.md#props)*

___

###  toString

▸ **toString**(): *[TypeName](../modules/types.md#typename) | string*

*Inherited from [Serializable](types.serializable.md).[toString](types.serializable.md#tostring)*

*Overrides void*

**Returns:** *[TypeName](../modules/types.md#typename) | string*

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Inherited from [Versionable](types.versionable.md).[transformLegacyProps](types.versionable.md#transformlegacyprops)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *[Props](../modules/types.md#props)*

___

###  unschedule

▸ **unschedule**(`assignmentId`: string | [Stringifiable](types.stringifiable.md), `commandType`: [MessageType](types.messagetype.md)‹[Command](types.command.md)›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`assignmentId` | string &#124; [Stringifiable](types.stringifiable.md) |
`commandType` | [MessageType](types.messagetype.md)‹[Command](types.command.md)› |

**Returns:** *void*

▸ **unschedule**(`assignmentId`: string | Stringifiable, `commandType`: MessageType‹Command›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`assignmentId` | string &#124; Stringifiable |
`commandType` | MessageType‹Command› |

**Returns:** *void*

___

###  validateProps

▸ **validateProps**(`props`: [Props](../modules/types.md#props), `propTypes`: [PropTypes](../modules/types.md#proptypes), `isStrict?`: boolean): *boolean*

*Inherited from [Definable](types.definable.md).[validateProps](types.definable.md#validateprops)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |
`propTypes` | [PropTypes](../modules/types.md#proptypes) |
`isStrict?` | boolean |

**Returns:** *boolean*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](../classes/extendableerror.md#static-error)): *boolean*

*Inherited from [Stateful](types.stateful.md).[validateState](types.stateful.md#validatestate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | [Error](../classes/extendableerror.md#static-error) |

**Returns:** *boolean*

___

###  validateStatus

▸ **validateStatus**(`statusOrStatuses`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[], `error?`: [Error](../classes/extendableerror.md#static-error)): *boolean*

*Inherited from [Statusful](types.statusful.md).[validateStatus](types.statusful.md#validatestatus)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`statusOrStatuses` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |
`error?` | [Error](../classes/extendableerror.md#static-error) |

**Returns:** *boolean*

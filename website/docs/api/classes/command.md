---
id: "command"
title: "Command"
sidebar_label: "Command"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

  ↳ [Message](message.md)

* Message

  ↳ **Command**

  ↳ [ScheduleCommand](schedulecommand.md)

  ↳ [UnscheduleCommand](unschedulecommand.md)

## Implements

* [Definable](../interfaces/types.definable.md)
* [Hookable](../interfaces/types.hookable.md)
* [Ejsonable](../interfaces/types.ejsonable.md)
* [Message](../interfaces/types.message.md)
* [Command](../interfaces/types.command.md)
* [Identifiable](../interfaces/types.identifiable.md)
* Definable
* Hookable
* Ejsonable
* Message
* Command
* Identifiable

## Index

### Constructors

* [constructor](command.md#constructor)

### Properties

* [metadata](command.md#metadata)
* [schemaVersion](command.md#optional-schemaversion)
* [targetId](command.md#targetid)
* [timestamp](command.md#timestamp)

### Methods

* [assignMetadata](command.md#assignmetadata)
* [equals](command.md#equals)
* [getActions](command.md#getactions)
* [getAssignment](command.md#getassignment)
* [getCorrelationId](command.md#getcorrelationid)
* [getHook](command.md#gethook)
* [getHookOrThrow](command.md#gethookorthrow)
* [getHooks](command.md#gethooks)
* [getId](command.md#getid)
* [getLegacyTransformer](command.md#getlegacytransformer)
* [getLegacyTransformers](command.md#getlegacytransformers)
* [getMetadata](command.md#getmetadata)
* [getPropTypes](command.md#getproptypes)
* [getPropertyInitializers](command.md#getpropertyinitializers)
* [getSchemaVersion](command.md#getschemaversion)
* [getTimestamp](command.md#gettimestamp)
* [getTypeName](command.md#gettypename)
* [hasAction](command.md#hasaction)
* [hasCorrelationId](command.md#hascorrelationid)
* [hasHook](command.md#hashook)
* [hasLegacyTransformer](command.md#haslegacytransformer)
* [hasMetadata](command.md#hasmetadata)
* [in](command.md#in)
* [isDeliverable](command.md#isdeliverable)
* [isScheduled](command.md#isscheduled)
* [overrideHook](command.md#overridehook)
* [overrideLegacyTransformer](command.md#overridelegacytransformer)
* [processSerializableList](command.md#processserializablelist)
* [registerHook](command.md#registerhook)
* [registerLegacyTransformer](command.md#registerlegacytransformer)
* [removeHook](command.md#removehook)
* [schedule](command.md#schedule)
* [setCorrelationId](command.md#setcorrelationid)
* [toJSONValue](command.md#tojsonvalue)
* [toPlainObject](command.md#toplainobject)
* [toString](command.md#tostring)
* [transformLegacyProps](command.md#transformlegacyprops)
* [typeName](command.md#typename)
* [validateProps](command.md#validateprops)
* [disableSerializableLists](command.md#static-disableserializablelists)
* [enableSerializableLists](command.md#static-enableserializablelists)
* [from](command.md#static-from)
* [getPropTypes](command.md#static-getproptypes)
* [getPropertyInitializers](command.md#static-getpropertyinitializers)
* [getTypeName](command.md#static-gettypename)
* [toString](command.md#static-tostring)
* [typeName](command.md#static-typename)

## Constructors

###  constructor

\+ **new Command**(`props?`: [Props](../modules/types.md#props)): *[Command](command.md)*

*Overrides [Serializable](serializable.md).[constructor](serializable.md#constructor)*

Creates an instance of Message.
Creates an instance of Message.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props?` | [Props](../modules/types.md#props) | Properties of the type required for construction.  |

**Returns:** *[Command](command.md)*

## Properties

###  metadata

• **metadata**: *Record‹string, any›*

*Implementation of [Command](../interfaces/types.command.md).[metadata](../interfaces/types.command.md#optional-metadata)*

*Inherited from [Message](message.md).[metadata](message.md#metadata)*

*Overrides [CreateEmployee](createemployee.md).[metadata](createemployee.md#metadata)*

___

### `Optional` schemaVersion

• **schemaVersion**? : *number*

*Inherited from [Serializable](serializable.md).[schemaVersion](serializable.md#optional-schemaversion)*

*Overrides [VersionableMixin](versionablemixin.md).[schemaVersion](versionablemixin.md#optional-schemaversion)*

___

###  targetId

• **targetId**: *Guid | string*

*Implementation of [Command](../interfaces/types.command.md).[targetId](../interfaces/types.command.md#targetid)*

___

###  timestamp

• **timestamp**: *Date*

*Implementation of [Command](../interfaces/types.command.md).[timestamp](../interfaces/types.command.md#timestamp)*

*Inherited from [Message](message.md).[timestamp](message.md#timestamp)*

*Overrides [CreateEmployee](createemployee.md).[timestamp](createemployee.md#timestamp)*

## Methods

###  assignMetadata

▸ **assignMetadata**(`props`: Record‹string, any›): *void*

*Implementation of [Command](../interfaces/types.command.md)*

*Inherited from [Message](message.md).[assignMetadata](message.md#assignmetadata)*

*Overrides [CreateEmployee](createemployee.md).[assignMetadata](createemployee.md#assignmetadata)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | Record‹string, any› |

**Returns:** *void*

___

###  equals

▸ **equals**(`other`: any): *boolean*

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[equals](definablemixin.md#equals)*

*Overrides [CreateEmployee](createemployee.md).[equals](createemployee.md#equals)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getActions](hookablemixin.md#getactions)*

*Overrides [CreateEmployee](createemployee.md).[getActions](createemployee.md#getactions)*

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

___

###  getAssignment

▸ **getAssignment**(): *[Assignment](assignment.md) | undefined*

*Implementation of [Command](../interfaces/types.command.md)*

Returns scheduling assignment if present.

**Returns:** *[Assignment](assignment.md) | undefined*

Instance of `Assignment`, else `undefined`.

___

###  getCorrelationId

▸ **getCorrelationId**(`key`: string): *string | undefined*

*Implementation of [Command](../interfaces/types.command.md)*

*Inherited from [Message](message.md).[getCorrelationId](message.md#getcorrelationid)*

*Overrides [CreateEmployee](createemployee.md).[getCorrelationId](createemployee.md#getcorrelationid)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *string | undefined*

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

▸ **getId**(): *[Guid](guid.md) | string*

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

Returns command's targeted element by id.

**Returns:** *[Guid](guid.md) | string*

Command's target identifier as a instance of `Guid` or string.

___

###  getLegacyTransformer

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

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

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getLegacyTransformers](versionablemixin.md#getlegacytransformers)*

*Overrides [CreateEmployee](createemployee.md).[getLegacyTransformers](createemployee.md#getlegacytransformers)*

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

___

###  getMetadata

▸ **getMetadata**(): *Record‹string, any›*

*Implementation of [Command](../interfaces/types.command.md)*

*Inherited from [Message](message.md).[getMetadata](message.md#getmetadata)*

*Overrides [CreateEmployee](createemployee.md).[getMetadata](createemployee.md#getmetadata)*

**Returns:** *Record‹string, any›*

___

###  getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

*Overrides [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getSchemaVersion](versionablemixin.md#getschemaversion)*

*Overrides [CreateEmployee](createemployee.md).[getSchemaVersion](createemployee.md#getschemaversion)*

**Returns:** *number | undefined*

___

###  getTimestamp

▸ **getTimestamp**(): *Date*

*Implementation of [Command](../interfaces/types.command.md)*

*Inherited from [Message](message.md).[getTimestamp](message.md#gettimestamp)*

*Overrides [CreateEmployee](createemployee.md).[getTimestamp](createemployee.md#gettimestamp)*

**Returns:** *Date*

___

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[getTypeName](serializablemixin.md#gettypename)*

*Overrides [CreateEmployee](createemployee.md).[getTypeName](createemployee.md#gettypename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

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

###  hasCorrelationId

▸ **hasCorrelationId**(`key`: string): *boolean*

*Implementation of [Command](../interfaces/types.command.md)*

*Inherited from [Message](message.md).[hasCorrelationId](message.md#hascorrelationid)*

*Overrides [CreateEmployee](createemployee.md).[hasCorrelationId](createemployee.md#hascorrelationid)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

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

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[hasLegacyTransformer](versionablemixin.md#haslegacytransformer)*

*Overrides [CreateEmployee](createemployee.md).[hasLegacyTransformer](createemployee.md#haslegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *boolean*

___

###  hasMetadata

▸ **hasMetadata**(): *boolean*

*Implementation of [Command](../interfaces/types.command.md)*

*Inherited from [Message](message.md).[hasMetadata](message.md#hasmetadata)*

*Overrides [CreateEmployee](createemployee.md).[hasMetadata](createemployee.md#hasmetadata)*

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

###  isDeliverable

▸ **isDeliverable**(): *boolean*

*Implementation of [Command](../interfaces/types.command.md)*

Evaluates if message is deliverable(i.e. is not scheduled or is past delivery time).

**Returns:** *boolean*

Returns `true` if command is deliverable, else `false`.

___

###  isScheduled

▸ **isScheduled**(): *boolean*

*Implementation of [Command](../interfaces/types.command.md)*

Evaluates if command is scheduled for delivery.

**Returns:** *boolean*

Returns `true` if command is scheduled, else `false`.

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

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

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

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

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

###  schedule

▸ **schedule**(`assignment`: [Assignment](assignment.md)): *void*

*Implementation of [Command](../interfaces/types.command.md)*

Schedules command for delivery at specific time.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`assignment` | [Assignment](assignment.md) | Scheduling assignment information.  |

**Returns:** *void*

___

###  setCorrelationId

▸ **setCorrelationId**(`key`: string, `id`: [Stringifiable](../interfaces/types.stringifiable.md)): *void*

*Implementation of [Command](../interfaces/types.command.md)*

*Inherited from [Message](message.md).[setCorrelationId](message.md#setcorrelationid)*

*Overrides [CreateEmployee](createemployee.md).[setCorrelationId](createemployee.md#setcorrelationid)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`id` | [Stringifiable](../interfaces/types.stringifiable.md) |

**Returns:** *void*

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

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[toPlainObject](definablemixin.md#toplainobject)*

*Overrides [CreateEmployee](createemployee.md).[toPlainObject](createemployee.md#toplainobject)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[toString](serializablemixin.md#tostring)*

*Overrides [CreateEmployee](createemployee.md).[toString](createemployee.md#tostring)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Implementation of [Identifiable](../interfaces/types.identifiable.md)*

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

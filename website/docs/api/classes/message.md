---
id: "message"
title: "Message"
sidebar_label: "Message"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

  ↳ [Serializable](serializable.md)

* Serializable

  ↳ **Message**

  ↳ [Command](command.md)

  ↳ [Event](event.md)

## Implements

* [Definable](../interfaces/types.definable.md)
* [Hookable](../interfaces/types.hookable.md)
* [Ejsonable](../interfaces/types.ejsonable.md)
* [Message](../interfaces/types.message.md)
* Definable
* Hookable
* Ejsonable
* Message

## Index

### Constructors

* [constructor](message.md#constructor)

### Properties

* [metadata](message.md#metadata)
* [schemaVersion](message.md#optional-schemaversion)
* [timestamp](message.md#timestamp)

### Methods

* [assignMetadata](message.md#assignmetadata)
* [equals](message.md#equals)
* [getActions](message.md#getactions)
* [getCorrelationId](message.md#getcorrelationid)
* [getHook](message.md#gethook)
* [getHookOrThrow](message.md#gethookorthrow)
* [getHooks](message.md#gethooks)
* [getLegacyTransformer](message.md#getlegacytransformer)
* [getLegacyTransformers](message.md#getlegacytransformers)
* [getMetadata](message.md#getmetadata)
* [getPropTypes](message.md#getproptypes)
* [getPropertyInitializers](message.md#getpropertyinitializers)
* [getSchemaVersion](message.md#getschemaversion)
* [getTimestamp](message.md#gettimestamp)
* [getTypeName](message.md#gettypename)
* [hasAction](message.md#hasaction)
* [hasCorrelationId](message.md#hascorrelationid)
* [hasHook](message.md#hashook)
* [hasLegacyTransformer](message.md#haslegacytransformer)
* [hasMetadata](message.md#hasmetadata)
* [in](message.md#in)
* [overrideHook](message.md#overridehook)
* [overrideLegacyTransformer](message.md#overridelegacytransformer)
* [processSerializableList](message.md#processserializablelist)
* [registerHook](message.md#registerhook)
* [registerLegacyTransformer](message.md#registerlegacytransformer)
* [removeHook](message.md#removehook)
* [setCorrelationId](message.md#setcorrelationid)
* [toJSONValue](message.md#tojsonvalue)
* [toPlainObject](message.md#toplainobject)
* [toString](message.md#tostring)
* [transformLegacyProps](message.md#transformlegacyprops)
* [typeName](message.md#typename)
* [validateProps](message.md#validateprops)
* [disableSerializableLists](message.md#static-disableserializablelists)
* [enableSerializableLists](message.md#static-enableserializablelists)
* [from](message.md#static-from)
* [getPropTypes](message.md#static-getproptypes)
* [getPropertyInitializers](message.md#static-getpropertyinitializers)
* [getTypeName](message.md#static-gettypename)
* [toString](message.md#static-tostring)
* [typeName](message.md#static-typename)

## Constructors

###  constructor

\+ **new Message**(`props?`: [Props](../modules/types.md#props)): *[Message](message.md)*

*Inherited from [Serializable](serializable.md).[constructor](serializable.md#constructor)*

*Overrides [Struct](struct.md).[constructor](struct.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`props?` | [Props](../modules/types.md#props) |

**Returns:** *[Message](message.md)*

## Properties

###  metadata

• **metadata**: *Record‹string, any›*

*Implementation of [Message](../interfaces/types.message.md).[metadata](../interfaces/types.message.md#optional-metadata)*

___

### `Optional` schemaVersion

• **schemaVersion**? : *number*

*Inherited from [Serializable](serializable.md).[schemaVersion](serializable.md#optional-schemaversion)*

*Overrides [VersionableMixin](versionablemixin.md).[schemaVersion](versionablemixin.md#optional-schemaversion)*

___

###  timestamp

• **timestamp**: *Date*

*Implementation of [Message](../interfaces/types.message.md).[timestamp](../interfaces/types.message.md#timestamp)*

## Methods

###  assignMetadata

▸ **assignMetadata**(`props`: Record‹string, any›): *void*

*Implementation of [Message](../interfaces/types.message.md)*

Assigns metadata to message.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | Record‹string, any› | Metadata properties object with all information related to `Message`.  |

**Returns:** *void*

___

###  equals

▸ **equals**(`other`: any): *boolean*

*Implementation of [Message](../interfaces/types.message.md)*

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

###  getCorrelationId

▸ **getCorrelationId**(`key`: string): *string | undefined*

*Implementation of [Message](../interfaces/types.message.md)*

Returns metadata correlation id for message.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Key under which correlation is set with support of dotted notation for nested objects. |

**Returns:** *string | undefined*

String identifier of correlating element.

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

###  getLegacyTransformer

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

*Implementation of [Message](../interfaces/types.message.md)*

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

*Implementation of [Message](../interfaces/types.message.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getLegacyTransformers](versionablemixin.md#getlegacytransformers)*

*Overrides [CreateEmployee](createemployee.md).[getLegacyTransformers](createemployee.md#getlegacytransformers)*

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

___

###  getMetadata

▸ **getMetadata**(): *Record‹string, any›*

*Implementation of [Message](../interfaces/types.message.md)*

Returns metadata assigned to the message.

**Returns:** *Record‹string, any›*

Returns metadata assigned to the message as an object.

___

###  getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Implementation of [Message](../interfaces/types.message.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

*Overrides [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Implementation of [Message](../interfaces/types.message.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

*Implementation of [Message](../interfaces/types.message.md)*

*Inherited from [VersionableMixin](versionablemixin.md).[getSchemaVersion](versionablemixin.md#getschemaversion)*

*Overrides [CreateEmployee](createemployee.md).[getSchemaVersion](createemployee.md#getschemaversion)*

**Returns:** *number | undefined*

___

###  getTimestamp

▸ **getTimestamp**(): *Date*

*Implementation of [Message](../interfaces/types.message.md)*

Returns time when message was created.

**Returns:** *Date*

Returns instance of `Date`.

___

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [Message](../interfaces/types.message.md)*

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

*Implementation of [Message](../interfaces/types.message.md)*

Evaluates if message contains correlation id on metadata.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Key under which correlation is set with support of dotted notation for nested objects. |

**Returns:** *boolean*

Returns `true` if metadata contains correlated element, else `false`.

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

*Implementation of [Message](../interfaces/types.message.md)*

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

*Implementation of [Message](../interfaces/types.message.md)*

Evaluates if there is assigned metadata to message.

**Returns:** *boolean*

Returns true if `message` has assigned metadata, else `false`.

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

*Implementation of [Message](../interfaces/types.message.md)*

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

*Implementation of [Message](../interfaces/types.message.md)*

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

###  setCorrelationId

▸ **setCorrelationId**(`key`: string, `id`: [Stringifiable](../interfaces/types.stringifiable.md)): *void*

*Implementation of [Message](../interfaces/types.message.md)*

Sets correlation id metadata on message.

**`remarks`** 
**Databases like MongoDB does not support object keys with dots like: `my.nested.key`**
Since for correlation key - namespaced 'type name' like `MyNamespace.MyMessage`
can be used we utilize lodash'es 'set' method to construct nested object from
such notation.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Key under which correlation is set with support of dotted notation for nested objects. |
`id` | [Stringifiable](../interfaces/types.stringifiable.md) | Identifier of correlating element. |

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

*Implementation of [Message](../interfaces/types.message.md)*

*Inherited from [DefinableMixin](definablemixin.md).[toPlainObject](definablemixin.md#toplainobject)*

*Overrides [CreateEmployee](createemployee.md).[toPlainObject](createemployee.md#toplainobject)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

*Implementation of [Message](../interfaces/types.message.md)*

*Inherited from [SerializableMixin](serializablemixin.md).[toString](serializablemixin.md#tostring)*

*Overrides [CreateEmployee](createemployee.md).[toString](createemployee.md#tostring)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Implementation of [Message](../interfaces/types.message.md)*

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

---
id: "types.command"
title: "@eveble/eveble"
sidebar_label: "Command"
---

## Hierarchy

  ↳ [Message](types.message.md)

* Message

  ↳ **Command**

## Implemented by

* [Command](../classes/command.md)
* [ScheduleCommand](../classes/schedulecommand.md)
* [UnscheduleCommand](../classes/unschedulecommand.md)

## Index

### Properties

* [metadata](types.command.md#optional-metadata)
* [targetId](types.command.md#targetid)
* [timestamp](types.command.md#timestamp)

### Methods

* [assignMetadata](types.command.md#assignmetadata)
* [equals](types.command.md#equals)
* [getAssignment](types.command.md#getassignment)
* [getCorrelationId](types.command.md#getcorrelationid)
* [getId](types.command.md#getid)
* [getLegacyTransformer](types.command.md#getlegacytransformer)
* [getLegacyTransformers](types.command.md#getlegacytransformers)
* [getMetadata](types.command.md#getmetadata)
* [getPropTypes](types.command.md#getproptypes)
* [getPropertyInitializers](types.command.md#getpropertyinitializers)
* [getSchemaVersion](types.command.md#getschemaversion)
* [getTimestamp](types.command.md#gettimestamp)
* [getTypeName](types.command.md#gettypename)
* [hasCorrelationId](types.command.md#hascorrelationid)
* [hasLegacyTransformer](types.command.md#haslegacytransformer)
* [hasMetadata](types.command.md#hasmetadata)
* [isDeliverable](types.command.md#isdeliverable)
* [isScheduled](types.command.md#isscheduled)
* [overrideLegacyTransformer](types.command.md#overridelegacytransformer)
* [registerLegacyTransformer](types.command.md#registerlegacytransformer)
* [schedule](types.command.md#schedule)
* [setCorrelationId](types.command.md#setcorrelationid)
* [toPlainObject](types.command.md#toplainobject)
* [toString](types.command.md#tostring)
* [transformLegacyProps](types.command.md#transformlegacyprops)
* [validateProps](types.command.md#validateprops)

## Properties

### `Optional` metadata

• **metadata**? : *Record‹string, any›*

*Inherited from [Message](types.message.md).[metadata](types.message.md#optional-metadata)*

*Overrides void*

___

###  targetId

• **targetId**: *string | Stringifiable*

___

###  timestamp

• **timestamp**: *Date*

*Inherited from [Message](types.message.md).[timestamp](types.message.md#timestamp)*

*Overrides void*

## Methods

###  assignMetadata

▸ **assignMetadata**(`props`: Record‹string, any›): *void*

*Inherited from [Message](types.message.md).[assignMetadata](types.message.md#assignmetadata)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | Record‹string, any› |

**Returns:** *void*

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

###  getAssignment

▸ **getAssignment**(): *[Assignment](types.assignment.md) | undefined*

**Returns:** *[Assignment](types.assignment.md) | undefined*

▸ **getAssignment**(): *Assignment | undefined*

**Returns:** *Assignment | undefined*

___

###  getCorrelationId

▸ **getCorrelationId**(`key`: string): *string | undefined*

*Inherited from [Message](types.message.md).[getCorrelationId](types.message.md#getcorrelationid)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *string | undefined*

___

###  getId

▸ **getId**(): *string | [Stringifiable](types.stringifiable.md)*

**Returns:** *string | [Stringifiable](types.stringifiable.md)*

▸ **getId**(): *string | Stringifiable*

**Returns:** *string | Stringifiable*

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

###  getMetadata

▸ **getMetadata**(): *Record‹string, any›*

*Inherited from [Message](types.message.md).[getMetadata](types.message.md#getmetadata)*

*Overrides void*

**Returns:** *Record‹string, any›*

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

###  getTimestamp

▸ **getTimestamp**(): *Date*

*Inherited from [Message](types.message.md).[getTimestamp](types.message.md#gettimestamp)*

*Overrides void*

**Returns:** *Date*

___

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [Serializable](types.serializable.md).[getTypeName](types.serializable.md#gettypename)*

*Overrides void*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  hasCorrelationId

▸ **hasCorrelationId**(`key`: string): *boolean*

*Inherited from [Message](types.message.md).[hasCorrelationId](types.message.md#hascorrelationid)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

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

###  hasMetadata

▸ **hasMetadata**(): *boolean*

*Inherited from [Message](types.message.md).[hasMetadata](types.message.md#hasmetadata)*

*Overrides void*

**Returns:** *boolean*

___

###  isDeliverable

▸ **isDeliverable**(): *boolean*

**Returns:** *boolean*

▸ **isDeliverable**(): *boolean*

**Returns:** *boolean*

___

###  isScheduled

▸ **isScheduled**(): *boolean*

**Returns:** *boolean*

▸ **isScheduled**(): *boolean*

**Returns:** *boolean*

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

###  schedule

▸ **schedule**(`assignment`: [Assignment](types.assignment.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`assignment` | [Assignment](types.assignment.md) |

**Returns:** *void*

▸ **schedule**(`assignment`: Assignment): *void*

**Parameters:**

Name | Type |
------ | ------ |
`assignment` | Assignment |

**Returns:** *void*

___

###  setCorrelationId

▸ **setCorrelationId**(`key`: string, `id`: [Stringifiable](types.stringifiable.md)): *void*

*Inherited from [Message](types.message.md).[setCorrelationId](types.message.md#setcorrelationid)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`id` | [Stringifiable](types.stringifiable.md) |

**Returns:** *void*

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

---
id: "types.message"
title: "@eveble/eveble"
sidebar_label: "Message"
---

## Hierarchy

  ↳ [Serializable](types.serializable.md)

* Serializable

  ↳ **Message**

  ↳ [Command](types.command.md)

  ↳ [Event](types.event.md)

## Implemented by

* [Command](../classes/command.md)
* [DomainException](../classes/domainexception.md)
* [Event](../classes/event.md)
* [Message](../classes/message.md)
* [ScheduleCommand](../classes/schedulecommand.md)
* [UnscheduleCommand](../classes/unschedulecommand.md)

## Index

### Properties

* [metadata](types.message.md#optional-metadata)
* [timestamp](types.message.md#optional-timestamp)

### Methods

* [assignMetadata](types.message.md#assignmetadata)
* [equals](types.message.md#equals)
* [getCorrelationId](types.message.md#getcorrelationid)
* [getLegacyTransformer](types.message.md#getlegacytransformer)
* [getLegacyTransformers](types.message.md#getlegacytransformers)
* [getMetadata](types.message.md#getmetadata)
* [getPropTypes](types.message.md#getproptypes)
* [getPropertyInitializers](types.message.md#getpropertyinitializers)
* [getSchemaVersion](types.message.md#getschemaversion)
* [getTimestamp](types.message.md#gettimestamp)
* [getTypeName](types.message.md#gettypename)
* [hasCorrelationId](types.message.md#hascorrelationid)
* [hasLegacyTransformer](types.message.md#haslegacytransformer)
* [hasMetadata](types.message.md#hasmetadata)
* [overrideLegacyTransformer](types.message.md#overridelegacytransformer)
* [registerLegacyTransformer](types.message.md#registerlegacytransformer)
* [setCorrelationId](types.message.md#setcorrelationid)
* [toPlainObject](types.message.md#toplainobject)
* [toString](types.message.md#tostring)
* [transformLegacyProps](types.message.md#transformlegacyprops)
* [validateProps](types.message.md#validateprops)

## Properties

### `Optional` metadata

• **metadata**? : *Record‹string, any›*

___

### `Optional` timestamp

• **timestamp**? : *Date*

## Methods

###  assignMetadata

▸ **assignMetadata**(`props`: Record‹string, any›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | Record‹string, any› |

**Returns:** *void*

▸ **assignMetadata**(`props`: Record‹string, any›): *void*

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

###  getCorrelationId

▸ **getCorrelationId**(`key`: string): *string | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *string | undefined*

▸ **getCorrelationId**(`key`: string): *string | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *string | undefined*

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

**Returns:** *Record‹string, any›*

▸ **getMetadata**(): *Record‹string, any›*

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

**Returns:** *Date*

▸ **getTimestamp**(): *Date*

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

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *boolean*

▸ **hasCorrelationId**(`key`: string): *boolean*

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

**Returns:** *boolean*

▸ **hasMetadata**(): *boolean*

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

###  setCorrelationId

▸ **setCorrelationId**(`key`: string, `id`: [Stringifiable](types.stringifiable.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`id` | [Stringifiable](types.stringifiable.md) |

**Returns:** *void*

▸ **setCorrelationId**(`key`: string, `id`: Stringifiable): *void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`id` | Stringifiable |

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

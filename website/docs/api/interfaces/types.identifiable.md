---
id: "types.identifiable"
title: "@eveble/eveble"
sidebar_label: "Identifiable"
---

## Hierarchy

  ↳ [Serializable](types.serializable.md)

* Serializable

  ↳ **Identifiable**

  ↳ [Entity](types.entity.md)

## Implemented by

* [Command](../classes/command.md)
* [DomainException](../classes/domainexception.md)
* [Event](../classes/event.md)
* [ScheduleCommand](../classes/schedulecommand.md)
* [UnscheduleCommand](../classes/unschedulecommand.md)

## Index

### Methods

* [equals](types.identifiable.md#equals)
* [getId](types.identifiable.md#getid)
* [getLegacyTransformer](types.identifiable.md#getlegacytransformer)
* [getLegacyTransformers](types.identifiable.md#getlegacytransformers)
* [getPropTypes](types.identifiable.md#getproptypes)
* [getPropertyInitializers](types.identifiable.md#getpropertyinitializers)
* [getSchemaVersion](types.identifiable.md#getschemaversion)
* [getTypeName](types.identifiable.md#gettypename)
* [hasLegacyTransformer](types.identifiable.md#haslegacytransformer)
* [overrideLegacyTransformer](types.identifiable.md#overridelegacytransformer)
* [registerLegacyTransformer](types.identifiable.md#registerlegacytransformer)
* [toPlainObject](types.identifiable.md#toplainobject)
* [toString](types.identifiable.md#tostring)
* [transformLegacyProps](types.identifiable.md#transformlegacyprops)
* [validateProps](types.identifiable.md#validateprops)

## Methods

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

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

*Inherited from [Serializable](types.serializable.md).[getTypeName](types.serializable.md#gettypename)*

*Overrides void*

**Returns:** *[TypeName](../modules/types.md#typename)*

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

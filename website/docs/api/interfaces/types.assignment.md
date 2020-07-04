---
id: "types.assignment"
title: "@eveble/eveble"
sidebar_label: "Assignment"
---

## Hierarchy

  ↳ [Serializable](types.serializable.md)

* Serializable

  ↳ **Assignment**

## Implemented by

* [Assignment](../classes/assignment.md)

## Index

### Properties

* [assignerId](types.assignment.md#assignerid)
* [assignerType](types.assignment.md#assignertype)
* [assignmentId](types.assignment.md#assignmentid)
* [deliverAt](types.assignment.md#deliverat)

### Methods

* [equals](types.assignment.md#equals)
* [getLegacyTransformer](types.assignment.md#getlegacytransformer)
* [getLegacyTransformers](types.assignment.md#getlegacytransformers)
* [getPropTypes](types.assignment.md#getproptypes)
* [getPropertyInitializers](types.assignment.md#getpropertyinitializers)
* [getSchemaVersion](types.assignment.md#getschemaversion)
* [getTypeName](types.assignment.md#gettypename)
* [hasLegacyTransformer](types.assignment.md#haslegacytransformer)
* [overrideLegacyTransformer](types.assignment.md#overridelegacytransformer)
* [registerLegacyTransformer](types.assignment.md#registerlegacytransformer)
* [toPlainObject](types.assignment.md#toplainobject)
* [toString](types.assignment.md#tostring)
* [transformLegacyProps](types.assignment.md#transformlegacyprops)
* [validateProps](types.assignment.md#validateprops)

## Properties

###  assignerId

• **assignerId**: *string | Stringifiable*

___

###  assignerType

• **assignerType**: *[TypeName](../modules/types.md#typename)*

___

###  assignmentId

• **assignmentId**: *string | Stringifiable*

___

###  deliverAt

• **deliverAt**: *Date*

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

---
id: "types.commit"
title: "@eveble/eveble"
sidebar_label: "Commit"
---

## Hierarchy

  ↳ [Serializable](types.serializable.md)

* Serializable

  ↳ **Commit**

## Implemented by

* [Commit](../classes/commit.md)

## Index

### Properties

* [commands](types.commit.md#commands)
* [eventSourceableType](types.commit.md#eventsourceabletype)
* [events](types.commit.md#events)
* [id](types.commit.md#id)
* [insertedAt](types.commit.md#insertedat)
* [receivers](types.commit.md#receivers)
* [sentBy](types.commit.md#sentby)
* [sourceId](types.commit.md#sourceid)
* [version](types.commit.md#version)

### Methods

* [addReceiver](types.commit.md#addreceiver)
* [equals](types.commit.md#equals)
* [getCommandTypeNames](types.commit.md#getcommandtypenames)
* [getEventTypeNames](types.commit.md#geteventtypenames)
* [getLegacyTransformer](types.commit.md#getlegacytransformer)
* [getLegacyTransformers](types.commit.md#getlegacytransformers)
* [getPropTypes](types.commit.md#getproptypes)
* [getPropertyInitializers](types.commit.md#getpropertyinitializers)
* [getReceiver](types.commit.md#getreceiver)
* [getSchemaVersion](types.commit.md#getschemaversion)
* [getTypeName](types.commit.md#gettypename)
* [hasLegacyTransformer](types.commit.md#haslegacytransformer)
* [overrideLegacyTransformer](types.commit.md#overridelegacytransformer)
* [registerLegacyTransformer](types.commit.md#registerlegacytransformer)
* [toPlainObject](types.commit.md#toplainobject)
* [toString](types.commit.md#tostring)
* [transformLegacyProps](types.commit.md#transformlegacyprops)
* [validateProps](types.commit.md#validateprops)

## Properties

###  commands

• **commands**: *Command[]*

___

###  eventSourceableType

• **eventSourceableType**: *string*

___

###  events

• **events**: *Event[]*

___

###  id

• **id**: *string*

___

###  insertedAt

• **insertedAt**: *Date*

___

###  receivers

• **receivers**: *CommitReceiver[]*

___

###  sentBy

• **sentBy**: *string*

___

###  sourceId

• **sourceId**: *string*

___

###  version

• **version**: *number*

## Methods

###  addReceiver

▸ **addReceiver**(`receiver`: [CommitReceiver](types.commitreceiver.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`receiver` | [CommitReceiver](types.commitreceiver.md) |

**Returns:** *void*

▸ **addReceiver**(`receiver`: CommitReceiver): *void*

**Parameters:**

Name | Type |
------ | ------ |
`receiver` | CommitReceiver |

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

###  getCommandTypeNames

▸ **getCommandTypeNames**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

▸ **getCommandTypeNames**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

___

###  getEventTypeNames

▸ **getEventTypeNames**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

▸ **getEventTypeNames**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

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

###  getReceiver

▸ **getReceiver**(`appId`: string): *[CommitReceiver](types.commitreceiver.md) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`appId` | string |

**Returns:** *[CommitReceiver](types.commitreceiver.md) | undefined*

▸ **getReceiver**(`appId`: string): *CommitReceiver | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`appId` | string |

**Returns:** *CommitReceiver | undefined*

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

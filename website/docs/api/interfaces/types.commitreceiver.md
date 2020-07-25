---
id: "types.commitreceiver"
title: "@eveble/eveble"
sidebar_label: "CommitReceiver"
---

## Hierarchy

  ↳ [Serializable](types.serializable.md)

* [Stateful](types.stateful.md)

* Serializable

* Stateful

  ↳ **CommitReceiver**

## Implemented by

* [CommitReceiver](../classes/commitreceiver.md)

## Index

### Properties

* [appId](types.commitreceiver.md#appid)
* [failedAt](types.commitreceiver.md#optional-failedat)
* [publishedAt](types.commitreceiver.md#optional-publishedat)
* [receivedAt](types.commitreceiver.md#receivedat)
* [state](types.commitreceiver.md#state)
* [workerId](types.commitreceiver.md#optional-workerid)

### Methods

* [equals](types.commitreceiver.md#equals)
* [flagAsFailed](types.commitreceiver.md#flagasfailed)
* [flagAsPublished](types.commitreceiver.md#flagaspublished)
* [flagAsReceived](types.commitreceiver.md#flagasreceived)
* [flagAsTimeouted](types.commitreceiver.md#flagastimeouted)
* [getLegacyTransformer](types.commitreceiver.md#getlegacytransformer)
* [getLegacyTransformers](types.commitreceiver.md#getlegacytransformers)
* [getPropTypes](types.commitreceiver.md#getproptypes)
* [getPropertyInitializers](types.commitreceiver.md#getpropertyinitializers)
* [getSchemaVersion](types.commitreceiver.md#getschemaversion)
* [getSelectableStates](types.commitreceiver.md#getselectablestates)
* [getState](types.commitreceiver.md#getstate)
* [getTypeName](types.commitreceiver.md#gettypename)
* [hasLegacyTransformer](types.commitreceiver.md#haslegacytransformer)
* [hasState](types.commitreceiver.md#hasstate)
* [isInOneOfStates](types.commitreceiver.md#isinoneofstates)
* [isInState](types.commitreceiver.md#isinstate)
* [overrideLegacyTransformer](types.commitreceiver.md#overridelegacytransformer)
* [registerLegacyTransformer](types.commitreceiver.md#registerlegacytransformer)
* [setState](types.commitreceiver.md#setstate)
* [toPlainObject](types.commitreceiver.md#toplainobject)
* [toString](types.commitreceiver.md#tostring)
* [transformLegacyProps](types.commitreceiver.md#transformlegacyprops)
* [validateProps](types.commitreceiver.md#validateprops)
* [validateState](types.commitreceiver.md#validatestate)

## Properties

###  appId

• **appId**: *string*

___

### `Optional` failedAt

• **failedAt**? : *Date*

___

### `Optional` publishedAt

• **publishedAt**? : *Date*

___

###  receivedAt

• **receivedAt**: *Date*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Overrides [Stateful](types.stateful.md).[state](types.stateful.md#state)*

___

### `Optional` workerId

• **workerId**? : *string*

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

###  flagAsFailed

▸ **flagAsFailed**(`workerId`: string | [Stringifiable](types.stringifiable.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`workerId` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *void*

▸ **flagAsFailed**(`workerId`: string | Stringifiable): *void*

**Parameters:**

Name | Type |
------ | ------ |
`workerId` | string &#124; Stringifiable |

**Returns:** *void*

___

###  flagAsPublished

▸ **flagAsPublished**(`workerId`: string | [Stringifiable](types.stringifiable.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`workerId` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *void*

▸ **flagAsPublished**(`workerId`: string | Stringifiable): *void*

**Parameters:**

Name | Type |
------ | ------ |
`workerId` | string &#124; Stringifiable |

**Returns:** *void*

___

###  flagAsReceived

▸ **flagAsReceived**(`workerId`: string | [Stringifiable](types.stringifiable.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`workerId` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *void*

▸ **flagAsReceived**(`workerId`: string | Stringifiable): *void*

**Parameters:**

Name | Type |
------ | ------ |
`workerId` | string &#124; Stringifiable |

**Returns:** *void*

___

###  flagAsTimeouted

▸ **flagAsTimeouted**(`workerId`: string | [Stringifiable](types.stringifiable.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`workerId` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *void*

▸ **flagAsTimeouted**(`workerId`: string | Stringifiable): *void*

**Parameters:**

Name | Type |
------ | ------ |
`workerId` | string &#124; Stringifiable |

**Returns:** *void*

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

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Inherited from [Stateful](types.stateful.md).[getState](types.stateful.md#getstate)*

*Overrides void*

**Returns:** *[State](../modules/types.md#state)*

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

###  hasState

▸ **hasState**(): *boolean*

*Inherited from [Stateful](types.stateful.md).[hasState](types.stateful.md#hasstate)*

*Overrides void*

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

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Inherited from [Stateful](types.stateful.md).[validateState](types.stateful.md#validatestate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*

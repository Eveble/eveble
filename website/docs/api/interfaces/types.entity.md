---
id: "types.entity"
title: "@eveble/eveble"
sidebar_label: "Entity"
---

## Hierarchy

  ↳ [Serializable](types.serializable.md)

* [Stateful](types.stateful.md)

* [Statusful](types.statusful.md)

  ↳ [Identifiable](types.identifiable.md)

* Serializable

* Stateful

* Statusful

* Identifiable

  ↳ **Entity**

  ↳ [EventSourceable](types.eventsourceable.md)

## Implemented by

* [Aggregate](../classes/aggregate.md)
* [Entity](../classes/entity.md)
* [EventSourceable](../classes/eventsourceable.md)
* [Process](../classes/process.md)

## Index

### Properties

* [state](types.entity.md#state)
* [status](types.entity.md#status)

### Methods

* [[ROLLBACK_STATE_METHOD_KEY]](types.entity.md#[rollback_state_method_key])
* [[SAVE_STATE_METHOD_KEY]](types.entity.md#[save_state_method_key])
* [equals](types.entity.md#equals)
* [getId](types.entity.md#getid)
* [getLegacyTransformer](types.entity.md#getlegacytransformer)
* [getLegacyTransformers](types.entity.md#getlegacytransformers)
* [getPropTypes](types.entity.md#getproptypes)
* [getPropertyInitializers](types.entity.md#getpropertyinitializers)
* [getSchemaVersion](types.entity.md#getschemaversion)
* [getSelectableStates](types.entity.md#getselectablestates)
* [getSelectableStatuses](types.entity.md#getselectablestatuses)
* [getState](types.entity.md#getstate)
* [getStatus](types.entity.md#getstatus)
* [getTypeName](types.entity.md#gettypename)
* [hasLegacyTransformer](types.entity.md#haslegacytransformer)
* [hasState](types.entity.md#hasstate)
* [hasStatus](types.entity.md#hasstatus)
* [isInOneOfStates](types.entity.md#isinoneofstates)
* [isInOneOfStatuses](types.entity.md#isinoneofstatuses)
* [isInState](types.entity.md#isinstate)
* [isInStatus](types.entity.md#isinstatus)
* [isStateSaved](types.entity.md#isstatesaved)
* [on](types.entity.md#on)
* [overrideLegacyTransformer](types.entity.md#overridelegacytransformer)
* [registerLegacyTransformer](types.entity.md#registerlegacytransformer)
* [setState](types.entity.md#setstate)
* [setStatus](types.entity.md#setstatus)
* [toPlainObject](types.entity.md#toplainobject)
* [toString](types.entity.md#tostring)
* [transformLegacyProps](types.entity.md#transformlegacyprops)
* [validateProps](types.entity.md#validateprops)
* [validateState](types.entity.md#validatestate)
* [validateStatus](types.entity.md#validatestatus)

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

**Returns:** *void*

▸ **[ROLLBACK_STATE_METHOD_KEY]**(): *void*

**Returns:** *void*

___

###  [SAVE_STATE_METHOD_KEY]

▸ **[SAVE_STATE_METHOD_KEY]**(): *void*

**Returns:** *void*

▸ **[SAVE_STATE_METHOD_KEY]**(): *void*

**Returns:** *void*

___

###  equals

▸ **equals**(`other`: any): *boolean*

*Inherited from [Definable](types.definable.md).[equals](types.definable.md#equals)*

*Overrides [Definable](types.definable.md).[equals](types.definable.md#equals)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

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

*Overrides [Versionable](types.versionable.md).[getLegacyTransformer](types.versionable.md#getlegacytransformer)*

**Parameters:**

Name | Type |
------ | ------ |
`schemaVersion` | number |

**Returns:** *[Hook](../modules/types.md#hook)*

___

###  getLegacyTransformers

▸ **getLegacyTransformers**(): *[LegacyTransformers](../modules/types.md#legacytransformers)*

*Inherited from [Versionable](types.versionable.md).[getLegacyTransformers](types.versionable.md#getlegacytransformers)*

*Overrides [Versionable](types.versionable.md).[getLegacyTransformers](types.versionable.md#getlegacytransformers)*

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

___

###  getPropTypes

▸ **getPropTypes**(): *Record‹keyof any, any›*

*Inherited from [Definable](types.definable.md).[getPropTypes](types.definable.md#getproptypes)*

*Overrides [Definable](types.definable.md).[getPropTypes](types.definable.md#getproptypes)*

**Returns:** *Record‹keyof any, any›*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Inherited from [Definable](types.definable.md).[getPropertyInitializers](types.definable.md#getpropertyinitializers)*

*Overrides [Definable](types.definable.md).[getPropertyInitializers](types.definable.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

*Inherited from [Versionable](types.versionable.md).[getSchemaVersion](types.versionable.md#getschemaversion)*

*Overrides [Versionable](types.versionable.md).[getSchemaVersion](types.versionable.md#getschemaversion)*

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

*Overrides [Serializable](types.serializable.md).[getTypeName](types.serializable.md#gettypename)*

**Returns:** *[TypeName](../modules/types.md#typename)*

___

###  hasLegacyTransformer

▸ **hasLegacyTransformer**(`schemaVersion`: number): *boolean*

*Inherited from [Versionable](types.versionable.md).[hasLegacyTransformer](types.versionable.md#haslegacytransformer)*

*Overrides [Versionable](types.versionable.md).[hasLegacyTransformer](types.versionable.md#haslegacytransformer)*

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

**Returns:** *boolean*

▸ **isStateSaved**(): *boolean*

**Returns:** *boolean*

___

###  on

▸ **on**(`action`: string | [Stringifiable](types.stringifiable.md)): *any*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *any*

▸ **on**(`action`: string | Stringifiable): *any*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string &#124; Stringifiable |

**Returns:** *any*

___

###  overrideLegacyTransformer

▸ **overrideLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook)): *void*

*Inherited from [Versionable](types.versionable.md).[overrideLegacyTransformer](types.versionable.md#overridelegacytransformer)*

*Overrides [Versionable](types.versionable.md).[overrideLegacyTransformer](types.versionable.md#overridelegacytransformer)*

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

*Overrides [Versionable](types.versionable.md).[registerLegacyTransformer](types.versionable.md#registerlegacytransformer)*

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

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Inherited from [Definable](types.definable.md).[toPlainObject](types.definable.md#toplainobject)*

*Overrides [Definable](types.definable.md).[toPlainObject](types.definable.md#toplainobject)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  toString

▸ **toString**(): *[TypeName](../modules/types.md#typename) | string*

*Inherited from [Serializable](types.serializable.md).[toString](types.serializable.md#tostring)*

*Overrides [Serializable](types.serializable.md).[toString](types.serializable.md#tostring)*

**Returns:** *[TypeName](../modules/types.md#typename) | string*

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

*Inherited from [Versionable](types.versionable.md).[transformLegacyProps](types.versionable.md#transformlegacyprops)*

*Overrides [Versionable](types.versionable.md).[transformLegacyProps](types.versionable.md#transformlegacyprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *[Props](../modules/types.md#props)*

___

###  validateProps

▸ **validateProps**(`props`: [Props](../modules/types.md#props), `propTypes`: [PropTypes](../modules/types.md#proptypes), `isStrict?`: boolean): *boolean*

*Inherited from [Definable](types.definable.md).[validateProps](types.definable.md#validateprops)*

*Overrides [Definable](types.definable.md).[validateProps](types.definable.md#validateprops)*

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

___

###  validateStatus

▸ **validateStatus**(`statusOrStatuses`: [Status](../modules/types.md#status) | [Status](../modules/types.md#status)[], `error?`: Error): *boolean*

*Inherited from [Statusful](types.statusful.md).[validateStatus](types.statusful.md#validatestatus)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`statusOrStatuses` | [Status](../modules/types.md#status) &#124; [Status](../modules/types.md#status)[] |
`error?` | Error |

**Returns:** *boolean*

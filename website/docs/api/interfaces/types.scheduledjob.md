---
id: "types.scheduledjob"
title: "@eveble/eveble"
sidebar_label: "ScheduledJob"
---

## Hierarchy

* [Definable](types.definable.md)

* [Hookable](types.hookable.md)

* [Stateful](types.stateful.md)

* Definable

* Hookable

* Stateful

  ↳ **ScheduledJob**

## Implemented by

* [ScheduledJob](../classes/scheduledjob.md)

## Index

### Properties

* [completedAt](types.scheduledjob.md#optional-completedat)
* [data](types.scheduledjob.md#data)
* [failedAt](types.scheduledjob.md#optional-failedat)
* [id](types.scheduledjob.md#id)
* [lastRunAt](types.scheduledjob.md#optional-lastrunat)
* [lockedAt](types.scheduledjob.md#optional-lockedat)
* [name](types.scheduledjob.md#name)
* [nextRunAt](types.scheduledjob.md#optional-nextrunat)
* [priority](types.scheduledjob.md#priority)
* [state](types.scheduledjob.md#state)

### Methods

* [equals](types.scheduledjob.md#equals)
* [getActions](types.scheduledjob.md#getactions)
* [getHook](types.scheduledjob.md#gethook)
* [getHookOrThrow](types.scheduledjob.md#gethookorthrow)
* [getHooks](types.scheduledjob.md#gethooks)
* [getPropTypes](types.scheduledjob.md#getproptypes)
* [getPropertyInitializers](types.scheduledjob.md#getpropertyinitializers)
* [getSelectableStates](types.scheduledjob.md#getselectablestates)
* [getState](types.scheduledjob.md#getstate)
* [hasAction](types.scheduledjob.md#hasaction)
* [hasHook](types.scheduledjob.md#hashook)
* [hasState](types.scheduledjob.md#hasstate)
* [isInOneOfStates](types.scheduledjob.md#isinoneofstates)
* [isInState](types.scheduledjob.md#isinstate)
* [overrideHook](types.scheduledjob.md#overridehook)
* [registerHook](types.scheduledjob.md#registerhook)
* [removeHook](types.scheduledjob.md#removehook)
* [setState](types.scheduledjob.md#setstate)
* [toPlainObject](types.scheduledjob.md#toplainobject)
* [validateProps](types.scheduledjob.md#validateprops)
* [validateState](types.scheduledjob.md#validatestate)

## Properties

### `Optional` completedAt

• **completedAt**? : *Date*

___

###  data

• **data**: *Record‹string, any›*

___

### `Optional` failedAt

• **failedAt**? : *Date*

___

###  id

• **id**: *string | Stringifiable*

___

### `Optional` lastRunAt

• **lastRunAt**? : *Date*

___

### `Optional` lockedAt

• **lockedAt**? : *Date*

___

###  name

• **name**: *string*

___

### `Optional` nextRunAt

• **nextRunAt**? : *Date*

___

###  priority

• **priority**: *"lowest" | "low" | "normal" | "high" | "highest" | number*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Overrides [Stateful](types.stateful.md).[state](types.stateful.md#state)*

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

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Inherited from [Hookable](types.hookable.md).[getActions](types.hookable.md#getactions)*

*Overrides void*

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

___

###  getHook

▸ **getHook**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

*Inherited from [Hookable](types.hookable.md).[getHook](types.hookable.md#gethook)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook) | undefined*

___

###  getHookOrThrow

▸ **getHookOrThrow**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

*Inherited from [Hookable](types.hookable.md).[getHookOrThrow](types.hookable.md#gethookorthrow)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook) | undefined*

___

###  getHooks

▸ **getHooks**(`action`: string): *[Mappings](../modules/types.hooks.md#mappings)*

*Inherited from [Hookable](types.hookable.md).[getHooks](types.hookable.md#gethooks)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *[Mappings](../modules/types.hooks.md#mappings)*

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

###  hasAction

▸ **hasAction**(`action`: string): *boolean*

*Inherited from [Hookable](types.hookable.md).[hasAction](types.hookable.md#hasaction)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *boolean*

___

###  hasHook

▸ **hasHook**(`action`: string, `id`: string): *boolean*

*Inherited from [Hookable](types.hookable.md).[hasHook](types.hookable.md#hashook)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

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

###  overrideHook

▸ **overrideHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook)): *void*

*Inherited from [Hookable](types.hookable.md).[overrideHook](types.hookable.md#overridehook)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

___

###  registerHook

▸ **registerHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

*Inherited from [Hookable](types.hookable.md).[registerHook](types.hookable.md#registerhook)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeHook

▸ **removeHook**(`action`: string, `id`: string): *void*

*Inherited from [Hookable](types.hookable.md).[removeHook](types.hookable.md#removehook)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

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

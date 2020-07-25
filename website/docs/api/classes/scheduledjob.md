---
id: "scheduledjob"
title: "ScheduledJob"
sidebar_label: "ScheduledJob"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

* SuperPrototypeSelector‹[StatefulMixin](statefulmixin.md) | [Struct](struct.md), this› & [StatefulMixin](statefulmixin.md)‹this› & [Struct](struct.md)‹this›

* SuperPrototypeSelector‹Struct | StatefulMixin, this› & Struct‹this› & StatefulMixin‹this›

  ↳ **ScheduledJob**

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [Definable](../interfaces/types.definable.md)
* [Hookable](../interfaces/types.hookable.md)
* [ScheduledJob](../interfaces/types.scheduledjob.md)
* Definable
* Hookable
* Stateful
* ScheduledJob

## Index

### Constructors

* [constructor](scheduledjob.md#constructor)

### Properties

* [completedAt](scheduledjob.md#optional-completedat)
* [data](scheduledjob.md#data)
* [failedAt](scheduledjob.md#optional-failedat)
* [id](scheduledjob.md#id)
* [lastRunAt](scheduledjob.md#optional-lastrunat)
* [lockedAt](scheduledjob.md#optional-lockedat)
* [name](scheduledjob.md#name)
* [nextRunAt](scheduledjob.md#optional-nextrunat)
* [priority](scheduledjob.md#priority)
* [state](scheduledjob.md#state)

### Methods

* [equals](scheduledjob.md#equals)
* [getActions](scheduledjob.md#getactions)
* [getHook](scheduledjob.md#gethook)
* [getHookOrThrow](scheduledjob.md#gethookorthrow)
* [getHooks](scheduledjob.md#gethooks)
* [getPropTypes](scheduledjob.md#getproptypes)
* [getPropertyInitializers](scheduledjob.md#getpropertyinitializers)
* [getSelectableStates](scheduledjob.md#getselectablestates)
* [getState](scheduledjob.md#getstate)
* [hasAction](scheduledjob.md#hasaction)
* [hasHook](scheduledjob.md#hashook)
* [hasState](scheduledjob.md#hasstate)
* [isInOneOfStates](scheduledjob.md#isinoneofstates)
* [isInState](scheduledjob.md#isinstate)
* [overrideHook](scheduledjob.md#overridehook)
* [registerHook](scheduledjob.md#registerhook)
* [removeHook](scheduledjob.md#removehook)
* [setState](scheduledjob.md#setstate)
* [toPlainObject](scheduledjob.md#toplainobject)
* [validateProps](scheduledjob.md#validateprops)
* [validateState](scheduledjob.md#validatestate)
* [getPropTypes](scheduledjob.md#static-getproptypes)
* [getPropertyInitializers](scheduledjob.md#static-getpropertyinitializers)

### Object literals

* [STATES](scheduledjob.md#static-states)

## Constructors

###  constructor

\+ **new ScheduledJob**(`props?`: [Props](../modules/types.md#props)): *[ScheduledJob](scheduledjob.md)*

*Overrides [Struct](struct.md).[constructor](struct.md#constructor)*

Creates an instance of ScheduledJob.
Creates an instance of ScheduledJob.

**`remarks`** 
Since were dealing with special cases, mixins and limits of TypeScript, we
use of "invoking multiple base constructors" from polytype to pass props to Struct's
constructor:
https://www.npmjs.com/package/polytype#invoking-multiple-base-constructors

**`remarks`** 
Since were dealing with special cases, mixins and limits of TypeScript, we
use of "invoking multiple base constructors" from polytype to pass props to Struct's
constructor:
https://www.npmjs.com/package/polytype#invoking-multiple-base-constructors

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props?` | [Props](../modules/types.md#props) | Properties of the type required for construction. |

**Returns:** *[ScheduledJob](scheduledjob.md)*

## Properties

### `Optional` completedAt

• **completedAt**? : *Date*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md).[completedAt](../interfaces/types.scheduledjob.md#optional-completedat)*

___

###  data

• **data**: *Record‹string, any›*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md).[data](../interfaces/types.scheduledjob.md#data)*

___

### `Optional` failedAt

• **failedAt**? : *Date*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md).[failedAt](../interfaces/types.scheduledjob.md#optional-failedat)*

___

###  id

• **id**: *string | Guid*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md).[id](../interfaces/types.scheduledjob.md#id)*

___

### `Optional` lastRunAt

• **lastRunAt**? : *Date*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md).[lastRunAt](../interfaces/types.scheduledjob.md#optional-lastrunat)*

___

### `Optional` lockedAt

• **lockedAt**? : *Date*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md).[lockedAt](../interfaces/types.scheduledjob.md#optional-lockedat)*

___

###  name

• **name**: *string*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md).[name](../interfaces/types.scheduledjob.md#name)*

___

### `Optional` nextRunAt

• **nextRunAt**? : *Date*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md).[nextRunAt](../interfaces/types.scheduledjob.md#optional-nextrunat)*

___

###  priority

• **priority**: *"lowest" | "low" | "normal" | "high" | "highest" | number*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md).[priority](../interfaces/types.scheduledjob.md#priority)*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md).[state](../interfaces/types.scheduledjob.md#state)*

*Overrides [StatefulMixin](statefulmixin.md).[state](statefulmixin.md#state)*

## Methods

###  equals

▸ **equals**(`other`: any): *boolean*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

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

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getActions](hookablemixin.md#getactions)*

*Overrides [CreateEmployee](createemployee.md).[getActions](createemployee.md#getactions)*

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

___

###  getHook

▸ **getHook**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

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

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

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

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getHooks](hookablemixin.md#gethooks)*

*Overrides [CreateEmployee](createemployee.md).[getHooks](createemployee.md#gethooks)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *[Mappings](../modules/types.hooks.md#mappings)*

___

###  getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

*Overrides [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getSelectableStates](statefulmixin.md#getselectablestates)*

*Overrides [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getState](statefulmixin.md#getstate)*

*Overrides [Task](task.md).[getState](task.md#getstate)*

**Returns:** *[State](../modules/types.md#state)*

___

###  hasAction

▸ **hasAction**(`action`: string): *boolean*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [HookableMixin](hookablemixin.md).[hasAction](hookablemixin.md#hasaction)*

*Overrides [CreateEmployee](createemployee.md).[hasAction](createemployee.md#hasaction)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *boolean*

___

###  hasHook

▸ **hasHook**(`action`: string, `id`: string): *boolean*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [HookableMixin](hookablemixin.md).[hasHook](hookablemixin.md#hashook)*

*Overrides [CreateEmployee](createemployee.md).[hasHook](createemployee.md#hashook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *boolean*

___

###  hasState

▸ **hasState**(): *boolean*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[hasState](statefulmixin.md#hasstate)*

*Overrides [Task](task.md).[hasState](task.md#hasstate)*

**Returns:** *boolean*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInOneOfStates](statefulmixin.md#isinoneofstates)*

*Overrides [Task](task.md).[isInOneOfStates](task.md#isinoneofstates)*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInState](statefulmixin.md#isinstate)*

*Overrides [Task](task.md).[isInState](task.md#isinstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  overrideHook

▸ **overrideHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook)): *void*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

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

###  registerHook

▸ **registerHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

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

###  removeHook

▸ **removeHook**(`action`: string, `id`: string): *void*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [HookableMixin](hookablemixin.md).[removeHook](hookablemixin.md#removehook)*

*Overrides [CreateEmployee](createemployee.md).[removeHook](createemployee.md#removehook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *void*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[setState](statefulmixin.md#setstate)*

*Overrides [Task](task.md).[setState](task.md#setstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [DefinableMixin](definablemixin.md).[toPlainObject](definablemixin.md#toplainobject)*

*Overrides [CreateEmployee](createemployee.md).[toPlainObject](createemployee.md#toplainobject)*

**Returns:** *[Props](../modules/types.md#props)*

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

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Implementation of [ScheduledJob](../interfaces/types.scheduledjob.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*

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

## Object literals

### `Static` STATES

### ▪ **STATES**: *object*

###  completed

• **completed**: *string* = "completed"

###  enqueued

• **enqueued**: *string* = "enqueued"

###  failed

• **failed**: *string* = "failed"

###  locked

• **locked**: *string* = "locked"

###  removed

• **removed**: *string* = "removed"

###  started

• **started**: *string* = "started"

---
id: "statefulmixin"
title: "StatefulMixin"
sidebar_label: "StatefulMixin"
---

## Hierarchy

* **StatefulMixin**

  ↳ [Client](client.md)

  ↳ [AgendaCommandScheduler](agendacommandscheduler.md)

  ↳ [CommitMongoDBObserver](commitmongodbobserver.md)

## Implements

* [Stateful](../interfaces/types.stateful.md)
* Stateful

## Index

### Properties

* [state](statefulmixin.md#state)

### Methods

* [getSelectableStates](statefulmixin.md#getselectablestates)
* [getState](statefulmixin.md#getstate)
* [hasState](statefulmixin.md#hasstate)
* [isInOneOfStates](statefulmixin.md#isinoneofstates)
* [isInState](statefulmixin.md#isinstate)
* [setState](statefulmixin.md#setstate)
* [validateState](statefulmixin.md#validatestate)

## Properties

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [Stateful](../interfaces/types.stateful.md).[state](../interfaces/types.stateful.md#state)*

## Methods

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

Returns all selectable states.

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

Collection of available states.

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

Returns current state of instance.

**Returns:** *[State](../modules/types.md#state)*

Current state of instance as `string`.

___

###  hasState

▸ **hasState**(): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

Evaluates if target has state set on instance(is not `nil`).

**Returns:** *boolean*

Returns `true` if instance has state set(not `nil`), else `false`.

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

Evaluates if target is in one of expected state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] | Expected states in which one of instance should be. |

**Returns:** *boolean*

Returns true if instance is in one of states, else false.

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

Evaluates if target is in expected state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] | Expected state in which instance should be. |

**Returns:** *boolean*

Returns `true` if instance is in state, else `false`.

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

Sets instance state.

**`throws`** {ValidationError}
Thrown if the provided state does not match one of the selectable states.

**`throws`** {UndefinedStatesError}
Thrown if the instance does not have any states assigned.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [State](../modules/types.md#state) | State to which instance should be set. |

**Returns:** *void*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

Validates if instance is in allowed state(s).

**`throws`** {InvalidStateError}
Thrown if target is not in correct(one of allowed) state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] | Expected states list in one of which instance should be. |
`error?` | [Error](extendableerror.md#static-error) | Optional error instance for case where state does not match expected one. |

**Returns:** *boolean*

Returns `true` if instance is in correct state, else throws.

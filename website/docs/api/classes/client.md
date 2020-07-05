---
id: "client"
title: "Client"
sidebar_label: "Client"
---

## Hierarchy

* [StatefulMixin](statefulmixin.md)

* StatefulMixin

  ↳ **Client**

  ↳ [MongoDBClient](mongodbclient.md)

  ↳ [AgendaClient](agendaclient.md)

## Implements

* [Stateful](../interfaces/types.stateful.md)
* Stateful

## Index

### Constructors

* [constructor](client.md#constructor)

### Properties

* [id](client.md#id)
* [state](client.md#state)

### Methods

* [getId](client.md#getid)
* [getSelectableStates](client.md#getselectablestates)
* [getState](client.md#getstate)
* [hasState](client.md#hasstate)
* [isInOneOfStates](client.md#isinoneofstates)
* [isInState](client.md#isinstate)
* [setState](client.md#setstate)
* [validateState](client.md#validatestate)

### Object literals

* [STATES](client.md#static-states)

## Constructors

###  constructor

\+ **new Client**(`props?`: [Props](../modules/types.md#props)): *[Client](client.md)*

Creates an instance of Client.
Creates an instance of Client.

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

**Returns:** *[Client](client.md)*

## Properties

###  id

• **id**: *string | Guid*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [Stateful](../interfaces/types.stateful.md).[state](../interfaces/types.stateful.md#state)*

*Overrides [StatefulMixin](statefulmixin.md).[state](statefulmixin.md#state)*

## Methods

###  getId

▸ **getId**(): *string | [Guid](guid.md)*

Returns client identifier.

**Returns:** *string | [Guid](guid.md)*

Client's identifier.

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getSelectableStates](statefulmixin.md#getselectablestates)*

*Overrides [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getState](statefulmixin.md#getstate)*

*Overrides [Task](task.md).[getState](task.md#getstate)*

**Returns:** *[State](../modules/types.md#state)*

___

###  hasState

▸ **hasState**(): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[hasState](statefulmixin.md#hasstate)*

*Overrides [Task](task.md).[hasState](task.md#hasstate)*

**Returns:** *boolean*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

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

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInState](statefulmixin.md#isinstate)*

*Overrides [Task](task.md).[isInState](task.md#isinstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[setState](statefulmixin.md#setstate)*

*Overrides [Task](task.md).[setState](task.md#setstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | [Error](extendableerror.md#static-error) |

**Returns:** *boolean*

## Object literals

### `Static` STATES

### ▪ **STATES**: *object*

###  connected

• **connected**: *string* = "connected"

###  constructed

• **constructed**: *string* = "constructed"

###  disconnected

• **disconnected**: *string* = "disconnected"

###  failed

• **failed**: *string* = "failed"

###  initialized

• **initialized**: *string* = "initialized"

###  paused

• **paused**: *string* = "paused"

###  stopped

• **stopped**: *string* = "stopped"

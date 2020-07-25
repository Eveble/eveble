---
id: "types.client"
title: "@eveble/eveble"
sidebar_label: "Client"
---

## Hierarchy

* [Stateful](types.stateful.md)

* Stateful

  ↳ **Client**

## Implemented by

* [AgendaClient](../classes/agendaclient.md)
* [MongoDBClient](../classes/mongodbclient.md)

## Index

### Properties

* [state](types.client.md#state)

### Methods

* [connect](types.client.md#connect)
* [disconnect](types.client.md#disconnect)
* [getId](types.client.md#getid)
* [getSelectableStates](types.client.md#getselectablestates)
* [getState](types.client.md#getstate)
* [hasState](types.client.md#hasstate)
* [initialize](types.client.md#initialize)
* [isConnected](types.client.md#isconnected)
* [isInOneOfStates](types.client.md#isinoneofstates)
* [isInState](types.client.md#isinstate)
* [reconnect](types.client.md#reconnect)
* [setState](types.client.md#setstate)
* [validateState](types.client.md#validatestate)

## Properties

###  state

• **state**: *[State](../modules/types.md#state)*

*Inherited from [Stateful](types.stateful.md).[state](types.stateful.md#state)*

*Overrides void*

## Methods

###  connect

▸ **connect**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **connect**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  disconnect

▸ **disconnect**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **disconnect**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  getId

▸ **getId**(): *string | [Stringifiable](types.stringifiable.md)*

**Returns:** *string | [Stringifiable](types.stringifiable.md)*

▸ **getId**(): *string | Stringifiable*

**Returns:** *string | Stringifiable*

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

###  hasState

▸ **hasState**(): *boolean*

*Inherited from [Stateful](types.stateful.md).[hasState](types.stateful.md#hasstate)*

*Overrides void*

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **initialize**(): *Promise‹void›*

**Returns:** *Promise‹void›*

___

###  isConnected

▸ **isConnected**(): *boolean*

**Returns:** *boolean*

▸ **isConnected**(): *boolean*

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

###  reconnect

▸ **reconnect**(): *Promise‹void›*

**Returns:** *Promise‹void›*

▸ **reconnect**(): *Promise‹void›*

**Returns:** *Promise‹void›*

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

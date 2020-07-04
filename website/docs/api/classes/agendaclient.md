---
id: "agendaclient"
title: "AgendaClient"
sidebar_label: "AgendaClient"
---

## Hierarchy

  ↳ [Client](client.md)

* Client

  ↳ **AgendaClient**

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [Client](../interfaces/types.client.md)
* Stateful
* Client

## Index

### Constructors

* [constructor](agendaclient.md#constructor)

### Properties

* [collectionName](agendaclient.md#readonly-collectionname)
* [databaseName](agendaclient.md#readonly-databasename)
* [id](agendaclient.md#id)
* [mongoClient](agendaclient.md#readonly-mongoclient)
* [options](agendaclient.md#optional-readonly-options)
* [state](agendaclient.md#state)
* [STATES](agendaclient.md#static-states)

### Accessors

* [library](agendaclient.md#library)

### Methods

* [connect](agendaclient.md#connect)
* [disconnect](agendaclient.md#disconnect)
* [getId](agendaclient.md#getid)
* [getInterval](agendaclient.md#getinterval)
* [getSelectableStates](agendaclient.md#getselectablestates)
* [getState](agendaclient.md#getstate)
* [hasState](agendaclient.md#hasstate)
* [initialize](agendaclient.md#initialize)
* [isConnected](agendaclient.md#isconnected)
* [isInOneOfStates](agendaclient.md#isinoneofstates)
* [isInState](agendaclient.md#isinstate)
* [reconnect](agendaclient.md#reconnect)
* [setState](agendaclient.md#setstate)
* [stop](agendaclient.md#stop)
* [validateState](agendaclient.md#validatestate)

## Constructors

###  constructor

\+ **new AgendaClient**(`props?`: [Props](../modules/types.md#props)): *[AgendaClient](agendaclient.md)*

*Inherited from [Client](client.md).[constructor](client.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`props?` | [Props](../modules/types.md#props) |

**Returns:** *[AgendaClient](agendaclient.md)*

## Properties

### `Readonly` collectionName

• **collectionName**: *string*

___

### `Readonly` databaseName

• **databaseName**: *string*

___

###  id

• **id**: *string | Guid*

*Overrides [Client](client.md).[id](client.md#id)*

___

### `Readonly` mongoClient

• **mongoClient**: *MongoDBClient*

___

### `Optional` `Readonly` options

• **options**? : *Record‹string, any›*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [Client](../interfaces/types.client.md).[state](../interfaces/types.client.md#state)*

*Overrides [Client](client.md).[state](client.md#state)*

___

### `Static` STATES

▪ **STATES**: *object*

*Inherited from [Client](client.md).[STATES](client.md#static-states)*

*Overrides void*

#### Type declaration:

* **connected**: *string*

* **constructed**: *string*

* **disconnected**: *string*

* **failed**: *string*

* **initialized**: *string*

* **paused**: *string*

* **stopped**: *string*

## Accessors

###  library

• **get library**(): *Agenda*

Gets library instance.

**Returns:** *Agenda*

`Agenda` instance.

## Methods

###  connect

▸ **connect**(): *Promise‹void›*

*Implementation of [Client](../interfaces/types.client.md)*

Connects to Agenda.

**`async`** 

**`throws`** {Error}
Thrown if Agenda client can't be instantiated.

**Returns:** *Promise‹void›*

___

###  disconnect

▸ **disconnect**(): *Promise‹void›*

*Implementation of [Client](../interfaces/types.client.md)*

Disconnects Agenda client.

**`async`** 

**Returns:** *Promise‹void›*

___

###  getId

▸ **getId**(): *string | [Guid](guid.md)*

*Implementation of [Client](../interfaces/types.client.md)*

*Inherited from [Client](client.md).[getId](client.md#getid)*

*Overrides void*

**Returns:** *string | [Guid](guid.md)*

___

###  getInterval

▸ **getInterval**(): *number | undefined*

Returns frequency at which client will query looking for jobs that need to be processed.

**Returns:** *number | undefined*

Interval for query frequency as a `number`, else `undefined`.

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [Client](../interfaces/types.client.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getSelectableStates](statefulmixin.md#getselectablestates)*

*Overrides [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [Client](../interfaces/types.client.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getState](statefulmixin.md#getstate)*

*Overrides [Task](task.md).[getState](task.md#getstate)*

**Returns:** *[State](../modules/types.md#state)*

___

###  hasState

▸ **hasState**(): *boolean*

*Implementation of [Client](../interfaces/types.client.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[hasState](statefulmixin.md#hasstate)*

*Overrides [Task](task.md).[hasState](task.md#hasstate)*

**Returns:** *boolean*

___

###  initialize

▸ **initialize**(): *Promise‹void›*

*Implementation of [Client](../interfaces/types.client.md)*

Initializes client.

**`async`** 

**Returns:** *Promise‹void›*

___

###  isConnected

▸ **isConnected**(): *boolean*

*Implementation of [Client](../interfaces/types.client.md)*

Evaluates if client is connected to Agenda.

**Returns:** *boolean*

Returns `true` if client is connected, else `false`.

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Client](../interfaces/types.client.md)*

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

*Implementation of [Client](../interfaces/types.client.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInState](statefulmixin.md#isinstate)*

*Overrides [Task](task.md).[isInState](task.md#isinstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  reconnect

▸ **reconnect**(): *Promise‹void›*

*Implementation of [Client](../interfaces/types.client.md)*

Reconnects Agenda.

**`async`** 

**Returns:** *Promise‹void›*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Implementation of [Client](../interfaces/types.client.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[setState](statefulmixin.md#setstate)*

*Overrides [Task](task.md).[setState](task.md#setstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  stop

▸ **stop**(): *Promise‹void›*

Stops Agenda client.

**`async`** 

**Returns:** *Promise‹void›*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Implementation of [Client](../interfaces/types.client.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | [Error](extendableerror.md#static-error) |

**Returns:** *boolean*

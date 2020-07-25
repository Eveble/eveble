---
id: "mongodbclient"
title: "MongoDBClient"
sidebar_label: "MongoDBClient"
---

## Hierarchy

  ↳ [Client](client.md)

* Client

  ↳ **MongoDBClient**

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [Client](../interfaces/types.client.md)
* Stateful
* Client

## Index

### Constructors

* [constructor](mongodbclient.md#constructor)

### Properties

* [_library](mongodbclient.md#optional-_library)
* [databases](mongodbclient.md#databases)
* [id](mongodbclient.md#id)
* [options](mongodbclient.md#optional-options)
* [state](mongodbclient.md#state)
* [url](mongodbclient.md#url)
* [STATES](mongodbclient.md#static-states)

### Accessors

* [library](mongodbclient.md#library)

### Methods

* [connect](mongodbclient.md#connect)
* [disconnect](mongodbclient.md#disconnect)
* [getCollection](mongodbclient.md#getcollection)
* [getDatabase](mongodbclient.md#getdatabase)
* [getId](mongodbclient.md#getid)
* [getSelectableStates](mongodbclient.md#getselectablestates)
* [getState](mongodbclient.md#getstate)
* [hasState](mongodbclient.md#hasstate)
* [initialize](mongodbclient.md#initialize)
* [isConnected](mongodbclient.md#isconnected)
* [isInOneOfStates](mongodbclient.md#isinoneofstates)
* [isInState](mongodbclient.md#isinstate)
* [reconnect](mongodbclient.md#reconnect)
* [setState](mongodbclient.md#setstate)
* [validateState](mongodbclient.md#validatestate)

### Object literals

* [defaultOptions](mongodbclient.md#static-defaultoptions)

## Constructors

###  constructor

\+ **new MongoDBClient**(`props`: Partial‹[MongoDBClient](mongodbclient.md)›): *[MongoDBClient](mongodbclient.md)*

*Overrides [Client](client.md).[constructor](client.md#constructor)*

Creates an instance of MongoDBClient.
Creates an instance of MongoDBClient.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | Partial‹[MongoDBClient](mongodbclient.md)› | Properties of the type required for construction.  |

**Returns:** *[MongoDBClient](mongodbclient.md)*

## Properties

### `Optional` _library

• **_library**? : *MongoClient*

___

###  databases

• **databases**: *MongoDBDatabaseConfig[]*

___

###  id

• **id**: *string | Guid*

*Overrides [Client](client.md).[id](client.md#id)*

___

### `Optional` options

• **options**? : *MongoClientOptions*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [Client](../interfaces/types.client.md).[state](../interfaces/types.client.md#state)*

*Overrides [Client](client.md).[state](client.md#state)*

___

###  url

• **url**: *string*

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

• **get library**(): *MongoClient*

Gets library instance.

**Returns:** *MongoClient*

`MongoClient` instance.

## Methods

###  connect

▸ **connect**(): *Promise‹void›*

*Implementation of [Client](../interfaces/types.client.md)*

Connects to MongoDB.

**`async`** 

**`throws`** {Error}
Thrown if the connection to MongoDB cannot be established.

**Returns:** *Promise‹void›*

___

###  disconnect

▸ **disconnect**(): *Promise‹void›*

*Implementation of [Client](../interfaces/types.client.md)*

Disconnects MongoDB client.

**`async`** 

**Returns:** *Promise‹void›*

___

###  getCollection

▸ **getCollection**(`databaseName`: string, `collectionName`: string): *Collection*

Returns collection from MongoClient.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`databaseName` | string | Database name. |
`collectionName` | string | Collection name. |

**Returns:** *Collection*

`Collection` instance from MongoClient.

___

###  getDatabase

▸ **getDatabase**(`name`: string): *Db*

Returns database from MongoClient.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Database name. |

**Returns:** *Db*

`Db` instance from MongoClient.

___

###  getId

▸ **getId**(): *string | [Guid](guid.md)*

*Implementation of [Client](../interfaces/types.client.md)*

*Inherited from [Client](client.md).[getId](client.md#getid)*

*Overrides void*

**Returns:** *string | [Guid](guid.md)*

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

Evaluates if client is connected to MongoDB.

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

Reconnects to MongoDB.

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

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Implementation of [Client](../interfaces/types.client.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*

## Object literals

### `Static` defaultOptions

### ▪ **defaultOptions**: *object*

###  useNewUrlParser

• **useNewUrlParser**: *boolean* = true

###  useUnifiedTopology

• **useUnifiedTopology**: *boolean* = true

---
id: "commitmongodbobserver"
title: "CommitMongoDBObserver"
sidebar_label: "CommitMongoDBObserver"
---

## Hierarchy

* [StatefulMixin](statefulmixin.md)

* StatefulMixin

  ↳ **CommitMongoDBObserver**

## Implements

* [Stateful](../interfaces/types.stateful.md)
* Stateful

## Index

### Constructors

* [constructor](commitmongodbobserver.md#constructor)

### Properties

* [state](commitmongodbobserver.md#state)
* [stream](commitmongodbobserver.md#stream)

### Methods

* [getSelectableStates](commitmongodbobserver.md#getselectablestates)
* [getState](commitmongodbobserver.md#getstate)
* [hasState](commitmongodbobserver.md#hasstate)
* [initializeEventHandlers](commitmongodbobserver.md#initializeeventhandlers)
* [isInOneOfStates](commitmongodbobserver.md#isinoneofstates)
* [isInState](commitmongodbobserver.md#isinstate)
* [isObserving](commitmongodbobserver.md#isobserving)
* [pauseObserving](commitmongodbobserver.md#pauseobserving)
* [setState](commitmongodbobserver.md#setstate)
* [startObserving](commitmongodbobserver.md#startobserving)
* [stopObserving](commitmongodbobserver.md#stopobserving)
* [validateState](commitmongodbobserver.md#validatestate)

### Object literals

* [STATES](commitmongodbobserver.md#static-states)

## Constructors

###  constructor

\+ **new CommitMongoDBObserver**(): *[CommitMongoDBObserver](commitmongodbobserver.md)*

Creates an instance of CommitMongoDBObserver.
Creates an instance of CommitMongoDBObserver.

**Returns:** *[CommitMongoDBObserver](commitmongodbobserver.md)*

## Properties

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [Stateful](../interfaces/types.stateful.md).[state](../interfaces/types.stateful.md#state)*

*Overrides [StatefulMixin](statefulmixin.md).[state](statefulmixin.md#state)*

___

###  stream

• **stream**: *Cursor‹any› | undefined*

## Methods

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

###  initializeEventHandlers

▸ **initializeEventHandlers**(): *Promise‹void›*

Initializes event handlers.

**`async`** 

**Returns:** *Promise‹void›*

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

###  isObserving

▸ **isObserving**(): *boolean*

Evaluates if Mongo's commit collection is observed.

**Returns:** *boolean*

___

###  pauseObserving

▸ **pauseObserving**(): *Promise‹void›*

Pause observing Mongo's commit collection for changes.

**`async`** 

**Returns:** *Promise‹void›*

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

###  startObserving

▸ **startObserving**(`commitPublisher`: [CommitPublisher](../interfaces/types.commitpublisher.md)): *Promise‹void›*

Observes MongoDB collection for changes and publishes them through CommitPublisher.

**`async`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`commitPublisher` | [CommitPublisher](../interfaces/types.commitpublisher.md) | Instance implementing `CommitPublisher` interface.  |

**Returns:** *Promise‹void›*

___

###  stopObserving

▸ **stopObserving**(): *Promise‹void›*

Stops observing observed Mongo's commit collection for changes.

**`async`** 

**Returns:** *Promise‹void›*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: Error): *boolean*

*Implementation of [Stateful](../interfaces/types.stateful.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | Error |

**Returns:** *boolean*

## Object literals

### `Static` STATES

### ▪ **STATES**: *object*

###  closed

• **closed**: *string* = "closed"

###  created

• **created**: *string* = "created"

###  ended

• **ended**: *string* = "ended"

###  failed

• **failed**: *string* = "failed"

###  finished

• **finished**: *string* = "finished"

###  observing

• **observing**: *string* = "observing"

###  paused

• **paused**: *string* = "paused"

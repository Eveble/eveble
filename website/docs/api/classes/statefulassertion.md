---
id: "statefulassertion"
title: "StatefulAssertion"
sidebar_label: "StatefulAssertion"
---

## Hierarchy

* [Assertion](assertion.md)

* Assertion

  ↳ **StatefulAssertion**

## Index

### Constructors

* [constructor](statefulassertion.md#constructor)

### Properties

* [api](statefulassertion.md#api)
* [asserter](statefulassertion.md#asserter)

### Methods

* [ensureIsInOneOfStates](statefulassertion.md#ensureisinoneofstates)
* [ensureIsInState](statefulassertion.md#ensureisinstate)
* [ensureIsNotInOneOfStates](statefulassertion.md#ensureisnotinoneofstates)
* [ensureIsNotInState](statefulassertion.md#ensureisnotinstate)
* [getApi](statefulassertion.md#getapi)

## Constructors

###  constructor

\+ **new StatefulAssertion**(`asserter`: [Asserter](../interfaces/types.asserter.md)): *[StatefulAssertion](statefulassertion.md)*

*Inherited from [Assertion](assertion.md).[constructor](assertion.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`asserter` | [Asserter](../interfaces/types.asserter.md) |

**Returns:** *[StatefulAssertion](statefulassertion.md)*

## Properties

###  api

• **api**: *Map‹string, Function›* = new Map([
    ['ensure.is.inState', this.ensureIsInState as Function],
    ['ensure.is.not.inState', this.ensureIsNotInState as Function],
    ['ensure.is.inOneOfStates', this.ensureIsInOneOfStates as Function],
    ['ensure.is.not.inOneOfStates', this.ensureIsNotInOneOfStates as Function],
  ])

*Overrides [Assertion](assertion.md).[api](assertion.md#api)*

___

###  asserter

• **asserter**: *[Asserter](../interfaces/types.asserter.md)*

*Inherited from [Assertion](assertion.md).[asserter](assertion.md#asserter)*

*Overrides void*

## Methods

###  ensureIsInOneOfStates

▸ **ensureIsInOneOfStates**(`expectedStates`: [State](../modules/types.md#state)[], `error?`: [DomainError](domainerror.md)): *[Asserter](../interfaces/types.asserter.md)*

Ensures that `Entity` is one of expected states.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectedStates` | [State](../modules/types.md#state)[] | Expected list of states in one of which `Entity` should be. |
`error?` | [DomainError](domainerror.md) | Optional instance of `DomainError` that will be thrown upon failed assertion. |

**Returns:** *[Asserter](../interfaces/types.asserter.md)*

`Asserter` implementation instance.

___

###  ensureIsInState

▸ **ensureIsInState**(`expectedState`: [State](../modules/types.md#state), `error?`: [DomainError](domainerror.md)): *[Asserter](../interfaces/types.asserter.md)*

Ensures that `Entity` is expected state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectedState` | [State](../modules/types.md#state) | Expected state that `Entity` should be in. |
`error?` | [DomainError](domainerror.md) | Optional instance of `DomainError` that will be thrown upon failed assertion. |

**Returns:** *[Asserter](../interfaces/types.asserter.md)*

`Asserter` implementation instance.

___

###  ensureIsNotInOneOfStates

▸ **ensureIsNotInOneOfStates**(`expectedStates`: [State](../modules/types.md#state)[], `error?`: [DomainError](domainerror.md)): *[Asserter](../interfaces/types.asserter.md)*

Ensures that `Entity` is NOT in one of expected states.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectedStates` | [State](../modules/types.md#state)[] | Expected list of states in one of which `Entity` shouldn't be. |
`error?` | [DomainError](domainerror.md) | Optional instance of `DomainError` that will be thrown upon failed assertion. |

**Returns:** *[Asserter](../interfaces/types.asserter.md)*

`Asserter` implementation instance.

___

###  ensureIsNotInState

▸ **ensureIsNotInState**(`expectedState`: [State](../modules/types.md#state), `error?`: [DomainError](domainerror.md)): *[Asserter](../interfaces/types.asserter.md)*

Ensures that `Entity` is NOT in expected state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectedState` | [State](../modules/types.md#state) | Expected state that `Entity` shouldn't be in. |
`error?` | [DomainError](domainerror.md) | Optional instance of `DomainError` that will be thrown upon failed assertion. |

**Returns:** *[Asserter](../interfaces/types.asserter.md)*

`Asserter` implementation instance.

___

###  getApi

▸ **getApi**(): *Map‹string, Function›*

*Inherited from [Assertion](assertion.md).[getApi](assertion.md#getapi)*

*Overrides void*

**Returns:** *Map‹string, Function›*

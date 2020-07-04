---
id: "statusfulassertion"
title: "StatusfulAssertion"
sidebar_label: "StatusfulAssertion"
---

## Hierarchy

* [Assertion](assertion.md)

* Assertion

  ↳ **StatusfulAssertion**

## Index

### Constructors

* [constructor](statusfulassertion.md#constructor)

### Properties

* [api](statusfulassertion.md#api)
* [asserter](statusfulassertion.md#asserter)

### Methods

* [ensureIsInOneOfStatuses](statusfulassertion.md#ensureisinoneofstatuses)
* [ensureIsInStatus](statusfulassertion.md#ensureisinstatus)
* [ensureIsNotInOneOfStatuses](statusfulassertion.md#ensureisnotinoneofstatuses)
* [ensureIsNotInStatus](statusfulassertion.md#ensureisnotinstatus)
* [getApi](statusfulassertion.md#getapi)

## Constructors

###  constructor

\+ **new StatusfulAssertion**(`asserter`: [Asserter](../interfaces/types.asserter.md)): *[StatusfulAssertion](statusfulassertion.md)*

*Inherited from [Assertion](assertion.md).[constructor](assertion.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`asserter` | [Asserter](../interfaces/types.asserter.md) |

**Returns:** *[StatusfulAssertion](statusfulassertion.md)*

## Properties

###  api

• **api**: *Map‹string, Function›* = new Map([
    ['ensure.is.inStatus', this.ensureIsInStatus as Function],
    ['ensure.is.not.inStatus', this.ensureIsNotInStatus as Function],
    ['ensure.is.inOneOfStatuses', this.ensureIsInOneOfStatuses as Function],
    [
      'ensure.is.not.inOneOfStatuses',
      this.ensureIsNotInOneOfStatuses as Function,
    ],
  ])

*Overrides [Assertion](assertion.md).[api](assertion.md#api)*

___

###  asserter

• **asserter**: *[Asserter](../interfaces/types.asserter.md)*

*Inherited from [Assertion](assertion.md).[asserter](assertion.md#asserter)*

*Overrides void*

## Methods

###  ensureIsInOneOfStatuses

▸ **ensureIsInOneOfStatuses**(`expectedStatuses`: [Status](../modules/types.md#status)[], `error?`: [DomainError](domainerror.md)): *[Asserter](../interfaces/types.asserter.md)*

Ensures that `Entity` is one of expected statuses.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectedStatuses` | [Status](../modules/types.md#status)[] | Expected list of statuses in one of which `Entity` should be. |
`error?` | [DomainError](domainerror.md) | Optional instance of `DomainError` that will be thrown upon failed assertion. |

**Returns:** *[Asserter](../interfaces/types.asserter.md)*

`Asserter` implementation instance.

___

###  ensureIsInStatus

▸ **ensureIsInStatus**(`expectedStatus`: [Status](../modules/types.md#status), `error?`: [DomainError](domainerror.md)): *[Asserter](../interfaces/types.asserter.md)*

Ensures that `Entity` is expected status.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectedStatus` | [Status](../modules/types.md#status) | Expected status that `Entity` should be in. |
`error?` | [DomainError](domainerror.md) | Optional instance of `DomainError` that will be thrown upon failed assertion. |

**Returns:** *[Asserter](../interfaces/types.asserter.md)*

`Asserter` implementation instance.

___

###  ensureIsNotInOneOfStatuses

▸ **ensureIsNotInOneOfStatuses**(`expectedStatuses`: [Status](../modules/types.md#status)[], `error?`: [DomainError](domainerror.md)): *[Asserter](../interfaces/types.asserter.md)*

Ensures that `Entity` is NOT in one of expected statuses.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectedStatuses` | [Status](../modules/types.md#status)[] | Expected list of statuses in one of which `Entity` shouldn't be. |
`error?` | [DomainError](domainerror.md) | Optional instance of `DomainError` that will be thrown upon failed assertion. |

**Returns:** *[Asserter](../interfaces/types.asserter.md)*

`Asserter` implementation instance.

___

###  ensureIsNotInStatus

▸ **ensureIsNotInStatus**(`expectedStatus`: [Status](../modules/types.md#status), `error?`: [DomainError](domainerror.md)): *[Asserter](../interfaces/types.asserter.md)*

Ensures that `Entity` is NOT in expected status.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expectedStatus` | [Status](../modules/types.md#status) | Expected status that `Entity` shouldn't be in. |
`error?` | [DomainError](domainerror.md) | Optional instance of `DomainError` that will be thrown upon failed assertion. |

**Returns:** *[Asserter](../interfaces/types.asserter.md)*

`Asserter` implementation instance.

___

###  getApi

▸ **getApi**(): *Map‹string, Function›*

*Inherited from [Assertion](assertion.md).[getApi](assertion.md#getapi)*

*Overrides void*

**Returns:** *Map‹string, Function›*

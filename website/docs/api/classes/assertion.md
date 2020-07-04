---
id: "assertion"
title: "Assertion"
sidebar_label: "Assertion"
---

## Hierarchy

* **Assertion**

  ↳ [AbilityAssertion](abilityassertion.md)

  ↳ [StatefulAssertion](statefulassertion.md)

  ↳ [StatusfulAssertion](statusfulassertion.md)

## Index

### Constructors

* [constructor](assertion.md#constructor)

### Properties

* [api](assertion.md#api)
* [asserter](assertion.md#asserter)

### Methods

* [getApi](assertion.md#getapi)

## Constructors

###  constructor

\+ **new Assertion**(`asserter`: [Asserter](../interfaces/types.asserter.md)): *[Assertion](assertion.md)*

Creates an instance of Assertion.
Creates an instance of Assertion.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`asserter` | [Asserter](../interfaces/types.asserter.md) | Instance implementing `Asserter` interface.  |

**Returns:** *[Assertion](assertion.md)*

## Properties

###  api

• **api**: *Map‹string, Function›*

___

###  asserter

• **asserter**: *Asserter*

## Methods

###  getApi

▸ **getApi**(): *Map‹string, Function›*

Return assertion api for current assertion.

**Returns:** *Map‹string, Function›*

Mappings of exposed api assertions.

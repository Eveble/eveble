---
id: "asserter"
title: "Asserter"
sidebar_label: "Asserter"
---

## Hierarchy

* **Asserter**

## Implements

* [Asserter](../interfaces/types.asserter.md)
* Asserter

## Index

### Constructors

* [constructor](asserter.md#constructor)

### Methods

* [assert](asserter.md#assert)
* [clearAction](asserter.md#clearaction)
* [getAction](asserter.md#getaction)
* [getApi](asserter.md#getapi)
* [getAssertions](asserter.md#getassertions)
* [getEntity](asserter.md#getentity)
* [hasAction](asserter.md#hasaction)
* [hasApi](asserter.md#hasapi)
* [hasAssertion](asserter.md#hasassertion)
* [registerAssertion](asserter.md#registerassertion)
* [setAction](asserter.md#setaction)
* [setEntity](asserter.md#setentity)

## Constructors

###  constructor

\+ **new Asserter**(): *[Asserter](asserter.md)*

Creates an instance of Asserter.
Creates an instance of Asserter.

**`remarks`** 
Current implementation of asserting engine is done in singleton fashion to
have minimal-to-none impact on performance in comparison to other solutions.

**`remarks`** 
Current implementation of asserting engine is done in singleton fashion to
have minimal-to-none impact on performance in comparison to other solutions.

**Returns:** *[Asserter](asserter.md)*

## Methods

###  assert

▸ **assert**(): *any*

*Implementation of [Asserter](../interfaces/types.asserter.md)*

Changes type of current instance to any so it can be used on TypeScript.

**Returns:** *any*

This instance of `Asserter`.

___

###  clearAction

▸ **clearAction**(): *void*

*Implementation of [Asserter](../interfaces/types.asserter.md)*

Clears the action

**Returns:** *void*

___

###  getAction

▸ **getAction**(): *[Stringifiable](../interfaces/types.stringifiable.md) | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | undefined*

*Implementation of [Asserter](../interfaces/types.asserter.md)*

Gets action for which assertion is being made.

**Returns:** *[Stringifiable](../interfaces/types.stringifiable.md) | [MessageType](../interfaces/types.messagetype.md)‹[Message](../interfaces/types.message.md)› | undefined*

Action as string or `Stringifiable` implementation.

___

###  getApi

▸ **getApi**(): *Map‹string, Function›*

*Implementation of [Asserter](../interfaces/types.asserter.md)*

Returns available api.

**Returns:** *Map‹string, Function›*

Mapping of all available methods.

___

###  getAssertions

▸ **getAssertions**(): *[Assertion](../interfaces/types.assertion.md)[]*

*Implementation of [Asserter](../interfaces/types.asserter.md)*

Return registered assertions.

**Returns:** *[Assertion](../interfaces/types.assertion.md)[]*

List of registered instances of `Assertion` interface.

___

###  getEntity

▸ **getEntity**(): *[Entity](../interfaces/types.entity.md)*

*Implementation of [Asserter](../interfaces/types.asserter.md)*

Returns `Entity` instance  target of assertions.

**Returns:** *[Entity](../interfaces/types.entity.md)*

`Entity` instance.

___

###  hasAction

▸ **hasAction**(): *boolean*

*Implementation of [Asserter](../interfaces/types.asserter.md)*

Evaluates if action is set on asserter.

**Returns:** *boolean*

Returns `true` if action is set on asserter, else `false`.

___

###  hasApi

▸ **hasApi**(`pathOrPartial`: any): *boolean*

Evaluates if explicit or partial api is registered on asserter.

**Parameters:**

Name | Type |
------ | ------ |
`pathOrPartial` | any |

**Returns:** *boolean*

Returns `true` if api is registered on asserter, else `false`.

___

###  hasAssertion

▸ **hasAssertion**(`assertionCtor`: any): *boolean*

*Implementation of [Asserter](../interfaces/types.asserter.md)*

Evaluates if assertion type is registered on asserter.

**Parameters:**

Name | Type |
------ | ------ |
`assertionCtor` | any |

**Returns:** *boolean*

Returns `true` if assertion instance is registered on asserter, else `false`.

___

###  registerAssertion

▸ **registerAssertion**(`assertion`: [Assertion](../interfaces/types.assertion.md)): *void*

*Implementation of [Asserter](../interfaces/types.asserter.md)*

Registers assertion extension.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`assertion` | [Assertion](../interfaces/types.assertion.md) | Instance implementing `Assertion` interface.  |

**Returns:** *void*

___

###  setAction

▸ **setAction**(`action`: [Stringifiable](../interfaces/types.stringifiable.md)): *void*

Sets the action for which assertion is being made.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`action` | [Stringifiable](../interfaces/types.stringifiable.md) | Action name or type implementing `MessageableType`.  |

**Returns:** *void*

___

###  setEntity

▸ **setEntity**(`entity`: [Entity](../interfaces/types.entity.md)): *void*

*Implementation of [Asserter](../interfaces/types.asserter.md)*

Sets the `Entity` target of assertions.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entity` | [Entity](../interfaces/types.entity.md) | `Entity` or subclass instance.  |

**Returns:** *void*

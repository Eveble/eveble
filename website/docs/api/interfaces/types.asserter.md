---
id: "types.asserter"
title: "@eveble/eveble"
sidebar_label: "Asserter"
---

## Hierarchy

* **Asserter**

## Implemented by

* [Asserter](../classes/asserter.md)

## Index

### Methods

* [assert](types.asserter.md#assert)
* [clearAction](types.asserter.md#clearaction)
* [getAction](types.asserter.md#getaction)
* [getApi](types.asserter.md#getapi)
* [getAssertions](types.asserter.md#getassertions)
* [getEntity](types.asserter.md#getentity)
* [hasAction](types.asserter.md#hasaction)
* [hasApi](types.asserter.md#hasapi)
* [hasAssertion](types.asserter.md#hasassertion)
* [registerAssertion](types.asserter.md#registerassertion)
* [setAction](types.asserter.md#setaction)
* [setEntity](types.asserter.md#setentity)

## Methods

###  assert

▸ **assert**(): *[Asserter](types.asserter.md)*

**Returns:** *[Asserter](types.asserter.md)*

▸ **assert**(): *Asserter*

**Returns:** *Asserter*

___

###  clearAction

▸ **clearAction**(): *void*

**Returns:** *void*

▸ **clearAction**(): *void*

**Returns:** *void*

___

###  getAction

▸ **getAction**(): *[Stringifiable](types.stringifiable.md) | [MessageType](types.messagetype.md)‹[Message](types.message.md)› | undefined*

**Returns:** *[Stringifiable](types.stringifiable.md) | [MessageType](types.messagetype.md)‹[Message](types.message.md)› | undefined*

▸ **getAction**(): *Stringifiable | MessageType‹Message› | undefined*

**Returns:** *Stringifiable | MessageType‹Message› | undefined*

___

###  getApi

▸ **getApi**(): *Map‹string, Function›*

**Returns:** *Map‹string, Function›*

▸ **getApi**(): *Map‹string, Function›*

**Returns:** *Map‹string, Function›*

___

###  getAssertions

▸ **getAssertions**(): *[Assertion](types.assertion.md)[]*

**Returns:** *[Assertion](types.assertion.md)[]*

▸ **getAssertions**(): *Assertion[]*

**Returns:** *Assertion[]*

___

###  getEntity

▸ **getEntity**(): *[Entity](types.entity.md)*

**Returns:** *[Entity](types.entity.md)*

▸ **getEntity**(): *Entity*

**Returns:** *Entity*

___

###  hasAction

▸ **hasAction**(): *boolean*

**Returns:** *boolean*

▸ **hasAction**(): *boolean*

**Returns:** *boolean*

___

###  hasApi

▸ **hasApi**(`path`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

▸ **hasApi**(`path`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

___

###  hasAssertion

▸ **hasAssertion**(`assertionCtor`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`assertionCtor` | any |

**Returns:** *boolean*

▸ **hasAssertion**(`assertionCtor`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`assertionCtor` | any |

**Returns:** *boolean*

___

###  registerAssertion

▸ **registerAssertion**(`assertion`: [Assertion](types.assertion.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`assertion` | [Assertion](types.assertion.md) |

**Returns:** *void*

▸ **registerAssertion**(`assertion`: Assertion): *void*

**Parameters:**

Name | Type |
------ | ------ |
`assertion` | Assertion |

**Returns:** *void*

___

###  setAction

▸ **setAction**(`action`: [Stringifiable](types.stringifiable.md) | [MessageType](types.messagetype.md)‹[Message](types.message.md)›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | [Stringifiable](types.stringifiable.md) &#124; [MessageType](types.messagetype.md)‹[Message](types.message.md)› |

**Returns:** *void*

▸ **setAction**(`action`: Stringifiable | MessageType‹Message›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`action` | Stringifiable &#124; MessageType‹Message› |

**Returns:** *void*

___

###  setEntity

▸ **setEntity**(`entity`: [Entity](types.entity.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`entity` | [Entity](types.entity.md) |

**Returns:** *void*

▸ **setEntity**(`entity`: Entity): *void*

**Parameters:**

Name | Type |
------ | ------ |
`entity` | Entity |

**Returns:** *void*

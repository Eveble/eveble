---
id: "invalidmessageabletype"
title: "InvalidMessageableType"
sidebar_label: "InvalidMessageableType"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **InvalidMessageableType**

## Index

### Constructors

* [constructor](invalidmessageabletype.md#constructor)

### Properties

* [code](invalidmessageabletype.md#optional-code)
* [message](invalidmessageabletype.md#message)
* [name](invalidmessageabletype.md#name)
* [stack](invalidmessageabletype.md#optional-stack)

### Methods

* [fillErrorProps](invalidmessageabletype.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidMessageableType**(`got`: string): *[InvalidMessageableType](invalidmessageabletype.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | string |

**Returns:** *[InvalidMessageableType](invalidmessageabletype.md)*

## Properties

### `Optional` code

• **code**? : *number*

*Inherited from [StateError](stateerror.md).[code](stateerror.md#optional-code)*

*Overrides [StateError](stateerror.md).[code](stateerror.md#optional-code)*

___

###  message

• **message**: *string*

*Inherited from [StateError](stateerror.md).[message](stateerror.md#message)*

*Overrides void*

___

###  name

• **name**: *string*

*Inherited from [StateError](stateerror.md).[name](stateerror.md#name)*

*Overrides void*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [StateError](stateerror.md).[stack](stateerror.md#optional-stack)*

*Overrides void*

## Methods

###  fillErrorProps

▸ **fillErrorProps**(`props`: [ErrorProps](../modules/types.md#errorprops)): *[ErrorProps](../modules/types.md#errorprops)*

*Inherited from [StateError](stateerror.md).[fillErrorProps](stateerror.md#fillerrorprops)*

*Overrides [StateError](stateerror.md).[fillErrorProps](stateerror.md#fillerrorprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*

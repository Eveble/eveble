---
id: "invalidcontrollererror"
title: "InvalidControllerError"
sidebar_label: "InvalidControllerError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **InvalidControllerError**

## Index

### Constructors

* [constructor](invalidcontrollererror.md#constructor)

### Properties

* [code](invalidcontrollererror.md#optional-code)
* [message](invalidcontrollererror.md#message)
* [name](invalidcontrollererror.md#name)
* [stack](invalidcontrollererror.md#optional-stack)

### Methods

* [fillErrorProps](invalidcontrollererror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidControllerError**(`className`: string): *[InvalidControllerError](invalidcontrollererror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |

**Returns:** *[InvalidControllerError](invalidcontrollererror.md)*

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

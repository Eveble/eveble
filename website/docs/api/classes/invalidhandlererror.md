---
id: "invalidhandlererror"
title: "InvalidHandlerError"
sidebar_label: "InvalidHandlerError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **InvalidHandlerError**

## Index

### Constructors

* [constructor](invalidhandlererror.md#constructor)

### Properties

* [code](invalidhandlererror.md#optional-code)
* [message](invalidhandlererror.md#message)
* [name](invalidhandlererror.md#name)
* [stack](invalidhandlererror.md#optional-stack)

### Methods

* [fillErrorProps](invalidhandlererror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidHandlerError**(`className`: string, `type`: string, `got`: string): *[InvalidHandlerError](invalidhandlererror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`type` | string |
`got` | string |

**Returns:** *[InvalidHandlerError](invalidhandlererror.md)*

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

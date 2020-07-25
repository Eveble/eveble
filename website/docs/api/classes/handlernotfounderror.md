---
id: "handlernotfounderror"
title: "HandlerNotFoundError"
sidebar_label: "HandlerNotFoundError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **HandlerNotFoundError**

## Index

### Constructors

* [constructor](handlernotfounderror.md#constructor)

### Properties

* [code](handlernotfounderror.md#optional-code)
* [message](handlernotfounderror.md#message)
* [name](handlernotfounderror.md#name)
* [stack](handlernotfounderror.md#optional-stack)

### Methods

* [fillErrorProps](handlernotfounderror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new HandlerNotFoundError**(`className`: string, `type`: string): *[HandlerNotFoundError](handlernotfounderror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`type` | string |

**Returns:** *[HandlerNotFoundError](handlernotfounderror.md)*

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

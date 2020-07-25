---
id: "handlerexisterror"
title: "HandlerExistError"
sidebar_label: "HandlerExistError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **HandlerExistError**

## Index

### Constructors

* [constructor](handlerexisterror.md#constructor)

### Properties

* [code](handlerexisterror.md#optional-code)
* [message](handlerexisterror.md#message)
* [name](handlerexisterror.md#name)
* [stack](handlerexisterror.md#optional-stack)

### Methods

* [fillErrorProps](handlerexisterror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new HandlerExistError**(`className`: string, `type`: string): *[HandlerExistError](handlerexisterror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`type` | string |

**Returns:** *[HandlerExistError](handlerexisterror.md)*

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

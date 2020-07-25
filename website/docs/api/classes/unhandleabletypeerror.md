---
id: "unhandleabletypeerror"
title: "UnhandleableTypeError"
sidebar_label: "UnhandleableTypeError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **UnhandleableTypeError**

## Index

### Constructors

* [constructor](unhandleabletypeerror.md#constructor)

### Properties

* [code](unhandleabletypeerror.md#optional-code)
* [message](unhandleabletypeerror.md#message)
* [name](unhandleabletypeerror.md#name)
* [stack](unhandleabletypeerror.md#optional-stack)

### Methods

* [fillErrorProps](unhandleabletypeerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new UnhandleableTypeError**(`className`: string, `handleableTypes`: string, `got`: string): *[UnhandleableTypeError](unhandleabletypeerror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`handleableTypes` | string |
`got` | string |

**Returns:** *[UnhandleableTypeError](unhandleabletypeerror.md)*

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

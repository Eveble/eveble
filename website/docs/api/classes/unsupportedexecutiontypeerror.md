---
id: "unsupportedexecutiontypeerror"
title: "UnsupportedExecutionTypeError"
sidebar_label: "UnsupportedExecutionTypeError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **UnsupportedExecutionTypeError**

## Index

### Constructors

* [constructor](unsupportedexecutiontypeerror.md#constructor)

### Properties

* [code](unsupportedexecutiontypeerror.md#optional-code)
* [message](unsupportedexecutiontypeerror.md#message)
* [name](unsupportedexecutiontypeerror.md#name)
* [stack](unsupportedexecutiontypeerror.md#optional-stack)

### Methods

* [fillErrorProps](unsupportedexecutiontypeerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new UnsupportedExecutionTypeError**(`className`: string, `execution`: string): *[UnsupportedExecutionTypeError](unsupportedexecutiontypeerror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`execution` | string |

**Returns:** *[UnsupportedExecutionTypeError](unsupportedexecutiontypeerror.md)*

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

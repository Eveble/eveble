---
id: "unparsablevalueerror"
title: "UnparsableValueError"
sidebar_label: "UnparsableValueError"
---

## Hierarchy

  ↳ [SerializationError](serializationerror.md)

* SerializationError

  ↳ **UnparsableValueError**

## Index

### Constructors

* [constructor](unparsablevalueerror.md#constructor)

### Properties

* [code](unparsablevalueerror.md#optional-code)
* [message](unparsablevalueerror.md#message)
* [name](unparsablevalueerror.md#name)
* [stack](unparsablevalueerror.md#optional-stack)

### Methods

* [fillErrorProps](unparsablevalueerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new UnparsableValueError**(`got`: string): *[UnparsableValueError](unparsablevalueerror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | string |

**Returns:** *[UnparsableValueError](unparsablevalueerror.md)*

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

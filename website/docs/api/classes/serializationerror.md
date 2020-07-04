---
id: "serializationerror"
title: "SerializationError"
sidebar_label: "SerializationError"
---

SERIALIZATION ERRORS

## Hierarchy

  ↳ [ExtendableError](extendableerror.md)

* ExtendableError

  ↳ **SerializationError**

  ↳ [UnparsableValueError](unparsablevalueerror.md)

## Index

### Constructors

* [constructor](serializationerror.md#constructor)

### Properties

* [code](serializationerror.md#optional-code)
* [message](serializationerror.md#message)
* [name](serializationerror.md#name)
* [stack](serializationerror.md#optional-stack)

### Methods

* [fillErrorProps](serializationerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new SerializationError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[SerializationError](serializationerror.md)*

*Inherited from [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[SerializationError](serializationerror.md)*

## Properties

### `Optional` code

• **code**? : *number*

*Inherited from [ExtendableError](extendableerror.md).[code](extendableerror.md#optional-code)*

*Overrides [NoQuittingFoolError](noquittingfoolerror.md).[code](noquittingfoolerror.md#optional-code)*

___

###  message

• **message**: *string*

*Inherited from [ExtendableError](extendableerror.md).[message](extendableerror.md#message)*

*Overrides void*

___

###  name

• **name**: *string*

*Inherited from [ExtendableError](extendableerror.md).[name](extendableerror.md#name)*

*Overrides void*

___

### `Optional` stack

• **stack**? : *string*

*Inherited from [ExtendableError](extendableerror.md).[stack](extendableerror.md#optional-stack)*

*Overrides void*

## Methods

###  fillErrorProps

▸ **fillErrorProps**(`props`: [ErrorProps](../modules/types.md#errorprops)): *[ErrorProps](../modules/types.md#errorprops)*

*Inherited from [ExtendableError](extendableerror.md).[fillErrorProps](extendableerror.md#fillerrorprops)*

*Overrides [NoQuittingFoolError](noquittingfoolerror.md).[fillErrorProps](noquittingfoolerror.md#fillerrorprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*

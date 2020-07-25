---
id: "serializationerror"
title: "SerializationError"
sidebar_label: "SerializationError"
---

SERIALIZATION ERRORS

## Hierarchy

* ExtendableError

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

*Inherited from [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[SerializationError](serializationerror.md)*

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

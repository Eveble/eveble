---
id: "invalidtransportiderror"
title: "InvalidTransportIdError"
sidebar_label: "InvalidTransportIdError"
---

## Hierarchy

  ↳ [LoggingError](loggingerror.md)

* LoggingError

  ↳ **InvalidTransportIdError**

## Index

### Constructors

* [constructor](invalidtransportiderror.md#constructor)

### Properties

* [code](invalidtransportiderror.md#optional-code)
* [message](invalidtransportiderror.md#message)
* [name](invalidtransportiderror.md#name)
* [stack](invalidtransportiderror.md#optional-stack)

### Methods

* [fillErrorProps](invalidtransportiderror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InvalidTransportIdError**(`got`: string): *[InvalidTransportIdError](invalidtransportiderror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`got` | string |

**Returns:** *[InvalidTransportIdError](invalidtransportiderror.md)*

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

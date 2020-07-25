---
id: "loggingerror"
title: "LoggingError"
sidebar_label: "LoggingError"
---

## Hierarchy

* ExtendableError

* ExtendableError

  ↳ **LoggingError**

  ↳ [InvalidTransportIdError](invalidtransportiderror.md)

  ↳ [TransportExistsError](transportexistserror.md)

## Index

### Constructors

* [constructor](loggingerror.md#constructor)

### Properties

* [code](loggingerror.md#optional-code)
* [message](loggingerror.md#message)
* [name](loggingerror.md#name)
* [stack](loggingerror.md#optional-stack)

### Methods

* [fillErrorProps](loggingerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new LoggingError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[LoggingError](loggingerror.md)*

*Inherited from [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[LoggingError](loggingerror.md)*

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

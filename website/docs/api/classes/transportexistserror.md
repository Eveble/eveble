---
id: "transportexistserror"
title: "TransportExistsError"
sidebar_label: "TransportExistsError"
---

## Hierarchy

  ↳ [LoggingError](loggingerror.md)

* LoggingError

  ↳ **TransportExistsError**

## Index

### Constructors

* [constructor](transportexistserror.md#constructor)

### Properties

* [code](transportexistserror.md#optional-code)
* [message](transportexistserror.md#message)
* [name](transportexistserror.md#name)
* [stack](transportexistserror.md#optional-stack)

### Methods

* [fillErrorProps](transportexistserror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new TransportExistsError**(`id`: string): *[TransportExistsError](transportexistserror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *[TransportExistsError](transportexistserror.md)*

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

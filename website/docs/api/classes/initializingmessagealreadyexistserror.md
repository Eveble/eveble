---
id: "initializingmessagealreadyexistserror"
title: "InitializingMessageAlreadyExistsError"
sidebar_label: "InitializingMessageAlreadyExistsError"
---

## Hierarchy

  ↳ [HandlingError](handlingerror.md)

* HandlingError

  ↳ **InitializingMessageAlreadyExistsError**

## Index

### Constructors

* [constructor](initializingmessagealreadyexistserror.md#constructor)

### Properties

* [code](initializingmessagealreadyexistserror.md#optional-code)
* [message](initializingmessagealreadyexistserror.md#message)
* [name](initializingmessagealreadyexistserror.md#name)
* [stack](initializingmessagealreadyexistserror.md#optional-stack)

### Methods

* [fillErrorProps](initializingmessagealreadyexistserror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InitializingMessageAlreadyExistsError**(`className`: string, `existingMsgName`: string, `newMsgName`: string): *[InitializingMessageAlreadyExistsError](initializingmessagealreadyexistserror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`className` | string |
`existingMsgName` | string |
`newMsgName` | string |

**Returns:** *[InitializingMessageAlreadyExistsError](initializingmessagealreadyexistserror.md)*

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

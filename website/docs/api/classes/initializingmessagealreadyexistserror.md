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

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

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

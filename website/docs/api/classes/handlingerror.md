---
id: "handlingerror"
title: "HandlingError"
sidebar_label: "HandlingError"
---

HANDLING ERRORS

## Hierarchy

  ↳ [ExtendableError](extendableerror.md)

* ExtendableError

  ↳ **HandlingError**

  ↳ [UnhandleableTypeError](unhandleabletypeerror.md)

  ↳ [InvalidControllerError](invalidcontrollererror.md)

  ↳ [InvalidHandlerError](invalidhandlererror.md)

  ↳ [HandlerExistError](handlerexisterror.md)

  ↳ [HandlerNotFoundError](handlernotfounderror.md)

  ↳ [UnsupportedExecutionTypeError](unsupportedexecutiontypeerror.md)

  ↳ [InvalidMessageableType](invalidmessageabletype.md)

  ↳ [InitializingMessageAlreadyExistsError](initializingmessagealreadyexistserror.md)

## Index

### Constructors

* [constructor](handlingerror.md#constructor)

### Properties

* [code](handlingerror.md#optional-code)
* [message](handlingerror.md#message)
* [name](handlingerror.md#name)
* [stack](handlingerror.md#optional-stack)

### Methods

* [fillErrorProps](handlingerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new HandlingError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[HandlingError](handlingerror.md)*

*Inherited from [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[HandlingError](handlingerror.md)*

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

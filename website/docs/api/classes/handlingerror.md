---
id: "handlingerror"
title: "HandlingError"
sidebar_label: "HandlingError"
---

HANDLING ERRORS

## Hierarchy

* ExtendableError

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

*Inherited from [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[HandlingError](handlingerror.md)*

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

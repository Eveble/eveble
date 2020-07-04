---
id: "extendableerror"
title: "ExtendableError"
sidebar_label: "ExtendableError"
---

## Hierarchy

* [Error](extendableerror.md#static-error)

* [Error](extendableerror.md#static-error)

  ↳ **ExtendableError**

  ↳ [StateError](stateerror.md)

  ↳ [HookError](hookerror.md)

  ↳ [VersionableError](versionableerror.md)

  ↳ [UndefinedLoggableTargetError](undefinedloggabletargeterror.md)

  ↳ [KernelError](kernelerror.md)

  ↳ [TypeError](typeerror.md)

  ↳ [ModuleError](moduleerror.md)

  ↳ [InjectorError](injectorerror.md)

  ↳ [AppError](apperror.md)

  ↳ [LoggingError](loggingerror.md)

  ↳ [InvalidTypeNameError](invalidtypenameerror.md)

  ↳ [StatusError](statuserror.md)

  ↳ [AssertionApiAlreadyExistsError](assertionapialreadyexistserror.md)

  ↳ [HandlingError](handlingerror.md)

  ↳ [SerializationError](serializationerror.md)

## Index

### Constructors

* [constructor](extendableerror.md#constructor)

### Properties

* [code](extendableerror.md#optional-code)
* [message](extendableerror.md#message)
* [name](extendableerror.md#name)
* [stack](extendableerror.md#optional-stack)
* [Error](extendableerror.md#static-error)

### Methods

* [fillErrorProps](extendableerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new ExtendableError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[ExtendableError](extendableerror.md)*

Creates an instance of ExtendableError.
Creates an instance of ExtendableError.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) | Error message as string or object containing message with other properties matching prop types.  |

**Returns:** *[ExtendableError](extendableerror.md)*

## Properties

### `Optional` code

• **code**? : *number*

___

###  message

• **message**: *string*

*Overrides void*

___

###  name

• **name**: *string*

*Overrides void*

___

### `Optional` stack

• **stack**? : *string*

*Overrides void*

___

### `Static` Error

▪ **Error**: *ErrorConstructor*

## Methods

###  fillErrorProps

▸ **fillErrorProps**(`props`: [ErrorProps](../modules/types.md#errorprops)): *[ErrorProps](../modules/types.md#errorprops)*

Fills missing error properties.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | [ErrorProps](../modules/types.md#errorprops) | Provided properties durning construction of error. |

**Returns:** *[ErrorProps](../modules/types.md#errorprops)*

Filled properties Object for ExtendableError instance.

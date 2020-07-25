---
id: "assertionapialreadyexistserror"
title: "AssertionApiAlreadyExistsError"
sidebar_label: "AssertionApiAlreadyExistsError"
---

## Hierarchy

* ExtendableError

* ExtendableError

  ↳ **AssertionApiAlreadyExistsError**

## Index

### Constructors

* [constructor](assertionapialreadyexistserror.md#constructor)

### Properties

* [code](assertionapialreadyexistserror.md#optional-code)
* [message](assertionapialreadyexistserror.md#message)
* [name](assertionapialreadyexistserror.md#name)
* [stack](assertionapialreadyexistserror.md#optional-stack)

### Methods

* [fillErrorProps](assertionapialreadyexistserror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new AssertionApiAlreadyExistsError**(`asserterName`: string, `assertionName`: string, `path`: string): *[AssertionApiAlreadyExistsError](assertionapialreadyexistserror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`asserterName` | string |
`assertionName` | string |
`path` | string |

**Returns:** *[AssertionApiAlreadyExistsError](assertionapialreadyexistserror.md)*

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

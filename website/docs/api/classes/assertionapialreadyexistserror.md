---
id: "assertionapialreadyexistserror"
title: "AssertionApiAlreadyExistsError"
sidebar_label: "AssertionApiAlreadyExistsError"
---

## Hierarchy

  ↳ [ExtendableError](extendableerror.md)

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

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

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

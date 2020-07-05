---
id: "hookalreadyexistserror"
title: "HookAlreadyExistsError"
sidebar_label: "HookAlreadyExistsError"
---

## Hierarchy

  ↳ [HookError](hookerror.md)

* HookError

  ↳ **HookAlreadyExistsError**

## Index

### Constructors

* [constructor](hookalreadyexistserror.md#constructor)

### Properties

* [code](hookalreadyexistserror.md#optional-code)
* [message](hookalreadyexistserror.md#message)
* [name](hookalreadyexistserror.md#name)
* [stack](hookalreadyexistserror.md#optional-stack)

### Methods

* [fillErrorProps](hookalreadyexistserror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new HookAlreadyExistsError**(`typeName`: [TypeName](../modules/types.md#typename), `action`: string, `id`: string): *[HookAlreadyExistsError](hookalreadyexistserror.md)*

*Overrides [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`action` | string |
`id` | string |

**Returns:** *[HookAlreadyExistsError](hookalreadyexistserror.md)*

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

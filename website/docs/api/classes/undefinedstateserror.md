---
id: "undefinedstateserror"
title: "UndefinedStatesError"
sidebar_label: "UndefinedStatesError"
---

## Hierarchy

  ↳ [StateError](stateerror.md)

* StateError

  ↳ **UndefinedStatesError**

## Index

### Constructors

* [constructor](undefinedstateserror.md#constructor)

### Properties

* [code](undefinedstateserror.md#optional-code)
* [message](undefinedstateserror.md#message)
* [name](undefinedstateserror.md#name)
* [stack](undefinedstateserror.md#optional-stack)

### Methods

* [fillErrorProps](undefinedstateserror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new UndefinedStatesError**(`typeName`: [TypeName](../modules/types.md#typename)): *[UndefinedStatesError](undefinedstateserror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *[UndefinedStatesError](undefinedstateserror.md)*

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

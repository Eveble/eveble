---
id: "undefinedstatuseserror"
title: "UndefinedStatusesError"
sidebar_label: "UndefinedStatusesError"
---

## Hierarchy

  ↳ [StatusError](statuserror.md)

* StatusError

  ↳ **UndefinedStatusesError**

## Index

### Constructors

* [constructor](undefinedstatuseserror.md#constructor)

### Properties

* [code](undefinedstatuseserror.md#optional-code)
* [message](undefinedstatuseserror.md#message)
* [name](undefinedstatuseserror.md#name)
* [stack](undefinedstatuseserror.md#optional-stack)

### Methods

* [fillErrorProps](undefinedstatuseserror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new UndefinedStatusesError**(`typeName`: [TypeName](../modules/types.md#typename)): *[UndefinedStatusesError](undefinedstatuseserror.md)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *[UndefinedStatusesError](undefinedstatuseserror.md)*

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

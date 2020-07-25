---
id: "injectorerror"
title: "InjectorError"
sidebar_label: "InjectorError"
---

## Hierarchy

* ExtendableError

* ExtendableError

  ↳ **InjectorError**

  ↳ [InvalidEventSourceableError](invalideventsourceableerror.md)

## Index

### Constructors

* [constructor](injectorerror.md#constructor)

### Properties

* [code](injectorerror.md#optional-code)
* [message](injectorerror.md#message)
* [name](injectorerror.md#name)
* [stack](injectorerror.md#optional-stack)

### Methods

* [fillErrorProps](injectorerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new InjectorError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[InjectorError](injectorerror.md)*

*Inherited from [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[InjectorError](injectorerror.md)*

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

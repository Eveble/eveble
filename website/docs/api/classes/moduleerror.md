---
id: "moduleerror"
title: "ModuleError"
sidebar_label: "ModuleError"
---

## Hierarchy

  ↳ [ExtendableError](extendableerror.md)

* ExtendableError

  ↳ **ModuleError**

  ↳ [AppMissingError](appmissingerror.md)

  ↳ [InjectorMissingError](injectormissingerror.md)

  ↳ [InvalidModuleError](invalidmoduleerror.md)

  ↳ [InvalidConfigError](invalidconfigerror.md)

  ↳ [InvalidEnvironmentError](invalidenvironmenterror.md)

## Index

### Constructors

* [constructor](moduleerror.md#constructor)

### Properties

* [code](moduleerror.md#optional-code)
* [message](moduleerror.md#message)
* [name](moduleerror.md#name)
* [stack](moduleerror.md#optional-stack)

### Methods

* [fillErrorProps](moduleerror.md#fillerrorprops)

## Constructors

###  constructor

\+ **new ModuleError**(`messageOrProps?`: string | [ErrorProps](../modules/types.md#errorprops)): *[ModuleError](moduleerror.md)*

*Inherited from [ExtendableError](extendableerror.md).[constructor](extendableerror.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[ModuleError](moduleerror.md)*

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

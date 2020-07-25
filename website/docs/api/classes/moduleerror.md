---
id: "moduleerror"
title: "ModuleError"
sidebar_label: "ModuleError"
---

## Hierarchy

* ExtendableError

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

*Inherited from [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

*Overrides [StateError](stateerror.md).[constructor](stateerror.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`messageOrProps?` | string &#124; [ErrorProps](../modules/types.md#errorprops) |

**Returns:** *[ModuleError](moduleerror.md)*

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

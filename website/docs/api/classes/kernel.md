---
id: "kernel"
title: "Kernel"
sidebar_label: "Kernel"
---

## Hierarchy

* **Kernel**

## Index

### Constructors

* [constructor](kernel.md#constructor)

### Properties

* [injector](kernel.md#optional-injector)

### Accessors

* [asserter](kernel.md#asserter)
* [converter](kernel.md#converter)
* [describer](kernel.md#describer)
* [library](kernel.md#library)
* [serializer](kernel.md#serializer)
* [validator](kernel.md#validator)

### Methods

* [disableValidation](kernel.md#disablevalidation)
* [enableValidation](kernel.md#enablevalidation)
* [isConverting](kernel.md#isconverting)
* [isValidating](kernel.md#isvalidating)
* [setAsserter](kernel.md#setasserter)
* [setConverter](kernel.md#setconverter)
* [setDescriber](kernel.md#setdescriber)
* [setInjector](kernel.md#setinjector)
* [setLibrary](kernel.md#setlibrary)
* [setSerializer](kernel.md#setserializer)
* [setValidator](kernel.md#setvalidator)

## Constructors

###  constructor

\+ **new Kernel**(`converter`: [Converter](../interfaces/types.converter.md), `validator`: [Validator](../modules/types.md#validator), `describer`: [Describer](../modules/types.md#describer), `library`: [Library](../interfaces/types.library.md), `config`: [KernelConfig](../modules/types.md#kernelconfig)): *[Kernel](kernel.md)*

Creates an instance of Kernel.
Creates an instance of Kernel.

**`remarks`** 
Allows to have a single point of entry for low level components of the framework.
Most are used on runtime, and would as constructor dependencies/property dependencies -
cause a lot of unnecessary complexity on construction or initialization of components.

**`remarks`** 
Allows to have a single point of entry for low level components of the framework.
Most are used on runtime, and would as constructor dependencies/property dependencies -
cause a lot of unnecessary complexity on construction or initialization of components.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`converter` | [Converter](../interfaces/types.converter.md) | `Converter` implementation. |
`validator` | [Validator](../modules/types.md#validator) | `Validator` implementation. |
`describer` | [Describer](../modules/types.md#describer) | `Describer` implementation. |
`library` | [Library](../interfaces/types.library.md) | `Library` implementation. |
`config` | [KernelConfig](../modules/types.md#kernelconfig) | Kernel configuration.  |

**Returns:** *[Kernel](kernel.md)*

## Properties

### `Optional` injector

• **injector**? : *Injector*

## Accessors

###  asserter

• **get asserter**(): *Asserter*

Returns asserter assigned to Kernel or one from IoC container(if container is assigned to Kernel).

**Returns:** *Asserter*

Instance implementing `types.Asserter` interface.

___

###  converter

• **get converter**(): *Converter*

Returns converter assigned to Kernel or one from IoC container(if container is assigned to Kernel).

**Returns:** *Converter*

Instance implementing `types.Converter` interface.

___

###  describer

• **get describer**(): *[Describer](../modules/types.md#describer)*

Returns describer assigned to Kernel or one from IoC container(if container is assigned to Kernel).

**Returns:** *[Describer](../modules/types.md#describer)*

Instance implementing `types.Describer` interface.

___

###  library

• **get library**(): *Library*

Returns library assigned to Kernel or one from IoC container(if container is assigned to Kernel).

**Returns:** *Library*

Instance implementing `types.Library` interface.

___

###  serializer

• **get serializer**(): *Serializer*

Returns serializer assigned to Kernel or one from IoC container(if container is assigned to Kernel).

**Returns:** *Serializer*

Instance implementing `types.Serializer` interface.

___

###  validator

• **get validator**(): *[Validator](../modules/types.md#validator)*

Returns validator assigned to Kernel or one from IoC container(if container is assigned to Kernel).

**Returns:** *[Validator](../modules/types.md#validator)*

Instance implementing `types.Validator` interface.

## Methods

###  disableValidation

▸ **disableValidation**(): *void*

Disables validation.

**Returns:** *void*

___

###  enableValidation

▸ **enableValidation**(): *void*

Enable validation.

**Returns:** *void*

___

###  isConverting

▸ **isConverting**(): *boolean*

Evaluates if conversion is done on runtime.

**Returns:** *boolean*

Returns `true` if conversion is done on runtime, else `false`.

___

###  isValidating

▸ **isValidating**(): *boolean*

Evaluates if validation is done on runtime.

**Returns:** *boolean*

Returns `true` if validation is done on runtime, else `false`.

___

###  setAsserter

▸ **setAsserter**(`asserter`: [Asserter](../interfaces/types.asserter.md)): *void*

Sets asserter on Kernel and IoC container(if container is assigned to Kernel).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`asserter` | [Asserter](../interfaces/types.asserter.md) | Instance implementing `Asserter` interface.  |

**Returns:** *void*

___

###  setConverter

▸ **setConverter**(`converter`: [Converter](../interfaces/types.converter.md)): *void*

Sets converter on Kernel and IoC container(if container is assigned to Kernel).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`converter` | [Converter](../interfaces/types.converter.md) | Instance implementing `Converter` interface.  |

**Returns:** *void*

___

###  setDescriber

▸ **setDescriber**(`describer`: [Describer](../modules/types.md#describer)): *void*

Sets describer on Kernel and IoC container(if container is assigned to Kernel).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`describer` | [Describer](../modules/types.md#describer) | Instance implementing `Describer` interface.  |

**Returns:** *void*

___

###  setInjector

▸ **setInjector**(`injector`: [Injector](../interfaces/types.injector.md)): *void*

Sets the IoC container on Kernel.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`injector` | [Injector](../interfaces/types.injector.md) | IoC container implementing `Container` interface.  |

**Returns:** *void*

___

###  setLibrary

▸ **setLibrary**(`library`: [Library](../interfaces/types.library.md)): *void*

Sets library on Kernel and IoC container(if container is assigned to Kernel).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`library` | [Library](../interfaces/types.library.md) | Instance implementing `Library` interface.  |

**Returns:** *void*

___

###  setSerializer

▸ **setSerializer**(`serializer`: [Serializer](../interfaces/types.serializer.md)): *void*

Sets serializer on Kernel and IoC container(if container is assigned to Kernel).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`serializer` | [Serializer](../interfaces/types.serializer.md) | Instance implementing `Serializer` interface.  |

**Returns:** *void*

___

###  setValidator

▸ **setValidator**(`validator`: [Validator](../modules/types.md#validator)): *void*

Sets validator on Kernel and IoC container(if container is assigned to Kernel).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`validator` | [Validator](../modules/types.md#validator) | Instance implementing `Validator` interface.  |

**Returns:** *void*

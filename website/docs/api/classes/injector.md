---
id: "injector"
title: "Injector"
sidebar_label: "Injector"
---

## Hierarchy

* Container

* Container

  ↳ **Injector**

## Implements

* Container
* [Injector](../interfaces/types.injector.md)
* Container
* Injector

## Index

### Constructors

* [constructor](injector.md#constructor)

### Properties

* [id](injector.md#id)
* [options](injector.md#readonly-options)
* [parent](injector.md#parent)

### Methods

* [applyCustomMetadataReader](injector.md#applycustommetadatareader)
* [applyMiddleware](injector.md#applymiddleware)
* [bind](injector.md#bind)
* [createChild](injector.md#createchild)
* [findByScope](injector.md#findbyscope)
* [get](injector.md#get)
* [getAll](injector.md#getall)
* [getAllAsync](injector.md#getallasync)
* [getAllNamed](injector.md#getallnamed)
* [getAllNamedAsync](injector.md#getallnamedasync)
* [getAllTagged](injector.md#getalltagged)
* [getAllTaggedAsync](injector.md#getalltaggedasync)
* [getAsync](injector.md#getasync)
* [getNamed](injector.md#getnamed)
* [getNamedAsync](injector.md#getnamedasync)
* [getTagged](injector.md#gettagged)
* [getTaggedAsync](injector.md#gettaggedasync)
* [injectInto](injector.md#injectinto)
* [injectIntoAsync](injector.md#injectintoasync)
* [isBound](injector.md#isbound)
* [isBoundNamed](injector.md#isboundnamed)
* [isBoundTagged](injector.md#isboundtagged)
* [load](injector.md#load)
* [loadAsync](injector.md#loadasync)
* [onActivation](injector.md#onactivation)
* [onDeactivation](injector.md#ondeactivation)
* [rebind](injector.md#rebind)
* [resolve](injector.md#resolve)
* [restore](injector.md#restore)
* [snapshot](injector.md#snapshot)
* [unbind](injector.md#unbind)
* [unbindAll](injector.md#unbindall)
* [unbindAllAsync](injector.md#unbindallasync)
* [unbindAsync](injector.md#unbindasync)
* [unload](injector.md#unload)
* [merge](injector.md#static-merge)

## Constructors

###  constructor

\+ **new Injector**(`containerOptions?`: ContainerOptions): *[Injector](injector.md)*

*Inherited from [Injector](injector.md).[constructor](injector.md#constructor)*

*Overrides [Injector](injector.md).[constructor](injector.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`containerOptions?` | ContainerOptions |

**Returns:** *[Injector](injector.md)*

## Properties

###  id

• **id**: *number*

*Implementation of [Injector](../interfaces/types.injector.md).[id](../interfaces/types.injector.md#id)*

*Inherited from [Injector](injector.md).[id](injector.md#id)*

*Overrides [Injector](injector.md).[id](injector.md#id)*

___

### `Readonly` options

• **options**: *ContainerOptions*

*Implementation of [Injector](../interfaces/types.injector.md).[options](../interfaces/types.injector.md#options)*

*Inherited from [Injector](injector.md).[options](injector.md#readonly-options)*

*Overrides [Injector](injector.md).[options](injector.md#readonly-options)*

___

###  parent

• **parent**: *Container | null*

*Implementation of [Injector](../interfaces/types.injector.md).[parent](../interfaces/types.injector.md#parent)*

*Inherited from [Injector](injector.md).[parent](injector.md#parent)*

*Overrides [Injector](injector.md).[parent](injector.md#parent)*

## Methods

###  applyCustomMetadataReader

▸ **applyCustomMetadataReader**(`metadataReader`: MetadataReader): *void*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[applyCustomMetadataReader](injector.md#applycustommetadatareader)*

*Overrides [Injector](injector.md).[applyCustomMetadataReader](injector.md#applycustommetadatareader)*

**Parameters:**

Name | Type |
------ | ------ |
`metadataReader` | MetadataReader |

**Returns:** *void*

___

###  applyMiddleware

▸ **applyMiddleware**(...`middlewares`: interfaces.Middleware[]): *void*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[applyMiddleware](injector.md#applymiddleware)*

*Overrides [Injector](injector.md).[applyMiddleware](injector.md#applymiddleware)*

**Parameters:**

Name | Type |
------ | ------ |
`...middlewares` | interfaces.Middleware[] |

**Returns:** *void*

___

###  bind

▸ **bind**‹**T**›(`serviceIdentifier`: inversifyTypes.ServiceIdentifier‹T›): *inversifyTypes.BindingToSyntax‹T› & object*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Overrides void*

[OVERRIDE]
Registers a type binding

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`serviceIdentifier` | inversifyTypes.ServiceIdentifier‹T› | Identifier for a service. |

**Returns:** *inversifyTypes.BindingToSyntax‹T› & object*

Instance implementing `BindingToSyntax` with additional `toRoute` method.

___

###  createChild

▸ **createChild**(`containerOptions?`: ContainerOptions): *Container*

*Inherited from [Injector](injector.md).[createChild](injector.md#createchild)*

*Overrides [Injector](injector.md).[createChild](injector.md#createchild)*

**Parameters:**

Name | Type |
------ | ------ |
`containerOptions?` | ContainerOptions |

**Returns:** *Container*

___

###  findByScope

▸ **findByScope**(`scope`: inversifyTypes.BindingScope): *inversifyTypes.ServiceIdentifier‹any›[]*

*Implementation of [Injector](../interfaces/types.injector.md)*

Finds service identifiers by scope.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scope` | inversifyTypes.BindingScope | One of supported scopes by Inversify. |

**Returns:** *inversifyTypes.ServiceIdentifier‹any›[]*

List of service identifiers binding with provided scope.

___

###  get

▸ **get**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›): *T*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[get](injector.md#get)*

*Overrides [Injector](injector.md).[get](injector.md#get)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |

**Returns:** *T*

___

###  getAll

▸ **getAll**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›): *T[]*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[getAll](injector.md#getall)*

*Overrides [Injector](injector.md).[getAll](injector.md#getall)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |

**Returns:** *T[]*

___

###  getAllAsync

▸ **getAllAsync**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›): *Promise‹T›[]*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[getAllAsync](injector.md#getallasync)*

*Overrides [Injector](injector.md).[getAllAsync](injector.md#getallasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |

**Returns:** *Promise‹T›[]*

___

###  getAllNamed

▸ **getAllNamed**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›, `named`: string | number | symbol): *T[]*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[getAllNamed](injector.md#getallnamed)*

*Overrides [Injector](injector.md).[getAllNamed](injector.md#getallnamed)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |
`named` | string &#124; number &#124; symbol |

**Returns:** *T[]*

___

###  getAllNamedAsync

▸ **getAllNamedAsync**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›, `named`: string | number | symbol): *Promise‹T›[]*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[getAllNamedAsync](injector.md#getallnamedasync)*

*Overrides [Injector](injector.md).[getAllNamedAsync](injector.md#getallnamedasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |
`named` | string &#124; number &#124; symbol |

**Returns:** *Promise‹T›[]*

___

###  getAllTagged

▸ **getAllTagged**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›, `key`: string | number | symbol, `value`: any): *T[]*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[getAllTagged](injector.md#getalltagged)*

*Overrides [Injector](injector.md).[getAllTagged](injector.md#getalltagged)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |
`key` | string &#124; number &#124; symbol |
`value` | any |

**Returns:** *T[]*

___

###  getAllTaggedAsync

▸ **getAllTaggedAsync**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›, `key`: string | number | symbol, `value`: any): *Promise‹T›[]*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[getAllTaggedAsync](injector.md#getalltaggedasync)*

*Overrides [Injector](injector.md).[getAllTaggedAsync](injector.md#getalltaggedasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |
`key` | string &#124; number &#124; symbol |
`value` | any |

**Returns:** *Promise‹T›[]*

___

###  getAsync

▸ **getAsync**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›): *Promise‹T›*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[getAsync](injector.md#getasync)*

*Overrides [Injector](injector.md).[getAsync](injector.md#getasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |

**Returns:** *Promise‹T›*

___

###  getNamed

▸ **getNamed**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›, `named`: string | number | symbol): *T*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[getNamed](injector.md#getnamed)*

*Overrides [Injector](injector.md).[getNamed](injector.md#getnamed)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |
`named` | string &#124; number &#124; symbol |

**Returns:** *T*

___

###  getNamedAsync

▸ **getNamedAsync**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›, `named`: string | number | symbol): *Promise‹T›*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[getNamedAsync](injector.md#getnamedasync)*

*Overrides [Injector](injector.md).[getNamedAsync](injector.md#getnamedasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |
`named` | string &#124; number &#124; symbol |

**Returns:** *Promise‹T›*

___

###  getTagged

▸ **getTagged**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›, `key`: string | number | symbol, `value`: any): *T*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[getTagged](injector.md#gettagged)*

*Overrides [Injector](injector.md).[getTagged](injector.md#gettagged)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |
`key` | string &#124; number &#124; symbol |
`value` | any |

**Returns:** *T*

___

###  getTaggedAsync

▸ **getTaggedAsync**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›, `key`: string | number | symbol, `value`: any): *Promise‹T›*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[getTaggedAsync](injector.md#gettaggedasync)*

*Overrides [Injector](injector.md).[getTaggedAsync](injector.md#gettaggedasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |
`key` | string &#124; number &#124; symbol |
`value` | any |

**Returns:** *Promise‹T›*

___

###  injectInto

▸ **injectInto**(`value`: any): *void*

*Implementation of [Injector](../interfaces/types.injector.md)*

Synchronously injects dependencies from IoC container to existing value.

**`remarks`** 
Supports `@postConstruct` decorator.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value to which dependencies should be injected.  |

**Returns:** *void*

___

###  injectIntoAsync

▸ **injectIntoAsync**(`value`: any): *Promise‹void›*

*Implementation of [Injector](../interfaces/types.injector.md)*

Asynchronously injects dependencies from IoC container to existing value.

**`remarks`** 
Supports async `@postConstruct` decorator.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value to which dependencies should be injected.  |

**Returns:** *Promise‹void›*

___

###  isBound

▸ **isBound**(`serviceIdentifier`: interfaces.ServiceIdentifier‹any›): *boolean*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[isBound](injector.md#isbound)*

*Overrides [Injector](injector.md).[isBound](injector.md#isbound)*

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹any› |

**Returns:** *boolean*

___

###  isBoundNamed

▸ **isBoundNamed**(`serviceIdentifier`: interfaces.ServiceIdentifier‹any›, `named`: string | number | symbol): *boolean*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[isBoundNamed](injector.md#isboundnamed)*

*Overrides [Injector](injector.md).[isBoundNamed](injector.md#isboundnamed)*

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹any› |
`named` | string &#124; number &#124; symbol |

**Returns:** *boolean*

___

###  isBoundTagged

▸ **isBoundTagged**(`serviceIdentifier`: interfaces.ServiceIdentifier‹any›, `key`: string | number | symbol, `value`: any): *boolean*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[isBoundTagged](injector.md#isboundtagged)*

*Overrides [Injector](injector.md).[isBoundTagged](injector.md#isboundtagged)*

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹any› |
`key` | string &#124; number &#124; symbol |
`value` | any |

**Returns:** *boolean*

___

###  load

▸ **load**(...`modules`: ContainerModule[]): *void*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[load](injector.md#load)*

*Overrides [Injector](injector.md).[load](injector.md#load)*

**Parameters:**

Name | Type |
------ | ------ |
`...modules` | ContainerModule[] |

**Returns:** *void*

___

###  loadAsync

▸ **loadAsync**(...`modules`: AsyncContainerModule[]): *Promise‹void›*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[loadAsync](injector.md#loadasync)*

*Overrides [Injector](injector.md).[loadAsync](injector.md#loadasync)*

**Parameters:**

Name | Type |
------ | ------ |
`...modules` | AsyncContainerModule[] |

**Returns:** *Promise‹void›*

___

###  onActivation

▸ **onActivation**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›, `onActivation`: interfaces.BindingActivation‹T›): *void*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[onActivation](injector.md#onactivation)*

*Overrides [Injector](injector.md).[onActivation](injector.md#onactivation)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |
`onActivation` | interfaces.BindingActivation‹T› |

**Returns:** *void*

___

###  onDeactivation

▸ **onDeactivation**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›, `onDeactivation`: interfaces.BindingDeactivation‹T›): *void*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[onDeactivation](injector.md#ondeactivation)*

*Overrides [Injector](injector.md).[onDeactivation](injector.md#ondeactivation)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |
`onDeactivation` | interfaces.BindingDeactivation‹T› |

**Returns:** *void*

___

###  rebind

▸ **rebind**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›): *BindingToSyntax‹T›*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[rebind](injector.md#rebind)*

*Overrides [Injector](injector.md).[rebind](injector.md#rebind)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹T› |

**Returns:** *BindingToSyntax‹T›*

___

###  resolve

▸ **resolve**‹**T**›(`constructorFunction`: interfaces.Newable‹T›): *T*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[resolve](injector.md#resolve)*

*Overrides [Injector](injector.md).[resolve](injector.md#resolve)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`constructorFunction` | interfaces.Newable‹T› |

**Returns:** *T*

___

###  restore

▸ **restore**(): *void*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[restore](injector.md#restore)*

*Overrides [Injector](injector.md).[restore](injector.md#restore)*

**Returns:** *void*

___

###  snapshot

▸ **snapshot**(): *void*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[snapshot](injector.md#snapshot)*

*Overrides [Injector](injector.md).[snapshot](injector.md#snapshot)*

**Returns:** *void*

___

###  unbind

▸ **unbind**(`serviceIdentifier`: interfaces.ServiceIdentifier‹any›): *void*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[unbind](injector.md#unbind)*

*Overrides [Injector](injector.md).[unbind](injector.md#unbind)*

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹any› |

**Returns:** *void*

___

###  unbindAll

▸ **unbindAll**(): *void*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[unbindAll](injector.md#unbindall)*

*Overrides [Injector](injector.md).[unbindAll](injector.md#unbindall)*

**Returns:** *void*

___

###  unbindAllAsync

▸ **unbindAllAsync**(): *Promise‹void›*

*Inherited from [Injector](injector.md).[unbindAllAsync](injector.md#unbindallasync)*

*Overrides [Injector](injector.md).[unbindAllAsync](injector.md#unbindallasync)*

**Returns:** *Promise‹void›*

___

###  unbindAsync

▸ **unbindAsync**(`serviceIdentifier`: interfaces.ServiceIdentifier‹any›): *Promise‹void›*

*Inherited from [Injector](injector.md).[unbindAsync](injector.md#unbindasync)*

*Overrides [Injector](injector.md).[unbindAsync](injector.md#unbindasync)*

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | interfaces.ServiceIdentifier‹any› |

**Returns:** *Promise‹void›*

___

###  unload

▸ **unload**(...`modules`: ContainerModule[]): *void*

*Implementation of [Injector](../interfaces/types.injector.md)*

*Inherited from [Injector](injector.md).[unload](injector.md#unload)*

*Overrides [Injector](injector.md).[unload](injector.md#unload)*

**Parameters:**

Name | Type |
------ | ------ |
`...modules` | ContainerModule[] |

**Returns:** *void*

___

### `Static` merge

▸ **merge**(`container1`: Container, `container2`: Container): *Container*

*Inherited from [Injector](injector.md).[merge](injector.md#static-merge)*

*Overrides [Injector](injector.md).[merge](injector.md#static-merge)*

**Parameters:**

Name | Type |
------ | ------ |
`container1` | Container |
`container2` | Container |

**Returns:** *Container*

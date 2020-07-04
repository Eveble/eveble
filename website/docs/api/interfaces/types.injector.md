---
id: "types.injector"
title: "@eveble/eveble"
sidebar_label: "Injector"
---

## Hierarchy

* Container

* Container

  ↳ **Injector**

## Implemented by

* [Injector](../classes/injector.md)

## Index

### Properties

* [id](types.injector.md#id)
* [options](types.injector.md#options)
* [parent](types.injector.md#parent)

### Methods

* [applyCustomMetadataReader](types.injector.md#applycustommetadatareader)
* [applyMiddleware](types.injector.md#applymiddleware)
* [bind](types.injector.md#bind)
* [createChild](types.injector.md#createchild)
* [findByScope](types.injector.md#findbyscope)
* [get](types.injector.md#get)
* [getAll](types.injector.md#getall)
* [getAllAsync](types.injector.md#getallasync)
* [getAllNamed](types.injector.md#getallnamed)
* [getAllNamedAsync](types.injector.md#getallnamedasync)
* [getAllTagged](types.injector.md#getalltagged)
* [getAllTaggedAsync](types.injector.md#getalltaggedasync)
* [getAsync](types.injector.md#getasync)
* [getNamed](types.injector.md#getnamed)
* [getNamedAsync](types.injector.md#getnamedasync)
* [getTagged](types.injector.md#gettagged)
* [getTaggedAsync](types.injector.md#gettaggedasync)
* [injectInto](types.injector.md#injectinto)
* [injectIntoAsync](types.injector.md#injectintoasync)
* [isBound](types.injector.md#isbound)
* [isBoundNamed](types.injector.md#isboundnamed)
* [isBoundTagged](types.injector.md#isboundtagged)
* [load](types.injector.md#load)
* [loadAsync](types.injector.md#loadasync)
* [onActivation](types.injector.md#onactivation)
* [onDeactivation](types.injector.md#ondeactivation)
* [rebind](types.injector.md#rebind)
* [resolve](types.injector.md#resolve)
* [restore](types.injector.md#restore)
* [snapshot](types.injector.md#snapshot)
* [unbind](types.injector.md#unbind)
* [unbindAll](types.injector.md#unbindall)
* [unload](types.injector.md#unload)

## Properties

###  id

• **id**: *number*

*Inherited from [Injector](types.injector.md).[id](types.injector.md#id)*

*Overrides [Injector](types.injector.md).[id](types.injector.md#id)*

___

###  options

• **options**: *ContainerOptions*

*Inherited from [Injector](types.injector.md).[options](types.injector.md#options)*

*Overrides [Injector](types.injector.md).[options](types.injector.md#options)*

___

###  parent

• **parent**: *Container | null*

*Inherited from [Injector](types.injector.md).[parent](types.injector.md#parent)*

*Overrides [Injector](types.injector.md).[parent](types.injector.md#parent)*

## Methods

###  applyCustomMetadataReader

▸ **applyCustomMetadataReader**(`metadataReader`: MetadataReader): *void*

*Inherited from [Injector](types.injector.md).[applyCustomMetadataReader](types.injector.md#applycustommetadatareader)*

*Overrides [Injector](types.injector.md).[applyCustomMetadataReader](types.injector.md#applycustommetadatareader)*

**Parameters:**

Name | Type |
------ | ------ |
`metadataReader` | MetadataReader |

**Returns:** *void*

___

###  applyMiddleware

▸ **applyMiddleware**(...`middleware`: Middleware[]): *void*

*Inherited from [Injector](types.injector.md).[applyMiddleware](types.injector.md#applymiddleware)*

*Overrides [Injector](types.injector.md).[applyMiddleware](types.injector.md#applymiddleware)*

**Parameters:**

Name | Type |
------ | ------ |
`...middleware` | Middleware[] |

**Returns:** *void*

___

###  bind

▸ **bind**‹**T**›(`serviceIdentifier`: inversifyTypes.ServiceIdentifier‹T›): *inversifyTypes.BindingToSyntax‹T› & object*

*Overrides void*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | inversifyTypes.ServiceIdentifier‹T› |

**Returns:** *inversifyTypes.BindingToSyntax‹T› & object*

▸ **bind**‹**T**›(`serviceIdentifier`: inversifyTypes.ServiceIdentifier‹T›): *inversifyTypes.BindingToSyntax‹T› & object*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | inversifyTypes.ServiceIdentifier‹T› |

**Returns:** *inversifyTypes.BindingToSyntax‹T› & object*

___

###  createChild

▸ **createChild**(): *Container*

*Inherited from [Injector](types.injector.md).[createChild](types.injector.md#createchild)*

*Overrides [Injector](types.injector.md).[createChild](types.injector.md#createchild)*

**Returns:** *Container*

___

###  findByScope

▸ **findByScope**(`scope`: inversifyTypes.BindingScope): *inversifyTypes.ServiceIdentifier‹any›[]*

**Parameters:**

Name | Type |
------ | ------ |
`scope` | inversifyTypes.BindingScope |

**Returns:** *inversifyTypes.ServiceIdentifier‹any›[]*

▸ **findByScope**(`scope`: inversifyTypes.BindingScope): *inversifyTypes.ServiceIdentifier‹any›[]*

**Parameters:**

Name | Type |
------ | ------ |
`scope` | inversifyTypes.BindingScope |

**Returns:** *inversifyTypes.ServiceIdentifier‹any›[]*

___

###  get

▸ **get**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›): *T*

*Inherited from [Injector](types.injector.md).[get](types.injector.md#get)*

*Overrides [Injector](types.injector.md).[get](types.injector.md#get)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |

**Returns:** *T*

___

###  getAll

▸ **getAll**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›): *T[]*

*Inherited from [Injector](types.injector.md).[getAll](types.injector.md#getall)*

*Overrides [Injector](types.injector.md).[getAll](types.injector.md#getall)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |

**Returns:** *T[]*

___

###  getAllAsync

▸ **getAllAsync**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›): *Promise‹T›[]*

*Inherited from [Injector](types.injector.md).[getAllAsync](types.injector.md#getallasync)*

*Overrides [Injector](types.injector.md).[getAllAsync](types.injector.md#getallasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |

**Returns:** *Promise‹T›[]*

___

###  getAllNamed

▸ **getAllNamed**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›, `named`: string | number | symbol): *T[]*

*Inherited from [Injector](types.injector.md).[getAllNamed](types.injector.md#getallnamed)*

*Overrides [Injector](types.injector.md).[getAllNamed](types.injector.md#getallnamed)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |
`named` | string &#124; number &#124; symbol |

**Returns:** *T[]*

___

###  getAllNamedAsync

▸ **getAllNamedAsync**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›, `named`: string | number | symbol): *Promise‹T›[]*

*Inherited from [Injector](types.injector.md).[getAllNamedAsync](types.injector.md#getallnamedasync)*

*Overrides [Injector](types.injector.md).[getAllNamedAsync](types.injector.md#getallnamedasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |
`named` | string &#124; number &#124; symbol |

**Returns:** *Promise‹T›[]*

___

###  getAllTagged

▸ **getAllTagged**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›, `key`: string | number | symbol, `value`: any): *T[]*

*Inherited from [Injector](types.injector.md).[getAllTagged](types.injector.md#getalltagged)*

*Overrides [Injector](types.injector.md).[getAllTagged](types.injector.md#getalltagged)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |
`key` | string &#124; number &#124; symbol |
`value` | any |

**Returns:** *T[]*

___

###  getAllTaggedAsync

▸ **getAllTaggedAsync**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›, `key`: string | number | symbol, `value`: any): *Promise‹T›[]*

*Inherited from [Injector](types.injector.md).[getAllTaggedAsync](types.injector.md#getalltaggedasync)*

*Overrides [Injector](types.injector.md).[getAllTaggedAsync](types.injector.md#getalltaggedasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |
`key` | string &#124; number &#124; symbol |
`value` | any |

**Returns:** *Promise‹T›[]*

___

###  getAsync

▸ **getAsync**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›): *Promise‹T›*

*Inherited from [Injector](types.injector.md).[getAsync](types.injector.md#getasync)*

*Overrides [Injector](types.injector.md).[getAsync](types.injector.md#getasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |

**Returns:** *Promise‹T›*

___

###  getNamed

▸ **getNamed**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›, `named`: string | number | symbol): *T*

*Inherited from [Injector](types.injector.md).[getNamed](types.injector.md#getnamed)*

*Overrides [Injector](types.injector.md).[getNamed](types.injector.md#getnamed)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |
`named` | string &#124; number &#124; symbol |

**Returns:** *T*

___

###  getNamedAsync

▸ **getNamedAsync**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›, `named`: string | number | symbol): *Promise‹T›*

*Inherited from [Injector](types.injector.md).[getNamedAsync](types.injector.md#getnamedasync)*

*Overrides [Injector](types.injector.md).[getNamedAsync](types.injector.md#getnamedasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |
`named` | string &#124; number &#124; symbol |

**Returns:** *Promise‹T›*

___

###  getTagged

▸ **getTagged**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›, `key`: string | number | symbol, `value`: any): *T*

*Inherited from [Injector](types.injector.md).[getTagged](types.injector.md#gettagged)*

*Overrides [Injector](types.injector.md).[getTagged](types.injector.md#gettagged)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |
`key` | string &#124; number &#124; symbol |
`value` | any |

**Returns:** *T*

___

###  getTaggedAsync

▸ **getTaggedAsync**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›, `key`: string | number | symbol, `value`: any): *Promise‹T›*

*Inherited from [Injector](types.injector.md).[getTaggedAsync](types.injector.md#gettaggedasync)*

*Overrides [Injector](types.injector.md).[getTaggedAsync](types.injector.md#gettaggedasync)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |
`key` | string &#124; number &#124; symbol |
`value` | any |

**Returns:** *Promise‹T›*

___

###  injectInto

▸ **injectInto**(`value`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

▸ **injectInto**(`value`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

___

###  injectIntoAsync

▸ **injectIntoAsync**(`value`: any): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *Promise‹void›*

▸ **injectIntoAsync**(`value`: any): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *Promise‹void›*

___

###  isBound

▸ **isBound**(`serviceIdentifier`: ServiceIdentifier‹any›): *boolean*

*Inherited from [Injector](types.injector.md).[isBound](types.injector.md#isbound)*

*Overrides [Injector](types.injector.md).[isBound](types.injector.md#isbound)*

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹any› |

**Returns:** *boolean*

___

###  isBoundNamed

▸ **isBoundNamed**(`serviceIdentifier`: ServiceIdentifier‹any›, `named`: string | number | symbol): *boolean*

*Inherited from [Injector](types.injector.md).[isBoundNamed](types.injector.md#isboundnamed)*

*Overrides [Injector](types.injector.md).[isBoundNamed](types.injector.md#isboundnamed)*

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹any› |
`named` | string &#124; number &#124; symbol |

**Returns:** *boolean*

___

###  isBoundTagged

▸ **isBoundTagged**(`serviceIdentifier`: ServiceIdentifier‹any›, `key`: string | number | symbol, `value`: any): *boolean*

*Inherited from [Injector](types.injector.md).[isBoundTagged](types.injector.md#isboundtagged)*

*Overrides [Injector](types.injector.md).[isBoundTagged](types.injector.md#isboundtagged)*

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹any› |
`key` | string &#124; number &#124; symbol |
`value` | any |

**Returns:** *boolean*

___

###  load

▸ **load**(...`modules`: ContainerModule[]): *void*

*Inherited from [Injector](types.injector.md).[load](types.injector.md#load)*

*Overrides [Injector](types.injector.md).[load](types.injector.md#load)*

**Parameters:**

Name | Type |
------ | ------ |
`...modules` | ContainerModule[] |

**Returns:** *void*

___

###  loadAsync

▸ **loadAsync**(...`modules`: AsyncContainerModule[]): *Promise‹void›*

*Inherited from [Injector](types.injector.md).[loadAsync](types.injector.md#loadasync)*

*Overrides [Injector](types.injector.md).[loadAsync](types.injector.md#loadasync)*

**Parameters:**

Name | Type |
------ | ------ |
`...modules` | AsyncContainerModule[] |

**Returns:** *Promise‹void›*

___

###  onActivation

▸ **onActivation**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›, `onActivation`: BindingActivation‹T›): *void*

*Inherited from [Injector](types.injector.md).[onActivation](types.injector.md#onactivation)*

*Overrides [Injector](types.injector.md).[onActivation](types.injector.md#onactivation)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |
`onActivation` | BindingActivation‹T› |

**Returns:** *void*

___

###  onDeactivation

▸ **onDeactivation**‹**T**›(`serviceIdentifier`: ServiceIdentifier‹T›, `onDeactivation`: BindingDeactivation‹T›): *void*

*Inherited from [Injector](types.injector.md).[onDeactivation](types.injector.md#ondeactivation)*

*Overrides [Injector](types.injector.md).[onDeactivation](types.injector.md#ondeactivation)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹T› |
`onDeactivation` | BindingDeactivation‹T› |

**Returns:** *void*

___

###  rebind

▸ **rebind**‹**T**›(`serviceIdentifier`: interfaces.ServiceIdentifier‹T›): *BindingToSyntax‹T›*

*Inherited from [Injector](types.injector.md).[rebind](types.injector.md#rebind)*

*Overrides [Injector](types.injector.md).[rebind](types.injector.md#rebind)*

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

*Inherited from [Injector](types.injector.md).[resolve](types.injector.md#resolve)*

*Overrides [Injector](types.injector.md).[resolve](types.injector.md#resolve)*

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

*Inherited from [Injector](types.injector.md).[restore](types.injector.md#restore)*

*Overrides [Injector](types.injector.md).[restore](types.injector.md#restore)*

**Returns:** *void*

___

###  snapshot

▸ **snapshot**(): *void*

*Inherited from [Injector](types.injector.md).[snapshot](types.injector.md#snapshot)*

*Overrides [Injector](types.injector.md).[snapshot](types.injector.md#snapshot)*

**Returns:** *void*

___

###  unbind

▸ **unbind**(`serviceIdentifier`: ServiceIdentifier‹any›): *void*

*Inherited from [Injector](types.injector.md).[unbind](types.injector.md#unbind)*

*Overrides [Injector](types.injector.md).[unbind](types.injector.md#unbind)*

**Parameters:**

Name | Type |
------ | ------ |
`serviceIdentifier` | ServiceIdentifier‹any› |

**Returns:** *void*

___

###  unbindAll

▸ **unbindAll**(): *void*

*Inherited from [Injector](types.injector.md).[unbindAll](types.injector.md#unbindall)*

*Overrides [Injector](types.injector.md).[unbindAll](types.injector.md#unbindall)*

**Returns:** *void*

___

###  unload

▸ **unload**(...`modules`: ContainerModule[]): *void*

*Inherited from [Injector](types.injector.md).[unload](types.injector.md#unload)*

*Overrides [Injector](types.injector.md).[unload](types.injector.md#unload)*

**Parameters:**

Name | Type |
------ | ------ |
`...modules` | ContainerModule[] |

**Returns:** *void*

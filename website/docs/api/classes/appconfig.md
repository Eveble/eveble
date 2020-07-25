---
id: "appconfig"
title: "AppConfig"
sidebar_label: "AppConfig"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

  ↳ [Config](config.md)

* Config

  ↳ **AppConfig**

## Implements

* [Definable](../interfaces/types.definable.md)
* [Hookable](../interfaces/types.hookable.md)
* [Configurable](../interfaces/types.configurable.md)
* Definable
* Hookable
* Configurable

## Index

### Constructors

* [constructor](appconfig.md#constructor)

### Properties

* [appId](appconfig.md#optional-appid)
* [eveble](appconfig.md#optional-eveble)
* [included](appconfig.md#optional-included)
* [logging](appconfig.md#optional-logging)
* [merged](appconfig.md#optional-merged)
* [workerId](appconfig.md#optional-workerid)

### Methods

* [assign](appconfig.md#assign)
* [equals](appconfig.md#equals)
* [get](appconfig.md#get)
* [getActions](appconfig.md#getactions)
* [getDefault](appconfig.md#getdefault)
* [getExact](appconfig.md#getexact)
* [getHook](appconfig.md#gethook)
* [getHookOrThrow](appconfig.md#gethookorthrow)
* [getHooks](appconfig.md#gethooks)
* [getPropTypes](appconfig.md#getproptypes)
* [getPropertyInitializers](appconfig.md#getpropertyinitializers)
* [has](appconfig.md#has)
* [hasAction](appconfig.md#hasaction)
* [hasDefault](appconfig.md#hasdefault)
* [hasHook](appconfig.md#hashook)
* [include](appconfig.md#include)
* [isConfigurable](appconfig.md#isconfigurable)
* [merge](appconfig.md#merge)
* [overrideHook](appconfig.md#overridehook)
* [registerHook](appconfig.md#registerhook)
* [removeHook](appconfig.md#removehook)
* [set](appconfig.md#set)
* [toPlainObject](appconfig.md#toplainobject)
* [validateProps](appconfig.md#validateprops)
* [from](appconfig.md#static-from)
* [generateId](appconfig.md#static-generateid)
* [getPropTypes](appconfig.md#static-getproptypes)
* [getPropertyInitializers](appconfig.md#static-getpropertyinitializers)

### Object literals

* [clients](appconfig.md#optional-clients)
* [conversion](appconfig.md#optional-conversion)
* [description](appconfig.md#optional-description)
* [validation](appconfig.md#optional-validation)
* [defaultMongoDBOptions](appconfig.md#static-defaultmongodboptions)

## Constructors

###  constructor

\+ **new AppConfig**(`props?`: Partial‹[AppConfig](appconfig.md)›): *[AppConfig](appconfig.md)*

*Overrides [Config](config.md).[constructor](config.md#constructor)*

Creates an instance of AppConfig.
Creates an instance of AppConfig.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props?` | Partial‹[AppConfig](appconfig.md)› | Properties of the type required for construction.  |

**Returns:** *[AppConfig](appconfig.md)*

## Properties

### `Optional` appId

• **appId**? : *string | Stringifiable* = getenv.string(
    'APP_ID',
    AppConfig.generateId() as string
  )

___

### `Optional` eveble

• **eveble**? : *EvebleConfig* = new EvebleConfig()

___

### `Optional` included

• **included**? : *Record‹string, [Configurable](../interfaces/types.configurable.md)›*

*Inherited from [Config](config.md).[included](config.md#optional-included)*

*Overrides void*

___

### `Optional` logging

• **logging**? : *LoggingConfig* = new LoggingConfig()

___

### `Optional` merged

• **merged**? : *Record‹string, [Configurable](../interfaces/types.configurable.md)›*

*Inherited from [Config](config.md).[merged](config.md#optional-merged)*

*Overrides void*

___

### `Optional` workerId

• **workerId**? : *string | Stringifiable* = getenv.string(
    'WORKER_ID',
    AppConfig.generateId() as string
  )

## Methods

###  assign

▸ **assign**(`props`: [Props](../modules/types.md#props)): *void*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [Config](config.md).[assign](config.md#assign)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *void*

___

###  equals

▸ **equals**(`other`: any): *boolean*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[equals](definablemixin.md#equals)*

*Overrides [CreateEmployee](createemployee.md).[equals](createemployee.md#equals)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  get

▸ **get**‹**T**›(`path`: string, `runtimeDefaultValue?`: T): *T | any*

*Inherited from [Config](config.md).[get](config.md#get)*

*Overrides void*

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`runtimeDefaultValue?` | T |

**Returns:** *T | any*

___

###  getActions

▸ **getActions**(): *[Actions](../modules/types.hooks.md#actions)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getActions](hookablemixin.md#getactions)*

*Overrides [CreateEmployee](createemployee.md).[getActions](createemployee.md#getactions)*

**Returns:** *[Actions](../modules/types.hooks.md#actions)*

___

###  getDefault

▸ **getDefault**‹**T**›(`path`: string): *T | any*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [Config](config.md).[getDefault](config.md#getdefault)*

*Overrides void*

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *T | any*

___

###  getExact

▸ **getExact**‹**T**›(`path`: string): *T | any*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [Config](config.md).[getExact](config.md#getexact)*

*Overrides void*

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *T | any*

___

###  getHook

▸ **getHook**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook) | undefined*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getHook](hookablemixin.md#gethook)*

*Overrides [CreateEmployee](createemployee.md).[getHook](createemployee.md#gethook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook) | undefined*

___

###  getHookOrThrow

▸ **getHookOrThrow**(`action`: string, `id`: string): *[Hook](../modules/types.md#hook)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getHookOrThrow](hookablemixin.md#gethookorthrow)*

*Overrides [CreateEmployee](createemployee.md).[getHookOrThrow](createemployee.md#gethookorthrow)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *[Hook](../modules/types.md#hook)*

___

###  getHooks

▸ **getHooks**(`action`: string): *[Mappings](../modules/types.hooks.md#mappings)*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[getHooks](hookablemixin.md#gethooks)*

*Overrides [CreateEmployee](createemployee.md).[getHooks](createemployee.md#gethooks)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *[Mappings](../modules/types.hooks.md#mappings)*

___

###  getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [Config](config.md).[getPropTypes](config.md#getproptypes)*

*Overrides [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  has

▸ **has**(`path`: string): *boolean*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [Config](config.md).[has](config.md#has)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

___

###  hasAction

▸ **hasAction**(`action`: string): *boolean*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[hasAction](hookablemixin.md#hasaction)*

*Overrides [CreateEmployee](createemployee.md).[hasAction](createemployee.md#hasaction)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |

**Returns:** *boolean*

___

###  hasDefault

▸ **hasDefault**(`path`: string): *boolean*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [Config](config.md).[hasDefault](config.md#hasdefault)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

___

###  hasHook

▸ **hasHook**(`action`: string, `id`: string): *boolean*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[hasHook](hookablemixin.md#hashook)*

*Overrides [CreateEmployee](createemployee.md).[hasHook](createemployee.md#hashook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *boolean*

___

###  include

▸ **include**(`config`: [Configurable](../interfaces/types.configurable.md)): *void*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [Config](config.md).[include](config.md#include)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Configurable](../interfaces/types.configurable.md) |

**Returns:** *void*

___

###  isConfigurable

▸ **isConfigurable**(`path`: string): *boolean*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [Config](config.md).[isConfigurable](config.md#isconfigurable)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

___

###  merge

▸ **merge**(`config`: [Configurable](../interfaces/types.configurable.md)): *void*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [Config](config.md).[merge](config.md#merge)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Configurable](../interfaces/types.configurable.md) |

**Returns:** *void*

___

###  overrideHook

▸ **overrideHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook)): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[overrideHook](hookablemixin.md#overridehook)*

*Overrides [CreateEmployee](createemployee.md).[overrideHook](createemployee.md#overridehook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |

**Returns:** *void*

___

###  registerHook

▸ **registerHook**(`action`: string, `id`: string, `hook`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[registerHook](hookablemixin.md#registerhook)*

*Overrides [CreateEmployee](createemployee.md).[registerHook](createemployee.md#registerhook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |
`hook` | [Hook](../modules/types.md#hook) |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeHook

▸ **removeHook**(`action`: string, `id`: string): *void*

*Implementation of [Hookable](../interfaces/types.hookable.md)*

*Inherited from [HookableMixin](hookablemixin.md).[removeHook](hookablemixin.md#removehook)*

*Overrides [CreateEmployee](createemployee.md).[removeHook](createemployee.md#removehook)*

**Parameters:**

Name | Type |
------ | ------ |
`action` | string |
`id` | string |

**Returns:** *void*

___

###  set

▸ **set**‹**T**›(`path`: string, `value`: T): *void*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [Config](config.md).[set](config.md#set)*

*Overrides void*

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`value` | T |

**Returns:** *void*

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Implementation of [Configurable](../interfaces/types.configurable.md)*

*Inherited from [DefinableMixin](definablemixin.md).[toPlainObject](definablemixin.md#toplainobject)*

*Overrides [CreateEmployee](createemployee.md).[toPlainObject](createemployee.md#toplainobject)*

**Returns:** *[Props](../modules/types.md#props)*

___

###  validateProps

▸ **validateProps**(`props`: Record‹string | number | symbol, any› | undefined, `propTypes`: [PropTypes](../modules/types.md#proptypes), `isStrict?`: boolean): *boolean*

*Inherited from [DefinableMixin](definablemixin.md).[validateProps](definablemixin.md#validateprops)*

*Overrides [CreateEmployee](createemployee.md).[validateProps](createemployee.md#validateprops)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | Record‹string &#124; number &#124; symbol, any› &#124; undefined |
`propTypes` | [PropTypes](../modules/types.md#proptypes) |
`isStrict?` | boolean |

**Returns:** *boolean*

___

### `Static` from

▸ **from**‹**T**›(`props`: Record‹string, any›): *T*

*Inherited from [Config](config.md).[from](config.md#static-from)*

*Overrides void*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`props` | Record‹string, any› |

**Returns:** *T*

___

### `Static` generateId

▸ **generateId**(): *string*

Generates unique application identifier.

**`static`** 

**Returns:** *string*

String identifier as uuid.

___

### `Static` getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropTypes](definablemixin.md#getproptypes)*

*Overrides [CreateEmployee](createemployee.md).[getPropTypes](createemployee.md#getproptypes)*

**Returns:** *[Props](../modules/types.md#props)*

___

### `Static` getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Inherited from [DefinableMixin](definablemixin.md).[getPropertyInitializers](definablemixin.md#getpropertyinitializers)*

*Overrides [CreateEmployee](createemployee.md).[getPropertyInitializers](createemployee.md#getpropertyinitializers)*

**Returns:** *[Props](../modules/types.md#props)*

## Object literals

### `Optional` clients

### ▪ **clients**? : *object*

▪ **Agenda**: *object*

* **CommandScheduler**: *object*

  * **processEvery**: *number* = 180000

▪ **MongoDB**: *object*

* **CommandScheduler**(): *object*

  * **useNewUrlParser**: *boolean* = true

  * **useUnifiedTopology**: *boolean* = true

* **CommitStore**(): *object*

  * **useNewUrlParser**: *boolean* = true

  * **useUnifiedTopology**: *boolean* = true

* **Snapshotter**(): *object*

  * **useNewUrlParser**: *boolean* = true

  * **useUnifiedTopology**: *boolean* = true

___

### `Optional` conversion

### ▪ **conversion**? : *object*

###  type

• **type**: *"runtime"* = "runtime"

___

### `Optional` description

### ▪ **description**? : *object*

###  formatting

• **formatting**: *"default"* = "default"

___

### `Optional` validation

### ▪ **validation**? : *object*

###  type

• **type**: *"runtime"* = "runtime"

___

### `Static` defaultMongoDBOptions

### ▪ **defaultMongoDBOptions**: *object*

###  useNewUrlParser

• **useNewUrlParser**: *boolean* = true

###  useUnifiedTopology

• **useUnifiedTopology**: *boolean* = true

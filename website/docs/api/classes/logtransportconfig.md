---
id: "logtransportconfig"
title: "LogTransportConfig"
sidebar_label: "LogTransportConfig"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

  ↳ [Config](config.md)

* Config

  ↳ **LogTransportConfig**

## Implements

* [Definable](../interfaces/types.definable.md)
* [Hookable](../interfaces/types.hookable.md)
* [Configurable](../interfaces/types.configurable.md)
* Definable
* Hookable
* Configurable

## Index

### Constructors

* [constructor](logtransportconfig.md#constructor)

### Properties

* [abbreviationLength](logtransportconfig.md#optional-abbreviationlength)
* [included](logtransportconfig.md#optional-included)
* [inspectDepth](logtransportconfig.md#optional-inspectdepth)
* [isEnabled](logtransportconfig.md#optional-isenabled)
* [level](logtransportconfig.md#optional-level)
* [merged](logtransportconfig.md#optional-merged)
* [timestampFormat](logtransportconfig.md#optional-timestampformat)

### Methods

* [assign](logtransportconfig.md#assign)
* [equals](logtransportconfig.md#equals)
* [get](logtransportconfig.md#get)
* [getActions](logtransportconfig.md#getactions)
* [getDefault](logtransportconfig.md#getdefault)
* [getExact](logtransportconfig.md#getexact)
* [getHook](logtransportconfig.md#gethook)
* [getHookOrThrow](logtransportconfig.md#gethookorthrow)
* [getHooks](logtransportconfig.md#gethooks)
* [getPropTypes](logtransportconfig.md#getproptypes)
* [getPropertyInitializers](logtransportconfig.md#getpropertyinitializers)
* [has](logtransportconfig.md#has)
* [hasAction](logtransportconfig.md#hasaction)
* [hasDefault](logtransportconfig.md#hasdefault)
* [hasHook](logtransportconfig.md#hashook)
* [include](logtransportconfig.md#include)
* [isConfigurable](logtransportconfig.md#isconfigurable)
* [merge](logtransportconfig.md#merge)
* [overrideHook](logtransportconfig.md#overridehook)
* [registerHook](logtransportconfig.md#registerhook)
* [removeHook](logtransportconfig.md#removehook)
* [set](logtransportconfig.md#set)
* [toPlainObject](logtransportconfig.md#toplainobject)
* [validateProps](logtransportconfig.md#validateprops)
* [from](logtransportconfig.md#static-from)
* [getPropTypes](logtransportconfig.md#static-getproptypes)
* [getPropertyInitializers](logtransportconfig.md#static-getpropertyinitializers)

### Object literals

* [flags](logtransportconfig.md#optional-flags)
* [logColors](logtransportconfig.md#optional-logcolors)
* [messages](logtransportconfig.md#optional-messages)
* [parts](logtransportconfig.md#optional-parts)
* [partsColors](logtransportconfig.md#optional-partscolors)

## Constructors

###  constructor

\+ **new LogTransportConfig**(`props?`: Partial‹[LogTransportConfig](logtransportconfig.md)›): *[LogTransportConfig](logtransportconfig.md)*

*Overrides [Config](config.md).[constructor](config.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`props?` | Partial‹[LogTransportConfig](logtransportconfig.md)› |

**Returns:** *[LogTransportConfig](logtransportconfig.md)*

## Properties

### `Optional` abbreviationLength

• **abbreviationLength**? : *number* = 15

___

### `Optional` included

• **included**? : *Record‹string, [Configurable](../interfaces/types.configurable.md)›*

*Inherited from [Config](config.md).[included](config.md#optional-included)*

*Overrides void*

___

### `Optional` inspectDepth

• **inspectDepth**? : *number* = 0

___

### `Optional` isEnabled

• **isEnabled**? : *boolean* = true

___

### `Optional` level

• **level**? : *[LogLevel](../modules/types.md#loglevel)* = "info"

___

### `Optional` merged

• **merged**? : *Record‹string, [Configurable](../interfaces/types.configurable.md)›*

*Inherited from [Config](config.md).[merged](config.md#optional-merged)*

*Overrides void*

___

### `Optional` timestampFormat

• **timestampFormat**? : *string* = "HH:mm:ss"

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

### `Optional` flags

### ▪ **flags**? : *object*

###  includeStackTrace

• **includeStackTrace**: *true* = true

###  isAbbreviatingSources

• **isAbbreviatingSources**: *false* = false

###  isColored

• **isColored**: *true* = true

###  isLabeled

• **isLabeled**: *false* = false

###  isTimestamped

• **isTimestamped**: *true* = true

###  isWholeLineColored

• **isWholeLineColored**: *true* = true

###  showMethod

• **showMethod**: *true* = true

###  showTarget

• **showTarget**: *true* = true

___

### `Optional` logColors

### ▪ **logColors**? : *object*

###  alert

• **alert**: *string* = "bold yellow"

###  crit

• **crit**: *string* = "bold red"

###  debug

• **debug**: *string* = "bold cyan"

###  emerg

• **emerg**: *string* = "bold redBG"

###  error

• **error**: *string* = "red"

###  info

• **info**: *string* = "white"

###  notice

• **notice**: *string* = "blue"

###  warning

• **warning**: *string* = "yellow"

___

### `Optional` messages

### ▪ **messages**? : *object*

###  exit

• **exit**: *any* = chalk`{gray exit}`

###  start

• **start**: *any* = chalk`{gray start}`

___

### `Optional` parts

### ▪ **parts**? : *object*

###  initial

• **initial**: *string* = ""

###  label

• **label**: *string* = ""

###  separator

• **separator**: *string* = " "

___

### `Optional` partsColors

### ▪ **partsColors**? : *object*

###  initial

• **initial**: *string* = "white"

###  label

• **label**: *string* = "white"

###  method

• **method**: *string* = "white"

###  separator

• **separator**: *string* = "white"

###  target

• **target**: *string* = "white"

###  timestamp

• **timestamp**: *string* = "white"

---
id: "types.logger"
title: "@eveble/eveble"
sidebar_label: "Logger"
---

## Hierarchy

* object

* [Stateful](types.stateful.md)

* object

* Stateful

  ↳ **Logger**

## Implemented by

* [Logger](../classes/logger.md)

## Index

### Properties

* [levels](types.logger.md#readonly-levels)
* [state](types.logger.md#state)

### Methods

* [alert](types.logger.md#alert)
* [crit](types.logger.md#crit)
* [debug](types.logger.md#debug)
* [emerg](types.logger.md#emerg)
* [error](types.logger.md#error)
* [getPriority](types.logger.md#getpriority)
* [getSelectableStates](types.logger.md#getselectablestates)
* [getState](types.logger.md#getstate)
* [getTransport](types.logger.md#gettransport)
* [getTransports](types.logger.md#gettransports)
* [hasState](types.logger.md#hasstate)
* [hasTransport](types.logger.md#hastransport)
* [info](types.logger.md#info)
* [isInOneOfStates](types.logger.md#isinoneofstates)
* [isInState](types.logger.md#isinstate)
* [isRunning](types.logger.md#isrunning)
* [isStopped](types.logger.md#isstopped)
* [log](types.logger.md#log)
* [notice](types.logger.md#notice)
* [overrideTransport](types.logger.md#overridetransport)
* [registerTransport](types.logger.md#registertransport)
* [removeTransport](types.logger.md#removetransport)
* [setState](types.logger.md#setstate)
* [start](types.logger.md#start)
* [stop](types.logger.md#stop)
* [validateState](types.logger.md#validatestate)
* [warning](types.logger.md#warning)

## Properties

### `Readonly` levels

• **levels**: *[LogLevels](../modules/types.md#loglevels)*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Inherited from [Stateful](types.stateful.md).[state](types.stateful.md#state)*

*Overrides void*

## Methods

###  alert

▸ **alert**(`entry`: string | [LogEntry](types.logentry.md), ...`args`: any[]): *void*

*Inherited from __type.alert*

*Overrides __type.alert*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  crit

▸ **crit**(`entry`: string | [LogEntry](types.logentry.md), ...`args`: any[]): *void*

*Inherited from __type.crit*

*Overrides __type.crit*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  debug

▸ **debug**(`entry`: string | [LogEntry](types.logentry.md), ...`args`: any[]): *void*

*Inherited from __type.debug*

*Overrides __type.debug*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  emerg

▸ **emerg**(`entry`: string | [LogEntry](types.logentry.md), ...`args`: any[]): *void*

*Inherited from __type.emerg*

*Overrides __type.emerg*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  error

▸ **error**(`entry`: string | [LogEntry](types.logentry.md), ...`args`: any[]): *void*

*Inherited from __type.error*

*Overrides __type.error*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  getPriority

▸ **getPriority**(`level`: [LogLevel](../modules/types.md#loglevel)): *number*

**Parameters:**

Name | Type |
------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) |

**Returns:** *number*

▸ **getPriority**(`level`: [LogLevel](../modules/types.md#loglevel)): *number*

**Parameters:**

Name | Type |
------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) |

**Returns:** *number*

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Inherited from [Stateful](types.stateful.md).[getSelectableStates](types.stateful.md#getselectablestates)*

*Overrides void*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Inherited from [Stateful](types.stateful.md).[getState](types.stateful.md#getstate)*

*Overrides void*

**Returns:** *[State](../modules/types.md#state)*

___

###  getTransport

▸ **getTransport**(`id`: string): *[LogTransport](types.logtransport.md) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *[LogTransport](types.logtransport.md) | undefined*

▸ **getTransport**(`id`: string): *LogTransport | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *LogTransport | undefined*

___

###  getTransports

▸ **getTransports**(): *Map‹string, [LogTransport](types.logtransport.md)›*

**Returns:** *Map‹string, [LogTransport](types.logtransport.md)›*

▸ **getTransports**(): *Map‹string, LogTransport›*

**Returns:** *Map‹string, LogTransport›*

___

###  hasState

▸ **hasState**(): *boolean*

*Inherited from [Stateful](types.stateful.md).[hasState](types.stateful.md#hasstate)*

*Overrides void*

**Returns:** *boolean*

___

###  hasTransport

▸ **hasTransport**(`id`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *boolean*

▸ **hasTransport**(`id`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *boolean*

___

###  info

▸ **info**(`entry`: string | [LogEntry](types.logentry.md), ...`args`: any[]): *void*

*Inherited from __type.info*

*Overrides __type.info*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Inherited from [Stateful](types.stateful.md).[isInOneOfStates](types.stateful.md#isinoneofstates)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Inherited from [Stateful](types.stateful.md).[isInState](types.stateful.md#isinstate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isRunning

▸ **isRunning**(): *boolean*

**Returns:** *boolean*

▸ **isRunning**(): *boolean*

**Returns:** *boolean*

___

###  isStopped

▸ **isStopped**(): *boolean*

**Returns:** *boolean*

▸ **isStopped**(): *boolean*

**Returns:** *boolean*

___

###  log

▸ **log**(`level`: [LogLevel](../modules/types.md#loglevel), `entry`: string | [LogEntry](types.logentry.md), ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) |
`entry` | string &#124; [LogEntry](types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

▸ **log**(`level`: [LogLevel](../modules/types.md#loglevel), `entry`: string | LogEntry, ...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) |
`entry` | string &#124; LogEntry |
`...args` | any[] |

**Returns:** *void*

___

###  notice

▸ **notice**(`entry`: string | [LogEntry](types.logentry.md), ...`args`: any[]): *void*

*Inherited from __type.notice*

*Overrides __type.notice*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  overrideTransport

▸ **overrideTransport**(`id`: string, `transport`: [LogTransport](types.logtransport.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`transport` | [LogTransport](types.logtransport.md) |

**Returns:** *void*

▸ **overrideTransport**(`id`: string, `transport`: LogTransport): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`transport` | LogTransport |

**Returns:** *void*

___

###  registerTransport

▸ **registerTransport**(`id`: string, `transport`: [LogTransport](types.logtransport.md), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`transport` | [LogTransport](types.logtransport.md) |
`shouldOverride?` | boolean |

**Returns:** *void*

▸ **registerTransport**(`id`: string, `transport`: LogTransport, `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`transport` | LogTransport |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeTransport

▸ **removeTransport**(`id`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *void*

▸ **removeTransport**(`id`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *void*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Inherited from [Stateful](types.stateful.md).[setState](types.stateful.md#setstate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  start

▸ **start**(): *void*

**Returns:** *void*

▸ **start**(): *void*

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

**Returns:** *void*

▸ **stop**(): *void*

**Returns:** *void*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](../classes/extendableerror.md#static-error)): *boolean*

*Inherited from [Stateful](types.stateful.md).[validateState](types.stateful.md#validatestate)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | [Error](../classes/extendableerror.md#static-error) |

**Returns:** *boolean*

___

###  warning

▸ **warning**(`entry`: string | [LogEntry](types.logentry.md), ...`args`: any[]): *void*

*Inherited from __type.warning*

*Overrides __type.warning*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

---
id: "logger"
title: "Logger"
sidebar_label: "Logger"
---

## Type parameters

▪ **T**: *SuperConstructor*

▪ **T**: *SuperConstructor*

## Hierarchy

* SuperPrototypeSelector‹[StatefulMixin](statefulmixin.md) | [RFC5424LoggingMixin](rfc5424loggingmixin.md), this› & [StatefulMixin](statefulmixin.md)‹this› & [RFC5424LoggingMixin](rfc5424loggingmixin.md)‹this›

* SuperPrototypeSelector‹StatefulMixin | RFC5424LoggingMixin, this› & StatefulMixin‹this› & RFC5424LoggingMixin‹this›

  ↳ **Logger**

## Implements

* [Stateful](../interfaces/types.stateful.md)
* [Logger](../interfaces/types.logger.md)
* Stateful
* Logger

## Index

### Constructors

* [constructor](logger.md#constructor)

### Properties

* [levels](logger.md#readonly-levels)
* [state](logger.md#state)
* [STATES](logger.md#static-states)

### Methods

* [alert](logger.md#alert)
* [crit](logger.md#crit)
* [debug](logger.md#debug)
* [emerg](logger.md#emerg)
* [error](logger.md#error)
* [getPriority](logger.md#getpriority)
* [getSelectableStates](logger.md#getselectablestates)
* [getState](logger.md#getstate)
* [getTransport](logger.md#gettransport)
* [getTransports](logger.md#gettransports)
* [hasState](logger.md#hasstate)
* [hasTransport](logger.md#hastransport)
* [info](logger.md#info)
* [isInOneOfStates](logger.md#isinoneofstates)
* [isInState](logger.md#isinstate)
* [isRunning](logger.md#isrunning)
* [isStopped](logger.md#isstopped)
* [log](logger.md#log)
* [notice](logger.md#notice)
* [overrideTransport](logger.md#overridetransport)
* [registerTransport](logger.md#registertransport)
* [removeTransport](logger.md#removetransport)
* [setState](logger.md#setstate)
* [start](logger.md#start)
* [stop](logger.md#stop)
* [validateState](logger.md#validatestate)
* [warning](logger.md#warning)

## Constructors

###  constructor

\+ **new Logger**(`levels?`: [LogLevels](../modules/types.md#loglevels)): *[Logger](logger.md)*

Creates an instance of Logger.
Creates an instance of Logger.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`levels?` | [LogLevels](../modules/types.md#loglevels) | Logging levels for logger.  |

**Returns:** *[Logger](logger.md)*

## Properties

### `Readonly` levels

• **levels**: *[LogLevels](../modules/types.md#loglevels)*

*Implementation of [Logger](../interfaces/types.logger.md).[levels](../interfaces/types.logger.md#readonly-levels)*

___

###  state

• **state**: *[State](../modules/types.md#state)*

*Implementation of [Logger](../interfaces/types.logger.md).[state](../interfaces/types.logger.md#state)*

*Inherited from [StatefulMixin](statefulmixin.md).[state](statefulmixin.md#state)*

*Overrides void*

___

### `Static` STATES

▪ **STATES**: *[STATES](../enums/states.md)* = STATES

## Methods

###  alert

▸ **alert**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[alert](rfc5424loggingmixin.md#alert)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  crit

▸ **crit**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[crit](rfc5424loggingmixin.md#crit)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  debug

▸ **debug**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[debug](rfc5424loggingmixin.md#debug)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  emerg

▸ **emerg**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[emerg](rfc5424loggingmixin.md#emerg)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  error

▸ **error**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[error](rfc5424loggingmixin.md#error)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  getPriority

▸ **getPriority**(`level`: [LogLevel](../modules/types.md#loglevel)): *number*

*Implementation of [Logger](../interfaces/types.logger.md)*

Returns logging level priority.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) | Level name. |

**Returns:** *number*

Logging level priority as `number`.

___

###  getSelectableStates

▸ **getSelectableStates**(): *Record‹string, [State](../modules/types.md#state)›*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getSelectableStates](statefulmixin.md#getselectablestates)*

*Overrides [Task](task.md).[getSelectableStates](task.md#getselectablestates)*

**Returns:** *Record‹string, [State](../modules/types.md#state)›*

___

###  getState

▸ **getState**(): *[State](../modules/types.md#state)*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[getState](statefulmixin.md#getstate)*

*Overrides [Task](task.md).[getState](task.md#getstate)*

**Returns:** *[State](../modules/types.md#state)*

___

###  getTransport

▸ **getTransport**(`id`: string): *[LogTransport](../interfaces/types.logtransport.md) | undefined*

*Implementation of [Logger](../interfaces/types.logger.md)*

Returns transport.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | Identifier for the transport. |

**Returns:** *[LogTransport](../interfaces/types.logtransport.md) | undefined*

Logging transport as instance implementing `LogTransport` interface.

___

###  getTransports

▸ **getTransports**(): *Map‹string, [LogTransport](../interfaces/types.logtransport.md)›*

*Implementation of [Logger](../interfaces/types.logger.md)*

Returns all transport mappings on logger.

**Returns:** *Map‹string, [LogTransport](../interfaces/types.logtransport.md)›*

Mappings of all registered transports.

___

###  hasState

▸ **hasState**(): *boolean*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[hasState](statefulmixin.md#hasstate)*

*Overrides [Task](task.md).[hasState](task.md#hasstate)*

**Returns:** *boolean*

___

###  hasTransport

▸ **hasTransport**(`id`: string): *boolean*

*Implementation of [Logger](../interfaces/types.logger.md)*

Evaluates if transport is registered on logger.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | Identifier for the transport. |

**Returns:** *boolean*

Returns `true` if logger has transport registered, else `false`.

___

###  info

▸ **info**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[info](rfc5424loggingmixin.md#info)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  isInOneOfStates

▸ **isInOneOfStates**(`states`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInOneOfStates](statefulmixin.md#isinoneofstates)*

*Overrides [Task](task.md).[isInOneOfStates](task.md#isinoneofstates)*

**Parameters:**

Name | Type |
------ | ------ |
`states` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[isInState](statefulmixin.md#isinstate)*

*Overrides [Task](task.md).[isInState](task.md#isinstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  isRunning

▸ **isRunning**(): *boolean*

*Implementation of [Logger](../interfaces/types.logger.md)*

Evaluates if logger is running.

**Returns:** *boolean*

Returns `true` if logger is in 'running' state, else `false`.

___

###  isStopped

▸ **isStopped**(): *boolean*

*Implementation of [Logger](../interfaces/types.logger.md)*

Evaluates if logger is stopped.

**Returns:** *boolean*

Returns `true` if logger is not in running state, else `false`.

___

###  log

▸ **log**(`level`: [LogLevel](../modules/types.md#loglevel), `entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Overrides [RFC5424LoggingMixin](rfc5424loggingmixin.md).[log](rfc5424loggingmixin.md#log)*

Logs message for level.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) | Supported logging level by logging transport. |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) | Logging entry as a string or instance implementing `LogEntry` interface. |
`...args` | any[] | Any other arguments that will be attached to log entry.  |

**Returns:** *void*

___

###  notice

▸ **notice**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[notice](rfc5424loggingmixin.md#notice)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

___

###  overrideTransport

▸ **overrideTransport**(`id`: string, `transport`: [LogTransport](../interfaces/types.logtransport.md)): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

Override existing transport.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | Identifier for the transport. |
`transport` | [LogTransport](../interfaces/types.logtransport.md) | Instance implementing `LogTransport` interface.  |

**Returns:** *void*

___

###  registerTransport

▸ **registerTransport**(`id`: string, `transport`: [LogTransport](../interfaces/types.logtransport.md), `shouldOverride?`: boolean): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

Registers logging transport.

**`throws`** {InvalidTransportIdError}
Thrown if the id argument is not a string.

**`throws`** {TransportExistsError}
Thrown if the transport would override existing one.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | Identifier for the transport. |
`transport` | [LogTransport](../interfaces/types.logtransport.md) | Instance implementing `LogTransport` interface. |
`shouldOverride?` | boolean | Flag indicating that transport should be overridden. |

**Returns:** *void*

___

###  removeTransport

▸ **removeTransport**(`id`: string): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

Removes transport from logger's transports.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | Identifier for the transport.  |

**Returns:** *void*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[setState](statefulmixin.md#setstate)*

*Overrides [Task](task.md).[setState](task.md#setstate)*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

___

###  start

▸ **start**(): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

Starts logging.

**`throws`** {InvalidStateError}
Thrown if logger is not in one of valid states: 'constructed' or 'stopped'.

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

Stops logging.

**Returns:** *void*

___

###  validateState

▸ **validateState**(`stateOrStates`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[], `error?`: [Error](extendableerror.md#static-error)): *boolean*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [StatefulMixin](statefulmixin.md).[validateState](statefulmixin.md#validatestate)*

*Overrides [Task](task.md).[validateState](task.md#validatestate)*

**Parameters:**

Name | Type |
------ | ------ |
`stateOrStates` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |
`error?` | [Error](extendableerror.md#static-error) |

**Returns:** *boolean*

___

###  warning

▸ **warning**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

*Implementation of [Logger](../interfaces/types.logger.md)*

*Inherited from [RFC5424LoggingMixin](rfc5424loggingmixin.md).[warning](rfc5424loggingmixin.md#warning)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) |
`...args` | any[] |

**Returns:** *void*

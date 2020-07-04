---
id: "types.logtransport"
title: "@eveble/eveble"
sidebar_label: "LogTransport"
---

## Hierarchy

* object

* object

  ↳ **LogTransport**

## Implemented by

* [ConsoleTransport](../classes/consoletransport.md)

## Index

### Properties

* [level](types.logtransport.md#readonly-level)
* [logger](types.logtransport.md#logger)

### Methods

* [alert](types.logtransport.md#alert)
* [crit](types.logtransport.md#crit)
* [debug](types.logtransport.md#debug)
* [emerg](types.logtransport.md#emerg)
* [error](types.logtransport.md#error)
* [info](types.logtransport.md#info)
* [isLoggable](types.logtransport.md#isloggable)
* [log](types.logtransport.md#log)
* [notice](types.logtransport.md#notice)
* [warning](types.logtransport.md#warning)

## Properties

### `Readonly` level

• **level**: *[LogLevel](../modules/types.md#loglevel)*

___

###  logger

• **logger**: *Logger*

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

###  isLoggable

▸ **isLoggable**(`level`: [LogLevel](../modules/types.md#loglevel)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) |

**Returns:** *boolean*

▸ **isLoggable**(`level`: [LogLevel](../modules/types.md#loglevel)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`level` | [LogLevel](../modules/types.md#loglevel) |

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

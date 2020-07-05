---
id: "rfc5424loggingmixin"
title: "RFC5424LoggingMixin"
sidebar_label: "RFC5424LoggingMixin"
---

## Hierarchy

* **RFC5424LoggingMixin**

  ↳ [LogTransport](logtransport.md)

## Index

### Methods

* [alert](rfc5424loggingmixin.md#alert)
* [crit](rfc5424loggingmixin.md#crit)
* [debug](rfc5424loggingmixin.md#debug)
* [emerg](rfc5424loggingmixin.md#emerg)
* [error](rfc5424loggingmixin.md#error)
* [info](rfc5424loggingmixin.md#info)
* [log](rfc5424loggingmixin.md#log)
* [notice](rfc5424loggingmixin.md#notice)
* [warning](rfc5424loggingmixin.md#warning)

## Methods

###  alert

▸ **alert**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

Logs action must be taken immediately.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) | Logging entry as a string or loggable. |
`...args` | any[] | Any other arguments that will be attached to log entry.  |

**Returns:** *void*

___

###  crit

▸ **crit**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

Logs critical conditions.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) | Logging entry as a string or loggable. |
`...args` | any[] | Any other arguments that will be attached to log entry.  |

**Returns:** *void*

___

###  debug

▸ **debug**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

Logs debug-level messages.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) | Logging entry as a string or loggable. |
`...args` | any[] | Any other arguments that will be attached to log entry.  |

**Returns:** *void*

___

###  emerg

▸ **emerg**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

Logs emergency system is unusable.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) | Logging entry as a string or loggable. |
`...args` | any[] | Any other arguments that will be attached to log entry.  |

**Returns:** *void*

___

###  error

▸ **error**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

Logs error conditions.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) | Logging entry as a string or loggable. |
`...args` | any[] | Any other arguments that will be attached to log entry.  |

**Returns:** *void*

___

###  info

▸ **info**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

Logs informational messages.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) | Logging entry as a string or loggable. |
`...args` | any[] | Any other arguments that will be attached to log entry.  |

**Returns:** *void*

___

###  log

▸ **log**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

[PLACEHOLDER]: Logs message for level.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) | Logging entry as a string or loggable. |
`...args` | any[] | Any other arguments that will be attached to log entry.  |

**Returns:** *void*

___

###  notice

▸ **notice**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

Logs normal but significant condition.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) | Logging entry as a string or loggable. |
`...args` | any[] | Any other arguments that will be attached to log entry.  |

**Returns:** *void*

___

###  warning

▸ **warning**(`entry`: string | [LogEntry](../interfaces/types.logentry.md), ...`args`: any[]): *void*

Logs warning conditions.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entry` | string &#124; [LogEntry](../interfaces/types.logentry.md) | Logging entry as a string or loggable. |
`...args` | any[] | Any other arguments that will be attached to log entry.  |

**Returns:** *void*

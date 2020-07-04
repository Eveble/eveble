---
id: "types.configurable"
title: "@eveble/eveble"
sidebar_label: "Configurable"
---

## Hierarchy

* [Definable](types.definable.md)

* Definable

  ↳ **Configurable**

## Implemented by

* [AppConfig](../classes/appconfig.md)
* [Config](../classes/config.md)
* [EvebleConfig](../classes/evebleconfig.md)
* [LogTransportConfig](../classes/logtransportconfig.md)
* [LoggingConfig](../classes/loggingconfig.md)
* [MongoDBCollectionConfig](../classes/mongodbcollectionconfig.md)
* [MongoDBDatabaseConfig](../classes/mongodbdatabaseconfig.md)

## Index

### Methods

* [assign](types.configurable.md#assign)
* [equals](types.configurable.md#equals)
* [get](types.configurable.md#get)
* [getDefault](types.configurable.md#getdefault)
* [getExact](types.configurable.md#getexact)
* [getPropTypes](types.configurable.md#getproptypes)
* [getPropertyInitializers](types.configurable.md#getpropertyinitializers)
* [has](types.configurable.md#has)
* [hasDefault](types.configurable.md#hasdefault)
* [include](types.configurable.md#include)
* [isConfigurable](types.configurable.md#isconfigurable)
* [merge](types.configurable.md#merge)
* [set](types.configurable.md#set)
* [toPlainObject](types.configurable.md#toplainobject)
* [validateProps](types.configurable.md#validateprops)

## Methods

###  assign

▸ **assign**(`props`: [Props](../modules/types.md#props)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *void*

▸ **assign**(`props`: [Props](../modules/types.md#props)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |

**Returns:** *void*

___

###  equals

▸ **equals**(`other`: any): *boolean*

*Inherited from [Definable](types.definable.md).[equals](types.definable.md#equals)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  get

▸ **get**(`path`: string, `runtimeDefaultValue?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`runtimeDefaultValue?` | any |

**Returns:** *any*

▸ **get**(`path`: string, `runtimeDefaultValue?`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`runtimeDefaultValue?` | any |

**Returns:** *any*

___

###  getDefault

▸ **getDefault**(`path`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *any*

▸ **getDefault**(`path`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *any*

___

###  getExact

▸ **getExact**(`path`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *any*

▸ **getExact**(`path`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *any*

___

###  getPropTypes

▸ **getPropTypes**(): *Record‹keyof any, any›*

*Inherited from [Definable](types.definable.md).[getPropTypes](types.definable.md#getproptypes)*

*Overrides void*

**Returns:** *Record‹keyof any, any›*

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Inherited from [Definable](types.definable.md).[getPropertyInitializers](types.definable.md#getpropertyinitializers)*

*Overrides void*

**Returns:** *[Props](../modules/types.md#props)*

___

###  has

▸ **has**(`path`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

▸ **has**(`path`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

___

###  hasDefault

▸ **hasDefault**(`path`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

▸ **hasDefault**(`path`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

___

###  include

▸ **include**(`config`: [Configurable](types.configurable.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Configurable](types.configurable.md) |

**Returns:** *void*

▸ **include**(`config`: Configurable): *void*

**Parameters:**

Name | Type |
------ | ------ |
`config` | Configurable |

**Returns:** *void*

___

###  isConfigurable

▸ **isConfigurable**(`path`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

▸ **isConfigurable**(`path`: string): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *boolean*

___

###  merge

▸ **merge**(`config`: [Configurable](types.configurable.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`config` | [Configurable](types.configurable.md) |

**Returns:** *void*

▸ **merge**(`config`: Configurable): *void*

**Parameters:**

Name | Type |
------ | ------ |
`config` | Configurable |

**Returns:** *void*

___

###  set

▸ **set**(`path`: string, `value`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`value` | any |

**Returns:** *void*

▸ **set**(`path`: string, `value`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |
`value` | any |

**Returns:** *void*

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Inherited from [Definable](types.definable.md).[toPlainObject](types.definable.md#toplainobject)*

*Overrides void*

**Returns:** *[Props](../modules/types.md#props)*

___

###  validateProps

▸ **validateProps**(`props`: [Props](../modules/types.md#props), `propTypes`: [PropTypes](../modules/types.md#proptypes), `isStrict?`: boolean): *boolean*

*Inherited from [Definable](types.definable.md).[validateProps](types.definable.md#validateprops)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [Props](../modules/types.md#props) |
`propTypes` | [PropTypes](../modules/types.md#proptypes) |
`isStrict?` | boolean |

**Returns:** *boolean*

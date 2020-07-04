---
id: "types.library"
title: "@eveble/eveble"
sidebar_label: "Library"
---

## Hierarchy

* **Library**

## Index

### Methods

* [getType](types.library.md#gettype)
* [getTypeOrThrow](types.library.md#gettypeorthrow)
* [getTypes](types.library.md#gettypes)
* [hasType](types.library.md#hastype)
* [isInState](types.library.md#isinstate)
* [overrideType](types.library.md#overridetype)
* [registerType](types.library.md#registertype)
* [removeType](types.library.md#removetype)
* [setState](types.library.md#setstate)

## Methods

###  getType

▸ **getType**(`typeName`: [TypeName](../modules/types.md#typename)): *[Serializable](types.serializable.md) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *[Serializable](types.serializable.md) | undefined*

▸ **getType**(`typeName`: [TypeName](../modules/types.md#typename)): *Serializable | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *Serializable | undefined*

___

###  getTypeOrThrow

▸ **getTypeOrThrow**(`typeName`: [TypeName](../modules/types.md#typename)): *[Serializable](types.serializable.md)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *[Serializable](types.serializable.md)*

▸ **getTypeOrThrow**(`typeName`: [TypeName](../modules/types.md#typename)): *Serializable*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *Serializable*

___

###  getTypes

▸ **getTypes**(): *Map‹string, [Serializable](types.serializable.md)›*

**Returns:** *Map‹string, [Serializable](types.serializable.md)›*

▸ **getTypes**(): *Map‹string, Serializable›*

**Returns:** *Map‹string, Serializable›*

___

###  hasType

▸ **hasType**(`typeName`: [TypeName](../modules/types.md#typename)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *boolean*

▸ **hasType**(`typeName`: [TypeName](../modules/types.md#typename)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *boolean*

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

▸ **isInState**(`state`: [State](../modules/types.md#state) | [State](../modules/types.md#state)[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) &#124; [State](../modules/types.md#state)[] |

**Returns:** *boolean*

___

###  overrideType

▸ **overrideType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: [Serializable](types.serializable.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`type` | [Serializable](types.serializable.md) |

**Returns:** *void*

▸ **overrideType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: Serializable): *void*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`type` | Serializable |

**Returns:** *void*

___

###  registerType

▸ **registerType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: [Serializable](types.serializable.md), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`type` | [Serializable](types.serializable.md) |
`shouldOverride?` | boolean |

**Returns:** *void*

▸ **registerType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: Serializable, `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`type` | Serializable |
`shouldOverride?` | boolean |

**Returns:** *void*

___

###  removeType

▸ **removeType**(`typeName`: [TypeName](../modules/types.md#typename)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *void*

▸ **removeType**(`typeName`: [TypeName](../modules/types.md#typename)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *void*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | [State](../modules/types.md#state) |

**Returns:** *void*

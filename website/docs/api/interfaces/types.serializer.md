---
id: "types.serializer"
title: "@eveble/eveble"
sidebar_label: "Serializer"
---

## Hierarchy

* **Serializer**

## Implemented by

* [EJSONSerializerAdapter](../classes/ejsonserializeradapter.md)

## Index

### Methods

* [clone](types.serializer.md#clone)
* [equals](types.serializer.md#equals)
* [fromData](types.serializer.md#fromdata)
* [fromJSONValue](types.serializer.md#fromjsonvalue)
* [getType](types.serializer.md#gettype)
* [getTypeOrThrow](types.serializer.md#gettypeorthrow)
* [getTypes](types.serializer.md#gettypes)
* [getTypesNames](types.serializer.md#gettypesnames)
* [hasType](types.serializer.md#hastype)
* [isTypeInstance](types.serializer.md#istypeinstance)
* [overrideType](types.serializer.md#overridetype)
* [parse](types.serializer.md#parse)
* [registerType](types.serializer.md#registertype)
* [removeType](types.serializer.md#removetype)
* [removeTypes](types.serializer.md#removetypes)
* [stringify](types.serializer.md#stringify)
* [toData](types.serializer.md#todata)
* [toJSONValue](types.serializer.md#tojsonvalue)

## Methods

###  clone

▸ **clone**‹**T**›(`value`: T): *T*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *T*

▸ **clone**‹**T**›(`value`: T): *T*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *T*

___

###  equals

▸ **equals**(`a`: any, `b`: any, `options?`: object): *boolean*

**Parameters:**

▪ **a**: *any*

▪ **b**: *any*

▪`Optional`  **options**: *object*

Name | Type |
------ | ------ |
`keyOrderSensitive` | boolean |

**Returns:** *boolean*

▸ **equals**(`a`: any, `b`: any, `options?`: object): *boolean*

**Parameters:**

▪ **a**: *any*

▪ **b**: *any*

▪`Optional`  **options**: *object*

Name | Type |
------ | ------ |
`keyOrderSensitive` | boolean |

**Returns:** *boolean*

___

###  fromData

▸ **fromData**(`data`: Record‹string | number, any›): *Record‹string | number, any›*

**Parameters:**

Name | Type |
------ | ------ |
`data` | Record‹string &#124; number, any› |

**Returns:** *Record‹string | number, any›*

▸ **fromData**(`data`: Record‹string | number, any›): *Record‹string | number, any›*

**Parameters:**

Name | Type |
------ | ------ |
`data` | Record‹string &#124; number, any› |

**Returns:** *Record‹string | number, any›*

___

###  fromJSONValue

▸ **fromJSONValue**(`value`: Record‹string, any›): *Record‹string, any› | [Serializable](types.serializable.md)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Record‹string, any› |

**Returns:** *Record‹string, any› | [Serializable](types.serializable.md)*

▸ **fromJSONValue**(`value`: Record‹string, any›): *Record‹string, any› | Serializable*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Record‹string, any› |

**Returns:** *Record‹string, any› | Serializable*

___

###  getType

▸ **getType**(`typeName`: [TypeName](../modules/types.md#typename)): *[Type](../modules/types.md#type) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *[Type](../modules/types.md#type) | undefined*

▸ **getType**(`typeName`: [TypeName](../modules/types.md#typename)): *[Type](../modules/types.md#type) | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *[Type](../modules/types.md#type) | undefined*

___

###  getTypeOrThrow

▸ **getTypeOrThrow**(`typeName`: [TypeName](../modules/types.md#typename)): *[Type](../modules/types.md#type)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *[Type](../modules/types.md#type)*

▸ **getTypeOrThrow**(`typeName`: [TypeName](../modules/types.md#typename)): *[Type](../modules/types.md#type)*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |

**Returns:** *[Type](../modules/types.md#type)*

___

###  getTypes

▸ **getTypes**(): *Map‹[TypeName](../modules/types.md#typename), [Type](../modules/types.md#type)›*

**Returns:** *Map‹[TypeName](../modules/types.md#typename), [Type](../modules/types.md#type)›*

▸ **getTypes**(): *Map‹[TypeName](../modules/types.md#typename), [Type](../modules/types.md#type)›*

**Returns:** *Map‹[TypeName](../modules/types.md#typename), [Type](../modules/types.md#type)›*

___

###  getTypesNames

▸ **getTypesNames**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

▸ **getTypesNames**(): *[TypeName](../modules/types.md#typename)[]*

**Returns:** *[TypeName](../modules/types.md#typename)[]*

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

###  isTypeInstance

▸ **isTypeInstance**(`typeInstance`: [Serializable](types.serializable.md)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`typeInstance` | [Serializable](types.serializable.md) |

**Returns:** *boolean*

▸ **isTypeInstance**(`typeInstance`: Serializable): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`typeInstance` | Serializable |

**Returns:** *boolean*

___

###  overrideType

▸ **overrideType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: [Type](../modules/types.md#type)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`type` | [Type](../modules/types.md#type) |

**Returns:** *void*

▸ **overrideType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: [Type](../modules/types.md#type)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`type` | [Type](../modules/types.md#type) |

**Returns:** *void*

___

###  parse

▸ **parse**(`str`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *any*

▸ **parse**(`str`: string): *any*

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *any*

___

###  registerType

▸ **registerType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: [Type](../modules/types.md#type), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`type` | [Type](../modules/types.md#type) |
`shouldOverride?` | boolean |

**Returns:** *void*

▸ **registerType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: [Type](../modules/types.md#type), `shouldOverride?`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) |
`type` | [Type](../modules/types.md#type) |
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

###  removeTypes

▸ **removeTypes**(): *void*

**Returns:** *void*

▸ **removeTypes**(): *void*

**Returns:** *void*

___

###  stringify

▸ **stringify**(`value`: any, `options?`: object): *string*

**Parameters:**

▪ **value**: *any*

▪`Optional`  **options**: *object*

Name | Type |
------ | ------ |
`canonical` | boolean |
`indent` | boolean &#124; number |

**Returns:** *string*

▸ **stringify**(`value`: any, `options?`: object): *string*

**Parameters:**

▪ **value**: *any*

▪`Optional`  **options**: *object*

Name | Type |
------ | ------ |
`canonical` | boolean |
`indent` | boolean &#124; number |

**Returns:** *string*

___

###  toData

▸ **toData**(`arg`: Record‹string | number, any›): *Record‹string | number, any›*

**Parameters:**

Name | Type |
------ | ------ |
`arg` | Record‹string &#124; number, any› |

**Returns:** *Record‹string | number, any›*

▸ **toData**(`arg`: Record‹string | number, any›): *Record‹string | number, any›*

**Parameters:**

Name | Type |
------ | ------ |
`arg` | Record‹string &#124; number, any› |

**Returns:** *Record‹string | number, any›*

___

###  toJSONValue

▸ **toJSONValue**(`value`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *any*

▸ **toJSONValue**(`value`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *any*

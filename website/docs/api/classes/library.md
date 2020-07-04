---
id: "library"
title: "Library"
sidebar_label: "Library"
---

## Hierarchy

* **Library**

## Index

### Constructors

* [constructor](library.md#constructor)

### Methods

* [getType](library.md#gettype)
* [getTypeOrThrow](library.md#gettypeorthrow)
* [getTypes](library.md#gettypes)
* [hasType](library.md#hastype)
* [isInState](library.md#isinstate)
* [overrideType](library.md#overridetype)
* [registerType](library.md#registertype)
* [removeType](library.md#removetype)
* [setState](library.md#setstate)

### Object literals

* [STATES](library.md#static-states)

## Constructors

###  constructor

\+ **new Library**(): *[Library](library.md)*

Creates an instance of Library.
Creates an instance of Library.

**Returns:** *[Library](library.md)*

## Methods

###  getType

▸ **getType**(`typeName`: [TypeName](../modules/types.md#typename)): *[Serializable](../interfaces/types.serializable.md) | undefined*

Returns type by name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type name as mapping for type. |

**Returns:** *[Serializable](../interfaces/types.serializable.md) | undefined*

Registered type instance, else `undefined`.

___

###  getTypeOrThrow

▸ **getTypeOrThrow**(`typeName`: [TypeName](../modules/types.md#typename)): *[Serializable](../interfaces/types.serializable.md)*

Returns type by name.

**`throws`** {TypeNotFoundError}
Thrown if provided type can't be found on library.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type name as mapping for type. |

**Returns:** *[Serializable](../interfaces/types.serializable.md)*

Registered type instance, else throws.

___

###  getTypes

▸ **getTypes**(): *Map‹string, [Serializable](../interfaces/types.serializable.md)›*

Returns all registered types on Library.

**Returns:** *Map‹string, [Serializable](../interfaces/types.serializable.md)›*

Map of all registered types.

___

###  hasType

▸ **hasType**(`typeName`: [TypeName](../modules/types.md#typename)): *boolean*

Evaluates if type is already registered by name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type name as mapping for type. |

**Returns:** *boolean*

Returns `true` if type is registered, else `false`.

___

###  isInState

▸ **isInState**(`state`: [State](../modules/types.md#state)): *boolean*

Evaluates if target is in expected state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [State](../modules/types.md#state) | Expected state in which instance should be. |

**Returns:** *boolean*

Returns `true` if instance is in state, else `false`.

___

###  overrideType

▸ **overrideType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: any): *void*

Overrides already existing type by mapping on library.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type for which mapping will be created or overridden. |
`type` | any | Type constructor implementing `Serializable` interface for registration.  |

**Returns:** *void*

___

###  registerType

▸ **registerType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: any, `shouldOverride?`: boolean): *void*

Registers type on library.

**`throws`** {UnregistrableTypeError}
Thrown if type does not implement `Serializable` interface.

**`throws`** {TypeExistsError}
Thrown if type would overridden on library without explicit call.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type's name for which mapping will be created. |
`type` | any | Type constructor implementing `Serializable` interface for registration. |
`shouldOverride?` | boolean | Flag indicating that mapping should be overridden if exist. |

**Returns:** *void*

___

###  removeType

▸ **removeType**(`typeName`: [TypeName](../modules/types.md#typename)): *void*

Removes type by type name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type name as mapping for type.  |

**Returns:** *void*

___

###  setState

▸ **setState**(`state`: [State](../modules/types.md#state)): *void*

Sets instance state.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [State](../modules/types.md#state) | State to which instance should be set.  |

**Returns:** *void*

## Object literals

### `Static` STATES

### ▪ **STATES**: *object*

###  default

• **default**: *string* = "default"

###  override

• **override**: *string* = "override"

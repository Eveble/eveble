---
id: "versionablemixin"
title: "VersionableMixin"
sidebar_label: "VersionableMixin"
---

## Hierarchy

* **VersionableMixin**

## Index

### Properties

* [schemaVersion](versionablemixin.md#optional-schemaversion)

### Methods

* [getLegacyTransformer](versionablemixin.md#getlegacytransformer)
* [getLegacyTransformers](versionablemixin.md#getlegacytransformers)
* [getSchemaVersion](versionablemixin.md#getschemaversion)
* [hasLegacyTransformer](versionablemixin.md#haslegacytransformer)
* [overrideLegacyTransformer](versionablemixin.md#overridelegacytransformer)
* [registerLegacyTransformer](versionablemixin.md#registerlegacytransformer)
* [transformLegacyProps](versionablemixin.md#transformlegacyprops)

## Properties

### `Optional` schemaVersion

• **schemaVersion**? : *number*

## Methods

###  getLegacyTransformer

▸ **getLegacyTransformer**(`schemaVersion`: number): *[Hook](../modules/types.md#hook)*

Returns legacy transformer for schema version.

**`throws`** {LegacyTransformerNotFoundError}
Thrown if transformer for schema version can't be found.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schemaVersion` | number | Schema version. |

**Returns:** *[Hook](../modules/types.md#hook)*

Legacy transformer for schema version.

___

###  getLegacyTransformers

▸ **getLegacyTransformers**(): *[LegacyTransformers](../modules/types.md#legacytransformers)*

Returns all available legacy transformers.

**Returns:** *[LegacyTransformers](../modules/types.md#legacytransformers)*

Map instance of all registered legacy transformers with number version as a key and transformer function as a value.

___

###  getSchemaVersion

▸ **getSchemaVersion**(): *number | undefined*

Returns current instance schema version.

**Returns:** *number | undefined*

Schema version as a number, else `undefined`.

___

###  hasLegacyTransformer

▸ **hasLegacyTransformer**(`schemaVersion`: number): *boolean*

Evaluates is there is registered legacy transformer for schema version.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schemaVersion` | number | Schema version. |

**Returns:** *boolean*

Returns `true` if legacy transformer for schema version is registered, else `false`.

___

###  overrideLegacyTransformer

▸ **overrideLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook)): *void*

Overrides registered transformer by schema version or registers a new one.

**`throws`** {InvalidSchemaVersionError}
Thrown if the the schema version argument is not a number.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schemaVersion` | number | Schema version. |
`transformer` | [Hook](../modules/types.md#hook) | Transformer function. |

**Returns:** *void*

___

###  registerLegacyTransformer

▸ **registerLegacyTransformer**(`schemaVersion`: number, `transformer`: [Hook](../modules/types.md#hook), `shouldOverride?`: boolean): *void*

Registers legacy transformer for version.

**`throws`** {InvalidSchemaVersionError}
Thrown if the the schema version argument is not a number.

**`throws`** {LegacyTransformerAlreadyExistsError}
Thrown if transformer for version would overridden without explicit call.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`schemaVersion` | number | Schema version. |
`transformer` | [Hook](../modules/types.md#hook) | Transformer function. |
`shouldOverride?` | boolean | Flag indicating that transformer should be overridden if exist. |

**Returns:** *void*

___

###  transformLegacyProps

▸ **transformLegacyProps**(`props`: [Props](../modules/types.md#props)): *[Props](../modules/types.md#props)*

Registrable hook for transforming legacy schema.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | [Props](../modules/types.md#props) | Properties object to be transformed. |

**Returns:** *[Props](../modules/types.md#props)*

Transformed legacy properties or thier unchanged state if up to date.

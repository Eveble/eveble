---
id: "serializablemixin"
title: "SerializableMixin"
sidebar_label: "SerializableMixin"
---

## Hierarchy

* **SerializableMixin**

  ↳ [EjsonableMixin](ejsonablemixin.md)

## Index

### Methods

* [getTypeName](serializablemixin.md#gettypename)
* [toJSONValue](serializablemixin.md#tojsonvalue)
* [toString](serializablemixin.md#tostring)
* [getTypeName](serializablemixin.md#static-gettypename)
* [toString](serializablemixin.md#static-tostring)

## Methods

###  getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

Returns definable type name.

**Returns:** *[TypeName](../modules/types.md#typename)*

Type name as a string.

___

###  toJSONValue

▸ **toJSONValue**(): *Record‹string, any›*

Serializes value into a JSON-compatible value. It preserves all custom
field types, however the initial value type is not saved.

**`example`** 
```ts
@define('Address')
class Address extends Serializable {
  city: string;

  street: string;
}

@define('Person')
class Person extends Serializable {
  firstName: string;

  lastName: string;

  address?: Address;
}

const person = new Person({
  firstName: 'Jane',
  lastName: 'Doe',
  address: new Address({
    city: 'New York',
    street: 'Wall Street',
  }),
});

expect(person.toJSONValue()).to.be.eql({
  firstName: 'Jane',
  lastName: 'Doe',
  address: {
    city: 'New York',
    street: 'Wall Street',
  },
});

**Returns:** *Record‹string, any›*

Normalized value as JSON-compatible without type identifers.

___

###  toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

Returns definable type name

**Returns:** *[TypeName](../modules/types.md#typename)*

Type name as a string.

___

### `Static` getTypeName

▸ **getTypeName**(): *[TypeName](../modules/types.md#typename)*

Returns definable type name.

**Returns:** *[TypeName](../modules/types.md#typename)*

Type name as a string.

___

### `Static` toString

▸ **toString**(): *[TypeName](../modules/types.md#typename)*

Returns definable type name

**Returns:** *[TypeName](../modules/types.md#typename)*

Type name as a string.

---
id: "ejsonserializeradapter"
title: "EJSONSerializerAdapter"
sidebar_label: "EJSONSerializerAdapter"
---

## Hierarchy

* **EJSONSerializerAdapter**

## Implements

* [Serializer](../interfaces/types.serializer.md)
* Serializer

## Index

### Constructors

* [constructor](ejsonserializeradapter.md#constructor)

### Methods

* [clone](ejsonserializeradapter.md#clone)
* [equals](ejsonserializeradapter.md#equals)
* [fromData](ejsonserializeradapter.md#fromdata)
* [fromJSONValue](ejsonserializeradapter.md#fromjsonvalue)
* [getFactory](ejsonserializeradapter.md#getfactory)
* [getType](ejsonserializeradapter.md#gettype)
* [getTypeKey](ejsonserializeradapter.md#gettypekey)
* [getTypeOrThrow](ejsonserializeradapter.md#gettypeorthrow)
* [getTypes](ejsonserializeradapter.md#gettypes)
* [getTypesNames](ejsonserializeradapter.md#gettypesnames)
* [hasType](ejsonserializeradapter.md#hastype)
* [isTypeInstance](ejsonserializeradapter.md#istypeinstance)
* [overrideType](ejsonserializeradapter.md#overridetype)
* [parse](ejsonserializeradapter.md#parse)
* [registerType](ejsonserializeradapter.md#registertype)
* [removeType](ejsonserializeradapter.md#removetype)
* [removeTypes](ejsonserializeradapter.md#removetypes)
* [stringify](ejsonserializeradapter.md#stringify)
* [toData](ejsonserializeradapter.md#todata)
* [toJSONValue](ejsonserializeradapter.md#tojsonvalue)

## Constructors

###  constructor

\+ **new EJSONSerializerAdapter**(`typeKey?`: string): *[EJSONSerializerAdapter](ejsonserializeradapter.md)*

Creates an instance of EJSONSerializerAdapter.
Creates an instance of EJSONSerializerAdapter.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeKey?` | string | Identifier that will be use to identify custom types on `fromData` and `toData` serialization methods.  |

**Returns:** *[EJSONSerializerAdapter](ejsonserializeradapter.md)*

## Methods

###  clone

▸ **clone**‹**T**›(`value`: T): *T*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Return a deep copy of value.

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
  address: Address;
}

const address = new Address({
  city: 'New York',
  street: 'Wall Street',
});
const person = new Person({
  firstName: 'Jane',
  lastName: 'Doe',
  address,
});

const clonedPerson = serializer.clone<Person>(person);
expect(clonedPerson).to.be.instanceof(Person);
expect(clonedPerson).to.be.eql(person);
expect(clonedPerson).to.not.be.equal(person);
expect(clonedPerson.address).to.not.be.equal(address);
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | T | A value to copy. |

**Returns:** *T*

Cloned value without any reference

___

###  equals

▸ **equals**(`a`: any, `b`: any, `options?`: object): *boolean*

Return true if `a` and `b` are equal to each other. Return false otherwise.
Uses the `equals` method on `a` if present, otherwise performs a deep comparison.

**`example`** 
```ts
@define('Car')
class Car extends Serializable {
  brand: string;
}

const carA = new Car({
  brand: 'Audi',
});
const carB = new Car({
  brand: 'Audi',
});

expect(serializer.equals(carA, carB)).to.be.true;
```

**`example`** 
```ts
@define('Car')
class Car extends Serializable {
  brand: string;
}

const carA = new Car({
  brand: 'Audi',
});
const carB = new Car({
  brand: 'BMW',
});

expect(serializer.equals(carA, carB)).to.be.false;
```

**Parameters:**

▪ **a**: *any*

Base value.

▪ **b**: *any*

Other value.

▪`Optional`  **options**: *object*

Additional compering options.

Name | Type |
------ | ------ |
`keyOrderSensitive` | boolean |

**Returns:** *boolean*

___

###  fromData

▸ **fromData**‹**T**›(`data`: Record‹string, any›): *T*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Converts record-compatible argument to plain-object data.

**`example`** 
```ts
@define('Car')
class Car extends Serializable {
  brand: string;
}

const data = {
  _type: 'Car',
  brand: 'Bentley',
};

const typeInstance = serializer.fromData(data);
expect(typeInstance).to.be.instanceof(Car);
expect(typeInstance).to.be.eql(
  new Car({
    brand: 'Bentley',
  })
);
```

**Type parameters:**

▪ **T**: *[Serializable](../interfaces/types.serializable.md)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | Record‹string, any› | Data as an object. |

**Returns:** *T*

Converted data to `Serializable` instance.

___

###  fromJSONValue

▸ **fromJSONValue**(`value`: Record‹string, any›): *Record‹string, any› | [Serializable](../interfaces/types.serializable.md)*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Deserializes an EJSON value from its plain JSON representation.

**`throws`** {TypeNotFoundError}
Thrown if the value contains a serialized type that is not supported.

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
  address: Address;
}

const json = {
  $type: 'Person',
  $value: {
    firstName: 'Jane',
    lastName: 'Doe',
    address: {
      $type: 'Address',
      $value: {
        city: 'New York',
        street: 'Wall Street',
      },
    },
  },
};
const person = serializer.fromJSONValue(json);
expect(person).to.be.instanceof(Person);
expect(person).to.be.eql(
  new Person({
    firstName: 'Jane',
    lastName: 'Doe',
    address: new Address({
      city: 'New York',
      street: 'Wall Street',
    }),
  })
);
```

**`example`** 
```ts
const date = new Date('December 17, 1995 03:24:00');
const obj = {
  $date: date,
};

const json = serializer.toJSONValue(obj);
expect(serializer.fromJSONValue(json)).to.be.eql(date);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | Record‹string, any› | A value to deserialize into EJSON. |

**Returns:** *Record‹string, any› | [Serializable](../interfaces/types.serializable.md)*

Deserialized EJSON value.

___

###  getFactory

▸ **getFactory**(`typeName`: [TypeName](../modules/types.md#typename)): *Function & object*

Returns factory for type name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type name for type. |

**Returns:** *Function & object*

Factory function for type.

___

###  getType

▸ **getType**(`typeName`: [TypeName](../modules/types.md#typename)): *[Type](../modules/types.md#type) | undefined*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Returns type for type name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type name for type. |

**Returns:** *[Type](../modules/types.md#type) | undefined*

Type constructor, else `undefined`;

___

###  getTypeKey

▸ **getTypeKey**(): *string*

Returns type key identifier.

**Returns:** *string*

Type key identifier as a string.

___

###  getTypeOrThrow

▸ **getTypeOrThrow**(`typeName`: [TypeName](../modules/types.md#typename)): *[Type](../modules/types.md#type)*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Returns type for type name.

**`throws`** {TypeNotFoundError}
Thrown if type for type name can't be found.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type name for type. |

**Returns:** *[Type](../modules/types.md#type)*

Type constructor, else throws;

___

###  getTypes

▸ **getTypes**(): *Map‹[TypeName](../modules/types.md#typename), [Type](../modules/types.md#type)›*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Returns all data-types registered on EJSON.

**Returns:** *Map‹[TypeName](../modules/types.md#typename), [Type](../modules/types.md#type)›*

Returns object with relation typeName:type.

___

###  getTypesNames

▸ **getTypesNames**(): *[TypeName](../modules/types.md#typename)[]*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Returns all types names.

**Returns:** *[TypeName](../modules/types.md#typename)[]*

List of type names of all registered types.

___

###  hasType

▸ **hasType**(`typeName`: [TypeName](../modules/types.md#typename)): *boolean*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Evaluates if serializer has registered type by type name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type name for type. |

**Returns:** *boolean*

Returns `true` if type is registered, else `false`.

___

###  isTypeInstance

▸ **isTypeInstance**(`typeInstance`: [Serializable](../interfaces/types.serializable.md)): *boolean*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Evaluates if provided instance belongs to one of custom types.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeInstance` | [Serializable](../interfaces/types.serializable.md) | Instance of a type implementing `Serializable` interface. |

**Returns:** *boolean*

Returns `true` if instance is of registered type, else `false`.

___

###  overrideType

▸ **overrideType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: [Type](../modules/types.md#type)): *void*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Override a data-type on serializer.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type's name for which type will be registered. |
`type` | [Type](../modules/types.md#type) | Type constructor implementing `Serializable` interface for registration. |

**Returns:** *void*

___

###  parse

▸ **parse**(`str`: string): *any*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Parse a string into an EJSON value.

**`throws`** {UnparsableValueError}
Thrown if the argument is not a valid EJSON.

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
  address: Address;
}

const string =
'{"$type":"Person","$value":{"firstName":"Jane","lastName":"Doe","address":{"$type":"Address","$value":{"city":"New York","street":"Wall Street"}}}}';

const ejsonValue = serializer.parse(string);
expect(ejsonValue).to.be.instanceof(Person);
expect(ejsonValue).to.be.eql(
  new Person({
    firstName: 'Jane',
    lastName: 'Doe',
    address: new Address({
      city: 'New York',
      street: 'Wall Street',
    }),
  })
);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string | A string to parse into an EJSON value. |

**Returns:** *any*

Parsed value to type or `Serializable` instance.

___

###  registerType

▸ **registerType**(`typeName`: [TypeName](../modules/types.md#typename), `type`: [Type](../modules/types.md#type), `shouldOverride?`: boolean): *void*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Register a data-type on serializer.

**`throws`** {UnregistrableTypeError}
Thrown if type does not implement `Serializable` interface.

**`throws`** {TypeExistsError}
Thrown if type would overridden on EJSON without explicit call.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type's name for which mapping will be created. |
`type` | [Type](../modules/types.md#type) | Type constructor implementing `Serializable` interface for registration. Must contain typeName - a tag for your custom type that must be unique among other data types defined in your project. |
`shouldOverride?` | boolean | Flag indicating that type should be overridden if exist. |

**Returns:** *void*

___

###  removeType

▸ **removeType**(`typeName`: [TypeName](../modules/types.md#typename)): *void*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Removes data-type by its type name.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`typeName` | [TypeName](../modules/types.md#typename) | Type name for type.  |

**Returns:** *void*

___

###  removeTypes

▸ **removeTypes**(): *void*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Allows to remove all data-types from EJSON.

**Returns:** *void*

___

###  stringify

▸ **stringify**(`value`: any, `options?`: object): *string*

Serialize a value to a string with value's initial type preserved.

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
  address: Address;
}

const person = new Person({
  firstName: 'Jane',
  lastName: 'Doe',
  address: new Address({
    city: 'New York',
    street: 'Wall Street',
  }),
});

expect(serializer.stringify(person)).to.be.equal(
  '{"$type":"Person","$value":{"firstName":"Jane","lastName":"Doe","address":{"$type":"Address","$value":{"city":"New York","street":"Wall Street"}}}}'
);
```

**Parameters:**

▪ **value**: *any*

A value or `Serializable` instance to stringify.

▪`Optional`  **options**: *object*

Optional serialization options.

Name | Type |
------ | ------ |
`canonical` | boolean |
`indent` | boolean &#124; number |

**Returns:** *string*

Stringified value.

___

###  toData

▸ **toData**(`serializable`: [Serializable](../interfaces/types.serializable.md)): *Record‹string, any›*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Converts `Serializable` to plain-object data.

**`throws`** {UnregistrableTypeError}
Thrown if provided argument is not a type implementing `Serializable` interface.

**`example`** 
```ts
@define('Car')
class Car extends Serializable {
  brand: string;
}

const car = new Car({
  brand: 'Bentley',
});
expect(serializer.toData(car)).to.be.eql({
  _type: 'Car',
  brand: 'Bentley',
});
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`serializable` | [Serializable](../interfaces/types.serializable.md) | `Serializable` instance. |

**Returns:** *Record‹string, any›*

Converted `Serializable` to plain-object data.

___

###  toJSONValue

▸ **toJSONValue**(`value`: any): *any*

*Implementation of [Serializer](../interfaces/types.serializer.md)*

Serializes value into a JSON-compatible value. It preserves all custom
fields, however the initial value type is not saved.

**`remarks`** 
Method `toJSONValue` is not returning type serialized in object structure like
```ts
{$type: "MyType", $value: {key: "my-string"}}
```
Since that would impact `stringify` method that under the hood uses `toJSONValue`.
Method `stringify` will produce string that has exact structure like presented above.

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
  address: Address;
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
```

**`example`** 
```ts
const date = new Date();
const obj = {
  $date: date,
};

expect(
  serializer.toJSONValue(obj)
).to.be.eql({ $date: date.toJSON() });
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | JSON-compatible value like object or `Serializable` instance. |

**Returns:** *any*

Serialized value as JSON-compatible object without type name($type) identifers preserved.

---
id: "definablemixin"
title: "DefinableMixin"
sidebar_label: "DefinableMixin"
---

## Hierarchy

* **DefinableMixin**

## Implements

* [Definable](../interfaces/types.definable.md)
* Definable

## Index

### Methods

* [equals](definablemixin.md#equals)
* [getPropTypes](definablemixin.md#getproptypes)
* [getPropertyInitializers](definablemixin.md#getpropertyinitializers)
* [toPlainObject](definablemixin.md#toplainobject)
* [validateProps](definablemixin.md#validateprops)
* [getPropTypes](definablemixin.md#static-getproptypes)
* [getPropertyInitializers](definablemixin.md#static-getpropertyinitializers)

## Methods

###  equals

▸ **equals**(`other`: any): *boolean*

*Implementation of [Definable](../interfaces/types.definable.md)*

Evaluates if value and value's type of passed other instance are equal to current one.

**`example`** 
```ts
class Person extends DefinableMixin {
  firstName: string;
  lastName: string;
  age: number;

  constructor(firstName: string, lastName: string, age: number) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }
}
const firstPerson = new Person('Jane', 'Doe', 28);
const secondPerson = new Person('Jane', 'Doe', 28);
expect(firstPerson.equals(secondPerson)).to.be.true;
```

**`example`** 
```ts
const firstPerson = new Person('Jane', 'Doe', 28);
const secondPerson = new Person('John', 'Doe', 30);
expect(firstPerson.equals(secondPerson)).to.be.false;
```

**`example`** 
```ts
const firstPerson = new Person('Jane', 'Doe', 28);
const secondPerson = {firstName: 'John', lastName: 'Doe', age: 30);
expect(firstPerson.equals(secondPerson)).to.be.false;
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`other` | any | Other instance of DefinableMixin. |

**Returns:** *boolean*

Returns `true` if other instance of DefinableMixin is equal, else `false`.

___

###  getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

*Implementation of [Definable](../interfaces/types.definable.md)*

Returns class properties types from whole inheritance tree.

**`example`** 
```ts
@define()
class MyClass extends DefinableMixin {
  stringKey: string

  constructor(props: Record<keyof any, any>) {
    super()
    Object.assign(this, props);
  }
}

expect(new MyClass({stringKey: 'my-string'}).getPropTypes()).to.be.eql({
  stringKey: PropTypes.instanceOf(String)
})
```

**Returns:** *[Props](../modules/types.md#props)*

Plain object representation of properties types.

___

###  getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

*Implementation of [Definable](../interfaces/types.definable.md)*

Returns default values metadata from property initializers conversion for whole
inheritance tree.

**`example`** 
```ts
@define()
class MyClass extends Struct {
  stringKey = 'my-string';

  numberKey = 1337;

  constructor(props: Partial<MyClass>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

expect(new MyClass().getPropertyInitializers()).to.be.eql({
  stringKey: 'my-string',
  numberKey: 1337
})
```

**Returns:** *[Props](../modules/types.md#props)*

Default values for properties.

___

###  toPlainObject

▸ **toPlainObject**(): *[Props](../modules/types.md#props)*

*Implementation of [Definable](../interfaces/types.definable.md)*

Converts properties to plain object.

**`remarks`** 
**Loosing object references is required** since in scenarios when properties resolved
from `toPlainObject` are transformed - in such changes to the modified plain object
will cascade to original instance(**THIS** instance, since properties are **referenced**).

**`example`** 
```ts
@define()
class Point extends DefinableMixin {
  x: number;
  y: number;
  z: number;
}

const point = new Point({x: 1, y: 2, z: 3})
expect(point.toPlainObject()).to.be.eql({x: 1, y: 2, z: 3});
```

**Returns:** *[Props](../modules/types.md#props)*

Public properties with assigned values as plain object.

___

###  validateProps

▸ **validateProps**(`props`: Record‹string | number | symbol, any› | undefined, `propTypes`: [PropTypes](../modules/types.md#proptypes), `isStrict?`: boolean): *boolean*

Validates if provided properties matches prop types.

**`throws`** {ValidationError}
Thrown if the passed properties do not match prop types.

**`remarks`** 
Disabling of runtime validation is possible via Kernel's configuration(and by
that env flags also) or by annotating class with `@validable(false)`.

This is useful when there is external layer(like transportation) that does all
the heavy lifting of validation and there are no other sources of incoming data beside
points that is handled by layer.

Use env `EVEBLE_VALIDATION_TYPE` set to `manual` to disable validation on
initialization. You ca re-enable it again on your application configuration via
path `validation.type` set to `runtime` before staring application.

**`example`** 
```ts
@define()
class MyClass extends DefinableMixin {
  stringKey: string

  constructor(props: Record<keyof any, any>) {
    super()
    Object.assign(this, props);
  }
}

const instance = new MyClass({stringKey: 'my-string'});
expect(
  () => instance.validateProps({stringKey: 1337}, this.getPropTypes())
).to.throw(ValidationError)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`props` | Record‹string &#124; number &#124; symbol, any› &#124; undefined | Properties to validate. |
`propTypes` | [PropTypes](../modules/types.md#proptypes) | Properties types. |
`isStrict?` | boolean | Flag indicating that validation should be done in strict mode. |

**Returns:** *boolean*

Returns `true` if properties are valid, else throws.

___

### `Static` getPropTypes

▸ **getPropTypes**(): *[Props](../modules/types.md#props)*

Returns class properties types from whole inheritance tree.

**`example`** 
```ts
@define()
class MyClass extends DefinableMixin {
  stringKey: string

  constructor(props: Record<keyof any, any>) {
    super()
    Object.assign(this, props);
  }
}

expect(MyClass.getPropTypes()).to.be.eql({
  stringKey: PropTypes.instanceOf(String)
})
```

**Returns:** *[Props](../modules/types.md#props)*

Plain object representation of properties types.

___

### `Static` getPropertyInitializers

▸ **getPropertyInitializers**(): *[Props](../modules/types.md#props)*

Returns class property initializers for whole inheritance tree.

**`example`** 
```ts
@define()
class MyClass extends Struct {
  stringKey = 'my-string';

  numberKey = 1337;

  constructor(props: Partial<MyClass>) {
    super();
    Object.assign(this, this.processProps(props));
  }
}

expect(MyClass.getPropertyInitializers()).to.be.eql({
  stringKey: 'my-string',
  numberKey: 1337
})
```

**Returns:** *[Props](../modules/types.md#props)*

Plain object representation of property initializers.

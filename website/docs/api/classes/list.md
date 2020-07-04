---
id: "list"
title: "List"
sidebar_label: "List"
---

## Type parameters

▪ **T**: *[Serializable](../interfaces/types.serializable.md)*

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**: *Serializable*

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

## Hierarchy

* [Array](../interfaces/types.list.md#array)

* [Array](../interfaces/types.list.md#array)

  ↳ **List**

## Indexable

* \[ **n**: *number*\]: T

## Index

### Constructors

* [constructor](list.md#constructor)

### Properties

* [length](list.md#length)
* [Array](list.md#static-array)

### Methods

* [[Symbol.iterator]](list.md#[symbol.iterator])
* [[Symbol.unscopables]](list.md#[symbol.unscopables])
* [add](list.md#add)
* [concat](list.md#concat)
* [copyWithin](list.md#copywithin)
* [create](list.md#create)
* [entries](list.md#entries)
* [every](list.md#every)
* [fill](list.md#fill)
* [filter](list.md#filter)
* [find](list.md#find)
* [findBy](list.md#findby)
* [findById](list.md#findbyid)
* [findIndex](list.md#findindex)
* [first](list.md#first)
* [forEach](list.md#foreach)
* [getBy](list.md#getby)
* [getById](list.md#getbyid)
* [getByIdOrThrow](list.md#getbyidorthrow)
* [getByOrThrow](list.md#getbyorthrow)
* [getListKey](list.md#getlistkey)
* [getSerializableType](list.md#getserializabletype)
* [getSource](list.md#getsource)
* [hasBy](list.md#hasby)
* [hasById](list.md#hasbyid)
* [hasSame](list.md#hassame)
* [includes](list.md#includes)
* [indexOf](list.md#indexof)
* [join](list.md#join)
* [keys](list.md#keys)
* [last](list.md#last)
* [lastIndexOf](list.md#lastindexof)
* [map](list.md#map)
* [overrideBy](list.md#overrideby)
* [pop](list.md#pop)
* [push](list.md#push)
* [reduce](list.md#reduce)
* [reduceRight](list.md#reduceright)
* [removeBy](list.md#removeby)
* [removeById](list.md#removebyid)
* [replaceBy](list.md#replaceby)
* [replaceById](list.md#replacebyid)
* [reverse](list.md#reverse)
* [shift](list.md#shift)
* [slice](list.md#slice)
* [some](list.md#some)
* [sort](list.md#sort)
* [splice](list.md#splice)
* [toLocaleString](list.md#tolocalestring)
* [toString](list.md#tostring)
* [unshift](list.md#unshift)
* [values](list.md#values)

## Constructors

###  constructor

\+ **new List**(`source`: [Serializable](../interfaces/types.serializable.md), `listKey`: string, `serializableType`: [Type](../modules/types.md#type), `serializables`: any[]): *[List](list.md)*

Creates an instance of `List` that behaves like instance of `Array`.
Creates an instance of `List` that behaves like instance of `Array`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`source` | [Serializable](../interfaces/types.serializable.md) | Source `Serializable`, from which list is referenced. |
`listKey` | string | Property key under which list is assigned on source. |
`serializableType` | [Type](../modules/types.md#type) | `Serializable` type constructor for which list is dedicated for.  |
`serializables` | any[] | - |

**Returns:** *[List](list.md)*

## Properties

###  length

• **length**: *number*

*Inherited from [List](../interfaces/types.list.md).[length](../interfaces/types.list.md#length)*

*Overrides [List](../interfaces/types.list.md).[length](../interfaces/types.list.md#length)*

Gets or sets the length of the array. This is a number one higher than the highest element defined in an array.

___

### `Static` Array

▪ **Array**: *ArrayConstructor*

## Methods

###  [Symbol.iterator]

▸ **[Symbol.iterator]**(): *IterableIterator‹T›*

*Inherited from [List](../interfaces/types.list.md).[[Symbol.iterator]](../interfaces/types.list.md#[symbol.iterator])*

*Overrides [List](../interfaces/types.list.md).[[Symbol.iterator]](../interfaces/types.list.md#[symbol.iterator])*

Iterator

**Returns:** *IterableIterator‹T›*

___

###  [Symbol.unscopables]

▸ **[Symbol.unscopables]**(): *object*

*Inherited from [List](../interfaces/types.list.md).[[Symbol.unscopables]](../interfaces/types.list.md#[symbol.unscopables])*

*Overrides [List](../interfaces/types.list.md).[[Symbol.unscopables]](../interfaces/types.list.md#[symbol.unscopables])*

Returns an object whose properties have the value 'true'
when they will be absent when used in a 'with' statement.

**Returns:** *object*

* **copyWithin**: *boolean*

* **entries**: *boolean*

* **fill**: *boolean*

* **find**: *boolean*

* **findIndex**: *boolean*

* **keys**: *boolean*

* **values**: *boolean*

___

###  add

▸ **add**(`element`: T): *void*

Adds already instantiated `Serializable` to list.

**`throws`** {ValidationError}
Thrown if the `Serializable` is not matching list's `Serializable` type.

**`throws`** {IdentifiableAlreadyExistsError}
Thrown if the `Identifiable` with same identifier already exists on list.

**`throws`** {ElementAlreadyExistError}
Thrown if the same `Serializable` already exists on list(use `List.prototype.push` instead).

**`example`** 
```ts
@define('Item')
class Item extends Serializable {
  name: string;
}
@define('Order')
class Order extends Serializable {
  items: Item[];
}

const source = new Order({ items: [] });
const element = new Item({ name: 'my-item-name' });

source.in<Item>('items').add(element);
expect(source.items[0]).to.be.instanceof(Item);
expect(source.items[0]).to.be.eql(
  new Item({
    name: 'my-item-name',
  })
);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`element` | T | `Serializable` instance matching type for which list is dedicated. |

**Returns:** *void*

___

###  concat

▸ **concat**(...`items`: ConcatArray‹T›[]): *T[]*

*Inherited from [List](../interfaces/types.list.md).[concat](../interfaces/types.list.md#concat)*

*Overrides [List](../interfaces/types.list.md).[concat](../interfaces/types.list.md#concat)*

Combines two or more arrays.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | ConcatArray‹T›[] | Additional items to add to the end of array1.  |

**Returns:** *T[]*

▸ **concat**(...`items`: T | ConcatArray‹T›[]): *T[]*

*Inherited from [List](../interfaces/types.list.md).[concat](../interfaces/types.list.md#concat)*

*Overrides [List](../interfaces/types.list.md).[concat](../interfaces/types.list.md#concat)*

Combines two or more arrays.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | T &#124; ConcatArray‹T›[] | Additional items to add to the end of array1.  |

**Returns:** *T[]*

___

###  copyWithin

▸ **copyWithin**(`target`: number, `start`: number, `end?`: number): *this*

*Inherited from [List](../interfaces/types.list.md).[copyWithin](../interfaces/types.list.md#copywithin)*

*Overrides [List](../interfaces/types.list.md).[copyWithin](../interfaces/types.list.md#copywithin)*

Returns the this object after copying a section of the array identified by start and end
to the same array starting at position target

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | number | If target is negative, it is treated as length+target where length is the length of the array. |
`start` | number | If start is negative, it is treated as length+start. If end is negative, it is treated as length+end. |
`end?` | number | If not specified, length of the this object is used as its default value.  |

**Returns:** *this*

___

###  create

▸ **create**(...`sources`: Record‹string, any›[]): *T*

Creates `Serializable` from multiple data sources and adds it to list.

**`throws`** {ValidationError}
Thrown if the properties does not match property types on `Serializable`.

**`example`** 
```ts
@define('Item')
class Item extends Serializable {
  name: string;
}

@define('Order')
class Order extends Serializable {
  items: Item[];
}

const source = new Order({ items: [] });
source.in<Item>('items').create({
  name: 'my-item-name',
});
expect(source.items[0]).to.be.instanceof(Item);
expect(source.items[0]).to.be.be.eql(
  new Item({
    name: 'my-item-name',
  })
);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...sources` | Record‹string, any›[] | Source(s) of properties(like Object.assign). |

**Returns:** *T*

Instance of newly created and added `Serializable`.

___

###  entries

▸ **entries**(): *IterableIterator‹[number, T]›*

*Inherited from [List](../interfaces/types.list.md).[entries](../interfaces/types.list.md#entries)*

*Overrides [List](../interfaces/types.list.md).[entries](../interfaces/types.list.md#entries)*

Returns an iterable of key, value pairs for every entry in the array

**Returns:** *IterableIterator‹[number, T]›*

___

###  every

▸ **every**(`callbackfn`: function, `thisArg?`: any): *boolean*

*Inherited from [List](../interfaces/types.list.md).[every](../interfaces/types.list.md#every)*

*Overrides [List](../interfaces/types.list.md).[every](../interfaces/types.list.md#every)*

Determines whether all the members of an array satisfy the specified test.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. The every method calls
the callbackfn function for each element in the array until the callbackfn returns a value
which is coercible to the Boolean value false, or until the end of the array.

▸ (`value`: T, `index`: number, `array`: T[]): *unknown*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function.
If thisArg is omitted, undefined is used as the this value.

**Returns:** *boolean*

___

###  fill

▸ **fill**(`value`: T, `start?`: number, `end?`: number): *this*

*Inherited from [List](../interfaces/types.list.md).[fill](../interfaces/types.list.md#fill)*

*Overrides [List](../interfaces/types.list.md).[fill](../interfaces/types.list.md#fill)*

Returns the this object after filling the section identified by start and end with value

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | T | value to fill array section with |
`start?` | number | index to start filling the array at. If start is negative, it is treated as length+start where length is the length of the array. |
`end?` | number | index to stop filling the array at. If end is negative, it is treated as length+end.  |

**Returns:** *this*

___

###  filter

▸ **filter**‹**S**›(`callbackfn`: function, `thisArg?`: any): *S[]*

*Inherited from [List](../interfaces/types.list.md).[filter](../interfaces/types.list.md#filter)*

*Overrides [List](../interfaces/types.list.md).[filter](../interfaces/types.list.md#filter)*

Returns the elements of an array that meet the condition specified in a callback function.

**Type parameters:**

▪ **S**: *T*

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.

▸ (`value`: T, `index`: number, `array`: T[]): *value is S*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

**Returns:** *S[]*

▸ **filter**(`callbackfn`: function, `thisArg?`: any): *T[]*

*Inherited from [List](../interfaces/types.list.md).[filter](../interfaces/types.list.md#filter)*

*Overrides [List](../interfaces/types.list.md).[filter](../interfaces/types.list.md#filter)*

Returns the elements of an array that meet the condition specified in a callback function.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.

▸ (`value`: T, `index`: number, `array`: T[]): *unknown*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

**Returns:** *T[]*

___

###  find

▸ **find**‹**S**›(`predicate`: function, `thisArg?`: any): *S | undefined*

*Inherited from [List](../interfaces/types.list.md).[find](../interfaces/types.list.md#find)*

*Overrides [List](../interfaces/types.list.md).[find](../interfaces/types.list.md#find)*

Returns the value of the first element in the array where predicate is true, and undefined
otherwise.

**Type parameters:**

▪ **S**: *T*

**Parameters:**

▪ **predicate**: *function*

find calls predicate once for each element of the array, in ascending
order, until it finds one where predicate returns true. If such an element is found, find
immediately returns that element value. Otherwise, find returns undefined.

▸ (`this`: void, `value`: T, `index`: number, `obj`: T[]): *value is S*

**Parameters:**

Name | Type |
------ | ------ |
`this` | void |
`value` | T |
`index` | number |
`obj` | T[] |

▪`Optional`  **thisArg**: *any*

If provided, it will be used as the this value for each invocation of
predicate. If it is not provided, undefined is used instead.

**Returns:** *S | undefined*

▸ **find**(`predicate`: function, `thisArg?`: any): *T | undefined*

*Inherited from [List](../interfaces/types.list.md).[find](../interfaces/types.list.md#find)*

*Overrides [List](../interfaces/types.list.md).[find](../interfaces/types.list.md#find)*

**Parameters:**

▪ **predicate**: *function*

▸ (`value`: T, `index`: number, `obj`: T[]): *unknown*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`obj` | T[] |

▪`Optional`  **thisArg**: *any*

**Returns:** *T | undefined*

___

###  findBy

▸ **findBy**(`key`: string, `value`: any): *T*

**`alias`** getByOrThrow

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *T*

___

###  findById

▸ **findById**(`id`: string | [Stringifiable](../interfaces/types.stringifiable.md)): *T*

**`alias`** getOrThrow

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; [Stringifiable](../interfaces/types.stringifiable.md) |

**Returns:** *T*

___

###  findIndex

▸ **findIndex**(`predicate`: function, `thisArg?`: any): *number*

*Inherited from [List](../interfaces/types.list.md).[findIndex](../interfaces/types.list.md#findindex)*

*Overrides [List](../interfaces/types.list.md).[findIndex](../interfaces/types.list.md#findindex)*

Returns the index of the first element in the array where predicate is true, and -1
otherwise.

**Parameters:**

▪ **predicate**: *function*

find calls predicate once for each element of the array, in ascending
order, until it finds one where predicate returns true. If such an element is found,
findIndex immediately returns that element index. Otherwise, findIndex returns -1.

▸ (`value`: T, `index`: number, `obj`: T[]): *unknown*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`obj` | T[] |

▪`Optional`  **thisArg**: *any*

If provided, it will be used as the this value for each invocation of
predicate. If it is not provided, undefined is used instead.

**Returns:** *number*

___

###  first

▸ **first**(): *T | undefined*

Returns first `Serializable` in list.

**`example`** 
```ts
@define('Item')
class Item extends Serializable {
  name: string;
}
@define('Order')
class Order extends Serializable {
  items: Item[];
}

const source = new Order({ items: [] });
const firstElement = new Item({ name: 'my-first-name' });
const secondElement = new Item({ name: 'my-second-name' });
source.in<Item>('items').add(firstElement);
source.in<Item>('items').add(secondElement);
expect(source.in<Item>('items').first()).to.be.equal(firstElement);
```

**Returns:** *T | undefined*

Returns `Serializable` instance.

___

###  forEach

▸ **forEach**(`callbackfn`: function, `thisArg?`: any): *void*

*Inherited from [List](../interfaces/types.list.md).[forEach](../interfaces/types.list.md#foreach)*

*Overrides [List](../interfaces/types.list.md).[forEach](../interfaces/types.list.md#foreach)*

Performs the specified action for each element in an array.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.

▸ (`value`: T, `index`: number, `array`: T[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

**Returns:** *void*

___

###  getBy

▸ **getBy**(`key`: string, `value`: any): *T | undefined*

Returns `Serializable` from list by custom key and matching value.

**`example`** 
```ts
@define('Item')
class Item extends Serializable {
  name: string;
}
@define('Order')
class Order extends Serializable {
  items: Item[];
}

const source = new Order({ items: [] });
const element = new Item({ name: 'my-item-name' });
source.in<Item>('items').add(element);
expect(
  source.in<Item>('items').getBy('name', 'my-item-name')
).to.be.equal(element);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Property name(key) from `Serializable`. |
`value` | any | Property value that should be matched. |

**Returns:** *T | undefined*

Returns `Serializable` instance if found, else `undefined`.

___

###  getById

▸ **getById**(`id`: string | [Stringifiable](../interfaces/types.stringifiable.md)): *T | undefined*

Returns `Serializable` instance from list by its identifier.

**`example`** 
```ts
@define('Employee')
class Employee extends Serializable implements types.Identifiable {
  id: string;

  getId(): string {
    return this.id;
  }
}

@define('Company')
class Company extends Serializable {
  id: string;

  employees: Employee[];
}

const source = new Company({ id: 'my-company-id', employees: [] });
const element = new Employee({ id: 'my-employee-id' });
source.in<Employee>('employees').add(element);
expect(
  source.in<Employee>('employees').getById('my-employee-id')
).to.be.
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string &#124; [Stringifiable](../interfaces/types.stringifiable.md) | Identifier of `Serializable`. |

**Returns:** *T | undefined*

Returns `Serializable` instance if found, else `undefined`.

___

###  getByIdOrThrow

▸ **getByIdOrThrow**(`id`: string | [Stringifiable](../interfaces/types.stringifiable.md)): *T*

Returns `Serializable` from list by its identifier or throws.

**`throws`** {ElementNotFoundError}
Thrown if the `Serializable` with identifier can't be found on list.

**`example`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string &#124; [Stringifiable](../interfaces/types.stringifiable.md) | Identifier of `Serializable`. |

**Returns:** *T*

Returns `Serializable` instance if found, else throws.

___

###  getByOrThrow

▸ **getByOrThrow**(`key`: string, `value`: any): *T*

Returns `Serializable` from list by custom key and value or throws.

**`throws`** {ElementNotFoundError}
Thrown if the `Serializable` with key and value can't be matched on list.

**`example`** 

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Property name(key) from `Serializable`. |
`value` | any | Property value that should be matched. |

**Returns:** *T*

Returns `Serializable` instance if found, else throws.

___

###  getListKey

▸ **getListKey**(): *string*

Gets property key under which list is created on source.

**Returns:** *string*

Property key of the list as a string.

___

###  getSerializableType

▸ **getSerializableType**(): *[Type](../modules/types.md#type)*

Gets serializable type constructor for which this list is being made.

**Returns:** *[Type](../modules/types.md#type)*

`Serializable` type constructor.

___

###  getSource

▸ **getSource**(): *[Serializable](../interfaces/types.serializable.md)*

Gets source for which list is made.

**Returns:** *[Serializable](../interfaces/types.serializable.md)*

Instance of `Serializable`.

___

###  hasBy

▸ **hasBy**(`key`: string, `value`: any): *boolean*

Evaluates if list contains `Serializable` by key and value.

**`example`** 
```ts
@define('Item')
class Item extends Serializable {
  name: string;
}
@define('Order')
class Order extends Serializable {
  items: Item[];
}

const source = new Order({ items: [] });
const element = new Item({ name: 'my-first-name' });
source.in<Item>('items').add(element);
expect(source.in<Item>('items').hasBy('name', 'my-first-name')).to.be
  .true;
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Property name(key) from `Serializable`. |
`value` | any | Property value that should be matched. |

**Returns:** *boolean*

Returns `Serializable` instance if found, else `undefined`.

___

###  hasById

▸ **hasById**(`id`: string | [Stringifiable](../interfaces/types.stringifiable.md)): *boolean*

Evaluates if list contains `Serializable` by its identifier.

**`example`** 
```ts
@define('Employee')
class Employee extends Serializable {
  id: string;

  getId(): string {
    return this.id;
  }
}

@define('Company')
class Company extends Serializable {
  id: string;

  employees: Employee[];
}

const source = new Company({ id: 'my-company-id', employees: [] });
const element = new Employee({ id: 'my-first-id' });
source.in<Employee>('employees').add(element);
expect(source.in<Employee>('employees').hasById('my-first-id')).to.be
  .true;
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string &#124; [Stringifiable](../interfaces/types.stringifiable.md) | `Serializable` identifier. |

**Returns:** *boolean*

Returns `true` if `Serializable` exists on list, else `false`.

___

###  hasSame

▸ **hasSame**(`element`: T): *boolean*

Evaluates if list contains same `Serializable` by values.

**`example`** 
```ts
@define('Item')
class Item extends Serializable {
  name: string;
}
@define('Order')
class Order extends Serializable {
  items: Item[];
}

const source = new Order({ items: [] });
const element = new Item({ name: 'my-first-name' });
source.in<Item>('items').add(element);
expect(source.in<Item>('items').hasSame(element)).to.be.true;
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`element` | T | `Serializable` instance. |

**Returns:** *boolean*

Returns `true` if `Serializable` exists on list, else `false`.

___

###  includes

▸ **includes**(`searchElement`: T, `fromIndex?`: number): *boolean*

*Inherited from [List](../interfaces/types.list.md).[includes](../interfaces/types.list.md#includes)*

*Overrides [List](../interfaces/types.list.md).[includes](../interfaces/types.list.md#includes)*

Determines whether an array includes a certain element, returning true or false as appropriate.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`searchElement` | T | The element to search for. |
`fromIndex?` | number | The position in this array at which to begin searching for searchElement.  |

**Returns:** *boolean*

___

###  indexOf

▸ **indexOf**(`searchElement`: T, `fromIndex?`: number): *number*

*Inherited from [List](../interfaces/types.list.md).[indexOf](../interfaces/types.list.md#indexof)*

*Overrides [List](../interfaces/types.list.md).[indexOf](../interfaces/types.list.md#indexof)*

Returns the index of the first occurrence of a value in an array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`searchElement` | T | The value to locate in the array. |
`fromIndex?` | number | The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.  |

**Returns:** *number*

___

###  join

▸ **join**(`separator?`: string): *string*

*Inherited from [List](../interfaces/types.list.md).[join](../interfaces/types.list.md#join)*

*Overrides [List](../interfaces/types.list.md).[join](../interfaces/types.list.md#join)*

Adds all the elements of an array separated by the specified separator string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`separator?` | string | A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.  |

**Returns:** *string*

___

###  keys

▸ **keys**(): *IterableIterator‹number›*

*Inherited from [List](../interfaces/types.list.md).[keys](../interfaces/types.list.md#keys)*

*Overrides [List](../interfaces/types.list.md).[keys](../interfaces/types.list.md#keys)*

Returns an iterable of keys in the array

**Returns:** *IterableIterator‹number›*

___

###  last

▸ **last**(): *T | undefined*

Returns last `Serializable` in list.

**`example`** 
```ts
@define('Item')
class Item extends Serializable {
  name: string;
}
@define('Order')
class Order extends Serializable {
  items: Item[];
}

const source = new Order({ items: [] });
const firstElement = new Item({ name: 'my-first-name' });
const secondElement = new Item({ name: 'my-second-name' });
source.in<Item>('items').add(firstElement);
source.in<Item>('items').add(secondElement);
expect(source.in<Item>('items').last()).to.be.equal(secondElement);
```

**Returns:** *T | undefined*

Returns `Serializable` instance.

___

###  lastIndexOf

▸ **lastIndexOf**(`searchElement`: T, `fromIndex?`: number): *number*

*Inherited from [List](../interfaces/types.list.md).[lastIndexOf](../interfaces/types.list.md#lastindexof)*

*Overrides [List](../interfaces/types.list.md).[lastIndexOf](../interfaces/types.list.md#lastindexof)*

Returns the index of the last occurrence of a specified value in an array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`searchElement` | T | The value to locate in the array. |
`fromIndex?` | number | The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.  |

**Returns:** *number*

___

###  map

▸ **map**‹**U**›(`callbackfn`: function, `thisArg?`: any): *U[]*

*Inherited from [List](../interfaces/types.list.md).[map](../interfaces/types.list.md#map)*

*Overrides [List](../interfaces/types.list.md).[map](../interfaces/types.list.md#map)*

Calls a defined callback function on each element of an array, and returns an array that contains the results.

**Type parameters:**

▪ **U**

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.

▸ (`value`: T, `index`: number, `array`: T[]): *U*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

**Returns:** *U[]*

___

###  overrideBy

▸ **overrideBy**(`key`: string, `value`: any, `element`: T): *void*

Override existing `Serializable` on list by specific key and matching value or adds it to list.

**`example`** 
```ts
@define('Item')
class Item extends Serializable {
  name: string;
}
@define('Order')
class Order extends Serializable {
  items: Item[];
}

const source = new Order({ items: [] });
const firstElement = new Item({ name: 'my-first-name' });
const secondElement = new Item({ name: 'my-second-name' });

source.in<Item>('items').add(firstElement);
expect(source.items[0]).to.be.equal(firstElement);
source
  .in<Item>('items')
  .overrideBy('name', 'my-first-name', secondElement);
expect(source.items[0]).to.be.equal(secondElement);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Property name(key) from `Serializable`. |
`value` | any | Property value that should be matched. |
`element` | T | `Serializable` instance. |

**Returns:** *void*

___

###  pop

▸ **pop**(): *T | undefined*

*Inherited from [List](../interfaces/types.list.md).[pop](../interfaces/types.list.md#pop)*

*Overrides [List](../interfaces/types.list.md).[pop](../interfaces/types.list.md#pop)*

Removes the last element from an array and returns it.

**Returns:** *T | undefined*

___

###  push

▸ **push**(...`items`: T[]): *number*

*Inherited from [List](../interfaces/types.list.md).[push](../interfaces/types.list.md#push)*

*Overrides [List](../interfaces/types.list.md).[push](../interfaces/types.list.md#push)*

Appends new elements to an array, and returns the new length of the array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | T[] | New elements of the Array.  |

**Returns:** *number*

___

###  reduce

▸ **reduce**(`callbackfn`: function): *T*

*Inherited from [List](../interfaces/types.list.md).[reduce](../interfaces/types.list.md#reduce)*

*Overrides [List](../interfaces/types.list.md).[reduce](../interfaces/types.list.md#reduce)*

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.

▸ (`previousValue`: T, `currentValue`: T, `currentIndex`: number, `array`: T[]): *T*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | T |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

**Returns:** *T*

▸ **reduce**(`callbackfn`: function, `initialValue`: T): *T*

*Inherited from [List](../interfaces/types.list.md).[reduce](../interfaces/types.list.md#reduce)*

*Overrides [List](../interfaces/types.list.md).[reduce](../interfaces/types.list.md#reduce)*

**Parameters:**

▪ **callbackfn**: *function*

▸ (`previousValue`: T, `currentValue`: T, `currentIndex`: number, `array`: T[]): *T*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | T |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

▪ **initialValue**: *T*

**Returns:** *T*

▸ **reduce**‹**U**›(`callbackfn`: function, `initialValue`: U): *U*

*Inherited from [List](../interfaces/types.list.md).[reduce](../interfaces/types.list.md#reduce)*

*Overrides [List](../interfaces/types.list.md).[reduce](../interfaces/types.list.md#reduce)*

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

**Type parameters:**

▪ **U**

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.

▸ (`previousValue`: U, `currentValue`: T, `currentIndex`: number, `array`: T[]): *U*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | U |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

▪ **initialValue**: *U*

If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.

**Returns:** *U*

___

###  reduceRight

▸ **reduceRight**(`callbackfn`: function): *T*

*Inherited from [List](../interfaces/types.list.md).[reduceRight](../interfaces/types.list.md#reduceright)*

*Overrides [List](../interfaces/types.list.md).[reduceRight](../interfaces/types.list.md#reduceright)*

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.

▸ (`previousValue`: T, `currentValue`: T, `currentIndex`: number, `array`: T[]): *T*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | T |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

**Returns:** *T*

▸ **reduceRight**(`callbackfn`: function, `initialValue`: T): *T*

*Inherited from [List](../interfaces/types.list.md).[reduceRight](../interfaces/types.list.md#reduceright)*

*Overrides [List](../interfaces/types.list.md).[reduceRight](../interfaces/types.list.md#reduceright)*

**Parameters:**

▪ **callbackfn**: *function*

▸ (`previousValue`: T, `currentValue`: T, `currentIndex`: number, `array`: T[]): *T*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | T |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

▪ **initialValue**: *T*

**Returns:** *T*

▸ **reduceRight**‹**U**›(`callbackfn`: function, `initialValue`: U): *U*

*Inherited from [List](../interfaces/types.list.md).[reduceRight](../interfaces/types.list.md#reduceright)*

*Overrides [List](../interfaces/types.list.md).[reduceRight](../interfaces/types.list.md#reduceright)*

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

**Type parameters:**

▪ **U**

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.

▸ (`previousValue`: U, `currentValue`: T, `currentIndex`: number, `array`: T[]): *U*

**Parameters:**

Name | Type |
------ | ------ |
`previousValue` | U |
`currentValue` | T |
`currentIndex` | number |
`array` | T[] |

▪ **initialValue**: *U*

If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.

**Returns:** *U*

___

###  removeBy

▸ **removeBy**(`key`: string, `value`: any): *void*

Removes `Serializable` from list by key and value.

**`example`** 
```ts
@define('Item')
class Item extends Serializable {
  name: string;
}
@define('Order')
class Order extends Serializable {
  items: Item[];
}

const source = new Order({ items: [] });
const element = new Item({ name: 'my-item-name' });
source.in<Item>('items').add(element);
expect(source.items).to.have.length(1);
source.in<Item>('items').removeBy('name', 'my-item-name');
expect(source.items).to.have.length(0);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Property name(key) from `Serializable`. |
`value` | any | Property value that should be matched. |

**Returns:** *void*

___

###  removeById

▸ **removeById**(`id`: string | [Stringifiable](../interfaces/types.stringifiable.md)): *void*

Removes `Serializable` from list by its identifier.

**`example`** 
```ts
@define('Employee')
class Employee extends Serializable {
  id: string;

  getId(): string {
    return this.id;
  }
}

@define('Company')
class Company extends Serializable {
  id: string;

  employees: Employee[];
}

const source = new Company({ id: 'my-company-id', employees: [] });
const element = new Employee({ id: 'my-employee-id' });

source.in<Employee>('employees').add(element);
expect(source.employees).to.have.length(1);
source.in<Employee>('employees').removeById('my-employee-id');
expect(source.employees).to.have.length(0);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string &#124; [Stringifiable](../interfaces/types.stringifiable.md) | Identifier of `Serializable`. |

**Returns:** *void*

___

###  replaceBy

▸ **replaceBy**(`key`: string, `value`: any, `element`: T): *void*

Replaces element by key and value.

**`example`** 
```ts
@define('Item')
class Item extends Serializable {
  name: string;
}
@define('Order')
class Order extends Serializable {
  items: Item[];
}

const source = new Order({ items: [] });
const element = new Item({ name: 'my-item-name' });
const updatedElement = new Item({ name: 'my-item-name' });
source.in<Item>('items').add(element);
source.in<Item>('items').replaceBy(
 'name', 'my-item-name', updatedElement
);
expect(
 source.in<Item>('items').getBy('name', 'my-item-name')
).to.be.equal(updatedElement);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | Property name(key) from `Serializable`. |
`value` | any | Property value that should be matched. |
`element` | T | `Serializable` instance matching type for which list is dedicated. |

**Returns:** *void*

___

###  replaceById

▸ **replaceById**(`id`: string | [Stringifiable](../interfaces/types.stringifiable.md), `element`: T): *void*

Replaces element by identifier.

**`example`** 
```ts
@define('Employee')
class Employee extends Serializable {
  id: string;

  getId(): string {
    return this.id;
  }
}

@define('Company')
class Company extends Serializable {
  id: string;

  employees: Employee[];
}

const source = new Company({ id: 'my-company-id', employees: [] });
const element = new Employee({ id: 'my-id' });
const updatedElement = new Employee({ id: 'my-id' });
source.in<Employee>('employees').add(element);
source.in<Employee>('employees').replaceById(
 element.id, updatedElement
);
expect(source.in<Employee>('employees').getById('my-id')).to.be
  .equal(updatedElement);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string &#124; [Stringifiable](../interfaces/types.stringifiable.md) | Identifier of `Serializable`. |
`element` | T | `Serializable` instance matching type for which list is dedicated. |

**Returns:** *void*

___

###  reverse

▸ **reverse**(): *T[]*

*Inherited from [List](../interfaces/types.list.md).[reverse](../interfaces/types.list.md#reverse)*

*Overrides [List](../interfaces/types.list.md).[reverse](../interfaces/types.list.md#reverse)*

Reverses the elements in an Array.

**Returns:** *T[]*

___

###  shift

▸ **shift**(): *T | undefined*

*Inherited from [List](../interfaces/types.list.md).[shift](../interfaces/types.list.md#shift)*

*Overrides [List](../interfaces/types.list.md).[shift](../interfaces/types.list.md#shift)*

Removes the first element from an array and returns it.

**Returns:** *T | undefined*

___

###  slice

▸ **slice**(`start?`: number, `end?`: number): *T[]*

*Inherited from [List](../interfaces/types.list.md).[slice](../interfaces/types.list.md#slice)*

*Overrides [List](../interfaces/types.list.md).[slice](../interfaces/types.list.md#slice)*

Returns a section of an array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`start?` | number | The beginning of the specified portion of the array. |
`end?` | number | The end of the specified portion of the array. This is exclusive of the element at the index 'end'.  |

**Returns:** *T[]*

___

###  some

▸ **some**(`callbackfn`: function, `thisArg?`: any): *boolean*

*Inherited from [List](../interfaces/types.list.md).[some](../interfaces/types.list.md#some)*

*Overrides [List](../interfaces/types.list.md).[some](../interfaces/types.list.md#some)*

Determines whether the specified callback function returns true for any element of an array.

**Parameters:**

▪ **callbackfn**: *function*

A function that accepts up to three arguments. The some method calls
the callbackfn function for each element in the array until the callbackfn returns a value
which is coercible to the Boolean value true, or until the end of the array.

▸ (`value`: T, `index`: number, `array`: T[]): *unknown*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`index` | number |
`array` | T[] |

▪`Optional`  **thisArg**: *any*

An object to which the this keyword can refer in the callbackfn function.
If thisArg is omitted, undefined is used as the this value.

**Returns:** *boolean*

___

###  sort

▸ **sort**(`compareFn?`: function): *this*

*Inherited from [List](../interfaces/types.list.md).[sort](../interfaces/types.list.md#sort)*

*Overrides [List](../interfaces/types.list.md).[sort](../interfaces/types.list.md#sort)*

Sorts an array.

**Parameters:**

▪`Optional`  **compareFn**: *function*

Function used to determine the order of the elements. It is expected to return
a negative value if first argument is less than second argument, zero if they're equal and a positive
value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
```ts
[11,2,22,1].sort((a, b) => a - b)
```

▸ (`a`: T, `b`: T): *number*

**Parameters:**

Name | Type |
------ | ------ |
`a` | T |
`b` | T |

**Returns:** *this*

___

###  splice

▸ **splice**(`start`: number, `deleteCount?`: number): *T[]*

*Inherited from [List](../interfaces/types.list.md).[splice](../interfaces/types.list.md#splice)*

*Overrides [List](../interfaces/types.list.md).[splice](../interfaces/types.list.md#splice)*

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`start` | number | The zero-based location in the array from which to start removing elements. |
`deleteCount?` | number | The number of elements to remove.  |

**Returns:** *T[]*

▸ **splice**(`start`: number, `deleteCount`: number, ...`items`: T[]): *T[]*

*Inherited from [List](../interfaces/types.list.md).[splice](../interfaces/types.list.md#splice)*

*Overrides [List](../interfaces/types.list.md).[splice](../interfaces/types.list.md#splice)*

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`start` | number | The zero-based location in the array from which to start removing elements. |
`deleteCount` | number | The number of elements to remove. |
`...items` | T[] | Elements to insert into the array in place of the deleted elements.  |

**Returns:** *T[]*

___

###  toLocaleString

▸ **toLocaleString**(): *string*

*Inherited from [List](../interfaces/types.list.md).[toLocaleString](../interfaces/types.list.md#tolocalestring)*

*Overrides [List](../interfaces/types.list.md).[toLocaleString](../interfaces/types.list.md#tolocalestring)*

Returns a string representation of an array. The elements are converted to string using their toLocalString methods.

**Returns:** *string*

___

###  toString

▸ **toString**(): *string*

*Inherited from [List](../interfaces/types.list.md).[toString](../interfaces/types.list.md#tostring)*

*Overrides [List](../interfaces/types.list.md).[toString](../interfaces/types.list.md#tostring)*

Returns a string representation of an array.

**Returns:** *string*

___

###  unshift

▸ **unshift**(...`items`: T[]): *number*

*Inherited from [List](../interfaces/types.list.md).[unshift](../interfaces/types.list.md#unshift)*

*Overrides [List](../interfaces/types.list.md).[unshift](../interfaces/types.list.md#unshift)*

Inserts new elements at the start of an array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | T[] | Elements to insert at the start of the Array.  |

**Returns:** *number*

___

###  values

▸ **values**(): *IterableIterator‹T›*

*Inherited from [List](../interfaces/types.list.md).[values](../interfaces/types.list.md#values)*

*Overrides [List](../interfaces/types.list.md).[values](../interfaces/types.list.md#values)*

Returns an iterable of values in the array

**Returns:** *IterableIterator‹T›*

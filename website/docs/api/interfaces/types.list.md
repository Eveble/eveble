---
id: "types.list"
title: "@eveble/eveble"
sidebar_label: "List"
---

## Type parameters

▪ **T**

▪ **T**

## Hierarchy

* [Array](types.list.md#array)‹T›

* [Array](types.list.md#array)‹T›

  ↳ **List**

## Indexable

* \[ **n**: *number*\]: T

## Index

### Properties

* [Array](types.list.md#array)
* [length](types.list.md#length)

### Methods

* [[Symbol.iterator]](types.list.md#[symbol.iterator])
* [[Symbol.unscopables]](types.list.md#[symbol.unscopables])
* [add](types.list.md#add)
* [concat](types.list.md#concat)
* [copyWithin](types.list.md#copywithin)
* [create](types.list.md#create)
* [entries](types.list.md#entries)
* [every](types.list.md#every)
* [fill](types.list.md#fill)
* [filter](types.list.md#filter)
* [find](types.list.md#find)
* [findBy](types.list.md#findby)
* [findById](types.list.md#findbyid)
* [findIndex](types.list.md#findindex)
* [first](types.list.md#first)
* [forEach](types.list.md#foreach)
* [getBy](types.list.md#getby)
* [getById](types.list.md#getbyid)
* [getByIdOrThrow](types.list.md#getbyidorthrow)
* [getByOrThrow](types.list.md#getbyorthrow)
* [hasBy](types.list.md#hasby)
* [hasById](types.list.md#hasbyid)
* [hasSame](types.list.md#hassame)
* [includes](types.list.md#includes)
* [indexOf](types.list.md#indexof)
* [join](types.list.md#join)
* [keys](types.list.md#keys)
* [last](types.list.md#last)
* [lastIndexOf](types.list.md#lastindexof)
* [map](types.list.md#map)
* [overrideBy](types.list.md#overrideby)
* [pop](types.list.md#pop)
* [push](types.list.md#push)
* [reduce](types.list.md#reduce)
* [reduceRight](types.list.md#reduceright)
* [removeBy](types.list.md#removeby)
* [removeById](types.list.md#removebyid)
* [replaceBy](types.list.md#replaceby)
* [replaceById](types.list.md#replacebyid)
* [reverse](types.list.md#reverse)
* [shift](types.list.md#shift)
* [slice](types.list.md#slice)
* [some](types.list.md#some)
* [sort](types.list.md#sort)
* [splice](types.list.md#splice)
* [toLocaleString](types.list.md#tolocalestring)
* [toString](types.list.md#tostring)
* [unshift](types.list.md#unshift)
* [values](types.list.md#values)

## Properties

###  Array

• **Array**: *ArrayConstructor*

___

###  length

• **length**: *number*

*Inherited from [List](types.list.md).[length](types.list.md#length)*

*Overrides [List](types.list.md).[length](types.list.md#length)*

Gets or sets the length of the array. This is a number one higher than the highest element defined in an array.

## Methods

###  [Symbol.iterator]

▸ **[Symbol.iterator]**(): *IterableIterator‹T›*

*Inherited from [List](types.list.md).[[Symbol.iterator]](types.list.md#[symbol.iterator])*

*Overrides [List](types.list.md).[[Symbol.iterator]](types.list.md#[symbol.iterator])*

Iterator

**Returns:** *IterableIterator‹T›*

___

###  [Symbol.unscopables]

▸ **[Symbol.unscopables]**(): *object*

*Inherited from [List](types.list.md).[[Symbol.unscopables]](types.list.md#[symbol.unscopables])*

*Overrides [List](types.list.md).[[Symbol.unscopables]](types.list.md#[symbol.unscopables])*

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

**Parameters:**

Name | Type |
------ | ------ |
`element` | T |

**Returns:** *void*

▸ **add**(`element`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`element` | T |

**Returns:** *void*

___

###  concat

▸ **concat**(...`items`: ConcatArray‹T›[]): *T[]*

*Inherited from [List](types.list.md).[concat](types.list.md#concat)*

*Overrides [List](types.list.md).[concat](types.list.md#concat)*

Combines two or more arrays.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | ConcatArray‹T›[] | Additional items to add to the end of array1.  |

**Returns:** *T[]*

▸ **concat**(...`items`: T | ConcatArray‹T›[]): *T[]*

*Inherited from [List](types.list.md).[concat](types.list.md#concat)*

*Overrides [List](types.list.md).[concat](types.list.md#concat)*

Combines two or more arrays.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | T &#124; ConcatArray‹T›[] | Additional items to add to the end of array1.  |

**Returns:** *T[]*

___

###  copyWithin

▸ **copyWithin**(`target`: number, `start`: number, `end?`: number): *this*

*Inherited from [List](types.list.md).[copyWithin](types.list.md#copywithin)*

*Overrides [List](types.list.md).[copyWithin](types.list.md#copywithin)*

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

**Parameters:**

Name | Type |
------ | ------ |
`...sources` | Record‹string, any›[] |

**Returns:** *T*

▸ **create**(...`sources`: Record‹string, any›[]): *T*

**Parameters:**

Name | Type |
------ | ------ |
`...sources` | Record‹string, any›[] |

**Returns:** *T*

___

###  entries

▸ **entries**(): *IterableIterator‹[number, T]›*

*Inherited from [List](types.list.md).[entries](types.list.md#entries)*

*Overrides [List](types.list.md).[entries](types.list.md#entries)*

Returns an iterable of key, value pairs for every entry in the array

**Returns:** *IterableIterator‹[number, T]›*

___

###  every

▸ **every**(`callbackfn`: function, `thisArg?`: any): *boolean*

*Inherited from [List](types.list.md).[every](types.list.md#every)*

*Overrides [List](types.list.md).[every](types.list.md#every)*

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

*Inherited from [List](types.list.md).[fill](types.list.md#fill)*

*Overrides [List](types.list.md).[fill](types.list.md#fill)*

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

*Inherited from [List](types.list.md).[filter](types.list.md#filter)*

*Overrides [List](types.list.md).[filter](types.list.md#filter)*

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

*Inherited from [List](types.list.md).[filter](types.list.md#filter)*

*Overrides [List](types.list.md).[filter](types.list.md#filter)*

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

*Inherited from [List](types.list.md).[find](types.list.md#find)*

*Overrides [List](types.list.md).[find](types.list.md#find)*

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

*Inherited from [List](types.list.md).[find](types.list.md#find)*

*Overrides [List](types.list.md).[find](types.list.md#find)*

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

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *T*

▸ **findBy**(`key`: string, `value`: any): *T*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *T*

___

###  findById

▸ **findById**(`id`: string | [Stringifiable](types.stringifiable.md)): *T*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *T*

▸ **findById**(`id`: string | Stringifiable): *T*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; Stringifiable |

**Returns:** *T*

___

###  findIndex

▸ **findIndex**(`predicate`: function, `thisArg?`: any): *number*

*Inherited from [List](types.list.md).[findIndex](types.list.md#findindex)*

*Overrides [List](types.list.md).[findIndex](types.list.md#findindex)*

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

**Returns:** *T | undefined*

▸ **first**(): *T | undefined*

**Returns:** *T | undefined*

___

###  forEach

▸ **forEach**(`callbackfn`: function, `thisArg?`: any): *void*

*Inherited from [List](types.list.md).[forEach](types.list.md#foreach)*

*Overrides [List](types.list.md).[forEach](types.list.md#foreach)*

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

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *T | undefined*

▸ **getBy**(`key`: string, `value`: any): *T | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *T | undefined*

___

###  getById

▸ **getById**(`id`: string | [Stringifiable](types.stringifiable.md)): *T | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *T | undefined*

▸ **getById**(`id`: string | Stringifiable): *T | undefined*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; Stringifiable |

**Returns:** *T | undefined*

___

###  getByIdOrThrow

▸ **getByIdOrThrow**(`id`: string | [Stringifiable](types.stringifiable.md)): *T*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *T*

▸ **getByIdOrThrow**(`id`: string | Stringifiable): *T*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; Stringifiable |

**Returns:** *T*

___

###  getByOrThrow

▸ **getByOrThrow**(`key`: string, `value`: any): *T*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *T*

▸ **getByOrThrow**(`key`: string, `value`: any): *T*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *T*

___

###  hasBy

▸ **hasBy**(`key`: string, `value`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *boolean*

▸ **hasBy**(`key`: string, `value`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *boolean*

___

###  hasById

▸ **hasById**(`id`: string | [Stringifiable](types.stringifiable.md)): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *boolean*

▸ **hasById**(`id`: string | Stringifiable): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; Stringifiable |

**Returns:** *boolean*

___

###  hasSame

▸ **hasSame**(`element`: T): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`element` | T |

**Returns:** *boolean*

▸ **hasSame**(`element`: T): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`element` | T |

**Returns:** *boolean*

___

###  includes

▸ **includes**(`searchElement`: T, `fromIndex?`: number): *boolean*

*Inherited from [List](types.list.md).[includes](types.list.md#includes)*

*Overrides [List](types.list.md).[includes](types.list.md#includes)*

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

*Inherited from [List](types.list.md).[indexOf](types.list.md#indexof)*

*Overrides [List](types.list.md).[indexOf](types.list.md#indexof)*

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

*Inherited from [List](types.list.md).[join](types.list.md#join)*

*Overrides [List](types.list.md).[join](types.list.md#join)*

Adds all the elements of an array separated by the specified separator string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`separator?` | string | A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.  |

**Returns:** *string*

___

###  keys

▸ **keys**(): *IterableIterator‹number›*

*Inherited from [List](types.list.md).[keys](types.list.md#keys)*

*Overrides [List](types.list.md).[keys](types.list.md#keys)*

Returns an iterable of keys in the array

**Returns:** *IterableIterator‹number›*

___

###  last

▸ **last**(): *T | undefined*

**Returns:** *T | undefined*

▸ **last**(): *T | undefined*

**Returns:** *T | undefined*

___

###  lastIndexOf

▸ **lastIndexOf**(`searchElement`: T, `fromIndex?`: number): *number*

*Inherited from [List](types.list.md).[lastIndexOf](types.list.md#lastindexof)*

*Overrides [List](types.list.md).[lastIndexOf](types.list.md#lastindexof)*

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

*Inherited from [List](types.list.md).[map](types.list.md#map)*

*Overrides [List](types.list.md).[map](types.list.md#map)*

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

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |
`element` | T |

**Returns:** *void*

▸ **overrideBy**(`key`: string, `value`: any, `element`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |
`element` | T |

**Returns:** *void*

___

###  pop

▸ **pop**(): *T | undefined*

*Inherited from [List](types.list.md).[pop](types.list.md#pop)*

*Overrides [List](types.list.md).[pop](types.list.md#pop)*

Removes the last element from an array and returns it.

**Returns:** *T | undefined*

___

###  push

▸ **push**(...`items`: T[]): *number*

*Inherited from [List](types.list.md).[push](types.list.md#push)*

*Overrides [List](types.list.md).[push](types.list.md#push)*

Appends new elements to an array, and returns the new length of the array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | T[] | New elements of the Array.  |

**Returns:** *number*

___

###  reduce

▸ **reduce**(`callbackfn`: function): *T*

*Inherited from [List](types.list.md).[reduce](types.list.md#reduce)*

*Overrides [List](types.list.md).[reduce](types.list.md#reduce)*

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

*Inherited from [List](types.list.md).[reduce](types.list.md#reduce)*

*Overrides [List](types.list.md).[reduce](types.list.md#reduce)*

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

*Inherited from [List](types.list.md).[reduce](types.list.md#reduce)*

*Overrides [List](types.list.md).[reduce](types.list.md#reduce)*

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

*Inherited from [List](types.list.md).[reduceRight](types.list.md#reduceright)*

*Overrides [List](types.list.md).[reduceRight](types.list.md#reduceright)*

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

*Inherited from [List](types.list.md).[reduceRight](types.list.md#reduceright)*

*Overrides [List](types.list.md).[reduceRight](types.list.md#reduceright)*

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

*Inherited from [List](types.list.md).[reduceRight](types.list.md#reduceright)*

*Overrides [List](types.list.md).[reduceRight](types.list.md#reduceright)*

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

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *void*

▸ **removeBy**(`key`: string, `value`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *void*

___

###  removeById

▸ **removeById**(`id`: string | [Stringifiable](types.stringifiable.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; [Stringifiable](types.stringifiable.md) |

**Returns:** *void*

▸ **removeById**(`id`: string | Stringifiable): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; Stringifiable |

**Returns:** *void*

___

###  replaceBy

▸ **replaceBy**(`key`: string, `value`: any, `element`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |
`element` | T |

**Returns:** *void*

▸ **replaceBy**(`key`: string, `value`: any, `element`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |
`element` | T |

**Returns:** *void*

___

###  replaceById

▸ **replaceById**(`id`: string | [Stringifiable](types.stringifiable.md), `element`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; [Stringifiable](types.stringifiable.md) |
`element` | T |

**Returns:** *void*

▸ **replaceById**(`id`: string | Stringifiable, `element`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string &#124; Stringifiable |
`element` | T |

**Returns:** *void*

___

###  reverse

▸ **reverse**(): *T[]*

*Inherited from [List](types.list.md).[reverse](types.list.md#reverse)*

*Overrides [List](types.list.md).[reverse](types.list.md#reverse)*

Reverses the elements in an Array.

**Returns:** *T[]*

___

###  shift

▸ **shift**(): *T | undefined*

*Inherited from [List](types.list.md).[shift](types.list.md#shift)*

*Overrides [List](types.list.md).[shift](types.list.md#shift)*

Removes the first element from an array and returns it.

**Returns:** *T | undefined*

___

###  slice

▸ **slice**(`start?`: number, `end?`: number): *T[]*

*Inherited from [List](types.list.md).[slice](types.list.md#slice)*

*Overrides [List](types.list.md).[slice](types.list.md#slice)*

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

*Inherited from [List](types.list.md).[some](types.list.md#some)*

*Overrides [List](types.list.md).[some](types.list.md#some)*

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

*Inherited from [List](types.list.md).[sort](types.list.md#sort)*

*Overrides [List](types.list.md).[sort](types.list.md#sort)*

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

*Inherited from [List](types.list.md).[splice](types.list.md#splice)*

*Overrides [List](types.list.md).[splice](types.list.md#splice)*

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`start` | number | The zero-based location in the array from which to start removing elements. |
`deleteCount?` | number | The number of elements to remove.  |

**Returns:** *T[]*

▸ **splice**(`start`: number, `deleteCount`: number, ...`items`: T[]): *T[]*

*Inherited from [List](types.list.md).[splice](types.list.md#splice)*

*Overrides [List](types.list.md).[splice](types.list.md#splice)*

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

*Inherited from [List](types.list.md).[toLocaleString](types.list.md#tolocalestring)*

*Overrides [List](types.list.md).[toLocaleString](types.list.md#tolocalestring)*

Returns a string representation of an array. The elements are converted to string using their toLocalString methods.

**Returns:** *string*

___

###  toString

▸ **toString**(): *string*

*Inherited from [List](types.list.md).[toString](types.list.md#tostring)*

*Overrides [List](types.list.md).[toString](types.list.md#tostring)*

Returns a string representation of an array.

**Returns:** *string*

___

###  unshift

▸ **unshift**(...`items`: T[]): *number*

*Inherited from [List](types.list.md).[unshift](types.list.md#unshift)*

*Overrides [List](types.list.md).[unshift](types.list.md#unshift)*

Inserts new elements at the start of an array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...items` | T[] | Elements to insert at the start of the Array.  |

**Returns:** *number*

___

###  values

▸ **values**(): *IterableIterator‹T›*

*Inherited from [List](types.list.md).[values](types.list.md#values)*

*Overrides [List](types.list.md).[values](types.list.md#values)*

Returns an iterable of values in the array

**Returns:** *IterableIterator‹T›*

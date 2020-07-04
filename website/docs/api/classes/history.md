---
id: "history"
title: "History"
sidebar_label: "History"
---

## Type parameters

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

▪ **T**

## Hierarchy

* [Array](../interfaces/types.list.md#array)

* [Array](../interfaces/types.list.md#array)

  ↳ **History**

## Indexable

* \[ **n**: *number*\]: T

## Index

### Constructors

* [constructor](history.md#constructor)

### Properties

* [length](history.md#length)
* [Array](history.md#static-array)

### Methods

* [[Symbol.iterator]](history.md#[symbol.iterator])
* [[Symbol.unscopables]](history.md#[symbol.unscopables])
* [concat](history.md#concat)
* [copyWithin](history.md#copywithin)
* [entries](history.md#entries)
* [every](history.md#every)
* [fill](history.md#fill)
* [filter](history.md#filter)
* [find](history.md#find)
* [findIndex](history.md#findindex)
* [forEach](history.md#foreach)
* [getInitializingMessage](history.md#getinitializingmessage)
* [includes](history.md#includes)
* [indexOf](history.md#indexof)
* [join](history.md#join)
* [keys](history.md#keys)
* [lastIndexOf](history.md#lastindexof)
* [map](history.md#map)
* [pop](history.md#pop)
* [push](history.md#push)
* [reduce](history.md#reduce)
* [reduceRight](history.md#reduceright)
* [reverse](history.md#reverse)
* [shift](history.md#shift)
* [slice](history.md#slice)
* [some](history.md#some)
* [sort](history.md#sort)
* [splice](history.md#splice)
* [toLocaleString](history.md#tolocalestring)
* [toString](history.md#tostring)
* [unshift](history.md#unshift)
* [values](history.md#values)

## Constructors

###  constructor

\+ **new History**(`events`: [Event](../interfaces/types.event.md)[]): *[History](history.md)*

Creates an instance of History.
Creates an instance of History.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`events` | [Event](../interfaces/types.event.md)[] | List of all events that already happen on `EventSourceable`.  |

**Returns:** *[History](history.md)*

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

###  getInitializingMessage

▸ **getInitializingMessage**(): *[Event](../interfaces/types.event.md)*

Returns initializing message.

**Returns:** *[Event](../interfaces/types.event.md)*

Returns initializing message as instance implementing `Event` interface.

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

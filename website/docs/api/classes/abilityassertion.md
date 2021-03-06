---
id: "abilityassertion"
title: "AbilityAssertion"
sidebar_label: "AbilityAssertion"
---

## Hierarchy

* [Assertion](assertion.md)

* Assertion

  ↳ **AbilityAssertion**

## Index

### Constructors

* [constructor](abilityassertion.md#constructor)

### Properties

* [api](abilityassertion.md#api)
* [asserter](abilityassertion.md#asserter)

### Methods

* [getApi](abilityassertion.md#getapi)

## Constructors

###  constructor

\+ **new AbilityAssertion**(`asserter`: [Asserter](../interfaces/types.asserter.md)): *[AbilityAssertion](abilityassertion.md)*

*Inherited from [Assertion](assertion.md).[constructor](assertion.md#constructor)*

*Overrides void*

**Parameters:**

Name | Type |
------ | ------ |
`asserter` | [Asserter](../interfaces/types.asserter.md) |

**Returns:** *[AbilityAssertion](abilityassertion.md)*

## Properties

###  api

• **api**: *Map‹string, any›* = new Map([
    // Validation - ensures that `Entity` is able to handle an action(throws error)
    [
      'ensure.is.ableTo',
      new Proxy(this, {
        get(target: any, propKey: string): any {
          const entity = target.asserter.getEntity();
          if (typeof entity[propKey] === 'function') {
            const proxifiedMethod = new Proxy(entity[propKey], {
              apply(_targetMethod, _thisArg, args): any {
                entity[SAVE_STATE_METHOD_KEY]();
                const result = entity[propKey](...args);
                entity[ROLLBACK_STATE_METHOD_KEY]();
                target.asserter.clearAction();
                return result;
              },
            });
            return proxifiedMethod;
          }
          return entity[propKey];
        },
      }),
    ],
    // Evaluation - evaluates that `Entity` is able to handle an action(returns boolean)
    [
      'is.ableTo',
      new Proxy(this, {
        get(target: any, propKey: string): any {
          const entity = target.asserter.getEntity();
          if (typeof entity[propKey] === 'function') {
            const proxifiedMethod = new Proxy(entity[propKey], {
              apply(_targetMethod, _thisArg, args): any {
                entity[SAVE_STATE_METHOD_KEY]();
                let isAble = true;
                try {
                  entity[propKey](...args);
                } catch (e) {
                  isAble = false;
                }
                entity[ROLLBACK_STATE_METHOD_KEY]();
                return isAble;
              },
            });
            return proxifiedMethod;
          }
          return entity[propKey];
        },
      }),
    ],
  ])

*Overrides [Assertion](assertion.md).[api](assertion.md#api)*

Since our goal is to enable expressive API in form of:

**`example`** 
```ts
entity.ensure.is.ableTo.doAction(...)
```
We need to use Proxy to pass-through all calls to the entity itself
(entity state will be not changed upon invoking method).

**`remarks`** 
The `entity.ensure` getter-method will return a Proxified instance of the
`Entity`. This proxified instance listens to all get methods and
catches the requested method name.

If the requested get method is named `is` - `is` an existing api registered
on `Asserter` with `AbilityAssertion` as assertion API.
This will return an object that will include property:
```ts
{ableTo: ...}
```
That will be fired with code below.

**`remarks`** 
Same approach is used for evaluator api `is.ableTo`(returning boolean
by catching any thrown error) - however it was replaced by
`Entity.prototype.can` method directly build on Entity.
The `is.ableTo` legacy code is still available to show possibilities of
building custom assertion apis without direct modification of
`Entity` or its subclasses - to have a assertion api code shared
'globally'.

___

###  asserter

• **asserter**: *[Asserter](../interfaces/types.asserter.md)*

*Inherited from [Assertion](assertion.md).[asserter](assertion.md#asserter)*

*Overrides void*

## Methods

###  getApi

▸ **getApi**(): *Map‹string, Function›*

*Inherited from [Assertion](assertion.md).[getApi](assertion.md#getapi)*

*Overrides void*

**Returns:** *Map‹string, Function›*

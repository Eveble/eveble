import { expect, describe, it, vi } from 'vitest';

import { Type } from '@eveble/core';
import { Serializable } from '../../../src/components/serializable';
import { List } from '../../../src/domain/list';
import {
  ElementNotFoundError,
  ElementAlreadyExistsError,
  IdentifiableAlreadyExistsError,
} from '../../../src/domain/domain-errors';

describe('List', () => {
  @Type('Item', { isRegistrable: false })
  class Item extends Serializable {
    name: string;
  }

  @Type('Order', { isRegistrable: false })
  class Order extends Serializable {
    id: string;

    items: Item[];

    getId(): string {
      return this.id;
    }
  }

  @Type('Employee', { isRegistrable: false })
  class Employee extends Serializable {
    id: string;

    isTerminated?: boolean;

    getId(): string {
      return this.id;
    }
  }

  @Type('Company', { isRegistrable: false })
  class Company extends Serializable {
    id: string;

    employees: Employee[];

    getId(): string {
      return this.id;
    }
  }

  it('extends Array', () => {
    expect(List.prototype).toBeInstanceOf(Array);
  });

  describe('construction', () => {
    it('takes required: Serializable source, property key under which list is defined, Serializable type and assings them', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const serializables = [
        new Item({ name: 'first' }),
        new Item({ name: 'second' }),
      ];
      const listKey = 'items';

      const list = new List<Item>(source, listKey, Item, serializables);
      expect(list.getSource()).toBe(source);
      expect(list.getListKey()).toBe(listKey);
      expect(list.getSerializableType()).toBe(Item);

      expect(list).toHaveLength(2);
      expect(list).to.have.eql([serializables[0], serializables[1]]);
    });
  });

  describe('conversion', () => {
    describe('toPlainObject', () => {
      it('converting other serializables', () => {
        const id = 'my-order-id';
        const items = [
          new Item({ name: 'first' }),
          new Item({ name: 'second' }),
        ];
        const source = new Order({ id, items });
        const list = source.in<Item>('items');
        const result = list.toPlainObject();

        expect(result).toEqual([{ name: 'first' }, { name: 'second' }]);
        expect(result[0]).not.toBeInstanceOf(Item);
        expect(result[1]).not.toBeInstanceOf(Item);
      });

      it('converting other values', () => {
        @Type('MyString', { isRegistrable: false })
        class MyString extends String {
          typeName() {
            return 'MyString';
          }

          toJSONValue() {
            return vi.fn();
          }
        }

        @Type('MyStringContainer', { isRegistrable: false })
        class MyStringContainer extends Serializable {
          items: MyString[];
        }

        const items = [new MyString('first'), new MyString('second')];
        const source = new MyStringContainer({ items });

        const list = source.in<Item>('items');
        const result = list.toPlainObject();

        expect(result).toEqual(['first', 'second']);
        expect(result[0]).not.toBeInstanceOf(MyString);
        expect(result[1]).not.toBeInstanceOf(MyString);
      });
    });
  });

  describe('create', () => {
    it('creates new serializable on the list', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      source.in<Item>('items').create({
        name: 'my-item-name',
      });
      expect(source.items[0]).toBeInstanceOf(Item);
      expect(source.items[0]).toEqual(
        new Item({
          name: 'my-item-name',
        })
      );
    });

    it('ensures that add method is called for adding new element to list', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const list = source.in<Item>('items');
      list.add = vi.fn();

      list.create({
        name: 'my-item-name',
      });
      expect(list.add).toHaveBeenCalledTimes(1);
      expect(list.add).toHaveBeenCalledWith(
        expect.objectContaining(
          new Item({
            name: 'my-item-name',
          })
        )
      );
    });
  });

  describe('add', () => {
    it('adds new serializable to list', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const element = new Item({ name: 'my-item-name' });

      source.in<Item>('items').add(element);
      expect(source.items[0]).toBeInstanceOf(Item);
      expect(source.items[0]).toEqual(
        new Item({
          name: 'my-item-name',
        })
      );
    });

    it('throws ElementAlreadyExistsError serializable with same values exists already on the list', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const element = new Item({ name: 'my-item-name' });

      source.in<Item>('items').add(element);
      expect(() => source.in<Item>('items').add(element)).toThrow(
        ElementAlreadyExistsError,
        `Order@my-order-id: already has same 'Item' on 'items' list`
      );
    });

    it('adds new identifiable to list', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      const element = new Employee({ id: 'my-employee-id' });

      source.in<Employee>('employees').add(element);
      expect(source.employees[0]).toBeInstanceOf(Employee);
      expect(source.employees[0]).toEqual(
        new Employee({
          id: 'my-employee-id',
        })
      );
    });

    it('throws IdentifiableAlreadyExistsError if type that can be identified already exists', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      const element = new Employee({ id: 'my-employee-id' });

      source.in<Employee>('employees').add(element);
      expect(() => source.in<Employee>('employees').add(element)).toThrow(
        IdentifiableAlreadyExistsError,
        `Company@my-company-id: already has 'Employee' with id 'my-employee-id' on 'employees' list`
      );
    });
  });

  describe('overrideBy', () => {
    it('adds new serializable to list', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const element = new Item({ name: 'my-item-name' });

      source.in<Item>('items').add(element);
      expect(source.items[0]).toBeInstanceOf(Item);
      expect(source.items[0]).toEqual(
        new Item({
          name: 'my-item-name',
        })
      );
    });

    it('overrides pre-existing serializable on the list', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const firstElement = new Item({ name: 'my-first-name' });
      const secondElement = new Item({ name: 'my-second-name' });

      source.in<Item>('items').add(firstElement);
      expect(source.items[0]).toBe(firstElement);

      source
        .in<Item>('items')
        .overrideBy('name', 'my-first-name', secondElement);
      expect(source.items[0]).toBe(secondElement);
    });

    it('overrides pre-existing identifiable on the list', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      const firstElement = new Employee({ id: 'my-first-id' });
      const secondElement = new Employee({
        id: 'my-first-id',
        isTerminated: true,
      });

      source.in<Employee>('employees').add(firstElement);
      expect(source.employees[0]).toBe(firstElement);
      source
        .in<Employee>('employees')
        .overrideBy('id', firstElement.getId(), secondElement);
      expect(source.employees[0]).toBe(secondElement);
    });
  });

  describe('getBy', () => {
    it('returns undefined for empty list', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      expect(source.in<Item>('items').getBy('name', 'my-item-name')).to.be
        .undefined;
    });

    it(`returns undefined for element that can't be found on list`, () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const element = new Item({ name: 'my-item-name' });
      source.in<Item>('items').add(element);
      expect(source.in<Item>('items').getBy('name', 'my-other-item-name')).to.be
        .undefined;
    });

    it('returns element from the list by matching key and value', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const firstElement = new Item({ name: 'my-first-name' });
      const secondElement = new Item({ name: 'my-second-name' });
      source.in<Item>('items').add(firstElement);
      source.in<Item>('items').add(secondElement);
      expect(source.in<Item>('items').getBy('name', 'my-first-name')).toBe(
        firstElement
      );
    });
  });

  describe('getByOrThrow', () => {
    it('returns element from the list by matching key and value', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const firstElement = new Item({ name: 'my-first-name' });
      const secondElement = new Item({ name: 'my-second-name' });
      source.in<Item>('items').add(firstElement);
      source.in<Item>('items').add(secondElement);
      expect(
        source.in<Item>('items').getByOrThrow('name', 'my-first-name')
      ).toBe(firstElement);
    });

    it(`throws ElementNotFoundError if element can't be found on the list`, () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      expect(() =>
        source.in<Item>('items').getByOrThrow('name', 'my-item-name')
      ).toThrow(
        ElementNotFoundError,
        `Order@my-order-id: does not contain 'Item' with name 'String("my-item-name")' on 'items' list`
      );
    });
  });

  describe('getById', () => {
    it('returns identifiable element from the list by matching identifier', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      const firstElement = new Employee({ id: 'my-first-id' });
      const secondElement = new Employee({
        id: 'my-second-id',
      });

      source.in<Employee>('employees').add(firstElement);
      source.in<Employee>('employees').add(secondElement);
      expect(source.in<Employee>('employees').getById('my-first-id')).toBe(
        firstElement
      );
    });

    it(`returns undefined for identifiable element that can't be found`, () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      expect(source.in<Employee>('employees').getById('my-first-id')).toBe(
        undefined
      );
    });
  });

  describe('getByIdOrThrow', () => {
    it('returns identifiable element from the list by matching identifier', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      const firstElement = new Employee({ id: 'my-first-id' });
      const secondElement = new Employee({
        id: 'my-second-id',
      });

      source.in<Employee>('employees').add(firstElement);
      source.in<Employee>('employees').add(secondElement);
      expect(
        source.in<Employee>('employees').getByIdOrThrow('my-first-id')
      ).toBe(firstElement);
    });

    it(`throws ElementNotFoundError if identifiable element can't be found`, () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      expect(() =>
        source.in<Employee>('employees').getByIdOrThrow('my-first-id')
      ).toThrow(
        ElementNotFoundError,
        `Company@my-company-id: does not contain 'Employee' with id 'my-first-id' on 'employees' list`
      );
    });
  });

  describe('findById', () => {
    it('aliases getByIdOrThrow', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      const list = source.in<Employee>('employees');
      list.getByIdOrThrow = vi.fn();

      list.findById('my-first-id');
      expect(list.getByIdOrThrow).toHaveBeenCalledTimes(1);
      expect(list.getByIdOrThrow).toHaveBeenCalledWith('my-first-id');
    });
  });

  describe('findBy', () => {
    it('aliases getByOrThrow', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const list = source.in<Item>('items');
      list.getByOrThrow = vi.fn();

      list.findBy('name', 'my-first-name');
      expect(list.getByOrThrow).toHaveBeenCalledTimes(1);
      expect(list.getByOrThrow).toHaveBeenCalledWith('name', 'my-first-name');
    });
  });

  describe('hasBy', () => {
    it('returns true if element exists by matching key and value', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const element = new Item({ name: 'my-first-name' });
      source.in<Item>('items').add(element);
      expect(source.in<Item>('items').hasBy('name', 'my-first-name')).to.be
        .true;
    });

    it('returns false for non-matching element', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      expect(source.in<Item>('items').hasBy('name', 'my-item-name')).to.be
        .false;
    });
  });

  describe('hasSame', () => {
    it('returns true if element exists with same values and type', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const element = new Item({ name: 'my-first-name' });
      source.in<Item>('items').add(element);
      expect(source.in<Item>('items').hasSame(element)).toBe(true);
    });

    it('returns false for non-matching element', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const element = new Item({ name: 'my-first-name' });
      expect(source.in<Item>('items').hasSame(element)).toBe(false);
    });
  });

  describe('hasById', () => {
    it('returns true if identifiable element exists by matching identifer', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      const element = new Employee({ id: 'my-first-id' });
      source.in<Employee>('employees').add(element);
      expect(source.in<Employee>('employees').hasById('my-first-id')).to.be
        .true;
    });

    it('returns false for non-matching element', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      expect(source.in<Employee>('employees').hasById('my-first-id')).to.be
        .false;
    });
  });

  describe('replaceById', () => {
    it('adds element by id if it does not exist', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      const element = new Employee({ id: 'my-id' });
      source.in<Employee>('employees').replaceById(element.id, element);
      expect(source.in<Employee>('employees').getById('my-id')).toBe(element);
    });

    it('replaces existing element by id', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      const element = new Employee({ id: 'my-id' });
      const updatedElement = new Employee({ id: 'my-id' });
      source.in<Employee>('employees').add(element);
      source
        .in<Employee>('employees')
        .replaceById(updatedElement.id, updatedElement);
      expect(source.in<Employee>('employees').getById('my-id')).toBe(
        updatedElement
      );
    });
  });

  describe('replaceBy', () => {
    it('adds element it does not exist', () => {
      const source = new Order({
        id: 'my-order-id',
        items: [],
      });
      const element = new Item({
        name: 'my-name',
      });
      source.in<Item>('items').replaceBy('name', element.name, element);
      expect(source.in<Item>('items').getBy('name', 'my-name')).toBe(element);
    });

    it('replaces existing element by matching key and value', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const firstElement = new Item({ name: 'my-name' });
      const secondElement = new Item({ name: 'my-name' });
      source.in<Item>('items').add(firstElement);
      source.in<Item>('items').replaceBy('name', 'my-name', secondElement);
      expect(source.in<Item>('items').getBy('name', 'my-name')).toBe(
        secondElement
      );
      expect(source.in<Item>('items').getBy('name', 'my-name')).to.be.not.equal(
        firstElement
      );
    });
  });

  describe('removeById', () => {
    it('removes identifiable element by matching identifier', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      const firstElement = new Employee({ id: 'my-first-id' });
      const secondElement = new Employee({
        id: 'my-second-id',
      });
      source.in<Employee>('employees').add(firstElement);
      source.in<Employee>('employees').add(secondElement);
      expect(source.employees).toHaveLength(2);
      expect(source.employees).to.be.have.members([
        firstElement,
        secondElement,
      ]);
      source.in<Employee>('employees').removeById('my-first-id');
      expect(source.employees).toHaveLength(1);
      expect(source.employees).to.be.have.members([secondElement]);
    });
  });

  describe('removeBy', () => {
    it('removes element by matching key and value', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const firstElement = new Item({ name: 'my-first-name' });
      const secondElement = new Item({ name: 'my-second-name' });
      source.in<Item>('items').add(firstElement);
      source.in<Item>('items').add(secondElement);
      expect(source.items).toHaveLength(2);
      expect(source.items).to.be.have.members([firstElement, secondElement]);
      source.in<Item>('items').removeBy('name', 'my-first-name');
      expect(source.items).toHaveLength(1);
      expect(source.items).to.be.have.members([secondElement]);
    });
  });

  describe('deleteById', () => {
    it('deletes identifiable element by matching identifier', () => {
      const source = new Company({ id: 'my-company-id', employees: [] });
      const firstElement = new Employee({ id: 'my-first-id' });
      const secondElement = new Employee({
        id: 'my-second-id',
      });
      source.in<Employee>('employees').add(firstElement);
      source.in<Employee>('employees').add(secondElement);
      expect(source.employees).toHaveLength(2);
      expect(source.employees).to.be.have.members([
        firstElement,
        secondElement,
      ]);
      source.in<Employee>('employees').deleteById('my-first-id');
      expect(source.employees).toHaveLength(1);
      expect(source.employees).to.be.have.members([secondElement]);
    });
  });

  describe('deleteBy', () => {
    it('deletes element by matching key and value', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const firstElement = new Item({ name: 'my-first-name' });
      const secondElement = new Item({ name: 'my-second-name' });
      source.in<Item>('items').add(firstElement);
      source.in<Item>('items').add(secondElement);
      expect(source.items).toHaveLength(2);
      expect(source.items).to.be.have.members([firstElement, secondElement]);
      source.in<Item>('items').deleteBy('name', 'my-first-name');
      expect(source.items).toHaveLength(1);
      expect(source.items).to.be.have.members([secondElement]);
    });
  });

  describe('first', () => {
    it('returns undefined for empty list', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      expect(source.in<Item>('items').first()).toBe(undefined);
    });

    it('returns first element from the list', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const firstElement = new Item({ name: 'my-first-name' });
      const secondElement = new Item({ name: 'my-second-name' });
      source.in<Item>('items').add(firstElement);
      source.in<Item>('items').add(secondElement);
      expect(source.in<Item>('items').first()).toBe(firstElement);
    });
  });

  describe('last', () => {
    it('returns undefined for empty list', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      expect(source.in<Item>('items').last()).toBe(undefined);
    });

    it('returns last element from the list', () => {
      const source = new Order({ id: 'my-order-id', items: [] });
      const firstElement = new Item({ name: 'my-first-name' });
      const secondElement = new Item({ name: 'my-second-name' });
      source.in<Item>('items').add(firstElement);
      source.in<Item>('items').add(secondElement);
      expect(source.in<Item>('items').last()).toBe(secondElement);
    });
  });
});

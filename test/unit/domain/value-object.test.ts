import { expect, describe, it } from 'vitest';

import { ValueObject } from '../../../src/domain/value-object';
import { Serializable } from '../../../src/components/serializable';
import { isTyped } from '../../../src/utils/helpers';

describe(`ValueObject`, () => {
  it(`extends Serializable`, () => {
    expect(ValueObject.prototype).toBeInstanceOf(Serializable);
  });

  it('ensures that type is defined', () => {
    expect(isTyped(ValueObject.prototype)).toBe(true);
  });

  it('defines the type name correctly', () => {
    expect(ValueObject.getTypeName()).toBe('ValueObject');
    expect(ValueObject.prototype.getTypeName()).toBe('ValueObject');
  });
});


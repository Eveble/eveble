import { expect, describe, it } from 'vitest';

import { Type } from '@eveble/core';
import { DomainError } from '../../../src/domain/domain-error';
import { SerializableError } from '../../../src/components/serializable-error';
import { isTyped } from '../../../src/utils/helpers';

describe('DomainError', () => {
  @Type()
  class MyDomainError extends DomainError {}

  it(`extends SerializableError`, () => {
    expect(DomainError.prototype).toBeInstanceOf(SerializableError);
  });

  it('ensures that type is defined', () => {
    expect(isTyped(DomainError.prototype)).toBe(true);
  });

  it('defines its serializable type name correctly', () => {
    expect(DomainError.getTypeName()).toBe('DomainError');
    expect(new MyDomainError('my-error').getTypeName()).toBe(
      'MyDomainError'
    );
  });
});


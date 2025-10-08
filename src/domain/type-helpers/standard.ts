import { Type } from '@eveble/core';
import { UnimplementedError, ValueObjectError } from '../domain-errors';
import { types } from '../../types';

@Type('UnconvertibleStandardError')
export class UnconvertibleStandardError extends ValueObjectError {
  public standardId: string;

  constructor(standardId: string) {
    super({ message: `Standard does not support conversion`, standardId });
  }
}

export class Standard<T> implements types.Standard<T> {
  public id: string;

  public isConvertible: boolean;

  public codes?: T[];

  /**
   * Creates an instance of Standard.
   * @param id - Standard identifier.
   * @param isConvertible - Flag indicating if standard supports conversion to other one.
   * @param codes - List of codes.
   */
  constructor(id: string, isConvertible = false, codes?: T[]) {
    this.id = id;
    this.isConvertible = isConvertible;
    this.codes = codes;
  }

  /**
   * Returns standard identifier.
   * @returns Standard identifier as a string.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Evaluates if code is valid for standard.
   * @param code - Evaluated code.
   * @returns Returns `true` if code is valid, else `false`.
   */
  public isValid(code: T): boolean {
    return this.isIn(code);
  }

  /**
   * Evaluates if code is applicable to standard.
   * @param code - Evaluated code.
   * @returns Returns `true` if code is applicable to standard, else `false`.
   * @throws {UnimplementedError}
   * Thrown if method is not implemented on standard.
   */
  public isIn(code: T): boolean {
    if (this.codes === undefined) {
      throw new UnimplementedError();
    }
    return this.codes.includes(code);
  }

  /**
   * Converts code with identified standard to current standard.
   * @param code - Converted code.
   * @param identifiedStandard - Identified `Standard` instance for code.
   * @returns Returns converted code if possible, else undefined.
   * @throws {UnconvertibleStandardError}
   * Thrown if standard does not support conversion.
   */
  public convert(
    code: T,
    _identifiedStandard: types.Standard<T>
  ): T | undefined {
    if (!this.isConvertible) {
      throw new UnconvertibleStandardError(this.id);
    }
    return code;
  }

  /**
   * Returns list of codes in standard.
   * @returns List of codes supported in standard.
   */
  public getCodes(): T[] {
    return this.codes || [];
  }
}

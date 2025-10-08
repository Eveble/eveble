import { Type } from '@eveble/core';
import { trait } from '@traits-ts/core';
import { types } from '../../../types';
import { ValueObjectError } from '../../domain-errors';

@Type('Eveble.StandardError')
export class StandardError extends ValueObjectError {}

@Type('Eveble.UnsupportedStandardError')
export class UnsupportedStandardError extends ValueObjectError {
  public standardId: string;

  constructor(standardId: string) {
    super({ message: `Standard is not supported`, standardId });
  }
}

@Type('Eveble.StandardExistError')
export class StandardExistError extends StandardError {
  constructor(typeName: string, id: string) {
    super(`${typeName}: standard with id '${id}' already exists`);
  }
}

@Type('Eveble.NotApplicableError')
export class NotApplicableError extends StandardError {
  constructor(typeName: string, id: string) {
    super(`${typeName}: standard with id '${id}' is not applicable`);
  }
}

@Type('Eveble.UnavailableConversionError')
export class UnavailableConversionError extends StandardError {
  public from: string;

  public to: string;

  constructor(from: string, to: string) {
    super({ message: `Conversion is not available`, from, to });
  }
}

export const StandardizedTrait = trait(
  (base) =>
    class extends base {
      public static standards?: Map<string, types.Standard<any>>;

      /**
       * Registers standard on `ValueObject`.
       * @param standard - Instance implementing `Standard` interface.
       * @param shouldOverride - Flag indicating that standard should be override.
       */
      public static registerStandard(
        standard: types.Standard<any>,
        shouldOverride = false
      ): void {
        if (this.standards === undefined) {
          this.standards = new Map();
        }
        if (this.hasStandard(standard.getId()) && !shouldOverride) {
          throw new StandardExistError(
            (this as any).getTypeName(),
            standard.getId()
          );
        }
        this.standards.set(standard.getId(), standard);
      }

      /**
       * Overrides registered hook by action and id or registers a new one.
       * @param standard - Instance implementing `Standard` interface.
       */
      public static overrideStandard(standard: types.Standard<any>): void {
        this.registerStandard(standard, true);
      }

      /**
       * Evaluates if standard is registered by standard identifier.
       * @param standardId - Standard identifier.
       * @returns Returns `true` if standard is registered, else `false`.
       */
      public static hasStandard(standardId: string): boolean {
        if (this.standards === undefined) return false;
        return this.standards?.has(standardId);
      }

      /**
       * Removes standard by standard identifier.
       * @param standardId - Standard identifier.
       */
      public static removeStandard(standardId: string): void {
        this.standards?.delete(standardId);
      }

      /**
       * Returns registered standards.
       * @returns List of all registered standards as `Standard` instances.
       */
      public static getStandards(): types.Standard<any>[] {
        if (this.standards !== undefined) {
          return Array.from(this.standards?.values());
        }
        return [];
      }

      /**
       * Returns standard by standard identifier.
       * @param standardId - Standard identifier.
       * @returns Instance of `Standard` if registered, else `undefined`.
       */
      public static getStandard(
        standardId: string
      ): types.Standard<any> | undefined {
        if (this.standards === undefined) return undefined;
        return this.standards.get(standardId);
      }

      /**
       * Returns list of all codes in standard.
       * @param standardId - Standard identifier.
       * @returns List with all standards in code.
       */
      public static getCodes(standardId: string): any[] {
        if (!this.hasStandard(standardId)) {
          throw new UnsupportedStandardError(standardId);
        }
        const standard = this.standards?.get(standardId) as types.Standard<any>;
        return standard.getCodes();
      }

      /**
       * Identifies code standard.
       * @param code - Evaluated code.
       * @returns Standard for code if identified, else `undefined`.
       */
      public static identifyStandard(
        code: string
      ): types.Standard<any> | undefined {
        if (this.standards === undefined) return undefined;
        for (const standard of this.standards.values()) {
          if (standard.isValid(code)) return standard;
        }
        return undefined;
      }

      /**
       * Evaluates if code is in standard.
       * @param code - Evaluated code.
       * @param standardId - Standard identifier.
       * @returns Returns `true` if code is in standard, else `false`.
       */
      public static isInStandard(code: string, standardId: string): boolean {
        if (!this.hasStandard(standardId)) {
          throw new UnsupportedStandardError(standardId);
        }
        const standard = this.getStandard(standardId) as types.Standard<any>;
        return standard.isIn(code);
      }

      /**
       * Converts code to another standard.
       * @param code - Converted code.
       * @param otherStandardId - Standard identifier to which code should be converted.
       * @returns Converted code if conversion is doable, else `undefined`.
       */
      public static convert(
        code: string,
        otherStandardId: string
      ): string | undefined {
        if (!this.hasStandard(otherStandardId)) {
          throw new UnsupportedStandardError(otherStandardId);
        }

        const identifiedStandard = this.identifyStandard(code);
        if (identifiedStandard?.getId() === otherStandardId) return code;

        const standard = this.getStandard(
          otherStandardId
        ) as types.Standard<any>;
        if (standard.isConvertible === true) {
          return standard.convert(
            code,
            identifiedStandard as types.Standard<any>
          );
        }
        return undefined;
      }
    }
);

import { ValueObject } from '../value-object';
import { types } from '../../types';
import { ValueObjectError } from '../domain-errors';
export declare class InvalidGuidValueError extends ValueObjectError {
    constructor(got: string);
}
export declare class Guid extends ValueObject implements types.Stringifiable {
    id: string;
    constructor(propsOrVal?: {
        id: string;
    } | string);
    valueOf(): string;
    toString(): string;
    equals(otherGuid: Guid): boolean;
    static generate(): Guid;
    static pattern: RegExp;
    static isValid(id: string): boolean;
}

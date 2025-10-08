import { ValueObjectError } from '../domain-errors';
import { types } from '../../types';
export declare class UnconvertibleStandardError extends ValueObjectError {
    standardId: string;
    constructor(standardId: string);
}
export declare class Standard<T> implements types.Standard<T> {
    id: string;
    isConvertible: boolean;
    codes?: T[];
    constructor(id: string, isConvertible?: boolean, codes?: T[]);
    getId(): string;
    isValid(code: T): boolean;
    isIn(code: T): boolean;
    convert(code: T, _identifiedStandard: types.Standard<T>): T | undefined;
    getCodes(): T[];
}

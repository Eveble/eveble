import { types } from '../../../types';
import { ValueObjectError } from '../../domain-errors';
export declare class StandardError extends ValueObjectError {
}
export declare class UnsupportedStandardError extends ValueObjectError {
    standardId: string;
    constructor(standardId: string);
}
export declare class StandardExistError extends StandardError {
    constructor(typeName: string, id: string);
}
export declare class NotApplicableError extends StandardError {
    constructor(typeName: string, id: string);
}
export declare class UnavailableConversionError extends StandardError {
    from: string;
    to: string;
    constructor(from: string, to: string);
}
export declare const StandardizedTrait: import("@traits-ts/core").Trait<(base: any) => {
    new (): {
        [x: string]: any;
    };
    [x: string]: any;
    standards?: Map<string, types.Standard<any>> | undefined;
    registerStandard(standard: types.Standard<any>, shouldOverride?: boolean): void;
    overrideStandard(standard: types.Standard<any>): void;
    hasStandard(standardId: string): boolean;
    removeStandard(standardId: string): void;
    getStandards(): types.Standard<any>[];
    getStandard(standardId: string): types.Standard<any> | undefined;
    getCodes(standardId: string): any[];
    identifyStandard(code: string): types.Standard<any> | undefined;
    isInStandard(code: string, standardId: string): boolean;
    convert(code: string, otherStandardId: string): string | undefined;
}, undefined>;

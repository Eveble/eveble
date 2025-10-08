import { ExtendableError } from '@eveble/core';
export declare class InvalidValidatorIdError extends ExtendableError {
    constructor(got: string);
}
export declare class ValidatorExistsError extends ExtendableError {
    constructor(id: string);
}
export declare class ValidatorNotFoundError extends ExtendableError {
    constructor(id: string);
}
export declare const ValidatorTrait: <T>() => import("@traits-ts/core").Trait<(base: any) => {
    new (validators?: Map<string, T>): {
        [x: string]: any;
        validators: Map<string, T>;
        registerValidator(id: string, validator: T, shouldOverride?: boolean): void;
        overrideValidator(id: string, validator: T): void;
        getValidator(id: string): T | undefined;
        hasValidator(id: string): boolean;
        removeValidator(id: string): void;
        getValidators(): Map<string, T>;
    };
    [x: string]: any;
}, undefined>;

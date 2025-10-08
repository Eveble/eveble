import { ExtendableError } from '@eveble/core';
export declare class InvalidGeneratorIdError extends ExtendableError {
    constructor(got: string);
}
export declare class GeneratorExistsError extends ExtendableError {
    constructor(id: string);
}
export declare class GeneratorNotFoundError extends ExtendableError {
    constructor(id: string);
}
export declare const GeneratorTrait: <T>() => import("@traits-ts/core").Trait<(base: any) => {
    new (generators?: Map<string, T>): {
        [x: string]: any;
        generators: Map<string, T>;
        registerGenerator(id: string, generator: T, shouldOverride?: boolean): void;
        overrideGenerator(id: string, generator: T): void;
        getGenerator(id: string): T | undefined;
        hasGenerator(id: string): boolean;
        removeGenerator(id: string): void;
        getGenerators(): Map<string, T>;
    };
    [x: string]: any;
}, undefined>;

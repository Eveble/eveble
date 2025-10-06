import 'reflect-metadata';
export interface InversifyClassMetadata {
    constructorArguments: any[];
    lifecycle: {
        postConstructMethodNames: Set<string>;
        preDestroyMethodNames: Set<string>;
    };
    properties: Map<string, {
        kind: number;
        name: string | undefined;
        optional: boolean;
        tags: Map<any, any>;
        value: any;
    }>;
    scope: any;
}
export declare function getInversifyMetadata(target: any): InversifyClassMetadata | null;
export declare function isInjectableClass(target: any): boolean;
export declare function getInjectedPropertyNames(target: any): string[];
export declare function getInjectedParameterIndices(target: any): number[];
export declare function getInjectedPropertyDetails(target: any): Map<string, {
    serviceIdentifier: any;
    optional: boolean;
    name?: string;
    tags: Map<any, any>;
}>;
export declare function hasPostConstruct(target: any): boolean;
export declare function getPostConstructMethodNames(target: any): string[];
export declare function hasPreDestroy(target: any): boolean;
export declare function getPreDestroyMethodNames(target: any): string[];
export declare function getMetadataSummary(target: any): {
    isInjectable: boolean;
    injectedProperties: string[];
    injectedParameters: number[];
    postConstructMethods: string[];
    preDestroyMethods: string[];
    scope: any;
};
export declare function debugInversifyMetadata(target: any): void;
export declare function getAllClassProperties(target: any): string[];
export declare function getPropertiesToValidate(target: any): string[];
export declare function isPropertyInjected(target: any, propertyName: string): boolean;
export declare function registerPostConstruct(target: any, methodName: string): void;

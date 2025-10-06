export declare function isTyped(arg: any): boolean;
export declare function isRecord(arg: any): boolean;
export declare function isPlainRecord(arg: any): boolean;
export declare function toPlainObject(arg: Record<keyof any, any>): Record<keyof any, any>;
export declare function convertObjectToCollection(obj: any): Record<keyof any, any>;
export declare const createEJSON: () => any;
export declare function isEventSourceableType(arg: any): boolean;
export declare function loadENV(envFilePath: string): void;

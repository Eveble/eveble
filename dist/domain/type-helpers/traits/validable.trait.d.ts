export declare const ValidableTrait: import("@traits-ts/core").Trait<(base: any) => {
    new (): {
        [x: string]: any;
    };
    [x: string]: any;
    setValidator(validator: (...args: any[]) => boolean): void;
    getValidator(): () => boolean;
    removeValidator(): void;
    hasValidator(): boolean;
}, undefined>;

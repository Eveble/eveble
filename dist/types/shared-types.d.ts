import { LanguageCode } from './generated-types';
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends LanguageCode ? LanguageCode : T[P] extends (...args: any[]) => any ? T[P] : T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export interface ClassType<T> extends Function {
    new (...args: any[]): T;
}
export type DeepRequired<T, U extends object | undefined = undefined> = T extends object ? {
    [P in keyof T]-?: NonNullable<T[P]> extends NonNullable<U | Function | ClassType<any>> ? NonNullable<T[P]> : DeepRequired<NonNullable<T[P]>, U>;
} : T;
export type AnyFn = (...args: unknown[]) => unknown;
export type Properties<C> = {
    [K in keyof C as C[K] extends Function ? never : K]: C[K];
};
export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
export type ClassProperties<C, O extends string | number | symbol = ''> = Omit<Omit<Properties<C>, O>, 'state' | 'status' | 'ableTo' | 'can' | 'ensure' | 'is'>;
export type EntityProperties<Klass extends object & {
    state?: PropType<Klass, 'state'> | undefined;
    status?: PropType<Klass, 'status'> | undefined;
}, KlassProp extends string | number | symbol = ''> = Omit<Omit<Properties<Klass>, KlassProp>, 'state' | 'status' | 'ableTo' | 'can' | 'ensure' | 'is'> & {
    state?: PropType<Klass, 'state'> | undefined;
    status?: PropType<Klass, 'status'> | undefined;
};
export type TranslationProperties<Klass extends object, KlassProp extends string | number | symbol = ''> = Omit<ClassProperties<Klass, KlassProp>, 'state' | 'status' | 'base' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UnwrappedArray<T extends any[]> = T[number];
export type ID = string | number;
export type ValueOf<T> = T[keyof T];

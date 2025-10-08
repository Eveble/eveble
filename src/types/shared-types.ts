/**
 * A recursive implementation of the `Partial<T>` type.
 * Source: {@link https://stackoverflow.com/a/49936686/772859}
 */
export type DeepPartial<T> = {
  [P in keyof T]?:
    | null
    | (T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>);
};

/**
 * A type representing the type rather than instance of a class.
 */
export interface Type<T> extends Function {
  // tslint:disable-next-line:callable-types
  new (...args: any[]): T;
}

/* eslint-disable @typescript-eslint/ban-types */
/**
 * A recursive implementation of Required<T>.
 * Source: https://github.com/microsoft/TypeScript/issues/15012#issuecomment-365453623
 */
export type DeepRequired<
  T,
  U extends object | undefined = undefined
> = T extends object
  ? {
      [P in keyof T]-?: NonNullable<T[P]> extends NonNullable<
        U | Function | Type<any>
      >
        ? NonNullable<T[P]>
        : DeepRequired<NonNullable<T[P]>, U>;
    }
  : T;

export type AnyFn = (...args: unknown[]) => unknown;

export type Properties<C> = {
  [K in keyof C as C[K] extends Function ? never : K]: C[K];
};

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export type ClassProperties<C, O extends string | number | symbol = ''> = Omit<
  Omit<Properties<C>, O>,
  'state' | 'status' | 'ableTo' | 'can' | 'ensure' | 'is'
>;

export type EntityProperties<
  Klass extends object & {
    state?: PropType<Klass, 'state'> | undefined;
    status?: PropType<Klass, 'status'> | undefined;
  },
  KlassProp extends string | number | symbol = ''
> = Omit<
  Omit<Properties<Klass>, KlassProp>,
  'state' | 'status' | 'ableTo' | 'can' | 'ensure' | 'is'
> & {
  state?: PropType<Klass, 'state'> | undefined;
  status?: PropType<Klass, 'status'> | undefined;
};

export type TranslationProperties<
  Klass extends object,
  KlassProp extends string | number | symbol = ''
> = Omit<
  ClassProperties<Klass, KlassProp>,
  'state' | 'status' | 'base' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

/**
 * Given an array type e.g. `Array<string>`, return the inner type e.g. string.
 */
export type UnwrappedArray<T extends any[]> = T[number];

/**
 * An entity ID. Depending on the configured {@link EntityIdStrategy}, it will be either
 * a `string` or a `number`;
 */
export type ID = string | number;

/**
 * Returns all values from available object type.
 */
export type ValueOf<T> = T[keyof T];

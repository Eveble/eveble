import { types } from '../types';
export declare const EXCLUDED_PROP_TYPES_KEY = "excludedPropTypes";
export declare const TypeTrait: import("@traits-ts/core").Trait<(base: any) => {
    new (): {
        [x: string]: any;
        getPropTypes(): types.Props;
        getPropertyInitializers(): types.Props;
        getInstanceInitializers(): types.Props;
        getParentInitializers(): types.Props;
        toPlainObject(): types.Props;
        validateProps(props: types.Props | undefined, propTypes: types.PropTypes, isStrict?: boolean): boolean;
        equals(other: any): boolean;
        hasSameValues(other: types.Typed): boolean;
    };
    [x: string]: any;
    excludedPropTypes?: string[] | undefined;
    getPropTypes(): types.Props;
    getPropertyInitializers(): types.Props;
}, undefined>;

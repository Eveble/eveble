import { types } from '../types';
export declare class DefinableMixin implements types.Definable {
    getPropTypes(): types.Props;
    getPropertyInitializers(): types.Props;
    protected getInstanceInitializers(): types.Props;
    protected getParentInitializers(): types.Props;
    toPlainObject(): types.Props;
    validateProps(props: types.Props | undefined, propTypes: types.PropTypes, isStrict?: boolean): boolean;
    equals(other: any): boolean;
    protected hasSameValues(other: types.Definable): boolean;
    static getPropTypes(): types.Props;
    static getPropertyInitializers(): types.Props;
}

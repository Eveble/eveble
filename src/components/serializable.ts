import { classes } from 'polytype';
import { pick } from 'lodash';
import { VersionableMixin } from '../mixins/versionable-mixin';
import { Struct } from './struct';
import { define } from '../decorators/define';
import { types } from '../types';
import { EjsonableMixin } from '../mixins/ejsonable-mixin';

@define('Serializable')
export class Serializable
  extends classes(Struct, EjsonableMixin, VersionableMixin)
  implements types.Ejsonable {
  schemaVersion: number | undefined;

  /**
   * Creates an instance of Serializable.
   * @param props - Properties of the type required for construction.
   * @remarks
   * Since were dealing with special cases and mixin and limits of TypeScript, we
   * use of "invoking multiple base constructors" from polytype to pass props to Struct's
   * constructor:
   * https://www.npmjs.com/package/polytype#invoking-multiple-base-constructors
   */
  constructor(props: types.Props = {}) {
    super([props]);
  }

  /**
   * Create an `Serializable` from multiple property sources. Have similar api
   * like `Object.assign`.
   * @param sources - One or more source of properties.
   * @returns New instance of `Serializable` with assigned properties.
   * @throws {ValidationError}
   * Thrown if the passed properties does not match entities property types.
   */
  public static from(...sources: Record<string, any>[]): any {
    const propTypes = this.getPropTypes();
    const propKeys = Object.keys(propTypes);

    const pickedProps = {};
    for (const source of sources) {
      Object.assign(pickedProps, pick(source, propKeys));
    }
    return new this(pickedProps);
  }
}

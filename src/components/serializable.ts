import { classes } from 'polytype';
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
}

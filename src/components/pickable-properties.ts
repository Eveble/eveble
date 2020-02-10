import { pick } from 'lodash';
import { types } from '../types';

export class PickableProperties {
  public sources: Record<keyof any, any>[];

  /**
   * Creates an instance of `Pickable`.
   * @param sources - List of sources for properties.
   */
  constructor(sources: Record<keyof any, any>[]) {
    this.sources = sources;
  }

  /**
   * Picks properties matching provided property types.
   * @param propTypes - Properties types.
   * @returns Properties collection matching prop types.
   */
  public pickProps(propTypes: Record<keyof any, any>): types.Props {
    const propKeys = Object.keys(propTypes);

    const pickedProps = {};
    for (const source of this.sources) {
      Object.assign(pickedProps, pick(source, propKeys));
    }
    return pickedProps;
  }
}
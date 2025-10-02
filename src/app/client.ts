import { Guid } from '../domain/value-objects/guid';
import { types } from '../types';
import { StatefulTrait } from '../trait/stateful.trait';

export class Client extends StatefulTrait {
  static STATES = {
    constructed: 'constructed',
    initialized: 'initialized',
    connected: 'connected',
    paused: 'paused',
    stopped: 'stopped',
    disconnected: 'disconnected',
    failed: 'failed',
  };

  public id: string | Guid;

  public state: types.State;

  /**
   * Creates an instance of Client.
   * @param props - Properties of the type required for construction.
   * @remarks
   * Since were dealing with special cases, mixins and limits of TypeScript, we
   * use of "invoking multiple base constructors" from polytype to pass props to Struct's
   * constructor:
   * https://www.npmjs.com/package/polytype#invoking-multiple-base-constructors
   */
  constructor(props: types.Props = {}) {
    super();
    Object.assign(this, props);
    this.setState(Client.STATES.constructed);
  }

  /**
   * Returns client identifier.
   * @return Client's identifier.
   */
  public getId(): string | Guid {
    return this.id;
  }
}

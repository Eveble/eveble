import { Config } from '../components/config';
import { define } from '../decorators/define';

@define()
export class EvebleConfig extends Config {
  public CommitStore?: {
    timeout?: number;
  };

  public Snapshotter?: {
    isEnabled?: boolean;
    frequency?: number;
  };

  public CommandScheduler?: {
    isEnabled?: boolean;
  };

  /**
   * Creates an instance of EvebleConfig.
   * @param props - Properties of the type required for construction.
   */
  constructor(props?: Partial<EvebleConfig>) {
    super();
    if (props) Object.assign(this, this.processProps(props));
  }
}

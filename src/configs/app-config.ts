import uuid from 'uuid';
import { define } from '../decorators/define';
import { Config } from '../components/config';
import { LoggingConfig } from './logging-config';

@define()
export class AppConfig extends Config {
  public appId?: string = AppConfig.generateId();

  public logging?: LoggingConfig = new LoggingConfig();

  public conversion?: {
    type: 'manual' | 'runtime';
  } = { type: 'runtime' };

  public validation?: {
    type: 'manual' | 'runtime';
  } = { type: 'runtime' };

  public description?: {
    formatting: 'default' | 'compact' | 'debug';
  } = { formatting: 'default' };

  constructor(props?: Partial<AppConfig>) {
    super();
    if (props) Object.assign(this, this.processProps(props));
  }

  /**
   * Generates unique application identifier.
   * @static
   * @returns String identifier as uuid.
   */
  public static generateId(): string {
    return uuid.v4().toString();
  }
}

import { v4 as uuidv4 } from 'uuid';
import getenv from 'getenv';
import { Type } from '@eveble/core';
import { Config } from '../components/config';
import { LoggingConfig } from './logging-config';
import { EvebleConfig } from './eveble-config';
import { types } from '../types';

@Type()
export class AppConfig extends Config {
  static defaultMongoDBOptions = {};

  public appId?: string | types.Stringifiable = getenv.string(
    'APP_ID',
    AppConfig.generateId() as string
  );

  public workerId?: string | types.Stringifiable = getenv.string(
    'WORKER_ID',
    AppConfig.generateId() as string
  );

  public logging?: LoggingConfig = new LoggingConfig();

  public conversion?: {
    type: 'manual' | 'runtime';
  } = { type: 'runtime' };

  public validation?: {
    type: 'manual' | 'runtime';
  } = { type: 'runtime' };

  public description?: {
    formatting: 'compact' | 'debug' | 'default';
  } = { formatting: 'default' };

  public eveble?: EvebleConfig = new EvebleConfig();

  public clients?: {
    MongoDB?: {
      CommitStore?: Record<string, any>; // MongoClientOptions, tsruntime fails to identify kind
      Snapshotter?: Record<string, any>; // MongoClientOptions, tsruntime fails to identify kind
      CommandScheduler?: Record<string, any>; // MongoClientOptions, tsruntime fails to identify kind
    };
    Pulse?: {
      CommandScheduler?: Record<string, any>; // PulseConfiguration, tsruntime fails to identify kind
    };
  } = {
    MongoDB: {
      CommitStore: AppConfig.defaultMongoDBOptions,
      Snapshotter: AppConfig.defaultMongoDBOptions,
      CommandScheduler: AppConfig.defaultMongoDBOptions,
    },
    Pulse: {
      CommandScheduler: {
        processEvery: 180000,
      },
    },
  };

  /**
   * Creates an instance of AppConfig.
   * @param props - Properties of the type required for construction.
   */
  constructor(props?: Partial<AppConfig>) {
    super();
    if (props) Object.assign(this, this.processProps(props));
  }

  /**
   * Processes properties for AppConfig.
   * @param props - Properties of the type required for construction.
   * @returns Processed properties with any registered `onConstruction` hooks and
   * validates them against prop types.
   */
  protected processProps(props: types.Props = {}): types.Props {
    if (props.eveble !== undefined && !(props.eveble instanceof EvebleConfig)) {
      props.eveble = new EvebleConfig(props.eveble);
    }
    return super.processProps(props);
  }

  /**
   * Generates unique application identifier.
   * @static
   * @returns String identifier as uuid.
   */
  public static generateId(): string {
    return uuidv4().toString();
  }
}

import { Config } from '../components/config';
import { LoggingConfig } from './logging-config';
import { EvebleConfig } from './eveble-config';
import { types } from '../types';
export declare class AppConfig extends Config {
    static defaultMongoDBOptions: {};
    appId?: string | types.Stringifiable;
    workerId?: string | types.Stringifiable;
    logging?: LoggingConfig;
    conversion?: {
        type: 'manual' | 'runtime';
    };
    validation?: {
        type: 'manual' | 'runtime';
    };
    description?: {
        formatting: 'compact' | 'debug' | 'default';
    };
    eveble?: EvebleConfig;
    clients?: {
        MongoDB?: {
            CommitStore?: Record<string, any>;
            Snapshotter?: Record<string, any>;
            CommandScheduler?: Record<string, any>;
        };
        Pulse?: {
            CommandScheduler?: Record<string, any>;
        };
    };
    constructor(props?: Partial<AppConfig>);
    protected processProps(props?: types.Props): types.Props;
    static generateId(): string;
}

import { Config } from '../components/config';
export declare class EvebleConfig extends Config {
    CommitStore?: {
        timeout?: number;
    };
    Snapshotter?: {
        isEnabled?: boolean;
        frequency?: number;
    };
    CommandScheduler?: {
        isEnabled?: boolean;
    };
    constructor(props?: Partial<EvebleConfig>);
}

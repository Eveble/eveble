import 'reflect-metadata';
import { Serializable } from './serializable';
import { types } from '../types';
export declare class Message extends Serializable implements types.Message {
    timestamp?: Date;
    metadata?: Record<string, any>;
    constructor(props?: types.Props);
    protected processProps(props?: types.Props): types.Props;
    getTimestamp(): Date;
    assignMetadata(props: Record<string, any>): void;
    hasMetadata(): boolean;
    getMetadata(): Record<string, any>;
    setCorrelationId(key: string, id: types.Stringifiable): void;
    getCorrelationId(key: string): string | undefined;
    hasCorrelationId(key: string): boolean;
}

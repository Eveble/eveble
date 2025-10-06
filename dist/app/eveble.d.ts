import { types } from '../types';
import { Module } from '../core/module';
export declare class Eveble extends Module {
    protected commitPublisher?: types.CommitPublisher;
    protected commandScheduler?: types.CommandScheduler;
    constructor(props?: types.ModuleProps);
    isSnapshotting(): boolean;
    isCommandScheduling(): boolean;
    protected onInitialize(): Promise<void>;
    protected initializeTopLevelDependencies(): Promise<void>;
    protected afterInitialize(): Promise<void>;
    protected beforeStart(): Promise<void>;
    protected onStart(): Promise<void>;
    protected onStop(): Promise<void>;
    protected setAsserterOnKernel(): void;
    protected bindSerializer(): void;
    protected setSerializerOnKernel(): Promise<void>;
    protected registerTypesOnSerializer(): Promise<void>;
    protected bindRouter(): void;
    protected bindInfrastructure(): void;
    protected bindSnapshotter(): void;
    protected bindCommandSchedulingService(): void;
    protected createEJSON(): Record<keyof any, any>;
}

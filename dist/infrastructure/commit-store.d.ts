import { types } from '../types';
import { Guid } from '../domain/value-objects/guid';
export declare class CommitStore implements types.CommitStore {
    protected log: types.Logger;
    protected config: types.Configurable;
    protected storage: types.CommitStorage;
    protected publisher: types.CommitPublisher;
    createCommit(eventSourceable: types.EventSourceable): Promise<types.Commit>;
    generateId(): Promise<string>;
    save(commit: types.Commit): Promise<string>;
    getEvents(eventSourceableId: string | Guid, versionOffset?: number): Promise<types.Event[]>;
    getAllEvents(): Promise<types.Event[]>;
    findById(commitId: string): Promise<types.Commit | undefined>;
    protected getEventsFromCommits(commits?: types.Commit[]): types.Event[];
    protected resolveEventsWithNewVersion(events: types.Event[], newVersion: number): types.Event[];
}

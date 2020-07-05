import { types } from '../../types';
export declare class CommitSerializer implements types.CommitSerializer {
    protected serializer: types.Serializer;
    serialize(commit: types.Commit): Record<string, any>;
    deserialize(serializedCommit: Record<string, any>): types.Commit;
}

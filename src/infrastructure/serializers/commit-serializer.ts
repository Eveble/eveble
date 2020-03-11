import { inject, injectable } from '@parisholley/inversify-async';
import { Commit, CommitReceiver } from '../structs/commit';
import { types } from '../../types';
import { BINDINGS } from '../../constants/bindings';

@injectable()
export class CommitSerializer implements types.CommitSerializer {
  @inject(BINDINGS.Serializer)
  protected serializer: types.Serializer;

  /**
   * Serializes commit.
   * @param commit - Instance implementing `Commit` interface.
   * @return Serialized commit as a plain object compatible with MongoDB document structure.
   */
  public serialize(commit: types.Commit): Record<string, any> {
    const serializedCommit: Record<string, any> = {};

    serializedCommit.id = commit.id;
    serializedCommit._id = commit.id;
    serializedCommit.sourceId = commit.sourceId;
    serializedCommit.version = commit.version;
    serializedCommit.insertedAt = commit.insertedAt;
    serializedCommit.sentBy = commit.sentBy;
    serializedCommit.changes = {
      eventSourceableType: commit.changes.eventSourceableType,
      events: [],
      commands: [],
    };
    serializedCommit.eventTypes = [];
    serializedCommit.commandTypes = [];
    serializedCommit.receivers = [];

    for (const event of commit.changes.events) {
      serializedCommit.changes.events.push({
        type: event.getTypeName(),
        data: this.serializer.toData(event),
      });
      serializedCommit.eventTypes.push(event.getTypeName());
    }
    for (const command of commit.changes.commands) {
      serializedCommit.changes.commands.push({
        type: command.getTypeName(),
        data: this.serializer.toData(command),
      });
      serializedCommit.commandTypes.push(command.getTypeName());
    }
    for (const receiver of commit.receivers) {
      serializedCommit.receivers.push({ ...receiver });
    }

    return serializedCommit;
  }

  /**
   * Deserializes serialized commit.
   * @param serializedCommit - Serialized commit.
   * @return Instance implementing `Commit` interface.
   */
  public deserialize(serializedCommit: Record<string, any>): types.Commit {
    const deserializedProps: Record<string, any> = { ...serializedCommit };
    delete deserializedProps._id;
    delete deserializedProps.commandTypes;
    delete deserializedProps.eventTypes;
    deserializedProps.receivers = [];

    deserializedProps.changes = {
      eventSourceableType: serializedCommit.changes.eventSourceableType,
      events: [],
      commands: [],
    };
    // Only parse events that can be handled by this app
    for (const event of serializedCommit.changes.events) {
      if (this.serializer.hasType(event.type)) {
        deserializedProps.changes.events.push(
          this.serializer.fromData(event.data)
        );
      }
    }
    // Only parse commands that can be handled by this app
    for (const command of serializedCommit.changes.commands) {
      if (this.serializer.hasType(command.type)) {
        deserializedProps.changes.commands.push(
          this.serializer.fromData(command.data)
        );
      }
    }

    for (const receiverProps of serializedCommit.receivers) {
      deserializedProps.receivers.push(new CommitReceiver(receiverProps));
    }

    return new Commit(deserializedProps);
  }
}

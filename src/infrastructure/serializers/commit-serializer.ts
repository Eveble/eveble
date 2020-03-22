import { inject, injectable } from '@parisholley/inversify-async';
import { union } from 'lodash';
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
    serializedCommit.eventSourceableType = commit.eventSourceableType;
    serializedCommit.events = [];
    serializedCommit.commands = [];
    serializedCommit.eventTypes = [];
    serializedCommit.commandTypes = [];
    serializedCommit.receivers = [];

    for (const event of commit.events) {
      serializedCommit.events.push({
        type: event.getTypeName(),
        data: this.serializer.toData(event),
      });
      serializedCommit.eventTypes = union(serializedCommit.eventTypes, [
        event.getTypeName(),
      ]);
    }
    for (const command of commit.commands) {
      serializedCommit.commands.push({
        type: command.getTypeName(),
        data: this.serializer.toData(command),
      });
      serializedCommit.commandTypes = union(serializedCommit.commandTypes, [
        command.getTypeName(),
      ]);
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

    deserializedProps.events = [];
    deserializedProps.commands = [];

    // Only parse events that can be handled by this app
    for (const event of serializedCommit.events) {
      if (this.serializer.hasType(event.type)) {
        deserializedProps.events.push(this.serializer.fromData(event.data));
      }
    }
    // Only parse commands that can be handled by this app
    for (const command of serializedCommit.commands) {
      if (this.serializer.hasType(command.type)) {
        deserializedProps.commands.push(this.serializer.fromData(command.data));
      }
    }

    for (const receiverProps of serializedCommit.receivers) {
      deserializedProps.receivers.push(new CommitReceiver(receiverProps));
    }

    return new Commit(deserializedProps);
  }
}

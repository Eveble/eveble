import { Module } from '../../core/module';
import { types } from '../../types';
import { Log } from '../../components/log-entry';
import { BINDINGS } from '../../constants/bindings';
import { InMemoryCommitStorage } from '../../infrastructure/storages/commit-memory-storage';
import { InMemorySnapshotStorage } from '../../infrastructure/storages/snapshot-memory-storage';
import { InMemoryCommitObserver } from '../../infrastructure/storages/commit-memory-observer';
import { InMemoryCommandScheduler } from '../../infrastructure/schedulers/in-memory-command-scheduler';

export class InMemoryModule extends Module {
  protected async beforeInitialize(): Promise<void> {
    this.log?.debug(
      new Log('initializing in-memory storage implementations')
        .on(this)
        .in(this.beforeInitialize)
    );

    if (!this.injector.isBound(BINDINGS.CommitStorage)) {
      this.injector
        .bind<types.CommitStorage>(BINDINGS.CommitStorage)
        .to(InMemoryCommitStorage)
        .inSingletonScope();
      this.log?.debug(
        new Log(
          `bound 'CommitStorage' to 'InMemoryCommitStorage' in singleton scope`
        )
          .on(this)
          .in(this.beforeInitialize)
      );
    }

    if (!this.injector.isBound(BINDINGS.SnapshotStorage)) {
      this.injector
        .bind<types.SnapshotStorage>(BINDINGS.SnapshotStorage)
        .to(InMemorySnapshotStorage)
        .inSingletonScope();
      this.log?.debug(
        new Log(
          `bound 'SnapshotStorage' to 'InMemorySnapshotStorage' in singleton scope`
        )
          .on(this)
          .in(this.beforeInitialize)
      );
    }

    if (!this.injector.isBound(BINDINGS.CommitObserver)) {
      this.injector
        .bind<types.CommitObserver>(BINDINGS.CommitObserver)
        .to(InMemoryCommitObserver)
        .inSingletonScope();
      this.log?.debug(
        new Log(
          `bound 'CommitObserver' to 'InMemoryCommitObserver' in singleton scope`
        )
          .on(this)
          .in(this.beforeInitialize)
      );
    }

    if (!this.injector.isBound(BINDINGS.CommandScheduler)) {
      this.injector
        .bind<types.CommandScheduler>(BINDINGS.CommandScheduler)
        .to(InMemoryCommandScheduler)
        .inSingletonScope();
      this.log?.debug(
        new Log(
          `bound 'CommandScheduler' to 'InMemoryCommandScheduler' in singleton scope`
        )
          .on(this)
          .in(this.beforeInitialize)
      );
    }
  }
}

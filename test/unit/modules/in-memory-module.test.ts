import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import 'reflect-metadata';

import { Module } from '../../../src/core/module';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';
import { InMemoryModule } from '../../../src/app/modules/in-memory-module';
import { AppConfig } from '../../../src/configs/app-config';

describe('InMemoryModule', () => {
  let injector: any;
  let app: any;
  let logger: any;

  const createBindingSyntaxMock = () => {
    const bindingToSyntax = { to: vi.fn(), inSingletonScope: vi.fn() };
    bindingToSyntax.to.mockReturnValue(bindingToSyntax);
    bindingToSyntax.inSingletonScope.mockReturnValue(undefined);
    return bindingToSyntax;
  };

  beforeEach(() => {
    logger = mock<types.Logger>();
    injector = mock<types.Injector>();
    app = mock<types.App>();
    app.config = new AppConfig();

    const bindMock = createBindingSyntaxMock();
    injector.bind.mockReturnValue(bindMock);

    injector.getAsync.calledWith(BINDINGS.log).mockReturnValue(logger);
    injector.findByScope.calledWith('Singleton').mockReturnValue([]);

    injector.isBound.calledWith(BINDINGS.CommitStorage).mockReturnValue(false);
    injector.isBound
      .calledWith(BINDINGS.SnapshotStorage)
      .mockReturnValue(false);
    injector.isBound.calledWith(BINDINGS.CommitObserver).mockReturnValue(false);
    injector.isBound
      .calledWith(BINDINGS.CommandScheduler)
      .mockReturnValue(false);
  });

  it('extends Module', () => {
    const module = new InMemoryModule();
    expect(module).toBeInstanceOf(Module);
  });

  it('binds CommitStorage to InMemoryCommitStorage', async () => {
    const module = new InMemoryModule();
    await module.initialize(app, injector);

    expect(injector.bind).toHaveBeenCalledWith(BINDINGS.CommitStorage);
  });

  it('binds SnapshotStorage to InMemorySnapshotStorage', async () => {
    const module = new InMemoryModule();
    await module.initialize(app, injector);

    expect(injector.bind).toHaveBeenCalledWith(BINDINGS.SnapshotStorage);
  });

  it('binds CommitObserver to InMemoryCommitObserver', async () => {
    const module = new InMemoryModule();
    await module.initialize(app, injector);

    expect(injector.bind).toHaveBeenCalledWith(BINDINGS.CommitObserver);
  });

  it('binds CommandScheduler to InMemoryCommandScheduler', async () => {
    const module = new InMemoryModule();
    await module.initialize(app, injector);

    expect(injector.bind).toHaveBeenCalledWith(BINDINGS.CommandScheduler);
  });

  it('skips binding if already bound', async () => {
    injector.isBound.calledWith(BINDINGS.CommitStorage).mockReturnValue(true);
    injector.isBound.calledWith(BINDINGS.SnapshotStorage).mockReturnValue(true);
    injector.isBound.calledWith(BINDINGS.CommitObserver).mockReturnValue(true);
    injector.isBound
      .calledWith(BINDINGS.CommandScheduler)
      .mockReturnValue(true);

    const module = new InMemoryModule();
    await module.initialize(app, injector);

    expect(injector.bind).not.toHaveBeenCalledWith(BINDINGS.CommitStorage);
    expect(injector.bind).not.toHaveBeenCalledWith(BINDINGS.SnapshotStorage);
    expect(injector.bind).not.toHaveBeenCalledWith(BINDINGS.CommitObserver);
    expect(injector.bind).not.toHaveBeenCalledWith(BINDINGS.CommandScheduler);
  });
});

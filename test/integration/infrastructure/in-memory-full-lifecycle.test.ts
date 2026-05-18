import { mock } from 'vitest-mock-extended';
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import getenv from 'getenv';
import { kernel, Type } from '@eveble/core';
import { Command } from '../../../src/components/command';
import { Event } from '../../../src/components/event';
import { types } from '../../../src/types';
import { App } from '../../../src/app/app';
import { Eveble } from '../../../src/app/eveble';
import { AppConfig } from '../../../src/configs/app-config';
import { LoggingConfig } from '../../../src/configs/logging-config';
import { Log } from '../../../src/components/log-entry';
import { BINDINGS } from '../../../src/constants/bindings';
import { InMemoryModule } from '../../../src/app/modules/in-memory-module';
import { Injector } from '../../../src/core/injector';

describe('App with InMemoryModule integration', () => {
  let injector: Injector;
  let log: any;
  let originalEnv: Record<string, string | undefined>;
  let originalProcessOn: any;

  const appId = 'test-in-memory-app';

  @Type('InMemoryIntegration.TestCommand', { isRegistrable: false })
  class TestCommand extends Command<TestCommand> {
    name: string;
  }
  @Type('InMemoryIntegration.TestEvent', { isRegistrable: false })
  class TestEvent extends Event<TestEvent> {
    name: string;
  }

  const now = new Date();

  beforeEach(() => {
    vi.useFakeTimers();

    originalEnv = {
      NODE_ENV: process.env.NODE_ENV,
      EVEBLE_COMMITSTORE_CLIENT: process.env.EVEBLE_COMMITSTORE_CLIENT,
      EVEBLE_SNAPSHOTTER_ENABLED: process.env.EVEBLE_SNAPSHOTTER_ENABLED,
      EVEBLE_COMMAND_SCHEDULER_ENABLED:
        process.env.EVEBLE_COMMAND_SCHEDULER_ENABLED,
      EVEBLE_COMMAND_SCHEDULER_CLIENT:
        process.env.EVEBLE_COMMAND_SCHEDULER_CLIENT,
      EVEBLE_COMMITSTORE_TIMEOUT: process.env.EVEBLE_COMMITSTORE_TIMEOUT,
    };

    process.env.NODE_ENV = 'test';
    process.env.EVEBLE_COMMITSTORE_CLIENT = 'inmemory';
    process.env.EVEBLE_SNAPSHOTTER_ENABLED = 'false';
    process.env.EVEBLE_COMMAND_SCHEDULER_ENABLED = 'false';
    process.env.EVEBLE_COMMITSTORE_TIMEOUT = '30000';

    injector = new Injector();
    log = mock<types.Logger>();
    injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);

    originalProcessOn = process.on;
    (process as any).on = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    kernel.setAsserter(undefined as any);
    kernel.setSerializer(undefined as any);
    kernel.setInjector(undefined as any);

    process.env.NODE_ENV = originalEnv.NODE_ENV;
    process.env.EVEBLE_COMMITSTORE_CLIENT =
      originalEnv.EVEBLE_COMMITSTORE_CLIENT;
    process.env.EVEBLE_SNAPSHOTTER_ENABLED =
      originalEnv.EVEBLE_SNAPSHOTTER_ENABLED;
    process.env.EVEBLE_COMMAND_SCHEDULER_ENABLED =
      originalEnv.EVEBLE_COMMAND_SCHEDULER_ENABLED;
    process.env.EVEBLE_COMMAND_SCHEDULER_CLIENT =
      originalEnv.EVEBLE_COMMAND_SCHEDULER_CLIENT;
    process.env.EVEBLE_COMMITSTORE_TIMEOUT =
      originalEnv.EVEBLE_COMMITSTORE_TIMEOUT;

    process.on = originalProcessOn;
  });

  it('initializes and starts app with InMemoryModule', async () => {
    const app = new App({
      config: new AppConfig({
        appId,
        logging: new LoggingConfig({ isEnabled: false }),
      }),
      modules: [new InMemoryModule()],
      injector,
    });

    await app.initialize();

    expect(app.isInState(App.STATES.initialized)).toBe(true);

    const commitStorage = injector.get<types.CommitStorage>(
      BINDINGS.CommitStorage
    );
    expect(commitStorage.constructor.name).toBe('InMemoryCommitStorage');

    const commitObserver = injector.get<types.CommitObserver>(
      BINDINGS.CommitObserver
    );
    expect(commitObserver.constructor.name).toBe('InMemoryCommitObserver');

    const commandBus = injector.get<types.CommandBus>(BINDINGS.CommandBus);
    expect(commandBus).toBeDefined();

    const eventBus = injector.get<types.EventBus>(BINDINGS.EventBus);
    expect(eventBus).toBeDefined();

    await app.start();
    expect(app.isInState(App.STATES.running)).toBe(true);

    await app.shutdown();
    expect(app.isInState(App.STATES.shutdown)).toBe(true);
  });

  it('handles command and stores commit via in-memory storage', async () => {
    const app = new App({
      config: new AppConfig({
        appId,
        logging: new LoggingConfig({ isEnabled: false }),
      }),
      modules: [new InMemoryModule()],
      injector,
    });

    await app.initialize();
    await app.start();

    const commitStorage = injector.get<types.CommitStorage>(
      BINDINGS.CommitStorage
    );

    const command = new TestCommand({
      targetId: 'test-target',
      timestamp: now,
      name: 'integration-test',
    });

    const commitStore = injector.get<types.CommitStore>(BINDINGS.CommitStore);
    expect(commitStore).toBeDefined();

    const allCommits = await commitStorage.getAllCommits();
    expect(allCommits).toEqual([]);

    await app.shutdown();
  });

  it('supports snapshotting with in-memory storage when enabled', async () => {
    process.env.EVEBLE_SNAPSHOTTER_ENABLED = 'true';
    process.env.EVEBLE_SNAPSHOTTER_FREQUENCY = '1';

    const app = new App({
      config: new AppConfig({
        appId,
        logging: new LoggingConfig({ isEnabled: false }),
        eveble: {
          Snapshotter: {
            isEnabled: true,
            frequency: 1,
          } as any,
        },
      }),
      modules: [new InMemoryModule()],
      injector,
    });

    await app.initialize();

    const snapshotStorage = injector.get<types.SnapshotStorage>(
      BINDINGS.SnapshotStorage
    );
    expect(snapshotStorage.constructor.name).toBe('InMemorySnapshotStorage');

    await app.start();
    await app.shutdown();
  });

  it('can be shutdown cleanly', async () => {
    const app = new App({
      config: new AppConfig({
        appId,
        logging: new LoggingConfig({ isEnabled: false }),
      }),
      modules: [new InMemoryModule()],
      injector,
    });

    await app.initialize();
    await app.start();
    await app.shutdown();

    expect(app.isInState(App.STATES.shutdown)).toBe(true);
  });
});

import { stubInterface } from 'ts-sinon';
import { Container } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';

export function setupInjector(): {
  container: Container;
  log: any;
  config: any;
} {
  const container = new Container();
  const log = stubInterface<types.Logger>();
  const config = stubInterface<types.Configurable>();

  container.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
  container.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  container.bind<types.Injector>(BINDINGS.Injector).toConstantValue(container);
  return { container, log, config };
}

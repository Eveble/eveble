import { stubInterface } from 'ts-sinon';
import { Injector } from '../../../src/core/injector';
import { types } from '../../../src/types';
import { BINDINGS } from '../../../src/constants/bindings';

export function setupInjector(): {
  injector: Injector;
  log: any;
  config: any;
} {
  const injector = new Injector();
  const log = stubInterface<types.Logger>();
  const config = stubInterface<types.Configurable>();

  injector.bind<types.Logger>(BINDINGS.log).toConstantValue(log);
  injector.bind<types.Configurable>(BINDINGS.Config).toConstantValue(config);
  injector.bind<types.Injector>(BINDINGS.Injector).toConstantValue(injector);
  return { injector, log, config };
}

import { DELEGATED_KEY } from '../constants/metadata-keys';

/*
Force delegated construction always on each Configuration and inheritables by
requiring to define class constructor::

class MyConfig extends Config {
  constructor(props?: Partial<MyConfig>) {
    super();
    if (props) Object.assign(this, this.processProps(props));
  }
}

So property initializers are ALWAYS supported by default in such way.
*/
export function delegate() {
  return (target: Record<string, any>): void => {
    Reflect.defineMetadata(DELEGATED_KEY, true, target);
  };
}

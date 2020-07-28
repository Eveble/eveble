import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { PropTypes, ValidationError } from 'typend';
import { define } from '@eveble/core';
import { Config } from '../../../src/components/config';
import { Struct } from '../../../src/components/struct';
import { InvalidConfigError } from '../../../src/core/core-errors';
import { isDefinable } from '../../../src/utils/helpers';

chai.use(sinonChai);

describe(`Config`, function () {
  const simpleProps = {
    first: 'first-value',
    second: 2,
  };

  @define('Config.Simple')
  class Simple extends Config {
    first: string;

    second: number;

    constructor(props: Partial<Simple>) {
      super();
      Object.assign(this, this.processProps(props));
    }
  }

  const complexProps = {
    root: 'root-value',
    simple: new Simple(simpleProps),
    nested: {
      'nested-first': 'nested-first-value',
      'nested-second': {
        'nested-third': 'nested-third-value',
      },
    },
  };

  @define('Config.Complex')
  class Complex extends Config {
    root: string;

    simple: Simple;

    nested: {
      'nested-first': string;
      'nested-second': {
        'nested-third': string;
      };
    };

    constructor(props: Partial<Complex>) {
      super();
      Object.assign(this, this.processProps(props));
    }
  }

  it('extends Struct', () => {
    expect(Config.prototype instanceof Struct).to.be.true;
  });

  it('ensures that type is defined', () => {
    expect(isDefinable(Config.prototype)).to.be.true;
  });

  describe(`construction`, () => {
    it(`takes properties for simple configuration and assigns them`, () => {
      expect(new Simple(simpleProps)).to.be.eql({
        ...simpleProps,
      });
    });

    it(`takes properties for complex configuration and assigns them`, () => {
      expect(new Complex(complexProps)).to.be.eql({
        ...complexProps,
      });
    });
  });

  describe(`conversion`, () => {
    it(`converts simple configuration to plain object`, () => {
      const config = new Simple(simpleProps);
      expect(config.toPlainObject()).to.be.eql({
        ...simpleProps,
      });
    });

    it(`converts complex configuration to plain object`, () => {
      const config = new Complex(complexProps);
      expect(config.toPlainObject()).to.be.eql({
        root: 'root-value',
        simple: {
          first: 'first-value',
          second: 2,
        },
        nested: {
          'nested-first': 'nested-first-value',
          'nested-second': {
            'nested-third': 'nested-third-value',
          },
        },
      });
    });
  });

  describe(`evaluation`, () => {
    it(`returns true if configuration has a set value for path`, () => {
      const config = new Complex(complexProps);
      expect(config.has('root')).to.be.true;
      expect(config.has('simple.first')).to.be.true;
      expect(config.has('nested.nested-first')).to.be.true;
      expect(config.has('nested.nested-second.nested-third')).to.be.true;
    });

    it(`returns false if configuration does not have set value for path`, () => {
      const config = new Complex(complexProps);
      expect(config.has('notvalid')).to.be.false;
      expect(config.has('simple.notvalid')).to.be.false;
      expect(config.has('nested.nested-first-notvalid')).to.be.false;
      expect(config.has('nested.nested-second.notvalid')).to.be.false;
    });

    it(`returns true if value is configurable`, () => {
      const config = new Complex(complexProps);
      expect(config.isConfigurable('root')).to.be.true;
      expect(config.isConfigurable('simple.first')).to.be.true;
      expect(config.isConfigurable('nested.nested-first')).to.be.true;
      expect(config.isConfigurable('nested.nested-second.nested-third')).to.be
        .true;
    });

    it(`returns false if value is not configurable`, () => {
      const config = new Complex(complexProps);
      expect(config.isConfigurable('not-root')).to.be.false;
      expect(config.isConfigurable('simple.not-nested')).to.be.false;
      expect(config.isConfigurable('nested.nested-not-first')).to.be.false;
      expect(config.isConfigurable('nested.nested-second.nested-not-third')).to
        .be.false;
    });
  });

  describe('prop types', () => {
    it(`returns prop types for simple configuration`, () => {
      const propTypes = {
        first: PropTypes.instanceOf(String),
        second: PropTypes.instanceOf(Number),
        included: PropTypes.interface({}).isOptional,
        merged: PropTypes.interface({}).isOptional,
      };
      expect(Simple.prototype.getPropTypes()).to.be.eql(propTypes);
    });

    it(`returns prop types for complex configuration`, () => {
      const propTypes = {
        root: PropTypes.instanceOf(String),
        simple: PropTypes.shape({
          first: PropTypes.instanceOf(String),
          second: PropTypes.instanceOf(Number),
          included: PropTypes.interface({}).isOptional,
          merged: PropTypes.interface({}).isOptional,
        }),
        nested: PropTypes.shape({
          'nested-first': PropTypes.instanceOf(String),
          'nested-second': PropTypes.shape({
            'nested-third': PropTypes.instanceOf(String),
          }),
        }),
        included: PropTypes.interface({}).isOptional,
        merged: PropTypes.interface({}).isOptional,
      };
      expect(Complex.prototype.getPropTypes()).to.be.eql(propTypes);
    });
  });

  describe('static constructor', () => {
    @define('Config.LoggingConfig')
    class LoggingConfig extends Config {
      isEnabled: boolean;

      level: string;

      constructor(props: Partial<LoggingConfig>) {
        super();
        Object.assign(this, this.processProps(props));
      }
    }

    @define('Config.AppConfig')
    class AppConfig extends Config {
      appId: string;

      logging?: LoggingConfig;

      constructor(props: Partial<AppConfig>) {
        super();
        Object.assign(this, this.processProps(props));
      }
    }

    it('constructs from non-nested configuration properties', () => {
      const props = {
        appId: 'my-id',
      };
      const appConfig = AppConfig.from<AppConfig>(props);
      expect(appConfig.appId).to.be.equal('my-id');
      expect(appConfig.logging).to.be.undefined;
    });

    it('constructs from nested configuration properties', () => {
      const props = {
        appId: 'my-id',
        logging: {
          isEnabled: true,
          level: 'emerg',
        },
      };
      const appConfig = AppConfig.from<AppConfig>(props);
      expect(appConfig.appId).to.be.equal('my-id');
      expect(appConfig.logging).to.be.instanceof(LoggingConfig);
      expect(appConfig.logging?.isEnabled).to.be.equal(true);
      expect(appConfig.logging?.level).to.be.equal('emerg');
    });
  });

  describe(`accessors`, () => {
    describe('get', () => {
      it(`returns value from configuration`, () => {
        const config = new Complex(complexProps);

        expect(config.get<string>('root')).to.be.equal('root-value');
        expect(config.get<string>('simple.first')).to.be.equal('first-value');
        expect(config.get<string>('nested.nested-first')).to.be.equal(
          'nested-first-value'
        );
        expect(
          config.get<string>('nested.nested-second.nested-third')
        ).to.be.equal('nested-third-value');
      });

      it(`returns undefined if value cannot be found on configuration`, () => {
        const config = new Complex(complexProps);

        expect(config.get('notvalid')).to.be.equal(undefined);
        expect(config.get('simple.notvalid')).to.be.equal(undefined);
        expect(config.get('nested.nested-first-notvalid')).to.be.equal(
          undefined
        );
        expect(
          config.get('nested.nested-second.nested-third-notvalid')
        ).to.be.equal(undefined);
      });

      it(`returns default value provided as second argument for unresolvable paths`, () => {
        const config = new Complex(complexProps);
        expect(
          config.get<string>('my-non-existing-path', 'default-value')
        ).to.be.equal('default-value');
      });

      it(`returns default values as fallback from class property initializers`, () => {
        @define('Config.MyConfig')
        class MyConfig extends Config {
          foo = 'foo-default';

          lorem: string;

          baz?: {
            bar: number;
            qux: {
              ipsum: boolean;
            };
          } = {
            bar: 1234,
            qux: {
              ipsum: true,
            },
          };

          constructor(props: Partial<MyConfig>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        const config = new MyConfig({
          foo: 'foo-set',
          lorem: 'lorem-set',
          baz: {
            bar: 1337,
            qux: {
              ipsum: false,
            },
          },
        });

        expect(config.get<string>('foo')).to.be.equal('foo-set');
        expect(config.get<string>('lorem')).to.be.equal('lorem-set');
        expect(config.get<number>('baz.bar')).to.be.equal(1337);
        expect(config.get<boolean>('baz.qux.ipsum')).to.be.equal(false);

        expect(config.getDefault<string>('foo')).to.be.equal('foo-default');
        expect(config.getDefault('lorem')).to.be.equal(undefined);
        expect(config.getDefault<number>('baz.bar')).to.be.equal(1234);
        expect(config.getDefault<boolean>('baz.qux.ipsum')).to.be.equal(true);
      });
    });

    describe('getDefault', () => {
      it(`returns default value from class initializing property`, () => {
        @define('Config.MyConfig')
        class MyConfig extends Config {
          foo = 'foo-default';

          baz?: {
            bar: number;
            qux: {
              lorem: boolean;
            };
          } = {
            bar: 1234,
            qux: {
              lorem: true,
            },
          };

          constructor(props: Partial<MyConfig>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        const config = new MyConfig({});
        expect(config.getDefault<string>('foo')).to.be.equal('foo-default');
        expect(config.getDefault<number>('baz.bar')).to.be.equal(1234);
        expect(config.getDefault<boolean>('baz.qux.lorem')).to.be.equal(true);
      });
    });

    describe('getExact', () => {
      it(`returns exact value from instance without fallback to defaults`, () => {
        @define('Config.MyConfig')
        class MyConfig extends Config {
          lorem: string;

          foo?: string;

          baz?: {
            bar?: number;
            qux?: {
              lorem: boolean;
            };
            qax: string;
          } = { qax: 'qax-default' };

          constructor(props: Partial<MyConfig>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        const config = new MyConfig({
          lorem: 'lorem-value',
          baz: { qax: 'qax-value' },
        });
        expect(config.getExact('foo')).to.be.undefined;
        expect(config.getExact('lorem')).to.be.equal('lorem-value');
        expect(config.getExact('baz.bar')).to.be.undefined;
        expect(config.getExact('baz.qux.lorem')).to.be.undefined;
        expect(config.getExact('baz.qax')).to.be.equal('qax-value');
      });
    });
  });

  describe(`mutators`, () => {
    context('setting single value', () => {
      it(`throws ValidationError when trying to set a value that does not match prop types`, () => {
        @define('Config.MyConfig')
        class MyConfig extends Config {
          key?: string;

          constructor(props: Partial<MyConfig>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }
        const config = new MyConfig({});

        expect(() => {
          config.set('key', 10);
        }).to.throw(
          ValidationError,
          `Config.MyConfig: (Key 'key': Expected Number(10) to be a String in {"key":Number(10)})`
        );
      });

      it(`sets property by path as first argument and a value as second`, () => {
        const props = {
          root: 'root-initial',
          simple: new Simple({
            first: 'first-initial',
            second: 2,
          }),
          nested: {
            'nested-first': 'nested-first-initial',
            'nested-second': {
              'nested-third': 'nested-third-initial',
            },
          },
        };
        const config = new Complex(props);

        config.set('root', 'root-set');
        expect(config.get('root')).to.be.equal('root-set');

        const setSimple = new Simple({ first: 'first-set', second: 10 });
        config.set('simple', setSimple);
        expect(config.get<Simple>('simple')).to.be.eql(setSimple);

        config.set('nested.nested-first', 'nested-first-set');
        expect(config.get<string>('nested.nested-first')).to.be.equal(
          'nested-first-set'
        );

        config.set('nested.nested-second.nested-third', 'nested-third-set');
        expect(
          config.get<string>('nested.nested-second.nested-third')
        ).to.be.equal('nested-third-set');
      });
    });

    context('assigning multiple values', () => {
      it(`throws ValidationError when trying to assign properties that does not match
    prop types`, () => {
        @define('Config.MyConfig')
        class MyConfig extends Config {
          key?: string;

          constructor(props: Partial<MyConfig>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }
        const config = new MyConfig({});

        expect(() => {
          config.assign({ key: 10 });
        }).to.throw(
          ValidationError,
          `Config.MyConfig: (Key 'key': Expected Number(10) to be a String in Config.MyConfig({"key":10}))`
        );
      });

      it(`assings multiple values by object as argument`, () => {
        const config = new Complex(complexProps);
        expect(config).to.be.eql(complexProps);

        const assignableProps = {
          root: 'root-assigned',
          simple: new Simple({ first: 'first-assigned', second: 10 }),
          nested: {
            'nested-first': 'nested-first-assigned',
            'nested-second': {
              'nested-third': 'nested-third-assigned',
            },
          },
        };
        config.assign(assignableProps);

        expect(config).to.be.eql(assignableProps);
      });

      it(`assigns multiple values by other instance of configuration as argument`, () => {
        const config = new Complex(complexProps);
        expect(config).to.be.eql(complexProps);

        const assignableConfig = new Complex({
          root: 'first',
          simple: new Simple({ first: 'set-first', second: 10 }),
          nested: {
            'nested-first': 'third',
            'nested-second': {
              'nested-third': 'fourth',
            },
          },
        });
        config.assign(assignableConfig);

        expect(config).to.be.eql(assignableConfig);
      });
    });
  });

  describe('merges configuration', () => {
    it('throws InvalidConfigError on merge if provided configuration is not instance of Config', () => {
      class MyConfig extends Config {}
      class MyInvalidConfig {}

      const config = new MyConfig();
      const invalidConfig = new MyInvalidConfig();
      expect(() => {
        config.merge(invalidConfig as any);
      }).to.throw(
        InvalidConfigError,
        'MyConfig: configuration must be an instance implementing Configurable interface, got MyInvalidConfig({})'
      );
    });

    it('includes other configurable implementations', () => {
      @define('Config.First')
      class First extends Config {
        firstKey: string;

        constructor(props: Partial<First>) {
          super();
          Object.assign(this, this.processProps(props));
        }
      }

      @define('Config.Second')
      class Second extends Config {
        secondKey: string;

        constructor(props: Partial<Second>) {
          super();
          Object.assign(this, this.processProps(props));
        }
      }

      const first = new First({ firstKey: 'first' });
      const second = new Second({ secondKey: 'second' });
      first.include(second);

      expect(first.included).to.be.instanceof(Object);
      expect(first.included).to.be.eql({ 'Config.Second': second });
      expect(first.get<string>('firstKey')).to.be.equal('first');
      expect(first.get<string>('secondKey')).to.be.equal('second');
    });

    describe('simple', () => {
      it('merges two configurations together while keeping parent properties precedence', () => {
        @define('Config.First')
        class First extends Config {
          key = 'first-key';

          foo = 'first-foo';

          constructor(props: Partial<First>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        @define('Config.Second')
        class Second extends Config {
          key = 'second-key';

          baz = 'second-baz';

          constructor(props: Partial<Second>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        const first = new First({
          key: 'first-key',
          foo: 'first-foo',
        });
        const second = new Second({
          key: 'second-key',
          baz: 'second-baz',
        });

        first.merge(second);
        expect(first.getPropTypes()).to.be.eql({
          included: PropTypes.interface({}).isOptional,
          merged: PropTypes.interface({}).isOptional,
          foo: PropTypes.instanceOf(String),
          key: PropTypes.instanceOf(String),
          baz: PropTypes.instanceOf(String),
        });

        expect(first).to.be.eql({
          merged: { 'Config.Second': second },
          foo: 'first-foo',
          baz: 'second-baz',
          key: 'first-key',
        });
      });

      it('resolves default value from path through all available dependent configurations', () => {
        @define('Config.First')
        class First extends Config {
          foo?: string;

          constructor(props: Partial<First>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        @define('Config.Second')
        class Second extends Config {
          foo = 'second-default-foo';

          constructor(props: Partial<Second>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        const first = new First({});
        const second = new Second({});

        first.merge(second);

        expect(first.has('foo')).to.be.true;
        expect(second.has('foo')).to.be.true;

        expect(first.hasDefault('foo')).to.be.false;
        expect(second.hasDefault('foo')).to.be.true;

        expect(first.get<string>('foo')).to.be.equal('second-default-foo');
        expect(second.get<string>('foo')).to.be.equal('second-default-foo');

        expect(second.getDefault<string>('foo')).to.be.equal(
          'second-default-foo'
        );
        expect(second.getDefault<string>('foo')).to.be.equal(
          'second-default-foo'
        );

        expect(first.getExact<string>('foo')).to.be.equal('second-default-foo');
        expect(second.getExact<string>('foo')).to.be.equal(
          'second-default-foo'
        );
      });
    });

    describe('simple with nested structs', () => {
      @define('MyFirst', { isRegistrable: false })
      class MyFirst extends Struct {
        value: string;

        constructor(value: string) {
          super({ value });
        }
      }
      @define('MySecond', { isRegistrable: false })
      class MySecond extends Struct {
        value: string;

        constructor(value: string) {
          super({ value });
        }
      }

      it('merges two configurations together while keeping parent properties precedence', () => {
        @define('Config.First')
        class First extends Config {
          key = 'first-key';

          foo: MyFirst;

          constructor(props: Partial<First>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        @define('Config.Second')
        class Second extends Config {
          key = 'second-key';

          baz: MySecond;

          constructor(props: Partial<Second>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        const first = new First({
          key: 'first-key',
          foo: new MyFirst('first-foo'),
        });
        const second = new Second({
          key: 'second-key',
          baz: new MySecond('second-baz'),
        });

        first.merge(second);
        expect(first.getPropTypes()).to.be.eql({
          included: PropTypes.interface({}).isOptional,
          merged: PropTypes.interface({}).isOptional,
          foo: PropTypes.instanceOf(MyFirst),
          key: PropTypes.instanceOf(String),
          baz: PropTypes.instanceOf(MySecond),
        });
        expect(first).to.be.eql({
          merged: { 'Config.Second': second },
          foo: new MyFirst('first-foo'),
          baz: new MySecond('second-baz'),
          key: 'first-key',
        });
      });

      it('merges two deeply nested configurations together while keeping parent properties precedence', () => {
        @define('Config.First')
        class First extends Config {
          key = 'first-key';

          foo: MyFirst;

          constructor(props: Partial<First>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        @define('Config.Second')
        class Second extends Config {
          I: {
            II: {
              III: {
                IV: {
                  V: MySecond;
                };
              };
            };
          };

          constructor(props: Partial<Second>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        const first = new First({
          key: 'first-key',
          foo: new MyFirst('first-foo'),
        });
        const second = new Second({
          I: {
            II: {
              III: {
                IV: {
                  V: new MySecond('second'),
                },
              },
            },
          },
        });

        first.merge(second);
        expect(first.getPropTypes()).to.be.eql({
          included: PropTypes.interface({}).isOptional,
          merged: PropTypes.interface({}).isOptional,
          foo: PropTypes.instanceOf(MyFirst),
          key: PropTypes.instanceOf(String),
          I: PropTypes.shape({
            II: {
              III: {
                IV: {
                  V: PropTypes.instanceOf(MySecond),
                },
              },
            },
          }),
        });
        expect(first).to.be.eql({
          merged: { 'Config.Second': second },
          foo: new MyFirst('first-foo'),
          key: 'first-key',
          I: {
            II: {
              III: {
                IV: {
                  V: new MySecond('second'),
                },
              },
            },
          },
        });
      });
    });

    describe('complex', () => {
      it('merges complex nested prop types and properties with parent config that takes explicit precedence', () => {
        @define('Config.First')
        class First extends Config {
          I = 'first-I';

          II: {
            foo: string;
            bar: string;
          } = {
            foo: 'first-foo',
            bar: 'first-bar',
          };

          III: {
            qux: string;
            qax: Record<string, any>;
          } = {
            qux: 'first-qux',
            qax: {},
          };

          collection: {
            pos1: string;
            pos2: string;
          } = {
            pos1: 'first-pos1',
            pos2: 'first-pos2',
          };

          constructor(props: Partial<First>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        @define('Config.Second')
        class Second extends Config {
          I = 'second-I';

          II: {
            baz: string;
            bar: string;
          } = {
            baz: 'second-baz',
            bar: 'second-bar',
          };

          III: {
            qax: Record<string, any>;
          } = {
            qax: {},
          };

          collection: {
            pos1: string;
          } = {
            pos1: 'second-pos1',
          };

          constructor(props: Partial<Second>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        const first = new First({
          I: 'first-I',
          II: {
            foo: 'first-foo',
            bar: 'first-bar',
          },
          III: {
            qux: 'first-qux',
            qax: {},
          },
          collection: {
            pos1: 'first-pos1',
            pos2: 'first-pos2',
          },
        });
        const second = new Second({
          I: 'second-I',
          II: {
            baz: 'second-baz',
            bar: 'second-bar',
          },
          III: {
            qax: {
              dux: 'second-dux',
            },
          },
          collection: {
            pos1: 'second-pos1',
          },
        });

        first.merge(second);
        expect(first.getPropTypes()).to.be.eql({
          included: PropTypes.interface({}).isOptional,
          merged: PropTypes.interface({}).isOptional,
          I: PropTypes.instanceOf(String),
          II: PropTypes.shape({
            foo: PropTypes.instanceOf(String),
            bar: PropTypes.instanceOf(String),
            baz: PropTypes.instanceOf(String),
          }),
          III: PropTypes.shape({
            qux: PropTypes.instanceOf(String),
            qax: PropTypes.interface({}),
          }),
          collection: PropTypes.shape({
            pos1: PropTypes.instanceOf(String),
            pos2: PropTypes.instanceOf(String),
          }),
        });
        expect(first).to.be.eql({
          merged: { 'Config.Second': second },
          I: 'first-I',
          II: {
            foo: 'first-foo',
            bar: 'first-bar',
            baz: 'second-baz',
          },
          III: {
            qux: 'first-qux',
            qax: {
              dux: 'second-dux',
            },
          },
          collection: {
            pos1: 'first-pos1',
            pos2: 'first-pos2',
          },
        });
      });

      it('resolves default value from path through all available dependent configurations', () => {
        @define('Config.First')
        class First extends Config {
          foo?: {
            baz?: {};
          };

          constructor(props: Partial<First>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        @define('Config.Second')
        class Second extends Config {
          foo?: {
            baz?: {
              qux?: string;
            };
          } = { baz: { qux: 'qux' } };

          constructor(props: Partial<Second>) {
            super();
            Object.assign(this, this.processProps(props));
          }
        }

        const first = new First({});
        const second = new Second({});

        first.merge(second);

        expect(first.has('foo.baz.qux')).to.be.true;
        expect(second.has('foo.baz.qux')).to.be.true;

        expect(first.hasDefault('foo.baz.qux')).to.be.false;
        expect(second.hasDefault('foo.baz.qux')).to.be.true;

        expect(first.get<string>('foo.baz.qux')).to.be.equal('qux');
        expect(second.get<string>('foo.baz.qux')).to.be.equal('qux');
      });
    });
  });
});

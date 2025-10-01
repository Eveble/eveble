import { expect } from 'chai';
import sinon from 'sinon';
import { classes } from 'polytype';
import { PropTypes } from 'typend';
import { Type } from '@eveble/core';
import { types } from '../../../src/types';
import { version } from '../../../src/annotations/version';
import { HookableMixin } from '../../../src/mixins/hookable-mixin';
import { DefinableMixin } from '../../../src/mixins/definable-mixin';
import {
  InvalidLegacyTransformerError,
  NotVersionableError,
  LegacyTransformerNotFoundError,
  LegacyTransformerAlreadyExistsError,
  VersionableMixin,
  InvalidSchemaVersionError,
} from '../../../src/mixins/versionable-mixin';

describe(`VersionableMixin`, () => {
  describe('prop types', () => {
    it('enforces with Versionable schemaVersion prop type as optional number', () => {
      @Type('MyClass', { isRegistrable: false })
      class MyClass
        extends classes(DefinableMixin, VersionableMixin)
        implements types.Versionable
      {
        schemaVersion: number | undefined;
      }

      expect(MyClass.getPropTypes().schemaVersion).to.be.eql(
        PropTypes.instanceOf(Number).isOptional
      );
    });
  });

  describe('registration of legacy transformers', () => {
    it('throws InvalidSchemaVersionError if provided schema version is not a number', () => {
      class MyClass extends VersionableMixin {}

      expect(() =>
        MyClass.prototype.registerLegacyTransformer('1' as any, sinon.stub())
      ).to.throw(
        InvalidSchemaVersionError,
        'MyClass: schema version must be a number, got String("1")'
      );
    });

    it('throws LegacyTransformerAlreadyExistsError when hook would be overridden', () => {
      class MyClass extends VersionableMixin {}

      MyClass.prototype.registerLegacyTransformer(1, sinon.stub());
      expect(() =>
        MyClass.prototype.registerLegacyTransformer(1, sinon.stub())
      ).to.throw(
        LegacyTransformerAlreadyExistsError,
        'MyClass: legacy transformer for schema version 1 already exists'
      );
    });

    it('registers transformer for schema version', () => {
      class MyClass extends VersionableMixin {}

      const schemaVersion = 1;
      const transformer = sinon.stub();
      MyClass.prototype.registerLegacyTransformer(schemaVersion, transformer);
      expect(MyClass.prototype.getLegacyTransformer(schemaVersion)).to.be.equal(
        transformer
      );
    });

    it('allows for explicit transformer overriding', () => {
      class MyClass extends VersionableMixin {}

      const schemaVersion = 1;
      const transformer = sinon.stub();
      const otherTransformer = sinon.stub();

      MyClass.prototype.registerLegacyTransformer(schemaVersion, transformer);
      expect(() =>
        MyClass.prototype.overrideLegacyTransformer(
          schemaVersion,
          otherTransformer
        )
      ).to.not.throw(LegacyTransformerAlreadyExistsError);
      expect(MyClass.prototype.getLegacyTransformer(schemaVersion)).to.be.equal(
        otherTransformer
      );
    });

    it(`throws LegacyTransformerNotFoundError if legacy transformer for schema version can't be found`, () => {
      class MyClass extends VersionableMixin {}

      expect(() => MyClass.prototype.getLegacyTransformer(1)).to.throw(
        LegacyTransformerNotFoundError,
        `MyClass: legacy transformer for schema version 1 was not found`
      );
    });

    it('returns legacy transformer by schema version', () => {
      class MyClass extends VersionableMixin {}

      const schemaVersion = 1;
      const transformer = sinon.stub();
      MyClass.prototype.registerLegacyTransformer(schemaVersion, transformer);
      expect(MyClass.prototype.getLegacyTransformer(schemaVersion)).to.be.equal(
        transformer
      );
    });

    describe('evaluation', () => {
      it('returns true if legacy transformer for schema version is registered', () => {
        class MyClass extends VersionableMixin {}

        const schemaVersion = 1;
        const transformer = sinon.stub();
        MyClass.prototype.registerLegacyTransformer(schemaVersion, transformer);
        expect(MyClass.prototype.hasLegacyTransformer(schemaVersion)).to.be
          .true;
      });
      it('returns false if legacy transformer for schema version does not exist', () => {
        class MyClass extends VersionableMixin {}

        const schemaVersion = 1;
        expect(MyClass.prototype.hasLegacyTransformer(schemaVersion)).to.be
          .false;
      });
    });
  });

  describe('version annotation', () => {
    it('throws NotVersionableError if provided class does not implement Versionable interface', () => {
      const ctor = (): any => {
        class MyClass {
          @version(1)
          transformToVersion1(): any {
            return undefined;
          }
        }
        return new MyClass();
      };
      expect(ctor).to.throw(
        NotVersionableError,
        `MyClass: class must implement Versionable and Hookable interfaces`
      );
    });

    it('throws NotVersionableError if provided class does not implement Hookable interface', () => {
      const ctor = (): any => {
        class MyClass extends VersionableMixin {
          @version(1)
          transformToVersion1(): any {
            return undefined;
          }
        }
        return new MyClass();
      };
      expect(ctor).to.throw(
        NotVersionableError,
        `MyClass: class must implement Versionable and Hookable interfaces`
      );
    });

    it('throws InvalidLegacyTransformerError if provided annotation is not applied to method', () => {
      const ctor = (): any => {
        class MyClass extends VersionableMixin {
          @version(1)
          myPropKey: string;
        }
        return new MyClass();
      };
      expect(ctor).to.throw(
        InvalidLegacyTransformerError,
        `MyClass: declared legacy transformer under key 'myPropKey' for schema version of 1 must be annotating method`
      );
    });
  });

  describe('transforming legacy schema', () => {
    it('does not register onConstruction versionable hook before first legacy transformer is annotated', () => {
      class MyClass extends classes(VersionableMixin, HookableMixin) {
        key: string;
      }
      expect(MyClass.prototype.hasHook('onConstruction', 'versionable')).to.be
        .false;
    });

    it('register an onConstruction versionable hook after first legacy transformer is annotated', () => {
      class MyClass extends classes(VersionableMixin, HookableMixin) {
        key: string;

        @version(1)
        transformToVersion1(props: types.Props): types.Props {
          props.key = 'my-version-1-string';
          return props;
        }
      }
      expect(MyClass.prototype.hasHook('onConstruction', 'versionable')).to.be
        .true;
      expect(
        MyClass.prototype.getHook('onConstruction', 'versionable')
      ).to.be.equal(MyClass.prototype.transformLegacyProps);
    });

    it.skip('does not leak legacy transformers in parent-child relation', () => {
      class Parent extends classes(VersionableMixin, HookableMixin) {
        key: string;

        @version(1)
        transformOnParentToVersion1(props: types.Props): types.Props {
          props.key = 'parent-version-1';
          return props;
        }
      }

      class Child extends Parent {
        key: string;

        @version(1)
        transformOnChildToVersion1(props: types.Props): types.Props {
          props.key = 'child-version-1';
          return props;
        }
      }

      const propsV0 = {
        key: 'initial-string',
      };
      expect(Parent.prototype.transformLegacyProps(propsV0)).to.be.eql({
        key: 'parent-version-1',
        schemaVersion: 1,
      });

      expect(Child.prototype.transformLegacyProps(propsV0)).to.be.eql({
        key: 'child-version-1',
        schemaVersion: 1,
      });
    });

    context('v0', () => {
      it('does not transform types that have no legacy transformers assigned', () => {
        class MyClass extends VersionableMixin {
          key: string;
        }
        const propsV0 = {
          key: 'my-string',
        };
        expect(MyClass.prototype.transformLegacyProps(propsV0)).to.be.eql(
          propsV0
        );
      });
    });

    context('v1', () => {
      it('transforms legacy props that are 1 version behind', () => {
        class MyClass extends classes(VersionableMixin, HookableMixin) {
          key: string;

          @version(1)
          transformToVersion1(props: types.Props): types.Props {
            props.key = 'my-version-1-string';
            return props;
          }
        }
        const propsV0 = {
          key: 'my-string',
        };
        const propsV1 = {
          key: 'my-version-1-string',
          schemaVersion: 1,
        };
        expect(MyClass.prototype.transformLegacyProps(propsV0)).to.be.eql(
          propsV1
        );
      });

      it('does not transform schema is up-to-date', () => {
        class MyClass extends classes(VersionableMixin, HookableMixin) {
          key: string;

          @version(1)
          transformToVersion1(props: types.Props): types.Props {
            props.key = 'my-version-1-string';
            return props;
          }
        }
        const propsV1 = {
          key: 'my-version-1-string',
          schemaVersion: 1,
        };
        expect(MyClass.prototype.transformLegacyProps(propsV1)).to.be.eql(
          propsV1
        );
      });
    });

    context('vN', () => {
      it('transforms legacy props that are 2 version behind', () => {
        class MyClass extends classes(VersionableMixin, HookableMixin) {
          key: string;

          @version(1)
          transformToVersion1(props: types.Props): types.Props {
            props.key = 'my-version-1-string';
            return props;
          }

          @version(2)
          transformToVersion2(props: types.Props): types.Props {
            props.key = 'my-version-2-string';
            return props;
          }
        }
        const propsV0 = {
          key: 'my-string',
        };
        const propsV2 = {
          key: 'my-version-2-string',
          schemaVersion: 2,
        };
        expect(MyClass.prototype.transformLegacyProps(propsV0)).to.be.eql(
          propsV2
        );
      });

      it('does not transform schema is up-to-date', () => {
        class MyClass extends classes(VersionableMixin, HookableMixin) {
          key: string;

          @version(1)
          transformToVersion1(props: types.Props): types.Props {
            props.key = 'my-version-1-string';
            return props;
          }

          @version(2)
          transformToVersion2(props: types.Props): types.Props {
            props.key = 'my-version-2-string';
            return props;
          }
        }

        const propsV2 = {
          key: 'my-version-2-string',
          schemaVersion: 2,
        };
        expect(MyClass.prototype.transformLegacyProps(propsV2)).to.be.eql(
          propsV2
        );
      });
    });
  });
});

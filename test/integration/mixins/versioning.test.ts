import { expect } from 'chai';
import { define } from '@eveble/core';
import { types } from '../../../src/types';
import { Serializable } from '../../../src/components/serializable';
import { version } from '../../../src/annotations/version';

describe(`Versioning`, () => {
  describe('transforming legacy schema', () => {
    @define('CustomerV0', { isRegistrable: false })
    class CustomerV0 extends Serializable {
      firstName: string;

      lastName: string;

      city: string;

      street: string;
    }

    /*
    In the best interest of future developer's sanity is to keep track
    of previous versions state. You can define previous prop types of a class as type
    and assign it as generic type at @version<T>(schemaVersion: number)
    */
    type CustomerOnV0 = {
      firstName: string;
      lastName: string;
      city: string;
      street: string;
    };

    @define('CustomerV1', { isRegistrable: false })
    class CustomerV1 extends Serializable {
      name: string;

      address: string;

      @version<CustomerOnV0>(1)
      transformToVersion1(props: types.Props): types.Props {
        props.name = `${props.firstName} ${props.lastName}`;
        props.address = `${props.city}, ${props.street}`;
        delete props.firstName;
        delete props.lastName;
        delete props.city;
        delete props.street;
        return props;
      }
    }

    type CustomerOnV1 = {
      name: string;

      address: string;
    };

    @define('CustomerV2', { isRegistrable: false })
    class CustomerV2 extends Serializable {
      name: string;

      address: string;

      loyaltyPoints: number;

      @version<CustomerOnV0>(1)
      transformToVersion1(props: types.Props): types.Props {
        props.name = `${props.firstName} ${props.lastName}`;
        props.address = `${props.city}, ${props.street}`;
        delete props.firstName;
        delete props.lastName;
        delete props.city;
        delete props.street;
        return props;
      }

      @version<CustomerOnV1>(2)
      transformToVersion2(props: types.Props): types.Props {
        props.loyaltyPoints = 0;
        return props;
      }
    }

    let propsV0;
    let propsV1;
    let propsV2;

    beforeEach(() => {
      propsV0 = {
        firstName: 'Jane',
        lastName: 'Doe',
        city: 'New York',
        street: 'Wall Street 1234',
      };

      propsV1 = {
        name: 'Jane Doe',
        address: 'New York, Wall Street 1234',
        schemaVersion: 1,
      };

      propsV2 = {
        name: 'Jane Doe',
        address: 'New York, Wall Street 1234',
        loyaltyPoints: 0,
        schemaVersion: 2,
      };
    });

    context('v0', () => {
      it('does not transform properties that matches current schema version', () => {
        const customer = new CustomerV0(propsV0);
        expect(customer).to.be.instanceof(CustomerV0);
        expect(customer).to.be.eql(propsV0);
      });
    });

    context('v1', () => {
      it('transform properties that are 1 version behind current schema version', () => {
        const customer = new CustomerV1(propsV0);
        expect(customer).to.be.instanceof(CustomerV1);
        expect(customer).to.be.eql(propsV1);
      });

      it('does not transform properties that matches current schema version', () => {
        const customer = new CustomerV1(propsV1);
        expect(customer).to.be.instanceof(CustomerV1);
        expect(customer).to.be.eql(propsV1);
      });
    });

    context('v2', () => {
      it('transform properties that are 2 version behind current schema version', () => {
        const customer = new CustomerV2(propsV1);
        expect(customer).to.be.instanceof(CustomerV2);
        expect(customer).to.be.eql(propsV2);
      });

      it('does not transform properties that matches current schema version', () => {
        const customer = new CustomerV2(propsV2);
        expect(customer).to.be.instanceof(CustomerV2);
        expect(customer).to.be.eql(propsV2);
      });
    });
  });

  describe('leakage', () => {
    it('does not leak legacy transformers in parent-child relation', () => {
      @define('Parent', { isRegistrable: false })
      class Parent extends Serializable {
        key: string;

        @version(1)
        transformOnParentToVersion1(props: types.Props): types.Props {
          props.key = 'parent-version-1';
          return props;
        }
      }
      @define('Child', { isRegistrable: false })
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
      expect(new Parent(propsV0)).to.be.eql({
        key: 'parent-version-1',
        schemaVersion: 1,
      });

      expect(new Child(propsV0)).to.be.eql({
        key: 'child-version-1',
        schemaVersion: 1,
      });
    });
  });
});

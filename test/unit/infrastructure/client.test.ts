import { expect } from 'chai';
import { Client } from '../../../src/app/client';
import { StatefulTrait } from '../../../src/traits/stateful.trait';

describe(`Client`, () => {
  it(`has StatefulTrait mixin on prototype chain applied`, () => {
    expect(Client.prototype).to.be.instanceof(StatefulTrait);
  });

  describe('working with state', () => {
    it('has predefined states', () => {
      expect(Client.STATES).to.be.eql({
        constructed: 'constructed',
        initialized: 'initialized',
        connected: 'connected',
        paused: 'paused',
        stopped: 'stopped',
        disconnected: 'disconnected',
        failed: 'failed',
      });
    });

    it(`allows to set state on client `, () => {
      const client = new Client({ id: 'my-id' });
      expect(client.getState()).to.be.equal(Client.STATES.constructed);
      client.setState(Client.STATES.connected);
      expect(client.getState()).to.be.equal(Client.STATES.connected);
    });

    it(`returns true if client is in state`, () => {
      const client = new Client({ id: 'my-id' });
      client.setState(Client.STATES.constructed);
      expect(client.isInState(Client.STATES.constructed)).to.be.true;
    });

    it(`returns false if client is not in state`, () => {
      const client = new Client({ id: 'my-id' });
      expect(client.isInState(Client.STATES.connected)).to.be.false;
    });

    it(`returns true if client has state`, () => {
      const client = new Client({ id: 'my-id' });
      client.setState(Client.STATES.connected);
      expect(client.hasState()).to.be.true;
    });

    it(`returns false if client is not in one of state`, () => {
      const client = new Client({ id: 'my-id' });
      client.state = undefined;
      expect(client.hasState()).to.be.false;
    });
  });

  describe('getters', () => {
    it('returns client id', () => {
      const id = 'my-id';
      const client = new Client({ id });
      expect(client.getId()).to.be.equal(id);
    });
  });
});

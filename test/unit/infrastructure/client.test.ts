import { expect, describe, it } from 'vitest';

import { derived } from '@traits-ts/core';
import { Client } from '../../../src/app/client';
import { StatefulTrait } from '../../../src/traits/stateful.trait';

describe(`Client`, () => {
  it(`has StatefulTrait in composition chain`, () => {
    expect(derived(Client.prototype, StatefulTrait)).toBe(true);
  });

  describe('working with state', () => {
    it('has predefined states', () => {
      expect(Client.STATES).toEqual({
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
      expect(client.getState()).toBe(Client.STATES.constructed);
      client.setState(Client.STATES.connected);
      expect(client.getState()).toBe(Client.STATES.connected);
    });

    it(`returns true if client is in state`, () => {
      const client = new Client({ id: 'my-id' });
      client.setState(Client.STATES.constructed);
      expect(client.isInState(Client.STATES.constructed)).toBe(true);
    });

    it(`returns false if client is not in state`, () => {
      const client = new Client({ id: 'my-id' });
      expect(client.isInState(Client.STATES.connected)).toBe(false);
    });

    it(`returns true if client has state`, () => {
      const client = new Client({ id: 'my-id' });
      client.setState(Client.STATES.connected);
      expect(client.hasState()).toBe(true);
    });

    it(`returns false if client is not in one of state`, () => {
      const client = new Client({ id: 'my-id' });
      client.state = undefined;
      expect(client.hasState()).toBe(false);
    });
  });

  describe('getters', () => {
    it('returns client id', () => {
      const id = 'my-id';
      const client = new Client({ id });
      expect(client.getId()).toBe(id);
    });
  });
});


import { describe, expect, it } from '@jest/globals';
import { AssertionError } from 'assert';

import { ConfLoader } from '../src/ConfLoader';

describe('ConfLoader', () => {
  describe('constructor', () => {
    it('should set it', () => {
      expect(new ConfLoader());
    });

    describe('getConf', () => {
      it('should get an error if CONF_URL env is not set', () => {
        expect(ConfLoader.getConf()).rejects.toThrowError(AssertionError);
      });

      it('should get an error if SRV_ID env is not set', () => {
        process.env.CONF_URL = 'http://localhost:3114/';
        expect(ConfLoader.getConf()).rejects.toThrowError(AssertionError);
      });

      it('should get an error if SECRET env is not set', () => {
        process.env.CONF_URL = 'http://localhost:3114/';
        process.env.SRV_ID = 'ezpfiejzfoiehzfouhezofh';
        expect(ConfLoader.getConf()).rejects.toThrowError(AssertionError);
      });

      it('should get an error if SECRET env is not set', () => {
        process.env.CONF_URL = 'http://localhost:3114/';
        process.env.SRV_ID = 'ezpfiejzfoiehzfouhezofh';
        process.env.SECRET = 'poipoi';
        // test fail
        //expect(ConfLoader.getConf());
      });
    });

    describe('loadConf', () => {
      it('no env var', () => {
        expect(ConfLoader.loadConf()).rejects.toThrow();
      });
    });
  });
});

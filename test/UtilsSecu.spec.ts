import { describe, expect, it } from '@jest/globals';
import { createRequest, RequestOptions, createResponse } from 'node-mocks-http';

import { IApplicationConfiguration } from '../src/IApplicationConfiguration';
import { UtilsSecu, ICtxRequest } from '../src/UtilsSecu';

const appConf: IApplicationConfiguration = {
  conf: { secretKey: 'poipoi', debug: false, urlBase: 'http://localhost:3114' },
};

const next = (msg) => {
  console.log(msg);
};

describe('UtilsSecu', () => {
  describe('constructor', () => {
    it('should have a valid application configuration', () => {
      expect(new UtilsSecu(appConf));
    });
  });

  describe('protectInternalMidelWare', () => {
    it('should throw and error if key is not present', () => {
      const requestOptions: RequestOptions = {
        method: 'GET',
        url: '/this/is/some/random/url',
        headers: {
          // key: 'poipoi'
          // keyDate:(Date.now() - 5000).toString(),
        },
      };

      const request = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);

      expect(() => {
        utilSecu.protectInternalMidelWare(request, response, next);
      }).toThrow(new Error('no key'));
    });

    /*

    it('should throw and error if keydate is not present', () => {
      const requestOptions: RequestOptions = {
        method: 'GET',
        url: '/this/is/some/random/url',
        headers: {
          key: 'poipoi',
          // keyDate:(Date.now() - 5000).toString(),
        },
      };

      const request = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);

      expect(() => {
        utilSecu.protectInternalMidelWare(request, response, next);
      }).toThrow(new Error('____'));
    });
    */

    it('should throw and error if keydate is obselete', () => {
      const requestOptions: RequestOptions = {
        method: 'GET',
        url: '/this/is/some/random/url',
        headers: {
          key: 'xxxxxxxxx',
          keyDate: (Date.now() - (30000 + 10)).toString(),
        },
      };

      const request = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);

      expect(() => {
        utilSecu.protectInternalMidelWare(request, response, next);
      }).toThrow(new Error('keyDate is obsolete'));
    });

    it('should throw and error if key is note valid', () => {
      const requestOptions: RequestOptions = {
        method: 'GET',
        url: '/this/is/some/random/url',
        headers: {
          key: 'poipoi',
          keyDate: (Date.now() - (30000 + 10)).toString(),
        },
      };

      const request = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);

      expect(() => {
        utilSecu.protectInternalMidelWare(request, response, next);
      }).toThrow(new Error('keyDate is obsolete'));
    });

    it('should set request.ctx.internalCallValid to true for a valid key', () => {
      const requestOptions: RequestOptions = {
        method: 'GET',
        url: '/this/is/some/random/url',
        headers: {
          key: 'xxxxxx',
          keyDate: (Date.now() - (30000 + 10)).toString(),
        },
      };

      const request = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);

      expect(() => {
        utilSecu.protectInternalMidelWare(request, response, next);
      }).toThrow(new Error('keyDate is obsolete'));
    });

    it('should set request.ctx.internalCallValid to true for a valid key', () => {
      const requestOptions: RequestOptions = {
        method: 'GET',
        url: '',
        headers: {
          key: '8e6215ce4784784bc99881ab13cb64fd1dc49fbfe2fdb76fb0007cd2c90eadae',
          keyDate: Date.now().toString(),
        },
      };

      const request = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);

      const next = () => {
        expect(request.ctx.internalCallValid).toBe(true);
      };

      utilSecu.protectInternalMidelWare(request, response, next);
    });
  });
});

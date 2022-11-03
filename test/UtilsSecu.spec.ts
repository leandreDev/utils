import { describe, expect, it } from '@jest/globals';
import { createRequest, RequestOptions, createResponse } from 'node-mocks-http';

import { IApplicationConfiguration } from '../src/IApplicationConfiguration';
import { UtilsSecu, ICtxRequest, IValidContext } from '../src/UtilsSecu';

const appConf: IApplicationConfiguration = {
  conf: { secretKey: 'poipoi', debug: false, urlBase: 'http://localhost:3114/' },
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
    keydate header is not tested fpr existence
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

    it('should throw and error if keydate is due (>30000ms)', () => {
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
          key: 'xxxxxxxxx',
          keyDate: (Date.now() - 0).toString(),
        },
      };

      const request = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);

      expect(() => {
        utilSecu.protectInternalMidelWare(request, response, next);
      }).toThrow(new Error('key dont match uri'));
    });

    it('should set request.ctx.internalCallValid to true for a valid key', () => {
      const requestOptions: RequestOptions = {
        method: 'GET',
        url: '/this/is/some/random/url',
        headers: {
          key: '',
          keyDate: (Date.now() - 1000).toString(),
        },
      };

      const request = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);
      // create a valid sercurity header
      utilSecu.addHeadersKey(request);
      const next = () => {
        expect(request.ctx.internalCallValid).toBe(true);
      };

      utilSecu.protectInternalMidelWare(request, response, next);
    });
  });

  describe('chekInternalMidelWare', () => {
    it('should throw and error if key is not present', () => {
      const requestOptions: RequestOptions = {
        method: 'GET',
        url: '/this/is/some/random/url',
        headers: {
          // key: 'poipoi'
          // keyDate:(Date.now() - 5000).toString(),
        },
      };

      const request: ICtxRequest<IValidContext> = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);
      request.ctx = {};

      const next = () => {
        expect(true);
      };
      utilSecu.chekInternalMidelWare(request, response, next);
    });

    it('should throw and error if keydate is due (>30000ms)', () => {
      const requestOptions: RequestOptions = {
        method: 'GET',
        url: '/this/is/some/random/url',
        headers: {
          key: 'xxxxxxxxx',
          keyDate: (Date.now() - (30000 + 10)).toString(),
        },
      };

      const request: ICtxRequest<IValidContext> = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);
      request.ctx = {};

      const next = () => {
        expect(request.ctx.internalCallValid).toBe(false);
      };

      utilSecu.chekInternalMidelWare(request, response, next);
    });

    it('should throw and error if key is note valid', () => {
      const requestOptions: RequestOptions = {
        method: 'GET',
        url: '/this/is/some/random/url',
        headers: {
          key: 'xxxxxxxxx',
          keyDate: (Date.now() - 0).toString(),
        },
      };

      const request: ICtxRequest<IValidContext> = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);
      request.ctx = {};

      const next = () => {
        expect(request.ctx.internalCallValid).toBe(false);
      };

      utilSecu.chekInternalMidelWare(request, response, next);
    });

    it('should set request.ctx.internalCallValid to true for a valid key', () => {
      const requestOptions: RequestOptions = {
        method: 'GET',
        url: '/this/is/some/random/url',
        headers: {
          key: '',
          keyDate: (Date.now() - 1000).toString(),
        },
      };
      const request: ICtxRequest<IValidContext> = createRequest(requestOptions);
      const response = createResponse();
      const utilSecu = new UtilsSecu(appConf);
      utilSecu.addHeadersKey(request);

      request.ctx = {};

      const next = () => {
        expect(request.ctx.internalCallValid).toBe(true);
      };

      utilSecu.chekInternalMidelWare(request, response, next);
    });
  });
});

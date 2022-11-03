import * as crypto from 'node:crypto';
import * as URL from 'node:url';
import * as assert from 'assert';
import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';

import { IApplicationConfiguration } from './IApplicationConfiguration';

export interface ICtxRequest<T> extends Request {
  ctx: T;
}

interface IValidContext {
  internalCallValid?: boolean;
}
export class UtilsSecu {
  constructor(private currentApp: IApplicationConfiguration) {
    /*
      Could make a better error handler
    */
    assert(currentApp.conf.secretKey, 'secretKey is not specified');
  }

  public addHeadersKeyProm(req: Request): Promise<void> {
    return Promise.resolve().then(() => {
      this.addHeadersKey(req);
      return;
    });
  }

  public addHeadersKey(req: Request): void {
    let date: number = Date.now();

    /*
      req.headers is always define in http.IncomingMessage (which extends expres.Request)
    */
    if (!req.headers) {
      req.headers = {};
    }

    /*
      NOTE: Ce block de condition au un probleme
      "date" n'est jamais utlisé après
      "date" devrais etre une string
      "keyDate" peurt etre une string ou string[]

      if (req.headers.keyDate {
        date = new Date(req.headers.keyDate).valueOf();
      } else {
        req.headers.keyDate = date.;
      }
    */

    /*
      header key are ALWAYS lowercase keyDate => become keydate
      req.headers.keyDate never exit !
    */

    if (req.headers.keyDate && typeof req.headers.keyDate == 'string') {
      date = new Date(req.headers.keyDate).valueOf();
    } else {
      req.headers.keyDate = date.toString();
    }

    /*
     "this.currentApp.conf.urlBase + req.url" is the full URL
      change it for URL.URL(myURL).format, ...)
    */

    req.url = URL.format(new URL.URL(req.url.trim()), { unicode: true });

    const url: string = req.url.toLowerCase();

    req.headers.key = crypto
      .createHmac('sha256', this.currentApp.conf.secretKey)
      .update(req.headers.keyDate + url)
      .digest('hex');

    /*
      use a logger module instead of console.log=> logger(msg)
    */

    if (this.currentApp.conf.debug) {
      console.info('create sig', url, req.headers.keyDate, req.headers.key);
    }
  }

  /*
    Add new method checkHeadersKey(req: express.Request): void
    for consistent method naming (eg: "addHeadersKey" above)
  */

  public testkey(req: ICtxRequest<IValidContext>): void {
    /*
      req.headers.keyDate can't be in headers : uppercase are transform to lowercase in HTTP request
      https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
    */
    const date = Number(req.headers.keyDate);
    const key = req.headers.key;
    let requrl: string;

    /*
      ""this.currentApp.conf.urlBase == undefined" should throw and catch error
    */

    if (req.originalUrl && req.originalUrl.length > 1) {
      requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1);
    } else {
      requrl = this.currentApp.conf.urlBase;
    }

    // var url = requrl.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://");
    const url: string = URL.format(new URL.URL(requrl.trim()), {
      unicode: true,
    }).toLowerCase();

    /*
      "this.currentApp.conf.secretKey == undefined" should throw and catch error
    */

    const newKey: string = crypto
      .createHmac('sha256', this.currentApp.conf.secretKey)
      .update(date + url)
      .digest('hex');

    /*
     Extend express Request interface with ctx propertie
    */

    if (newKey == key) {
      req.ctx.internalCallValid = true;
    } else {
      req.ctx.internalCallValid = false;

      if (this.currentApp.conf.debug) {
        console.error('key dont match ' + url, date, key, newKey);
      }
    }
  }

  /*
    Middleware should be put in another class
    => throw error() should be used a next(error) in middleware ?!
  */

  public get chekInternalMidelWare(): (req: ICtxRequest<IValidContext>, _res: Response, next: NextFunction) => void {
    return (req: ICtxRequest<IValidContext>, _res, next) => {
      const date: number = Number(req.header('keyDate'));
      const key: string = req.header('key');
      let reqUrl: string;
      const currentDate: number = Date.now();

      if (key) {
        if (currentDate > date + 30000) {
          if (this.currentApp.conf.debug) {
            console.error('keyDate is obsolete : ' + currentDate + '>' + date + '+ 30000');
          }

          req.ctx.internalCallValid = false;
          next();
        } else {
          if (req.originalUrl && req.originalUrl.length > 1) {
            reqUrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1);
          } else {
            reqUrl = this.currentApp.conf.urlBase;
          }

          /*
            use new URL.URL(...).format(...).toLowerCase()
          */

          const url: string = URL.format(new URL.URL(reqUrl.trim()), {
            unicode: true,
          }).toLowerCase();

          const newKey: string = crypto
            .createHmac('sha256', this.currentApp.conf.secretKey)
            .update(date + url)
            .digest('hex');

          if (newKey == key) {
            req.ctx.internalCallValid = true;
            next();
          } else {
            req.ctx.internalCallValid = false;

            if (this.currentApp.conf.debug) {
              console.error('key dont match ' + url, date, key, newKey);
            }
            next();
          }
        }
      } else {
        next();
      }
    };
  }

  public get protectInternalMidelWare(): (req: Request, _res: Response, next: NextFunction) => void {
    return (req: ICtxRequest<IValidContext>, _res, next) => {
      const date = Number(req.header('keyDate'));
      const key = req.header('key');
      let requrl: string;
      const currentDate: number = Date.now();

      if (key) {
        /*
          should test if keyDate is defined in headers
        */
        if (currentDate > date + 30000) {
          if (this.currentApp.conf.debug) {
            console.error('keyDate is obsolete : ' + currentDate + '>' + date + '+ 30000');
          }
          throw new Error('keyDate is obsolete');
          // next('keyDate is obsolete');
        } else {
          console.log('>>> ', req.originalUrl);

          if (req.originalUrl && req.originalUrl.length > 1) {
            requrl = this.currentApp.conf.urlBase + req.originalUrl.substr(1);
          } else {
            requrl = this.currentApp.conf.urlBase;
          }

          const url: string = URL.format(new URL.URL(requrl.trim()), {
            unicode: true,
          }).toLowerCase();

          const newKey: string = crypto
            .createHmac('sha256', this.currentApp.conf.secretKey)
            .update(date + url)
            .digest('hex');
          
          console.log('>> ', newKey);

          if (newKey == key) {
            if (!req.ctx) {
              req.ctx = {};
            }
            req.ctx.internalCallValid = true;

            next();
          } else {
            if (this.currentApp.conf.debug) {
              console.error('key dont match uri : ' + url, date, key, newKey);
            }
            throw new Error('key dont match uri : ' + requrl);
            // next('key dont match uri : ' + requrl);
          }
        }
      } else {
        throw new Error('no key');
        // next('no key');
      }
    };
  }

  public get protectUserConnected(): RequestHandler | ErrorRequestHandler {
    /*
      Bad interface "ctx" doesnt exit in RequestHandler
    */
    return (req, _res, next) => {
      if (req.ctx && req.ctx.user) {
        next();
      } else {
        throw new Error('user not connected');
        // next('user not connected');
      }
    };
  }
}

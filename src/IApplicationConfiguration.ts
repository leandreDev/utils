import * as express from 'express';
import * as http from 'node:http';
import * as Jose from 'node-jose';

import { UtilsSecu } from './UtilsSecu';

export interface IApplicationConfiguration {
  licence_keyStore?: Jose.JWK.KeyStore;
  server?: http.Server;
  express?: express.Application;
  toErrRes?: { (err: any, code?: number): any };
  toJsonRes?: { (objs: any, meta?: any): any };
  secu?: UtilsSecu;
  conf?: any;
}

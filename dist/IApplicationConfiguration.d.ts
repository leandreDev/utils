/// <reference types="node" />
import * as express from 'express';
import { UtilsSecu } from './UtilsSecu';
import * as http from 'http';
import * as Jose from 'node-jose';
export interface IApplicationConfiguration {
    licence_keyStore?: Jose.JWK.KeyStore;
    server?: http.Server;
    express?: express.Application;
    toErrRes?: {
        (err: any, code?: number): any;
    };
    toJsonRes?: {
        (objs: any, meta?: any): any;
    };
    secu?: UtilsSecu;
    conf?: any;
}

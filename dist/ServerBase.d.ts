/// <reference types="node" />
import * as express from 'express';
import { UtilsSecu } from './UtilsSecu';
import * as http from 'http';
export declare class ServerBase {
    currentApp: any;
    app: any;
    secu: UtilsSecu;
    server: http.Server;
    constructor();
    protected startHttpServer(): void;
    protected init(): Promise<any>;
    headers: string[][];
    protected reloadConfPromise(): Promise<any>;
    reloadConf(req: any, res: any): void;
    toErrRes(err: any): any;
    toJsonRes(objs: any, meta?: any): any;
    readonly addCtx: express.RequestHandler | express.ErrorRequestHandler;
    readonly checkJWT: express.RequestHandler | express.ErrorRequestHandler;
    readonly hasRight: express.RequestHandler | express.ErrorRequestHandler;
}

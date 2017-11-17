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
    protected readonly parentProcessHandler: (msg: any) => void;
    protected sendToParentProcess(msg: any): void;
    protected startHttpServer(): void;
    protected init(): Promise<any>;
    headers: string[][];
    protected reloadConfPromise(): Promise<any>;
    readonly reloadConf: (req: any, res: any) => void;
    readonly toErrRes: (err: any) => any;
    readonly toJsonRes: (objs: any, meta?: any) => any;
    readonly addCtx: express.RequestHandler | express.ErrorRequestHandler;
    readonly checkJWT: express.RequestHandler | express.ErrorRequestHandler;
    readonly hasRight: express.RequestHandler | express.ErrorRequestHandler;
}

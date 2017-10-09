/// <reference types="node" />
import * as express from 'express';
import { UtilsSecu } from './UtilsSecu';
import * as http from 'http';
export declare class ServerBase {
    currentApp: any;
    app: express;
    secu: UtilsSecu;
    server: http.Server;
    constructor();
    protected startHttpServer(): void;
    protected init(): Promise<any>;
    reloadConf(req: any, res: any): void;
    toErrRes(err: any): any;
    addCtx(req: any, res: any, next: any): void;
    checkJWT(req: any, res: any, next: any): void;
    hasRight(req: any, res: any, next: any): void;
}

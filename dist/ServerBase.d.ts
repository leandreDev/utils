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
    headers: string[][];
    reloadConf(req: any, res: any): void;
    toErrRes(err: any): any;
    toJsonRes(objs: any, meta?: any): any;
    readonly addCtx: (req: any, res: any, next: any) => void;
    readonly checkJWT: (req: any, res: any, next: any) => void;
    readonly hasRight: (req: any, res: any, next: any) => void;
}

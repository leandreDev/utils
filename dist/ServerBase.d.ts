/// <reference types="node" />
import * as express from 'express';
import { UtilsSecu } from './UtilsSecu';
import * as http from 'http';
import { IApplicationConfiguration } from './IApplicationConfiguration';
export declare class ServerBase {
    currentApp: IApplicationConfiguration;
    app: any;
    secu: UtilsSecu;
    server: http.Server;
    constructor();
    protected get parentProcessHandler(): (msg: any) => void;
    protected sendToParentProcess(msg: any): void;
    protected startHttpServer(): void;
    protected init(): Promise<any>;
    headers: string[][];
    protected loadConfPromise(): Promise<any>;
    protected loadDepConfPromise(): Promise<any>;
    protected reloadConfPromise(): Promise<any>;
    get reloadConf(): (req: any, res: any) => void;
    get toErrRes(): {
        (err: any, code?: number): any;
    };
    get toJsonRes(): {
        (objs: any, meta?: any): any;
    };
    get addCtx(): express.RequestHandler | express.ErrorRequestHandler;
    get checkJWT(): express.RequestHandler | express.ErrorRequestHandler;
    get hasRight(): express.RequestHandler | express.ErrorRequestHandler;
}

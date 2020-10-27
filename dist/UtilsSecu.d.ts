import * as express from "express";
export declare class UtilsSecu {
    private currentApp;
    constructor(currentApp: any);
    addHeadersKeyProm(rq: any): Promise<any>;
    addHeadersKey(rq: any): void;
    testkey(req: any): void;
    get chekInternalMidelWare(): express.RequestHandler | express.ErrorRequestHandler;
    get protectInternalMidelWare(): express.RequestHandler | express.ErrorRequestHandler;
}

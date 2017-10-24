import * as express from "express";
export declare class UtilsSecu {
    private currentApp;
    constructor(currentApp: any);
    addHeadersKey(rq: any): void;
    readonly chekInternalMidelWare: express.RequestHandler | express.ErrorRequestHandler;
    readonly protectInternalMidelWare: express.RequestHandler | express.ErrorRequestHandler;
}

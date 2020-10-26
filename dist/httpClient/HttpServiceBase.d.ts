import { HttpAbstractService } from "./HttpAbstractService";
import { IHttpResult } from "./IHttpResult";
import { UtilsSecu } from "../UtilsSecu";
import { CtxInterpretor } from "../CtxInterpretor";
import { MiddleWareConfig } from "./MiddleWareConfig";
import { IHttpServiceBase } from "./IHttpServiceBase";
export declare class HttpServiceBase<T> extends HttpAbstractService implements IHttpServiceBase<T> {
    constructor(conf: {
        url: string;
        secure: UtilsSecu;
    });
    protected url: string;
    protected globalCtxInt: CtxInterpretor;
    delete(id: string, headers?: any): Promise<IHttpResult<T>>;
    deleteMiddleware: (config: MiddleWareConfig) => (req: any, res: any, next: any) => void;
    get(query?: string, headers?: any): Promise<IHttpResult<T>>;
    getMiddleware: (config: MiddleWareConfig) => (req: any, res: any, next: any) => void;
    patch(body: any, headers?: any, query?: string): Promise<IHttpResult<T>>;
    patchMiddleware: (config: MiddleWareConfig) => (req: any, res: any, next: any) => void;
    post(body: T, headers?: any, query?: string): Promise<IHttpResult<T>>;
    postMiddleware: (config: MiddleWareConfig) => (req: any, res: any, next: any) => void;
    put(body: T, headers?: any, query?: string): Promise<IHttpResult<T>>;
    putMiddleware: (config: MiddleWareConfig) => (req: any, res: any, next: any) => void;
}

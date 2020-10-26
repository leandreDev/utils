import { HttpAbstractService } from "./HttpAbstractService";
import { IHttpResult } from "./IHttpResult";
import { CtxInterpretor } from "../CtxInterpretor";
import { IHttpServiceAdminBase } from "./IHttpServiceAdminBase";
export declare class HttpServiceAdminBase<T> extends HttpAbstractService implements IHttpServiceAdminBase<T> {
    constructor(conf: any);
    protected url: string;
    protected globalCtxInt: CtxInterpretor;
    delete(query: string, headers?: any): Promise<IHttpResult<T>>;
    patch(body: any, headers?: any, query?: string): Promise<IHttpResult<T>>;
}

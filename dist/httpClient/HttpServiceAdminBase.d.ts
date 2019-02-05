import { HttpAbstractService } from "./HttpAbstractService";
import { IHttpResult } from "./IHttpResult";
import { CtxInterpretor } from "../CtxInterpretor";
export declare class HttpServiceAdminBase<T> extends HttpAbstractService {
    constructor(conf: any);
    protected url: string;
    protected globalCtxInt: CtxInterpretor;
    delete(query: string, headers?: any): Promise<IHttpResult<T>>;
    patch(body: any, headers?: any, query?: string): Promise<IHttpResult<T>>;
}

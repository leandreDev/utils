import { IHttpResult } from "./IHttpResult";
import { UtilsSecu } from "../UtilsSecu";
export declare class HttpAbstractService {
    constructor(conf: any);
    protected secure: UtilsSecu;
    protected callRequest<T>(options: any): Promise<T>;
    protected baseDelete<T>(url?: string, headers?: any): Promise<IHttpResult<T>>;
    protected baseGet<T>(url?: string, headers?: any): Promise<IHttpResult<T>>;
    cleanArr(value: any[]): any[];
    cleanObj(value: any): any;
    protected basePatch<T>(url: string, body: any | null, headers?: any): Promise<IHttpResult<T>>;
    protected basePost<T>(url: string, body: any | null, headers?: any): Promise<IHttpResult<T>>;
    protected basePut<T>(url: string, body: any | null, headers?: any): Promise<IHttpResult<T>>;
}

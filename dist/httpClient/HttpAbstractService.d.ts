import { IHttpResult } from './IHttpResult';
import { UtilsSecu } from '../UtilsSecu';
export declare class HttpAbstractService {
    constructor(conf: {
        secure: UtilsSecu;
    });
    protected secure: UtilsSecu;
    protected callRequest<T>(options: any): Promise<T>;
    cleanArr(value: any[]): any[];
    cleanObj(value: any): any;
    protected basePatch<T>(url: string, body: any | null, headers?: any): Promise<IHttpResult<T>>;
    protected basePost<T, U = T>(url: string, body: U | null, headers?: any): Promise<IHttpResult<T>>;
    protected basePut<T, U = T>(url: string, body: U | null, headers?: any): Promise<IHttpResult<T>>;
    protected baseDelete<T>(url?: string, headers?: any): Promise<IHttpResult<T>>;
    protected baseGet<T>(url?: string, headers?: any): Promise<IHttpResult<T>>;
    protected _patch<T>(url: string, body: any | null, headers?: any): Promise<T>;
    protected _post<T, U = T>(url: string, body: U | null, headers?: any): Promise<T>;
    protected _put<T, U = T>(url: string, body: U | null, headers?: any): Promise<T>;
    protected _delete<T>(url?: string, headers?: any): Promise<T>;
    protected _get<T>(url?: string, headers?: any): Promise<T>;
}

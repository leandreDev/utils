import { IHttpResult } from "./IHttpResult";
export interface IHttpServiceAdminBase<T> {
    delete(query: string, headers?: any): Promise<IHttpResult<T>>;
    patch(body: any, headers?: any, query?: string): Promise<IHttpResult<T>>;
}

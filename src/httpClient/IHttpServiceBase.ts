import { IHttpResult } from './IHttpResult';
export interface IHttpServiceBase<T> {
  delete(id: string, headers?: any): Promise<IHttpResult<T>>;
  get(query?: string, headers?: any): Promise<IHttpResult<T>>;
  patch(body: any, headers?: any, query?: string): Promise<IHttpResult<T>>;
  post(body: T, headers?: any, query?: string): Promise<IHttpResult<T>>;
  put(body: T, headers?: any, query?: string): Promise<IHttpResult<T>>;
}

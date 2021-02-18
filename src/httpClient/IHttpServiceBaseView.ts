import { IHttpResult } from './IHttpResult';
export interface IHttpServiceBaseView<T> {
  get(
    query?: string,
    headers?: any,
    aggregate?: any,
    ctx?: any
  ): Promise<IHttpResult<T>>;
}

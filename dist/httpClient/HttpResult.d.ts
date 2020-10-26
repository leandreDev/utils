import { IHttpResult } from './IHttpResult';
import { IMeta } from './IMeta';
export declare class HttpResult<T> implements IHttpResult<T> {
    code: number;
    message?: string;
    name?: string;
    stack?: string;
    meta?: IMeta;
    response: T[];
    constructor(obj: T | T[] | Error, debug: boolean, meta?: IMeta);
}

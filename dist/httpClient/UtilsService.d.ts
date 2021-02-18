import { IHttpResult } from './IHttpResult';
export declare class UtilsService {
    static resultToObjWEmptyError<T>(message: string): {
        (dataResult: IHttpResult<T>): Promise<T>;
    };
    static resultToObj<T>(message: string): {
        (dataResult: IHttpResult<T>): Promise<T>;
    };
    static resultToArr<T>(message: string): {
        (dataResult: IHttpResult<T>): Promise<T[]>;
    };
    static resultToArrWEmptyError<T>(message: string): {
        (dataResult: IHttpResult<T>): Promise<T[]>;
    };
}

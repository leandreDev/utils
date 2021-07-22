import { Collection, Db, ObjectId } from 'mongodb';
import { CtxInterpretor } from '../CtxInterpretor';
import { Entity } from './Entity';
import { IBase } from '../lib/IBase';
import { IHttpResult } from './IHttpResult';
import { IHttpServiceBase } from './IHttpServiceBase';
export declare class HttpServiceBddBase<T extends IBase> implements IHttpServiceBase<T> {
    constructor(conf: {
        bdd: Promise<Db>;
        collectionName: string;
        debug: boolean;
        _class?: string;
        entity: {
            new (): Entity;
            cast(obj: any): any;
            check(target: any, isCompleteObj: boolean, path: string): string[];
            castQueryParam(path: string, value: any): any;
            getClassNameOfProp(path: string): string;
        };
        collections: {
            getHttpService(colName: string): HttpServiceBddBase<IBase>;
        };
    });
    collections: {
        getHttpService(colName: string): HttpServiceBddBase<IBase>;
    };
    protected entity: {
        new (): Entity;
        cast(obj: any): any;
        check(target: any, isCompleteObj: boolean, path: string): string[];
        castQueryParam(path: string, value: any): any;
        getClassNameOfProp(path: string): string;
    };
    protected debug: boolean;
    protected _class: string;
    collection: Promise<Collection>;
    protected url: string;
    protected globalCtxInt: CtxInterpretor;
    delete(id: string, headers?: any): Promise<IHttpResult<T>>;
    get(query?: string, headers?: any): Promise<IHttpResult<T>>;
    patch(body: any, headers?: any, query?: string): Promise<IHttpResult<T>>;
    post(body: T, headers?: any, query?: string): Promise<IHttpResult<T>>;
    put(body: T, headers?: any, query?: string): Promise<IHttpResult<T>>;
    getValueOfPath(path: string[], obj: any, ids: ObjectId[], proxy: any[]): void;
}

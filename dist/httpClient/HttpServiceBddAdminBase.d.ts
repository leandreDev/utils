import { IHttpResult } from './IHttpResult';
import { IBase } from '../lib/IBase';
import { CtxInterpretor } from '../CtxInterpretor';
import { Db, Collection } from 'mongodb';
import { Entity } from './Entity';
import { IHttpServiceAdminBase } from './IHttpServiceAdminBase';
export declare class HttpServiceBddAdminBase<T extends IBase> implements IHttpServiceAdminBase<T> {
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
        };
    });
    protected entity: {
        new (): Entity;
        cast(obj: any): any;
        check(target: any, isCompleteObj: boolean, path: string): string[];
        castQueryParam(path: string, value: any): any;
    };
    protected debug: boolean;
    protected _class: string;
    protected collection: Promise<Collection>;
    protected url: string;
    protected globalCtxInt: CtxInterpretor;
    delete(query: string, headers?: any): Promise<IHttpResult<T>>;
    patch(body: any, headers?: any, query?: string): Promise<IHttpResult<T>>;
    get(query?: string, headers?: any): Promise<IHttpResult<T>>;
    baseGet(q: any, headers?: any, meta?: any): Promise<IHttpResult<T>>;
}

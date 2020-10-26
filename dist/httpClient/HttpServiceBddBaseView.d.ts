import { IHttpResult } from './IHttpResult';
import { IBase } from '../lib/IBase';
import { CtxInterpretor } from '../CtxInterpretor';
import { Db, Collection, ObjectId } from 'mongodb';
import { Entity } from './Entity';
import { IHttpServiceBaseView } from './IHttpServiceBaseView';
import { HttpServiceBddBase } from './HttpServiceBddBase';
export declare class HttpServiceBddBaseView<T extends IBase> implements IHttpServiceBaseView<T> {
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
    protected collection: Promise<Collection>;
    protected url: string;
    protected globalCtxInt: CtxInterpretor;
    get(query: string, headers: any, aggregate: any[], ctx?: any): Promise<IHttpResult<T>>;
    getValueOfPath(path: string[], obj: any, ids: ObjectId[], proxy: any[]): void;
}

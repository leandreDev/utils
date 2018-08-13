import { IBase } from './IBase';
export declare class Base implements IBase {
    _id: string;
    _class: string;
    constructor(obj?: any);
    static check(target: any, isCompleteObj?: boolean, path?: string): Promise<boolean>;
    static create(target: any, path?: string): Promise<Base>;
    static stringObjectId(): string;
}
export declare class ObjectId {
    constructor();
    static stringObjectId(): string;
}

import { IBase } from './IBase';
export declare class Base implements IBase {
    _id: string;
    _class: string;
    constructor(obj?: any);
    check(target: any, isCompleteObj?: boolean, path?: string): string[];
    static check(target: any, isCompleteObj?: boolean, path?: string): string[];
    static stringObjectId(): string;
}
export declare class ObjectId {
    constructor();
    static stringObjectId(): string;
}

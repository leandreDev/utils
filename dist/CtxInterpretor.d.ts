export declare class CtxInterpretor {
    private context;
    constructor(context: any);
    private setEnv(varKey);
    private setGlobalEnv(stringKey);
    updateEnv(obj: any): any;
}

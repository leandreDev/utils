export declare class CtxInterpretor {
    context: any;
    startPatern: string;
    endPatern: string;
    splitPatern: string;
    constructor(context: any);
    private setEnv(varKey);
    private setGlobalEnv(stringKey);
    updateEnv(obj: any, clone?: boolean): any;
}

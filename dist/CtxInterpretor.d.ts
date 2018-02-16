export declare class CtxInterpretor {
    context: any;
    startPatern: string;
    endPatern: string;
    splitPatern: string;
    constructor(context: any);
    private setEnv(varKey);
    private setGlobalEnv(stringKey);
    updateArrEnv(obj: any[], clone?: boolean): any;
    updateEnv(obj: any, clone?: boolean): any;
}

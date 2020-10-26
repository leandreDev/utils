export declare class UtilSecuOAuthSrv {
    private currentApp;
    protected accessTokenUrl: string;
    protected client_id: string;
    protected client_secret: string;
    constructor(currentApp: any);
    protected refreshTokenDate: number;
    protected endTokenDate: number;
    protected promToken: Promise<any>;
    protected accToken: any;
    getToken(): Promise<any>;
    setToken(): Promise<any>;
    addHeadersKeyProm(rq: any): Promise<any>;
}

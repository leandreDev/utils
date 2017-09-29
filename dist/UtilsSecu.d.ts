export declare class UtilsSecu {
    private currentApp;
    constructor(currentApp: any);
    addHeadersKey(rq: any): void;
    chekInternalMidelWare: (req: any, res: any, next: any) => void;
    protectInternalMidelWare: (req: any, res: any, next: any) => void;
}

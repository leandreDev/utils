export interface IMeta {
    count?: number;
    nb?: number;
    pageSize?: number;
    offset?: number;
    sort?: {
        [key: string]: 1 | -1;
    };
    mongoquery?: any;
}

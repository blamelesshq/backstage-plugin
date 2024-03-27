import { BlamelessConnectionConfig } from './types';
export declare class BlamelessJob {
    private readonly blamelessService;
    constructor(connectionConfig: BlamelessConnectionConfig);
    listCatalog(): Promise<any[]>;
    updateBlamelessServices(): Promise<void>;
    start(): Promise<void>;
}

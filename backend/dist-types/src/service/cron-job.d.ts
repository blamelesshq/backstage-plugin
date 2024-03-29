import { BlamelessService } from './blameless';
import { BlamelessConnectionConfig } from './types';
export declare class BlamelessJob {
    readonly blamelessService: BlamelessService;
    private readonly catalogClient;
    constructor(connectionConfig: BlamelessConnectionConfig);
    listCatalog(): Promise<any[]>;
    updateBlamelessServices(): Promise<void>;
    start(): Promise<void>;
}

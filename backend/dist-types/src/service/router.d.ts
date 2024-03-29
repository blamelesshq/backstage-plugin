import express from 'express';
import { Logger } from 'winston';
import { DiscoveryService, RootConfigService } from '@backstage/backend-plugin-api';
export interface RouterOptions {
    logger: Logger;
    discovery?: DiscoveryService;
    config?: RootConfigService;
    auth?: any;
    httpAuth?: any;
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;

import express from 'express';
import { Logger } from 'winston';
import { CatalogClient } from '@backstage/catalog-client';
import { DiscoveryService, RootConfigService } from '@backstage/backend-plugin-api';
import { FetchApi } from '@backstage/core-plugin-api';
export interface RouterOptions {
    logger: Logger;
    discovery?: DiscoveryService;
    catalogClient?: CatalogClient;
    fetchApi?: FetchApi;
    permissions?: string[];
    config?: RootConfigService;
    auth?: any;
    httpAuth?: any;
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;

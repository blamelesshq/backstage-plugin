import { Config } from '@backstage/config';
import { CatalogClient } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {Logger} from 'winston';
import {
  PluginEndpointDiscovery,
} from '@backstage/backend-common';


export type AuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export  interface  BlamelessAPI {
    checkTokenExpiry: () => Promise<string | null>;
    getNewToken: () => Promise<AuthResponse | null>;
    updateServices: (entities: Entity[]) => Promise<void>;
}

export type BlamelessConnectionConfig = {
  logger: Logger;
  config: Config;
  catalogClient: CatalogClient;
  discovery: PluginEndpointDiscovery;
};

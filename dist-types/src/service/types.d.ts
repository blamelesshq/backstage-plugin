import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
export type Service = {
    name: string;
    kind: string;
    namespace: string;
    type: string;
};
export type AuthResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
};
export interface BlamelessAPI {
    checkTokenExpiry: () => Promise<string | null>;
    getNewToken: () => Promise<AuthResponse | null>;
    updateServices: (services: Service[]) => Promise<void>;
}
export type BlamelessConnectionConfig = {
    logger: Logger;
    config: Config;
    discovery: PluginEndpointDiscovery;
};

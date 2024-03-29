import { Config } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';
import { Logger } from 'winston';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
export type BlamelessIncident = {
    id: number;
    title: string;
    status: string;
    severity: string;
    incident_type: string;
    created_at: string;
    postmortem_url: string;
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
    updateServices: (entities: Entity[]) => Promise<void>;
    getIncidents: () => Promise<BlamelessIncident[]>;
}
export type BlamelessConnectionConfig = {
    logger: Logger;
    config: Config;
    discovery: PluginEndpointDiscovery;
};
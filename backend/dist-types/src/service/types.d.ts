import { Config } from '@backstage/config';
import { CatalogClient } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { Logger } from 'winston';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
export type BlamelessIncident = {
    id: number;
    title: string;
    status: string;
    severity: string;
    incident_type: string;
    created: string;
    postmortem_url: string | null;
    incident_url: string;
};
export type IncidentResponse = {
    ok: boolean;
    incidents: BlamelessIncident[];
    pagination: {
        limit: number;
        offset: number;
        count?: number;
    };
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
    getIncidents: (page: number) => Promise<BlamelessIncident[]>;
}
export type BlamelessConnectionConfig = {
    logger: Logger;
    config: Config;
    catalogClient: CatalogClient;
    discovery: PluginEndpointDiscovery;
};

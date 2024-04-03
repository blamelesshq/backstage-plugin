import { Entity } from "@backstage/catalog-model";
import { BlamelessAPI, BlamelessConnectionConfig, AuthResponse, BlamelessIncident, IncidentResponse } from "./types";
export declare class BlamelessService implements BlamelessAPI {
    private readonly authKey;
    private readonly baseurl;
    private access_token;
    readonly interval: number;
    readonly kinds: string[];
    connectionConfig: BlamelessConnectionConfig;
    constructor(connectionConfig: BlamelessConnectionConfig);
    checkTokenExpiry(): Promise<string | null>;
    getNewToken(): Promise<AuthResponse | null>;
    updateServices(entities: Entity[]): Promise<void>;
    fetchIncidents(limit: number, offset: number, token: string): Promise<IncidentResponse>;
    getIncidents(page?: number): Promise<BlamelessIncident[]>;
}

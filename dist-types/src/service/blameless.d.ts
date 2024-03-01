import { BlamelessAPI, BlamelessConnectionConfig, Service, AuthResponse } from "./types";
export declare class BlamelessService implements BlamelessAPI {
    private readonly authKey;
    private readonly authUrl;
    readonly interval: number;
    private readonly baseurl;
    private access_token;
    connectionConfig: BlamelessConnectionConfig;
    constructor(connectionConfig: BlamelessConnectionConfig);
    checkTokenExpiry(): Promise<string | null>;
    getNewToken(): Promise<AuthResponse | null>;
    updateServices(services: Service[]): Promise<void>;
}
